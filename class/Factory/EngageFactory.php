<?php

/**
 * MIT License
 * Copyright (c) 2022 Electronic Student Services @ Appalachian State University
 *
 * See LICENSE file in root directory for copyright and distribution permissions.
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Factory;

use phpws2\Database;

if (!defined('TRIPTRACK_ENGAGE_CONFIG') || empty(TRIPTRACK_ENGAGE_CONFIG)) {
    throw new \Exception('Engage configuration not set.');
}
require_once TRIPTRACK_ENGAGE_CONFIG;
require_once ENGAGE_API_DIR . 'EngageV3.php';
require_once ENGAGE_API_DIR . 'EngageV2.php';

class EngageFactory
{

    /**
     * Imports all active Engage organizations into database.
     * All rows in the table are deleted prior in case there are
     * title updates.
     * @return boolean|int
     */
    public static function importOrganizations()
    {
        $engageApi = new \EngageV3(ENGAGE_API_V3_KEY);
        $result = $engageApi->organizations->getAll();

        if (empty($result) || !is_array($result)) {
            return false;
        }
        $db = Database::getDB();
        $tbl = $db->addTable('trip_engageorg');
        $db->delete();
        $count = 0;
        foreach ($result as $org) {
            $tbl->resetValues();
            $tbl->addValue('engageId', $org->id);
            $tbl->addValue('name', $org->name);
            $tbl->addValue('websiteKey', $org->websiteKey);
            $db->insert();
            $count++;
        }
        return $count;
    }

    public static function getEvent(int $eventId)
    {
        $engageAPI = new \EngageV3(ENGAGE_API_V3_KEY);
        $engageAPI->events->parameters->ids = [$eventId];
        return $engageAPI->events->get();
    }

    public static function getMembersByOrganizationId(int $organizationEngageId)
    {
        $organization = OrganizationFactory::getByEngageId($organizationEngageId);
        $bannerIds = MemberFactory::list(['orgId' => $organization['id'], 'bannerOnly' => true]);

        $engageApi = new \EngageV2(ENGAGE_API_V2_KEY, ENGAGE_BASE_URL_V2);
        $engageApi->memberships->parameters->organizationId = $organizationEngageId;
        $memberships = $engageApi->memberships->getAll();
        $rows = [];
        if (empty($bannerIds)) {
            $bannerIds = [];
        }
        if (!empty($memberships)) {
            foreach ($memberships as $member) {
                /**
                 * Members can be in an organization multiple times with
                 * different position types.
                 */
                if (in_array($member->username, $bannerIds) ||
                    $member->positionRecordedEndDate !== null) {
                    continue;
                }
                $rows[] = ['bannerId' => $member->username, 'firstName' => $member->userFirstName,
                    'username' => str_ireplace('@' . CAMPUS_EMAIL_DOMAIN, '', $member->userCampusEmail),
                    'lastName' => $member->userLastName, 'email' => $member->userCampusEmail, 'engageId' => $member->userId];
                $bannerIds[] = $member->username;
            }
        }
        usort($rows, function ($a, $b) {
            return strcmp($a['lastName'], $b['lastName']);
        });
        return $rows;
    }

    public static function getRsvpListByEventId(int $eventId)
    {
        $engageAPI = new \EngageV3(ENGAGE_API_V3_KEY);
        $engageAPI->eventRsvps->parameters->eventIds = [$eventId];
        $attending = $engageAPI->getAll();

        if (empty($attending)) {
            return false;
        }
        $bannerId = [];
        foreach ($attending as $row) {
            $bannerIds[] = $row->userId->username;
        }
        return $bannerIds;
    }

    public static function getAttendedListByEventId(int $eventId, $attendedOnly = true)
    {
        $engageAPI = new \EngageV3(ENGAGE_API_V3_KEY);
        $attended = $engageAPI->eventAttendance;
        $attended->parameters->eventIds = [$eventId];
        if ($attendedOnly) {
            $attended->parameters->status = ['Attended'];
        }
        $attending = $attended->getAll();
        if (empty($attending)) {
            return [];
        }
        foreach ($attending as $att) {
            $attendList[] = ['bannerId' => $att->userId->username, 'email' => $att->userId->campusEmail];
        }
        return $attendList;
    }

    public static function getUpcomingEventsByOrganizationId(int $organizationEngageId)
    {
        $engageAPI = new \EngageV3(ENGAGE_API_V3_KEY);
        $engageAPI->events->parameters->organizationIds = array($organizationEngageId);
        $engageAPI->events->parameters->startsAfter = strftime('%Y-%m-%d');
        return $engageAPI->events->get();
    }

    public static function listOrganizations(array $options)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_engageorg');
        if (!empty($options['name'])) {
            $tbl->addFieldConditional('name', '%' . $options['name'] . '%', 'like');
        }

        if (!empty($options['limit'])) {
            $db->setLimit((int) $options['limit']);
        }

        if (!empty($options['noDuplicates'])) {
            $tbl2 = $db->addTable('trip_organization', null, false);
            $cond = new Database\Conditional($db, $tbl->getField('engageId'), $tbl2->getField('engageId'), '=');
            $db->joinResources($tbl, $tbl2, $cond, 'left');
            $tbl2->addFieldConditional($tbl2->getField('id'), null, 'is');
        }

        $tbl->addOrderBy('name');

        return $db->select();
    }

    public static function totalOnlineOrganizations()
    {
        if (!isset($_SESSION['ENGAGE_ORG_COUNT'])) {
            $engageAPI = new \EngageV3(ENGAGE_API_V3_KEY);
            $engageAPI->organizations->parameters->take = 0;
            $engageAPI->organizations->get();
            $_SESSION['ENGAGE_ORG_COUNT'] = $engageAPI->organizations->stats()['totalItems'];
        }
        return $_SESSION['ENGAGE_ORG_COUNT'];
    }

    public static function totalSavedOrganizations()
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_engageorg');
        $tbl->addField('engageId')->showCount();
        return $db->selectColumn();
    }

}
