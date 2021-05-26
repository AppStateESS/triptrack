<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Controller\Member;

use triptrack\Controller\SubController;
use triptrack\Factory\TripFactory;
use triptrack\Factory\SettingFactory;
use Canopy\Request;

class Trip extends SubController
{

    protected $view;

    public function __construct(\triptrack\Role\Base $role)
    {
        parent::__construct($role);
        $this->view = new \triptrack\View\TripView();
    }

    public function createHtml()
    {
        return $this->view->memberForm();
    }

    public function viewJson(Request $request)
    {
        if ((int) $this->id === 0) {
            $trip = TripFactory::loadNewMemberTrip();
        } else {
            $trip = TripFactory::load(TripFactory::build(), $this->id);
            if ($trip->submitUsername != \Current_User::getUsername()) {
                throw new \Exception('Member is not trip submitter');
            }
        }
        return $trip->getVariablesAsValue(false, null, true);
    }

    public function post(Request $request)
    {
        $trip = TripFactory::post($request, SettingFactory::getApprovalRequired());
        $errors = TripFactory::errorCheck($trip);

        if ($errors === true) {
            TripFactory::save($trip);
            return ['success' => true, 'id' => $trip->id];
        } else {
            return ['success' => false, 'errors' => $errors];
        }
    }

}
