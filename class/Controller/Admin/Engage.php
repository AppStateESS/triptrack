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

namespace triptrack\Controller\Admin;

use triptrack\Controller\SubController;
use Canopy\Request;
use triptrack\Factory\EngageFactory;
use triptrack\Factory\OrganizationFactory;

class Engage extends SubController
{

    protected $view;

    public function __construct(\triptrack\Role\Base $role)
    {
        parent::__construct($role);
        $this->view = new \triptrack\View\EngageView();
    }

    protected function countJson()
    {
        return ['countCurrent' => EngageFactory::totalSavedOrganizations(), 'countOnline' => EngageFactory::totalOnlineOrganizations()];
    }

    protected function importOrganizationsJson()
    {
        $result = EngageFactory::importOrganizations();
        if (!$result) {
            return ['success' => false];
        } else {
            return ['success' => true, 'countCurrent' => $result];
        }
    }

    protected function searchOrganizationsJson(Request $request)
    {
        $name = $request->pullGetString('name');
        return EngageFactory::listOrganizations(['name' => $name, 'limit' => 50, 'noDuplicates' => true]);
    }

    protected function memberImportHtml(Request $request)
    {
        $orgId = $request->pullGetInteger('orgId');

        return $this->view->memberImport($orgId);
    }

    protected function memberListByOrganizationJson(Request $request)
    {
        $engageOrgId = $request->pullGetInteger('engageOrgId');
        return EngageFactory::getMembersByOrganizationId($engageOrgId);
    }

    protected function eventListByOrganizationJson(Request $request)
    {
        $orgId = $request->pullGetInteger('orgId');
        $organization = OrganizationFactory::build($orgId);
        if (empty($organization)) {
            throw new \Exception('Organization not found');
        }

        return EngageFactory::getUpcomingEventsByOrganizationId($organization->engageId);
    }

    protected function rsvpListByEventJson(Request $request)
    {
        $eventId = $request->pullGetInteger('eventId');
        return EngageFactory::getRsvpListByEventId($eventId);
    }

}
