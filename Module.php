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

namespace triptrack;

use Canopy\Request;
use Canopy\Response;
use Canopy\Server;
use Canopy\SettingDefaults;
use triptrack\Controller\Controller;
use triptrack\Factory\MemberFactory;

$defineFile = PHPWS_SOURCE_DIR . 'mod/triptrack/config/defines.php';
if (is_file($defineFile)) {
    require_once $defineFile;
} else {
    require_once PHPWS_SOURCE_DIR . 'mod/triptrack/config/defines.dist.php';
}

class Module extends \Canopy\Module implements SettingDefaults
{

    public function __construct()
    {
        parent::__construct();
        $this->setTitle('triptrack');
        $this->setProperName('Travel Request');
        \spl_autoload_register('\triptrack\Module::autoloader', true, true);
    }

    public static function autoloader($class_name)
    {
        static $not_found = array();

        if (strpos($class_name, 'triptrack') !== 0) {
            return;
        }

        if (isset($not_found[$class_name])) {
            return;
        }
        $class_array = explode('\\', $class_name);
        $shifted = array_shift($class_array);
        $class_dir = implode('/', $class_array);

        $class_path = PHPWS_SOURCE_DIR . 'mod/triptrack/class/' . $class_dir . '.php';

        if (is_file($class_path)) {
            require_once $class_path;
            return true;
        } else {
            $not_found[] = $class_name;
            return false;
        }
    }

    public function getSettingDefaults()
    {
        $settings = array(
            'allowInternational' => false,
            'allowUpload' => false,
            'approvalRequired' => true,
            'bannerImport' => false,
            'contactBannerRequired' => true,
            'defaultCountry' => 'United States',
            'defaultState' => 'North Carolina',
            'hostLabel' => '',
            'organizationLabel' => '',
            'siteContactName' => '',
            'siteContactEmail' => '',
            'uploadRequired' => false,
            'uploadInstructions' => ''
        );
        return $settings;
    }

    public function runTime(Request $request)
    {
        if (\phpws\PHPWS_Core::atHome() && MemberFactory::currentUserIsMember()) {
            $createbutton = '<a href="./triptrack/Member/Trip/create" class="btn btn-primary">Create travel plan</a>';
            \Layout::add($createbutton, 'triptrack', 'triptrack-create');
        }
    }

    public static function loadAdminBar()
    {
        $auth = \Current_User::getAuthorization();

        $vars['is_deity'] = \Current_User::isDeity();
        $vars['logout_uri'] = $auth->logout_link;
        $vars['username'] = \Current_User::getDisplayName();
        $template = new \phpws2\Template($vars);
        $template->setModuleTemplate('triptrack', 'navbar.html');
        $content = $template->get();
        \Layout::plug($content, 'NAV_LINKS');
    }

    public function getController(Request $request)
    {
        try {
            $controller = new Controller($this, $request);
            return $controller;
        } catch (\triptrack\Exception\PrivilegeMissing $e) {
            if ($request->isGet() && !$request->isAjax()) {
                \Current_User::requireLogin();
            } else {
                throw $e;
            }
        } catch (\Exception $e) {
            if (TRIPTRACK_SYSTEM_SETTINGS['friendlyErrors']) {
                \phpws2\Error::log($e);
                $controller = new \triptrack\Controller\FriendlyErrorController($this);
                return $controller;
            } else {
                throw $e;
            }
        }
    }

}
