<?php

declare(strict_types=1);
/**
 * MIT License
 * Copyright (c) 2022 Electronic Student Services @ Appalachian State University
 *
 * See LICENSE file in root directory for copyright and distribution permissions.
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Controller\AbstractController;

use Canopy\Request;
use triptrack\Factory\OrganizationFactory;
use triptrack\Factory\EngageFactory;
use triptrack\Controller\SubController;

class AbstractEngage extends SubController
{

    protected function attendedListByEventJson(Request $request)
    {
        $eventId = $request->pullGetInteger('eventId');
        if (empty($eventId)) {
            return false;
        }

        return EngageFactory::getAttendedListByEventId($eventId);
    }

    protected function eventJson(Request $request)
    {
        return EngageFactory::getEvent($request->pullGetInteger('eventId'));
    }

    protected function eventListByOrganizationJson(Request $request)
    {
        $orgId = $request->pullGetInteger('orgId');
        $organization = OrganizationFactory::build($orgId);
        if (empty($organization)) {
            throw new \Exception('Organization not found');
        }

        $events = EngageFactory::getUpcomingEventsByOrganizationId($organization->engageId);

        if (empty($events)) {
            return null;
        }
        return EngageFactory::dropdownSortEvents($events);
    }

    protected function memberListByOrganizationJson(Request $request)
    {
        $engageOrgId = $request->pullGetInteger('engageOrgId');
        return EngageFactory::getMembersByOrganizationId($engageOrgId);
    }

    protected function searchOrganizationsJson(Request $request)
    {
        $name = $request->pullGetString('name');
        return EngageFactory::listOrganizations(['name' => $name, 'limit' => 50, 'noDuplicates' => true]);
    }

}
