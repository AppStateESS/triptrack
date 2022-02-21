<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Factory;

use phpws2\Database;
use Canopy\Request;
use triptrack\Resource\Trip;
use triptrack\Factory\SettingFactory;
use triptrack\Factory\DocumentFactory;

class TripFactory extends BaseFactory
{

    public static function approvalAllowed(int $tripId)
    {
        $documentCount = count(\triptrack\Factory\DocumentFactory::list(['tripId' => $tripId]));
        /**
         * If upload is not required or the document count is over 0, then trip approval
         * file requirement fulfilled.
         */
        $hasFiles = !SettingFactory::getUploadRequired() || $documentCount > 0;
        $attending = MemberFactory::tripHasAttending($tripId);
        return $hasFiles && $attending;
    }

    public static function copy(int $tripId)
    {
        $weekAhead = time() + 86400 * 7;
        $trip = self::build($tripId);
        $trip->id = 0;
        $trip->host = $trip->host . ' - (copy)';
        $trip->approved = false;
        $trip->completed = true;
        $trip->memberCount = 0;
        $trip->submitUserId = \Current_User::getId();
        $trip->submitUsername = \Current_User::getUsername();
        $trip->submitName = \Current_User::getDisplayName();
        $trip->submitEmail = \Current_User::getEmail();
        $trip->submitDate = time();
        $trip->timeDeparting = $weekAhead;
        $trip->timeEventStarts = $weekAhead;
        $trip->timeReturn = $weekAhead;
        $copy = self::save($trip);
        return $copy->id;
    }

    public static function deleteByOrganizationId(int $organizationId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_trip');
        $tbl->addField('id');
        $tbl->addFieldConditional('organizationId', $organizationId);
        while ($tripId = $db->selectColumn()) {
            MemberFactory::unlinkTrip($tripId);
        }
        $db->delete();
    }

    public static function build(int $id = 0, $throwException = true)
    {
        $trip = new Trip;
        if ($id) {
            $trip = self::load($trip, $id, $throwException);
        } else {
            $trip->destinationState = SettingFactory::getDefaultState();
        }
        return $trip;
    }

    public static function buildMemberTrip(int $memberId)
    {
        $member = MemberFactory::build($memberId);
        $trip = TripFactory::build();
        $trip->contactName = $trip->submitName = $member->firstName . ' ' . $member->lastName;
        $trip->contactEmail = $trip->submitEmail = $member->email;
        $trip->contactPhone = $member->phone;
        $trip->submitUsername = $member->username;
        $trip->submitUserId = \Current_User::getId();

        $trip = TripFactory::save($trip);
        return $trip;
    }

    public static function buildAdminTrip()
    {
        $trip = TripFactory::build();
        $trip->submitUserId = \Current_User::getId();
        $trip->submitUsername = \Current_User::getUsername();
        $trip->submitName = \Current_User::getDisplayName();
        $trip->submitEmail = \Current_User::getEmail();

        $trip = TripFactory::save($trip);
        return $trip;
    }

    /**
     * Returns a list of distinct states used in trips.
     * @return array
     */
    public static function getUsedStates()
    {
        $states = [];
        $db = Database::getDB();

        $tbl = $db->addTable('trip_trip');
        $tbl->addOrderBy('destinationState');
        $stateColumn = $tbl->addField('destinationState');
        $stateColumn->showDistinct();
        while ($column = $db->selectColumn()) {
            $states[] = $column;
        }
        return $states;
    }

    public static function getCurrentSubmitterIncomplete()
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_trip');
        $tbl->addFieldConditional('submitUserId', \Current_User::getId());
        $tbl->addFieldConditional('completed', 0);
        $result = $db->selectOneRow();
        if (empty($result)) {
            return;
        } else {
            $trip = self::build();
            $trip->setVars($result);
            return $trip;
        }
    }

    public static function emailTripSubmissionToAdmin(Trip $trip, $approved = true)
    {
        $vars = $trip->getVariablesAsValue();

        $vars['siteUrl'] = PHPWS_HOME_HTTP . 'triptrack/Admin/Trip/' . $trip->id;
        $template = new \phpws2\Template($vars);

        if ($approved) {
            $template->setModuleTemplate('triptrack', 'Admin/ApprovedNoticeEmail.html');
        } else {
            $template->setModuleTemplate('triptrack', 'Admin/UnapprovedNoticeEmail.html');
        }
        $content = $template->get();
        $contact = SettingFactory::getEmailAddressOnly();
        $subject = 'New trip needs review';
        EmailFactory::send($subject, $content, [$contact], true);
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
        $trip->submitUserId = \Current_User::getId();
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
     * FILTERS
     * - orgId (int): only trips with organization id
     * - unapprovedOnly (bool): only returned unapproved trips
     * - approvedOnly (bool): only returned approved trips
     * - search (string): search for string in the host, contact name, secondary
     *                    contact name, or submit name
     * - submitUserId (string): only return trip submitted using this user id
     * - submitUsername (string): only return trip submitted using this username
     * - memberId (int): return trips attended by this member
     * - startDate (int): return trips with a return date after this date
     * - endDate (int): return trips with a departure date after this date
     * - tripState (string): returns trip with the same destination state
     *
     * ADDITIONAL DATA
     * - memberCount (bool): include a count of members column on return
     * - includeOrganizationName (bool): organizationName column added to trip array
     * - includeIncomplete (bool): if true, incomplete trips are returned
     * - formatDates (bool): changes unix timestamps to formatted dates
     *
     * SORTING
     * - order (string): column to order by
     * - dir (string): direction to order by. order must be set
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

        $tbl->addField('id');
        $tbl->addField('approved');
        $tbl->addField('contactName');
        $tbl->addField('contactEmail');
        $tbl->addField('contactPhone');
        $tbl->addField('destinationCity');
        $tbl->addField('destinationCountry');
        $tbl->addField('destinationState');
        $tbl->addField('host');
        $tbl->addField('housingAddress');
        $tbl->addField('organizationId');
        $tbl->addField('secContactName');
        $tbl->addField('secContactEmail');
        $tbl->addField('secContactPhone');
        $tbl->addField('submitUserId');
        $tbl->addField('submitDate');
        $tbl->addField('submitEmail');
        $tbl->addField('submitName');
        $tbl->addField('submitUsername');
        $tbl->addField('visitPurpose');
        $tbl->addField('completed');
        $tbl->addField('engageEventId');

        if (!empty($options['includeOrganizationName'])) {
            $tbl4 = $db->addTable('trip_organization');
            $tbl4->addField('name', 'organizationName');
            $tbl->addFieldConditional('organizationId', $tbl4->getField('id'));
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

        if (!empty($options['submitUserId'])) {
            $tbl->addFieldConditional('submitUserId', $options['submitUserId']);
        }

        if (!empty($options['unapprovedOnly'])) {
            $tbl->addFieldConditional('approved', 0);
        }

        if (!empty($options['approvedOnly'])) {
            $tbl->addFieldConditional('approved', 1);
        }

        if (empty($options['includeIncomplete'])) {
            $tbl->addFieldConditional('completed', 1);
        }

        if (!empty($options['memberId'])) {
            $tbl3 = $db->addTable('trip_membertotrip');
            $tbl3->addFieldConditional('memberId', $options['memberId']);
            $db->joinResources($tbl, $tbl3, new Database\Conditional($db, $tbl->getField('id'), $tbl3->getField('tripId'), '='));
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

        if (!empty($options['startDate'])) {
            if (!empty($options['endDate'])) {
                $timeCond1 = $db->createConditional($tbl->getField('timeReturn'), $options['startDate'], '>=');
                $timeCond2 = $db->createConditional($tbl->getField('timeDeparting'), $options['endDate'], '<=');
                $timeCond3 = $db->createConditional($timeCond1, $timeCond2, 'and');
                $db->addConditional($timeCond3);
            } else {
                $tbl->addFieldConditional('timeReturn', $options['startDate'], '>=');
            }
        }

        if (!empty($options['tripState'])) {
            $tbl->addFieldConditional('destinationState', $options['tripState']);
        }

        if (!empty($options['formatDates'])) {
            $tbl->addField(new Database\Expression('from_unixtime(submitDate, "%Y-%m-%d")', 'submitDate'));
            $tbl->addField(new Database\Expression('from_unixtime(timeDeparting, "%Y-%m-%d")', 'timeDeparting'));
            $tbl->addField(new Database\Expression('from_unixtime(timeEventStarts, "%Y-%m-%d")', 'timeEventStarts'));
            $tbl->addField(new Database\Expression('from_unixtime(timeReturn, "%Y-%m-%d")', 'timeReturn'));
            $tbl->addField(new Database\Expression('from_unixtime(confirmedDate, "%Y-%m-%d")', 'confirmedDate'));
        } else {
            $tbl->addField('submitDate');
            $tbl->addField('timeDeparting');
            $tbl->addField('timeEventStarts');
            $tbl->addField('timeReturn');
            $tbl->addField('confirmedDate');
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
        $trip->engageEventId = (int) $request->pullPutInteger('engageEventId', true);
        $trip->travelMethod = (int) $request->pullPutInteger('travelMethod');
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
                case 'housingAddress':
                    if (SettingFactory::getAccommodationRequired() && $trip->isEmpty('housingAddress')) {
                        $errors['housingAddress'] = 'empty';
                    }
                    break;

                case 'contactName':
                case 'contactEmail':
                case 'contactPhone':
                case 'destinationCity':
                case 'destinationCountry':
                case 'destinationState':
                case 'host':
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

    /**
     * Permanently deletes a trip
     * @param int $tripId
     */
    public static function delete(int $tripId)
    {
        DocumentFactory::deleteByTripId($tripId);
        self::removeAllMembers($tripId);
        $db = Database::getDB();
        $tbl = $db->addTable('trip_trip');
        $tbl->addFieldConditional('id', $tripId);
        $db->delete();
    }

}
