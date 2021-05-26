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

    public function adminForm(int $tripId = 0)
    {
        $vars = $this->getSettings();
        $vars['tripId'] = $tripId;
        $tpl['dashboard'] = $this->scriptView('AdminTripForm', $vars);
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

    public function html(int $tripId)
    {
        $values = $this->json($tripId);
        $template = new \phpws2\Template($values);
        $template->setModuleTemplate('triptrack', 'Admin/View.html');
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
        if ($tripId) {
            if (!\triptrack\Factory\MemberFactory::currentOwnsTrip($tripId)) {
                exit('Member does not own trip');
            }
        }
        $vars = $this->getSettings();
        $vars['tripId'] = $tripId;
        $result = $this->scriptView('MemberTripForm', $vars);
        return $result;
    }

    private function getSettings()
    {
        $settings = SettingFactory::getAll();
        $vars['allowInternational'] = (bool) $settings['allowInternational'];
        $vars['allowUpload'] = (bool) $settings['allowUpload'];
        $vars['approvalRequired'] = (bool) $settings['approvalRequired'];
        $vars['bannerImport'] = (bool) $settings['bannerImport'];
        $vars['contactBannerRequired'] = (bool) $settings['contactBannerRequired'];
        $vars['defaultState'] = $settings['defaultState'];
        $vars['defaultCountry'] = $settings['defaultCountry'];
        $vars['hostLabel'] = $settings['hostLabel'];
        $vars['organizationLabel'] = $settings['organizationLabel'];
        $vars['siteContactName'] = $settings['siteContactName'];
        $vars['siteContactEmail'] = $settings['siteContactEmail'];
        $vars['uploadRequired'] = (bool) $settings['uploadRequired'];
        $vars['uploadInstructions'] = $settings['uploadInstructions'];
        $vars['accommodationRequired'] = (bool) $settings['accommodationRequired'];
        $vars['secondaryRequired'] = (bool) $settings['secondaryRequired'];
        return $vars;
    }

}
