<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Controller\Admin;

use triptrack\Controller\SubController;
use triptrack\Factory\TripFactory;
use triptrack\Factory\MemberFactory;
use triptrack\View\EmailView;
use Canopy\Request;

class Trip extends SubController
{

    protected $view;

    public function __construct(\triptrack\Role\Base $role)
    {
        parent::__construct($role);
        $this->view = new \triptrack\View\TripView();
    }

    protected function listHtml(Request $request)
    {
        $unapproved = $request->pullGetBoolean('unapproved', true);
        return $this->view->listHtml($unapproved);
    }

    protected function assignHtml(Request $request)
    {
        return $this->view->assign($this->id, 'Admin');
    }

    protected function listJson(Request $request)
    {
        $options = ['memberCount' => true, 'orgId' => $request->pullGetInteger('orgId', true), 'search' => $request->pullGetString('search',
                true), 'unapprovedOnly' => (bool) $request->pullGetBoolean('unapprovedOnly',
                true)];
        $options['orderBy'] = $request->pullGetString('orderBy', true);
        $options['dir'] = $request->pullGetString('dir', true);
        if ($request->pullGetBoolean('upcomingOnly', true)) {
            $options['startDate'] = time() - 86400;
        } else {
            $options['startDate'] = (int) $request->pullGetInteger('startDate', true);
            $options['endDate'] = (int) $request->pullGetInteger('endDate', true);
        }

        return TripFactory::list($options);
    }

    protected function createHtml()
    {
        $trip = TripFactory::getCurrentSubmitterIncomplete();
        if (!$trip) {
            $trip = TripFactory::buildAdminTrip();
        }

        return $this->view->adminForm($trip->id);
    }

    public function memberListJson()
    {
        return MemberFactory::getTripParticipants($this->id);
    }

    protected function emailMembersHtml(Request $request)
    {
        $organizationId = $request->pullGetInteger('orgId');
        $tripId = $request->pullGetInteger('tripId');
        $emailView = new EmailView;
        return $emailView->emailMembers('organization', $organizationId, $tripId);
    }

    protected function editHtml()
    {
        return $this->view->adminForm($this->id);
    }

    protected function upcomingHtml()
    {
        return $this->view->upcoming();
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

    protected function usedStatesJson()
    {
        return TripFactory::getUsedStates();
    }

    protected function delete(Request $request)
    {
        TripFactory::delete($this->id);
        return ['success' => true];
    }

    protected function put(Request $request)
    {
        $trip = TripFactory::put($this->id, $request, true);
        $trip->completed = true;

        TripFactory::save($trip);
        return ['success' => true, 'id' => $trip->id];
    }

    protected function approvalPatch(Request $request)
    {
        if (TripFactory::approvalAllowed($this->id)) {
            TripFactory::patch($this->id, 'approved', true);
            TripFactory::emailApproval($this->id);
            return ['success' => true];
        } else {
            throw new \Exception('Cannot approve trip id: ' . $this->id);
        }
    }

    protected function confirmPatch(Request $request)
    {
        $trip = TripFactory::build($this->id);
        $trip->stampConfirmed();
        TripFactory::save($trip);
    }

    /**
     * Adds attending members to a Trip
     * @param Request $request
     * @return type
     */
    protected function addMembersPost(Request $request)
    {
        $tripId = $request->pullPostInteger('tripId');
        $members = $request->pullPostArray('members');
        /**
         * Remove the currently linked members from the trip.
         */
        MemberFactory::unlinkTrip($tripId);

        if (!empty($members) && $tripId > 0) {
            MemberFactory::addListToTrip($members, $tripId);
            return ['success' => true];
        } else {
            return ['success' => false];
        }
    }

    protected function copyPut(Request $request)
    {
        $tripId = $request->pullPutInteger('tripId');
        $copyId = TripFactory::copy($tripId);
        return ['copyId' => $copyId];
    }

    protected function incompleteJson()
    {
        $trip = TripFactory::getCurrentSubmitterIncomplete();
        if (empty($trip)) {
            return null;
        } else {
            return $trip->getStringVars();
        }
    }

}
