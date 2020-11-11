<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Controller\Admin;

use triptrack\Controller\SubController;
use triptrack\Factory\OrganizationFactory;
use Canopy\Request;

class Organization extends SubController
{

    protected $view;

    public function __construct(\triptrack\Role\Base $role)
    {
        parent::__construct($role);
        $this->view = new \triptrack\View\OrganizationView();
    }

    public function load()
    {
        return OrganizationFactory::load(OrganizationFactory::build(), $this->id);
    }

    protected function listHtml()
    {
        return $this->view->listHtml();
    }

    protected function listJson(Request $request)
    {
        return OrganizationFactory::list();
    }

    protected function post(Request $request)
    {
        OrganizationFactory::post($request);
        return ['success' => true];
    }

    protected function put(Request $request)
    {
        $organization = self::load();
        OrganizationFactory::put($organization, $request);
        return ['success' => true];
    }

    protected function viewJson(Request $request)
    {
        $organization = self::load();
        return $organization->getStringVars();
    }

    protected function delete(Request $request)
    {
        if (!\Current_User::isDeity()) {
            throw new PrivilegeMissing();
        }
        $organization = self::load();
        OrganizationFactory::delete($organization);
        return ['success' => 1];
    }

    protected function assignmentJson(Request $request)
    {
        $orgId = $request->pullGetInteger('orgId');
        $tripId = $request->pullGetInteger('tripId');
        $organization = OrganizationFactory::load(OrganizationFactory::build(),
                        $this->id);
        $trip = OrganizationFactory::load(OrganizationFactory::build(),
                        $this->id);
    }

}
