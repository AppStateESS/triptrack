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

    public static function build()
    {
        $trip = new Trip;
        return $trip;
    }

    public static function list(array $options = [])
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_trip');
        if (!empty($options['orgId'])) {
            $tbl->addFieldConditional('organizationId', $options['orgId']);
        }
        $tbl->addOrderBy('submitName');
        if (!empty($options['memberCount'])) {
            $tbl2 = $db->addTable('trip_membertotrip');
            $counter = $tbl2->addField('memberId', 'memberCount');
            $counter->showCount();
            $joinConditional = $db->createConditional($tbl->getField('id'),
                    $tbl2->getField('tripId'));
            $db->joinResources($tbl, $tbl2, $joinConditional, 'left');
            $db->setGroupBy([$tbl->getField('id')]);
        }
        if (!empty($options['order'])) {
            $orderBy = $options['order'];
            if (!empty($options['dir'])) {
                $dir = 'asc';
            }
        } else {
            $orderBy = 'timeDeparting';
            $dir = 'desc';
        }
        $tbl->addOrderBy($orderBy, $dir);
        return $db->select();
    }

    public static function post(Request $request)
    {
        $trip = new Trip;
        $trip->host = $request->pullPostString('host');
        $trip->contactName = $request->pullPostString('contactName');
        $trip->contactEmail = $request->pullPostString('contactEmail');
        $trip->contactPhone = $request->pullPostString('contactPhone');
        $trip->destinationCity = $request->pullPostString('destinationCity');
        $trip->destinationCountry = $request->pullPostString('destinationCountry');
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

    public static function put(int $id, Request $request)
    {
        $trip = new Trip;
        self::load($trip, $id);
        $trip->host = $request->pullPutString('host');
        $trip->contactName = $request->pullPutString('contactName');
        $trip->contactEmail = $request->pullPutString('contactEmail');
        $trip->contactPhone = $request->pullPutString('contactPhone');
        $trip->destinationCity = $request->pullPutString('destinationCity');
        $trip->destinationCountry = $request->pullPutString('destinationCountry');
        $trip->destinationState = $request->pullPutString('destinationState');
        $trip->housingAddress = $request->pullPutString('housingAddress');
        $trip->organizationId = $request->pullPutInteger('organizationId');
        $trip->secContactName = $request->pullPutString('secContactName');
        $trip->secContactEmail = $request->pullPutString('secContactEmail');
        $trip->secContactPhone = $request->pullPutString('secContactPhone');
        $trip->submitEmail = $request->pullPutString('submitEmail');
        $trip->submitName = $request->pullPutString('submitName');
        $trip->submitUsername = $request->pullPutString('submitUsername');
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

    public static function delete(int $tripId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_trip');
        $tbl->addFieldConditional('id', $tripId);
        $db->delete();
    }

}
