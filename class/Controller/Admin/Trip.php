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
        $options = ['memberCount' => true, 'orgId' => $request->pullGetInteger('orgId', true), 'search' => $request->pullGetString('search',
                    true), 'unapprovedOnly' => (bool) $request->pullGetBoolean('unapprovedOnly',
                    true)];

        return TripFactory::list($options);
    }

    protected function createHtml()
    {
        return $this->view->adminForm();
    }

    protected function emailMembersHtml(Request $request)
    {
        $organizationId = $request->pullGetInteger('orgId');
        $tripId = $request->pullGetInteger('tripId');
        return $this->view->emailMembers($organizationId, $tripId);
    }

    protected function editHtml()
    {
        return $this->view->adminForm($this->id);
    }

    protected function viewJson()
    {
        if ((int) $this->id === 0) {
            $trip = TripFactory::build();
        } else {
            $trip = TripFactory::build($this->id);
        }
        return $trip->getVariablesAsValue(false, null, true);
    }

    protected function viewHtml(Request $request)
    {
        return $this->view->adminView($this->id);
    }

    protected function delete(Request $request)
    {
        TripFactory::removeAllMembers($this->id);
        TripFactory::delete($this->id);
        return ['success' => true];
    }

    protected function post(Request $request)
    {
        $trip = TripFactory::post($request, true);

        $errors = TripFactory::errorCheck($trip);

        if ($errors === true) {
            TripFactory::save($trip);
            return ['success' => true, 'id' => $trip->id];
        } else {
            return ['success' => false, 'errors' => $errors];
        }
    }

    protected function put(Request $request)
    {
        $trip = TripFactory::put($this->id, $request);
        TripFactory::save($trip);
        return ['success' => true, 'id' => $trip->id];
    }

    protected function approvalPatch(Request $request)
    {
        $approved = $request->pullPatchBoolean('approved');
        TripFactory::patch($this->id, 'approved', $approved);
        return ['success' => true];
    }

}
