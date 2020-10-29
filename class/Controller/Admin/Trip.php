<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Controller\Admin;

use triptrack\Controller\SubController;
use triptrack\Factory\TripFactory;
use Canopy\Request;

class Trip extends SubController
{

    protected $view;

    public function __construct(\triptrack\Role\Base $role)
    {
        parent::__construct($role);
        $this->view = new \triptrack\View\TripView();
    }

    protected function listHtml()
    {
        return $this->view->listHtml();
    }

    protected function listJson(Request $request)
    {
        return TripFactory::list();
    }

    protected function createHtml()
    {
        return $this->view->form();
    }

    protected function editHtml()
    {
        return $this->view->form($this->id);
    }

    protected function viewJson()
    {
        return $this->view->json($this->id);
    }

    protected function delete(Request $request)
    {
        TripFactory::removeAllMembers($this->id);
        TripFactory::delete($this->id);
        return ['success' => true];
    }

    protected function post(Request $request)
    {
        $trip = TripFactory::post($request);
        TripFactory::save($trip);
        return ['success' => true];
    }

}
