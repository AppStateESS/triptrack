<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Factory;

use phpws2\Database;
use Canopy\Request;
use triptrack\Resource\Trip;

class TripFactory extends BaseFactory
{

    public static function deleteByOrganizationId(int $organizationId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_trip');
        $tbl->addField('id');
        $tbl->addFieldConditional('organizationId', $organizationId);
        $rows = $db->selectColumn();
        if (!empty($rows)) {
            foreach ($rows as $orgId) {
                MemberFactory::unlinkOrganization($id);
            }
        }
        $db->delete();
    }

    public static function build(int $id = 0, $throwException = true)
    {
        $trip = new Trip;
        if ($id) {
            $trip = self::load($trip, $id, $throwException);
        }
        return $trip;
    }

    public static function emailApproval(int $tripId)
    {
        $trip = self::build($tripId);

        $subject = 'Your trip has been approved!';
        $vars['subject'] = $subject;
        $vars['city'] = $trip->destinationCity;
        $vars['state'] = $trip->destinationState;
        $vars['country'] = $trip->destinationCountry;
        $vars['contactName'] = SettingFactory::getContact()['siteContactName'];
        $vars['url'] = PHPWS_HOME_HTTP . 'triptrack/Member/Trip/' . $tripId;
        $template = new \phpws2\Template($vars);
        $template->setModuleTemplate('triptrack', 'Admin/ApprovalEmail.html');
        $body = $template->get();

        EmailFactory::send($subject, $body, [$trip->submitEmail], true);
    }

    public static function loadNewMemberTrip()
    {
        $member = MemberFactory::pullByUsername(\Current_User::getUsername(), true);
        $trip = new Trip;
        $trip->approved = false;
        $trip->submitEmail = $member->email;
        $trip->contactEmail = $member->email;
        $trip->submitName = $member->getFullName();
        $trip->contactName = $member->getFullName();
        $trip->submitUsername = $member->username;
        $trip->contactPhone = $member->phone;
        self::loadDefaults($trip);

        return $trip;
    }

    public static function loadDefaults(Trip $trip)
    {
        $settings = SettingFactory::getAll();
        $trip->destinationState = $settings['defaultState'];
        $trip->destinationCountry = $settings['defaultCountry'];
    }

    public static function patch(int $id, string $varname, $value)
    {
        $trip = self::build();
        self::loadByID($trip, $id);
        $trip->$varname = $value;
        self::save($trip);
    }

    /**
     * Options
     * orgId (int): only trips with organization id
     * memberCount (bool): include a count of members column on return
     * unapprovedOnly (bool): only returned unapproved trips
     * search (string): search for string in the host, contact name, secondary
     *                  contact name, or submit name
     * submitUsername (string): only return trip submitted using this username
     * order (string): column to order by
     * dir (string): direction to order by. order must be set
     *
     * @param array $options
     * @return type
     */
    public static function list(array $options = [])
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_trip');
        if (!empty($options['orgId'])) {
            $tbl->addFieldConditional('organizationId', $options['orgId']);
        }

        if (!empty($options['memberCount'])) {
            $tbl2 = $db->addTable('trip_membertotrip');
            $counter = $tbl2->addField('memberId', 'memberCount');
            $counter->showCount();
            $joinConditional = $db->createConditional($tbl->getField('id'),
                    $tbl2->getField('tripId'));
            $db->joinResources($tbl, $tbl2, $joinConditional, 'left');
            $db->setGroupBy([$tbl->getField('id')]);
        }

        if (!empty($options['submitUsername'])) {
            $tbl->addFieldConditional('submitUsername', $options['submitUsername']);
        }

        if (!empty($options['unapprovedOnly'])) {
            $tbl->addFieldConditional('approved', 0);
        }

        if (!empty($options['search'])) {
            $search = '%' . $options['search'] . '%';
            $searchCond1 = $db->createConditional($tbl->getField('host'), $search, 'like');
            $searchCond2 = $db->createConditional($tbl->getField('contactName'), $search, 'like');
            $searchCond3 = $db->createConditional($tbl->getField('secContactName'), $search, 'like');
            $searchCond4 = $db->createConditional($tbl->getField('submitName'), $search, 'like');
            $searchCond5 = $db->createConditional($tbl->getField('destinationCity'), $search, 'like');
            $searchCond6 = $db->createConditional($tbl->getField('destinationState'), $search, 'like');
            $searchCond7 = $db->createConditional($tbl->getField('destinationCountry'), $search, 'like');

            $subjoin1 = $db->createConditional($searchCond1, $searchCond2, 'or');
            $subjoin2 = $db->createConditional($searchCond3, $searchCond4, 'or');
            $subjoin3 = $db->createConditional($searchCond5, $searchCond6, 'or');
            $join1 = $db->createConditional($subjoin1, $subjoin2, 'or');
            $join2 = $db->createConditional($subjoin3, $searchCond7, 'or');
            $finalSearchCondition = $db->createConditional($join1, $join2, 'or');
            $db->addConditional($finalSearchCondition);
        }

        if (!empty($options['startDate']) && !empty($options['endDate'])) {
            $timeCond1 = $db->createConditional($tbl->getField('timeReturn'), $options['startDate'], '>=');
            $timeCond2 = $db->createConditional($tbl->getField('timeDeparting'), $options['endDate'], '<=');
            $timeCond3 = $db->createConditional($timeCond1, $timeCond2, 'and');
            $db->addConditional($timeCond3);
        }

        if (!empty($options['orderBy'])) {
            $orderBy = $options['orderBy'];
            if (empty($options['dir'])) {
                $dir = 'asc';
            } else {
                $dir = $options['dir'];
            }
            $tbl->addOrderBy($orderBy, $dir);
        }

        return $db->select();
    }

    public static function post(Request $request, bool $preapproved = false)
    {
        $country = $request->pullPostString('destinationCountry', true);
        if (!$country) {
            $country = SettingFactory::getDefaultCountry();
        }
        $trip = new Trip;
        $trip->approved = $preapproved;
        $trip->host = $request->pullPostString('host');
        $trip->contactName = $request->pullPostString('contactName');
        $trip->contactEmail = $request->pullPostString('contactEmail');
        $trip->contactPhone = $request->pullPostString('contactPhone');
        $trip->destinationCity = $request->pullPostString('destinationCity');
        $trip->destinationCountry = $country;
        $trip->destinationState = $request->pullPostString('destinationState');
        $trip->housingAddress = $request->pullPostString('housingAddress');
        $trip->organizationId = $request->pullPostInteger('organizationId');
        $trip->secContactName = $request->pullPostString('secContactName');
        $trip->secContactEmail = $request->pullPostString('secContactEmail');
        $trip->secContactPhone = $request->pullPostString('secContactPhone');
        $trip->submitEmail = $request->pullPostString('submitEmail');
        $trip->submitName = $request->pullPostString('submitName');
        $trip->submitUsername = $request->pullPostString('submitUsername');
        $trip->timeDeparting = $request->pullPostString('timeDeparting');
        $trip->timeEventStarts = $request->pullPostString('timeEventStarts');
        $trip->timeReturn = $request->pullPostString('timeReturn');
        $trip->visitPurpose = $request->pullPostString('visitPurpose');
        return $trip;
    }

    public static function put(int $id, Request $request, bool $isAdmin = false)
    {
        $country = $request->pullPostString('destinationCountry', true);
        if (!$country) {
            $country = SettingFactory::getDefaultCountry();
        }
        $trip = self::build($id);
        $trip->host = $request->pullPutString('host');
        $trip->contactName = $request->pullPutString('contactName');
        $trip->contactEmail = $request->pullPutString('contactEmail');
        $trip->contactPhone = $request->pullPutString('contactPhone');
        $trip->destinationCity = $request->pullPutString('destinationCity');
        $trip->destinationCountry = $country;
        $trip->destinationState = $request->pullPutString('destinationState');
        $trip->housingAddress = $request->pullPutString('housingAddress');
        $trip->organizationId = $request->pullPutInteger('organizationId');
        $trip->secContactName = $request->pullPutString('secContactName');
        $trip->secContactEmail = $request->pullPutString('secContactEmail');
        $trip->secContactPhone = $request->pullPutString('secContactPhone');
        if ($isAdmin) {
            $trip->submitEmail = $request->pullPutString('submitEmail');
            $trip->submitName = $request->pullPutString('submitName');
            $trip->submitUsername = $request->pullPutString('submitUsername');
        }
        $trip->timeDeparting = $request->pullPutString('timeDeparting');
        $trip->timeEventStarts = $request->pullPutString('timeEventStarts');
        $trip->timeReturn = $request->pullPutString('timeReturn');
        $trip->visitPurpose = $request->pullPutString('visitPurpose');
        return $trip;
    }

    public static function removeAllMembers(int $tripId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_membertotrip');
        $tbl->addFieldConditional('tripId', $tripId);
        $db->delete();
    }

    public static function errorCheck(Trip $trip)
    {
        $keys = array_keys($trip->getStringVars());
        $errors = [];

        foreach ($keys as $tripVar) {
            switch ($tripVar) {
                case 'contactName':
                case 'contactEmail':
                case 'contactPhone':
                case 'destinationCity':
                case 'destinationCountry':
                case 'destinationState':
                case 'host':
                case 'housingAddress':
                case 'submitDate':
                case 'submitEmail':
                case 'submitName':
                case 'submitUsername':
                case 'visitPurpose':
                    if ($trip->isEmpty($tripVar)) {
                        $errors[$tripVar] = 'empty';
                    }
                    break;

                case 'organizationId':
                    if ($trip->isEmpty($tripVar)) {
                        $errors[$tripVar] = 'org_unset';
                    }
                    break;

                case 'timeDeparting':
                    if ($trip->isEmpty($tripVar)) {
                        $errors[$tripVar] = 'empty';
                    }
                    if ($trip->timeDeparting > $trip->timeEventStarts) {
                        $errors['timeDeparting'] = 'after';
                    }
                    break;
                case 'timeEventStarts':
                    if ($trip->isEmpty($tripVar)) {
                        $errors[$tripVar] = 'empty';
                    }
                    if ($trip->timeEventStarts > $trip->timeReturn) {
                        $errors['timeEventStarts'] = 'after';
                    }
                    break;
                case 'timeReturn':
                    if ($trip->isEmpty('timeReturn')) {
                        $errors['timeReturn'] = 'empty';
                    }
                    break;

                case 'secContactName':
                case 'secContactEmail':
                case 'secContactPhone':
                    if (SettingFactory::getSecondaryRequired() && $trip->isEmpty($tripVar)) {
                        $errors[$tripVar] = 'empty';
                    }
                    break;
            }
        }
        if (empty($errors)) {
            return true;
        } else {
            return $errors;
        }
    }

    public static function delete(int $tripId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_trip');
        $tbl->addFieldConditional('id', $tripId);
        $db->delete();
    }

}
