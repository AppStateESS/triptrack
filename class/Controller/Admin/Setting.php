<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Controller\Admin;

use Canopy\Request;
use triptrack\Controller\SubController;
use triptrack\Factory\SettingFactory;

class Setting extends SubController
{

    protected $view;

    public function __construct(\triptrack\Role\Base $role)
    {
        parent::__construct($role);
        $this->view = new \triptrack\View\SettingView();
    }

    protected function listHtml()
    {
        return $this->view->listHtml();
    }

    public function post(Request $request)
    {
        SettingFactory::save($request->pullPostString('varName'),
                $request->pullPostVar('value'));
        return ['success' => true];
    }

}
