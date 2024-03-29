<?php

/**
 * MIT License
 * Copyright (c) 2022 Electronic Student Services @ Appalachian State University
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
use triptrack\Factory\TripFactory;

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
            'defaultState' => 'NC',
            'hostLabel' => '',
            'organizationLabel' => '',
            'siteContactName' => 'TripTrack Site',
            'siteContactEmail' => 'no-reply@appstate.edu',
            'uploadRequired' => false,
            'uploadInstructions' => '',
            'internationalInstructions' => '',
            'confirmationInstructions' => '',
            'secondaryRequired' => true,
            'forceEngageOrg' => false,
            'accommodationRequired' => true,
            'confirmationRequired' => false,
        );
        return $settings;
    }

    public function runTime(Request $request)
    {
        if (\phpws\PHPWS_Core::atHome()) {
            if (\Current_User::allow('triptrack')) {
                \Layout::add(View\FrontPageView::admin());
            } elseif (MemberFactory::currentUserIsMember()) {
                \Layout::add(View\FrontPageView::member());
            } elseif (\Current_User::isLogged()) {
                \Layout::add(View\FrontPageView::nonmember());
            } else {
                \Layout::add(View\FrontPageView::user());
            }
        }
    }

    public function getController(Request $request)
    {
        try {
            $controller = new Controller($this, $request);
            return $controller;
        } catch (\triptrack\Exception\PrivilegeMissing $e) {
            if ($request->isGet() && !$request->isAjax()) {
                $auth = \Current_User::getAuthorization();
                if (!empty($auth->login_link)) {
                    $url = $auth->login_link;
                } else {
                    $url = 'index.php?module=users&action=user&command=login_page';
                }
                \phpws\PHPWS_Core::reroute($url);
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
