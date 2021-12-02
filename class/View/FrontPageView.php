<?php

declare(strict_types=1);
/**
 * MIT License
 * Copyright (c) 2021 Electronic Student Services @ Appalachian State University
 *
 * See LICENSE file in root directory for copyright and distribution permissions.
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\View;

use triptrack\Factory\TripFactory;
use triptrack\View\TripView;

class FrontPageView
{

    public static function admin()
    {
        $trip = TripFactory::getCurrentSubmitterIncomplete();
        if ($trip) {
            $vars['tripButton'] = TripView::completeButton($trip->id, true);
        } else {
            $vars['tripButton'] = TripView::createButton(true);
        }
        $vars['viewButton'] = TripView::viewButton(true);
        $vars['organizationLabel'] = \triptrack\Factory\SettingFactory::getOrganizationLabel();
        $auth = \Current_User::getAuthorization();
        $vars['logoutUrl'] = $auth->logout_link;
        $template = new \phpws2\Template($vars);
        $template->setModuleTemplate('triptrack', 'Admin/FrontPage.html');
        return $template->get();
    }

    public static function member()
    {
        $trip = TripFactory::getCurrentSubmitterIncomplete();
        if ($trip) {
            $vars['tripButton'] = TripView::completeButton($trip->id, false);
        } else {
            $vars['tripButton'] = TripView::createButton(false);
        }
        $vars['viewButton'] = TripView::viewButton(false);

        $template = new \phpws2\Template($vars);
        $template->setModuleTemplate('triptrack', 'Member/FrontPage.html');
        return $template->get();
    }

    public static function user()
    {
        $auth = \Current_User::getAuthorization();
        $template = new \phpws2\Template(['loginUrl' => $auth->login_link]);
        $template->setModuleTemplate('triptrack', 'User/FrontPage.html');
        return $template->get();
    }

}
