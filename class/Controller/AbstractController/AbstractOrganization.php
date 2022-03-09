<?php

declare(strict_types=1);
/**
 * MIT License
 * Copyright (c) 2022 Electronic Student Services @ Appalachian State University
 *
 * See LICENSE file in root directory for copyright and distribution permissions.
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Controller\AbstractController;

use triptrack\Controller\SubController;
use triptrack\Factory\OrganizationFactory;
use Canopy\Request;

class AbstractOrganization extends SubController
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

}
