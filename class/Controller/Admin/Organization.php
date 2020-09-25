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

    protected function listHtml()
    {
        return $this->view->listHtml();
    }

    protected function listJson()
    {
        return OrganizationFactory::list();
    }

    protected function post(Request $request)
    {
        OrganizationFactory::post($request);
        return ['success' => true];
    }

}
