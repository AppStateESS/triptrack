<?php

/**
 * MIT License
 * Copyright (c) 2020 Electronic Student Services @ Appalachian State University
 *
 * See LICENSE file in root directory for copyright and distribution permissions.
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Controller;

use Canopy\Request;
use phpws2\Database;
use triptrack\Factory\MemberFactory;

class Controller extends \phpws2\Http\Controller
{

    protected $role;
    protected $subcontroller;

    public function __construct(\Canopy\Module $module, Request $request)
    {
        parent::__construct($module);
        $this->loadRole();
        $this->loadSubController($request);
    }

    private function loadRole()
    {
        if (\Current_User::isLogged()) {
            if (\Current_User::allow('triptrack')) {
                $this->role = new \triptrack\Role\Admin($userId);
            } elseif (MemberFactory::currentUserIsMember()) {
                $this->role = new \triptrack\Role\Member(\Current_User::getId());
                $this->role->memberId = $_SESSION['TT_MEMBER_ID'];
            }
        } else {
            $this->role = new \triptrack\Role\User;
        }
    }

    public function isMember()
    {
        return $this->role->isMember();
    }

    /**
     * Loads controller based on Role and Resource.
     * @param Request $request
     * @throws \triptrack\Exception\PrivilegeMissing
     * @throws \triptrack\Exception\BadCommand
     */
    private function loadSubController(Request $request)
    {
        $roleController = filter_var($request->shiftCommand(), FILTER_SANITIZE_STRING);

        if (empty($roleController) || preg_match('/\W/', $roleController)) {
            throw new \triptrack\Exception\BadCommand('Missing role controller');
        }

        $subController = filter_var($request->shiftCommand(), FILTER_SANITIZE_STRING);

        if ($roleController === 'Admin' && !$this->role->isAdmin()) {
            throw new \triptrack\Exception\PrivilegeMissing;
        } elseif ($roleController === 'Member' && !$this->role->isMember()) {
            throw new \triptrack\Exception\PrivilegeMissing;
        }

        if (empty($subController)) {
            throw new \triptrack\Exception\BadCommand('Missing subcontroller');
        }

        $subControllerName = '\\triptrack\\Controller\\' . $roleController . '\\' . $subController;
        if (!class_exists($subControllerName)) {
            throw new \triptrack\Exception\BadCommand($subControllerName);
        }
        $this->subcontroller = new $subControllerName($this->role);
    }

    public function execute(Request $request)
    {
        try {
            return parent::execute($request);
        } catch (\triptrack\Exception\PrivilegeMissing $e) {
            \Current_User::requireLogin();
        } catch (\Exception $e) {
            if (TRIPTRACK_SYSTEM_SETTINGS['friendlyErrors']) {
                \phpws2\Error::log($e);
                $controller = new \triptrack\Controller\FriendlyErrorController($this->getModule());
                return $controller->get($request);
            } else {
                throw $e;
            }
        }
    }

    public function post(Request $request)
    {
        return $this->subcontroller->changeResponse($request);
    }

    public function patch(Request $request)
    {
        return $this->subcontroller->changeResponse($request);
    }

    public function delete(Request $request)
    {
        return $this->subcontroller->changeResponse($request);
    }

    public function put(Request $request)
    {
        return $this->subcontroller->changeResponse($request);
    }

    public function get(Request $request)
    {
        if ($request->isAjax() || (bool) $request->pullGetBoolean('json', true)) {
            return $this->subcontroller->getJson($request);
        } else {
            return $this->subcontroller->getHtml($request);
        }
    }

}
