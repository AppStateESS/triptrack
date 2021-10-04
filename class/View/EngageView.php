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

namespace triptrack\View;

use phpws2\Template;
use triptrack\Factory\OrganizationFactory;
use triptrack\Factory\EngageFactory;

class EngageView extends AbstractView
{

    public function memberImport(int $orgId)
    {
        $organization = OrganizationFactory::build($orgId);
        $vars['orgName'] = $organization->name;
        $vars['orgId'] = $orgId;
        $vars['engageId'] = $organization->engageId;
        return $this->dashboardScript('member', 'EngageMember', $vars);
    }

}
