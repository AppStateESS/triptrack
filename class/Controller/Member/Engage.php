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

namespace triptrack\Controller\Member;

use triptrack\Controller\SubController;
use Canopy\Request;
use triptrack\Factory\EngageFactory;
use triptrack\Factory\OrganizationFactory;
use triptrack\Controller\AbstractController\AbstractEngage;

class Engage extends AbstractEngage
{

    protected $view;

    public function __construct(\triptrack\Role\Base $role)
    {
        parent::__construct($role);
        $this->view = new \triptrack\View\EngageView();
    }

    protected function rsvpListByEventJson(Request $request)
    {
        $eventId = $request->pullGetInteger('eventId');
        return EngageFactory::getRsvpListByEventId($eventId);
    }

}
