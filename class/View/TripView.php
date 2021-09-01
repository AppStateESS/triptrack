<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\View;

use triptrack\Factory\SettingFactory;
use phpws2\Database;
use triptrack\Factory\TripFactory;
use triptrack\Resource\Trip;

class TripView extends AbstractView
{

    public function listHtml()
    {
        return $this->dashboard('trip', 'TripList');
    }

    /**
     * Member trip create button for home screen
     * @return string
     */
    public static function createButton()
    {
        return '<div class="text-center mb-2"><a href="./triptrack/Member/Trip/create" class="btn btn-outline-dark">Create travel plan</a></div>';
    }

    public function emailMembers(int $organizationId, int $tripId)
    {
        return $this->dashboard('trip', 'EmailMembers', ['orgId' => $organizationId, 'tripId' => $tripId]);
    }

    public static function viewButton()
    {
        return '<div class="text-center mb-2"><a href="./triptrack/Member/Trip" class="btn btn-outline-dark">See upcoming trips</a></div>';
    }

    public function adminForm(int $tripId = 0)
    {
        $vars = $this->getSettings();
        $vars['tripId'] = $tripId;
        return $this->dashboard('trip', 'AdminTripForm', $vars);
    }

    public function adminView(int $tripId)
    {
        $trip = TripFactory::build($tripId);
        $organization = \triptrack\Factory\OrganizationFactory::build($trip->organizationId);
        $vars = $trip->getStringVars();
        $vars['organizationName'] = $organization->name;
        $vars['organizationLabel'] = \triptrack\Factory\SettingFactory::getOrganizationLabel();
        $vars['contactPhoneFormat'] = preg_replace('/(\d{3})(\d{3})(\d{4})/', '\\1-\\2-\\3', $trip->contactPhone);
        $template = new \phpws2\Template($vars);
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

    public function memberView(Trip $trip)
    {
        $organization = \triptrack\Factory\OrganizationFactory::build($trip->organizationId);
        $vars = $trip->getStringVars();
        $vars['organizationName'] = $organization->name;
        $vars['organizationLabel'] = \triptrack\Factory\SettingFactory::getOrganizationLabel();
        $vars['contactPhoneFormat'] = preg_replace('/(\d{3})(\d{3})(\d{4})/', '\\1-\\2-\\3', $trip->contactPhone);
        $template = new \phpws2\Template($vars);
        $template->setModuleTemplate('triptrack', 'User/View.html');
        return $template->get();
    }

    public function memberList()
    {
        $vars['rows'] = TripFactory::list(['submitUsername' => \Current_User::getUsername(),
                    'order' => 'submitDate']);
        $vars['hostLabel'] = SettingFactory::getHostLabel();
        $template = new \phpws2\Template($vars);
        $template->setModuleTemplate('triptrack', 'User/List.html');
        return $template->get();
    }

}
