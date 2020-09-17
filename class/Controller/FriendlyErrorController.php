<?php

/**
 * MIT License
 * Copyright (c) 2019 Electronic Student Services @ Appalachian State University
 *
 * See LICENSE file in root directory for copyright and distribution permissions.
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Controller;

define('TRIPTRACK_FRIENDLY_MESSAGE', 'Server error. Could not complete action');

class FriendlyErrorController extends \phpws2\Http\Controller
{

    public function execute(\Canopy\Request $request)
    {
        if ($request->isAjax()) {
            throw new \Exception(TRIPTRACK_FRIENDLY_MESSAGE);
        }
        return parent::execute($request);
    }

    public function get(\Canopy\Request $request)
    {
        $vars = \triptrack\Factory\SettingsFactory::getContact();
        $template = new \phpws2\Template($vars);
        $template->setModuleTemplate('triptrack', 'error.html');
        $template->add('message', TRIPTRACK_FRIENDLY_MESSAGE);
        $view = new \phpws2\View\HtmlView($template->get());
        $response = new \Canopy\Response($view);
        return $response;
    }

}
