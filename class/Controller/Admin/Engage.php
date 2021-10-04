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
        return EngageFactory::totalOrganizations();
    }

    protected function importOrganizationsJson()
    {
        $result = EngageFactory::importOrganizations();
        if (!$result) {
            return ['success' => false];
        } else {
            return ['success' => true, 'count' => $result];
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
        $orgId = $request->pullGetInteger('orgId');
        return EngageFactory::getMembersByOrganizationId($orgId);
    }

}
