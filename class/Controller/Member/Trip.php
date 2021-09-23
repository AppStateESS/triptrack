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
use triptrack\Exception\MemberDoesNotOwnTrip;
use Canopy\Request;

class Trip extends SubController
{

    protected $view;

    public function __construct(\triptrack\Role\Base $role)
    {
        parent::__construct($role);
        $this->view = new \triptrack\View\TripView();
    }

    protected function createHtml()
    {
        $trip = TripFactory::getCurrentSubmitterIncomplete();
        if (empty($trip)) {
            $trip = TripFactory::buildMemberTrip(MemberFactory::getCurrentMemberId());
        }

        return $this->view->memberForm($trip);
    }

    protected function editHtml()
    {
        $trip = TripFactory::build($this->id);
        return $this->view->memberForm($trip);
    }

    protected function viewJson(Request $request)
    {
        if ((int) $this->id === 0) {
            $trip = TripFactory::loadNewMemberTrip();
        } else {
            $trip = TripFactory::load(TripFactory::build(), $this->id);
            $this->testTrip($trip);
        }
        return $trip->getVariablesAsValue(false, null, true);
    }

    protected function viewHtml(Request $request)
    {
        $trip = TripFactory::build($this->id, false);
        if (empty($trip)) {
            header("HTTP/1.0 404 Not Found");
            return '<div>The trip you requested does not exist.</div>';
        }

        return $this->view->memberView($trip);
    }

    protected function listHtml()
    {
        return $this->view->memberList();
    }

    protected function testTrip(\triptrack\Resource\Trip $trip)
    {
        if (!MemberFactory::currentOwnsTrip($trip)) {
            throw new MemberDoesNotOwnTrip;
        }
    }

    protected function put(Request $request)
    {
        $trip = TripFactory::build($this->id);
        $this->testTrip($trip);

        if ($trip->approved) {
            throw new \Exception('Approved trips may not be updated by members.');
        }

        $updatedTrip = TripFactory::put($this->id, $request, false);
        $errorFree = TripFactory::errorCheck($updatedTrip);

        if ($errorFree === true) {
            $updatedTrip->completed = true;
            if ($updatedTrip->confirmedDate == 0) {
                $updatedTrip->stampConfirmed();
            }
            TripFactory::save($updatedTrip);
            return ['success' => true, 'id' => $this->id];
        } else {
            return ['success' => false, 'errors' => $errorFree];
        }
    }

    protected function memberListJson()
    {
        return MemberFactory::getTripParticipants($this->id);
    }

    protected function addMembersPost(Request $request)
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

    protected function delete(Request $request)
    {
        $trip = TripFactory::build($this->id);
        $this->testTrip($trip);
        if ($trip->completed) {
            throw new \Exception('Member can not delete a completed trip.');
        }
        TripFactory::delete($trip->id);
        return ['success' => true];
    }

}
