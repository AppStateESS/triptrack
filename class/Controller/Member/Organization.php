<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Controller\Member;

use triptrack\Controller\AbstractController\AbstractOrganization;
use triptrack\Controller\SubController;
use triptrack\Factory\OrganizationFactory;
use Canopy\Request;

class Organization extends AbstractOrganization
{

    protected function listJson(Request $request)
    {
        $memberId = \triptrack\Factory\MemberFactory::getCurrentMemberId();
        if (empty($memberId)) {
            throw \Exception('User is not a member');
        }
        return OrganizationFactory::list(['memberCount' => true, 'memberId' => $memberId]);
    }

    protected function viewJson(Request $request)
    {
        $organization = self::load();
        return $organization->getStringVars();
    }

}
