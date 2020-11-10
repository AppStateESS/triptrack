<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Controller\Admin;

use triptrack\Controller\SubController;
use Canopy\Request;
use triptrack\Factory\MemberFactory;

class Member extends SubController
{

    protected $view;

    public function __construct(\triptrack\Role\Base $role)
    {
        parent::__construct($role);
        $this->view = new \triptrack\View\MemberView();
    }

    protected function listHtml()
    {
        return $this->view->listHtml();
    }

    protected function listJson(Request $request)
    {
        $options = [];
        return MemberFactory::list($options);
    }

    protected function post(Request $request)
    {
        MemberFactory::post($request);
        return ['success' => true];
    }

    protected function put(Request $request)
    {
        MemberFactory::put($this->id, $request);
        return ['success' => true];
    }

}
