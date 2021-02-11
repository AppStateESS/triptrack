<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\View;

use triptrack\Factory\SettingFactory;
use phpws2\Database;
use triptrack\Factory\TripFactory;

class TripView extends AbstractView
{

    public function listHtml()
    {
        return $this->dashboard('trip', 'TripList');
    }

    public function form(int $tripId = 0)
    {
        $vars = $this->getSettings();
        $vars['tripId'] = $tripId;
        $vars['memberForm'] = false;
        $tpl['dashboard'] = $this->scriptView('Create', $vars);
        $orgExists = \triptrack\Factory\OrganizationFactory::exists();
        $tpl['tripActive'] = ' active';
        $tpl['orgActive'] = null;
        $tpl['memberActive'] = null;
        $tpl['settingActive'] = null;
        $tpl['alert'] = !$orgExists;
        $template = new \phpws2\Template($tpl);
        $template->setModuleTemplate('triptrack', 'Admin/Dashboard.html');
        return $template->get();
    }

    public function json(int $tripId)
    {
        $trip = TripFactory::load(TripFactory::build(), $tripId);
        return $trip->getVariablesAsValue();
    }

    public function memberForm($tripId = 0)
    {
        if (!\triptrack\Factory\OrganizationFactory::exists()) {
            return '<p>No organizations were found. Please contact our office.</p>';
        }

        $vars = $this->getSettings();
        $vars['tripId'] = $tripId;
        $vars['memberForm'] = true;
        $vars['memberEmail'] = \Current_User::getEmail();
        return $this->scriptView('Create', $vars);
    }

    private function getSettings()
    {
        $settings = SettingFactory::getAll();
        $vars['allowInternational'] = (bool) $settings['allowInternational'];
        $vars['contactBannerRequired'] = (bool) $settings['contactBannerRequired'];
        $vars['defaultState'] = $settings['defaultState'];
        $vars['defaultCountry'] = $settings['defaultCountry'];
        return $vars;
    }

}
