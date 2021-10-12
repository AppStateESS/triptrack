<?php

/**
 * MIT License
 * Copyright (c) 2021 Electronic Student Services @ Appalachian State University
 *
 * See LICENSE file in root directory for copyright and distribution permissions.
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Factory;

use phpws2\Database;

require_once '/var/www/html/essapi_config.php';


require_once WAREHOUSE_INSTALL_DIR . 'lib/Curl.php';
require_once WAREHOUSE_INSTALL_DIR . 'lib/Organization.php';
require_once WAREHOUSE_INSTALL_DIR . 'lib/Event.php';

class EngageFactory
{

    public static function totalOrganizations()
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_engageorg');
        $tbl->addField('engageId')->showCount();
        return $db->selectColumn();
    }

    public static function importOrganizations()
    {
        $result = \Organization::getAllOrgs(true);
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

    public static function getMembersByOrganizationId(int $organizationEngageId)
    {
        $org = new \Organization($organizationEngageId);
        $memberships = $org->getMembershipsV2();
        $rows = [];
        $bannerIds = [];
        if (!empty($memberships)) {
            foreach ($memberships as $member) {
                if ($member->deleted || in_array($member->username, $bannerIds) ||
                        $member->positionRecordedEndDate !== null) {
                    continue;
                }
                $rows[] = ['bannerId' => $member->username, 'firstName' => $member->userFirstName,
                    'username' => str_ireplace('@' . CAMPUS_EMAIL_DOMAIN, '', $member->userCampusEmail),
                    'lastName' => $member->userLastName, 'email' => $member->userCampusEmail, 'engageId' => $member->userId];
                $bannerIds[] = $member->username;
            }
        }
        usort($rows, function($a, $b) {
            return strcmp($a['lastName'], $b['lastName']);
        });
        return $rows;
    }

    public static function getUpcomingEventsByOrganizationId(int $organizationEngageId)
    {
        $org = new \Organization($organizationEngageId);
        $event = new \Event();
        return $event->getOrgEvents($organizationEngageId, strftime('%Y-%m-%d'));
    }

    public static function getEventsByOrganizationId(int $organizationEngageId)
    {

        $event = new \Event();
        $events = $event->getOrgEvents($organizationEngageId, strftime('%Y-%m-%d'));
        if (empty($events)) {
            return [];
        } else {
            return $events;
        }
    }

    public static function getEvent(int $eventId)
    {
        $engageEvent = new \Event;
        return $engageEvent->getEventV3($eventId);
    }

    public static function getRsvpListByEventId(int $eventId)
    {
        $engageEvent = new \Event;
        $attending = $engageEvent->getEventRSVP($eventId);

        if (empty($attending)) {
            return false;
        }
        $bannerId = [];
        foreach ($attending as $row) {
            $bannerIds[] = $row->userId->username;
        }
        return $bannerIds;
    }

}
