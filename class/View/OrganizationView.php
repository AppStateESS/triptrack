<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\View;

class OrganizationView extends AbstractView
{

    public function listHtml()
    {
        return $this->dashboardScript('org', 'OrgList',
                ['deity' => (bool) \Current_User::isDeity(), 'forceEngageOrg' => (bool) \triptrack\Factory\SettingFactory::getForceEngageOrg()]);
    }

}
