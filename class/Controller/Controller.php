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

namespace cstravel\Controller;

use Canopy\Request;
use phpws2\Database;

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
        $userId = \Current_User::getId();
        if (\Current_User::allow('cstravel')) {
            $this->role = new \cstravel\Role\Admin($userId);
        } else {
            $this->role = new \cstravel\Role\User;
        }
    }

    /**
     * Loads controller based on Role and Resource.
     * @param Request $request
     * @throws \cstravel\Exception\PrivilegeMissing
     * @throws \cstravel\Exception\BadCommand
     */
    private function loadSubController(Request $request)
    {
        $roleController = filter_var($request->shiftCommand(),
                FILTER_SANITIZE_STRING);

        if (empty($roleController) || preg_match('/\W/', $roleController)) {
            throw new \cstravel\Exception\BadCommand('Missing role controller');
        }

        $subController = filter_var($request->shiftCommand(),
                FILTER_SANITIZE_STRING);

        if ($roleController === 'Admin' && !$this->role->isAdmin()) {
            throw new \cstravel\Exception\PrivilegeMissing;
        }

        if (empty($subController)) {
            throw new \cstravel\Exception\BadCommand('Missing subcontroller');
        }

        $subControllerName = '\\cstravel\\Controller\\' . $roleController . '\\' . $subController;
        if (!class_exists($subControllerName)) {
            throw new \cstravel\Exception\BadCommand($subControllerName);
        }
        $this->subcontroller = new $subControllerName($this->role);
    }

    public function execute(Request $request)
    {
        try {
            return parent::execute($request);
        } catch (\cstravel\Exception\PrivilegeMissing $e) {
            \Current_User::requireLogin();
        } catch (\Exception $e) {
            if (CSTRAVEL_SYSTEM_SETTINGS['friendlyErrors']) {
                \phpws2\Error::log($e);
                $controller = new \cstravel\Controller\FriendlyErrorController($this->getModule());
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
            VisitorView::loggedInBox();
            return $this->subcontroller->getHtml($request);
        }
    }

}
