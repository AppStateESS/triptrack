<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Controller\User;

use Canopy\Request;
use triptrack\Controller\SubController;

class Trip extends SubController
{

    protected function createHtml()
    {
        $view = new \triptrack\View\TripView();
        $script = $view->scriptView('Create');
        $variables = [];
        $template = new \phpws2\Template($variables);
        $template->setModuleTemplate('triptrack', 'User/create.html');
        return $template->get();
    }

}
