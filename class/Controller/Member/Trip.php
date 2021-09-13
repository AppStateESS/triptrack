<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Controller\Member;

use triptrack\Controller\SubController;
use triptrack\Factory\TripFactory;
use triptrack\Factory\SettingFactory;
use triptrack\Factory\MemberFactory;
use triptrack\Exception\PrivilegeMissing;
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

    public function editHtml()
    {
        return $this->view->memberForm($this->id);
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

    public function viewHtml(Request $request)
    {
        $trip = TripFactory::build($this->id, false);
        if (empty($trip)) {
            header("HTTP/1.0 404 Not Found");
            return '<div>The trip you requested does not exist.</div>';
        }

        return $this->view->memberView($trip);
    }

    public function listHtml()
    {
        return $this->view->memberList();
    }

    public function post(Request $request)
    {
        $trip = TripFactory::post($request, !SettingFactory::getApprovalRequired());
        $errorFree = TripFactory::errorCheck($trip);

        if ($errorFree === true) {
            $trip = TripFactory::save($trip);
            \triptrack\Factory\MemberFactory::addToTrip($this->role->memberId, $trip->id);
            TripFactory::emailTripSubmissionToAdmin($trip, !SettingFactory::getApprovalRequired());
            return ['success' => true, 'id' => $trip->id];
        } else {
            return ['success' => false, 'errors' => $errorFree];
        }
    }

    public function put(Request $request)
    {
        $trip = TripFactory::build($this->id);
        if ($trip->submitUsername !== \Current_User::getUsername()) {
            throw new PrivilegeMissing();
        }

        if ($trip->approved) {
            throw new \Exception('Approved trips may not be updated by members.');
        }

        $updatedTrip = TripFactory::put($this->id, $request, false);
        $errorFree = TripFactory::errorCheck($updatedTrip);

        if ($errorFree === true) {
            TripFactory::save($updatedTrip);
            return ['success' => true, 'id' => $this->id];
        } else {
            return ['success' => false, 'errors' => $errorFree];
        }
    }

    public function memberListJson()
    {
        return MemberFactory::getTripParticipants($this->id);
    }

    public function addMembersPost(Request $request)
    {
        $tripId = $request->pullPostInteger('tripId');
        $members = $request->pullPostArray('members');
        MemberFactory::unlinkTrip($tripId);
        if (!empty($members) && $tripId > 0) {
            MemberFactory::addListToTrip($members, $tripId);
            return ['success' => true];
        } else {
            return ['success' => false];
        }
    }

}
