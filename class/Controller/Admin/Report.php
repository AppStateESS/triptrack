<?php

/**
 * MIT License
 * Copyright (c) 2021 Electronic Student Services @ Appalachian State University
 *
 * See LICENSE file in root directory for copyright and distribution permissions.
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Controller\Admin;

use triptrack\Controller\SubController;
use Canopy\Request;
use triptrack\Factory\ReportFactory;
use triptrack\View\ReportView;

class Report extends SubController
{

    /**
     *
     * @var \triptrack\View\ReportView;
     */
    protected $view;

    public function __construct(\triptrack\Role\Base $role)
    {
        parent::__construct($role);
        $this->view = new \triptrack\View\ReportView();
    }

    protected function listHtml()
    {
        return $this->view->list();
    }

    protected function organizationHtml(Request $request)
    {
        return $this->view->organization($request->pullGetInteger('orgId'), true);
    }

    protected function tripHtml(Request $request)
    {
        return $this->view->trip($request->pullGetInteger('tripId'), true);
    }

    protected function stateMembersHtml(Request $request)
    {
        return $this->view->stateMembers($request->pullGetString('state'), $request->pullGetBoolean('upcomingOnly', false), true);
    }

    protected function stateTripsHtml(Request $request)
    {
        return $this->view->stateTrips($request->pullGetString('state'), $request->pullGetBoolean('upcomingOnly', false), true);
    }

}
