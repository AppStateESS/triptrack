<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Controller\Member;

use triptrack\Controller\SubController;
use triptrack\Factory\OrganizationFactory;
use Canopy\Request;

class Organization extends SubController
{
       protected function listJson(Request $request)
    {
        return OrganizationFactory::list(['memberCount' => true]);
    }
}
