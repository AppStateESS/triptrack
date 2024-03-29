<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\View;

use phpws2\Database;
use triptrack\Factory\TripFactory;
use triptrack\Factory\MemberFactory;
use triptrack\Factory\SettingFactory;
use triptrack\Factory\EngageFactory;
use triptrack\Factory\OrganizationFactory;
use triptrack\View\MemberView;
use triptrack\View\DocumentView;
use triptrack\Resource\Trip;

class TripView extends AbstractView
{

    public function listHtml($unapproved = false)
    {
        return $this->dashboardScript('trip', 'TripList', ['unapproved' => $unapproved]);
    }

    /**
     * Member trip create button for home screen
     * @return string
     */
    public static function createButton(bool $isAdmin = false)
    {
        return '<a href="./triptrack/' . ($isAdmin ? 'Admin' : 'Member') . '/Trip/create" class="btn btn-success">Create travel plan</a>';
    }

    /**
     * Member trip update button for home screen
     * @param int $tripId
     * @return string
     */
    public static function completeButton(int $tripId, bool $isAdmin = false)
    {
        return '<a href="./triptrack/' . ($isAdmin ? 'Admin' : 'Member') . '/Trip/' . $tripId . '/edit" class="btn btn-outline-success">Complete travel plan</a>';
    }

    public static function viewButton(bool $isAdmin = false)
    {
        return '<a href="./triptrack/' . ($isAdmin ? 'Admin' : 'Member') . '/Trip" class="btn btn-info">See upcoming trips</a>';
    }

    public static function upcomingButton(bool $isAdmin = false)
    {
        return '<a href="./triptrack/Admin/Trip/upcoming" class="btn btn-info">See upcoming trips</a>';
    }

    public function adminForm(int $tripId = 0)
    {
        $vars = $this->getSettings();
        $vars['tripId'] = $tripId;
        return $this->dashboardScript('trip', 'AdminTripForm', $vars);
    }

    public function assign(int $tripId, string $role = 'Admin')
    {
        if ($role === 'Admin') {
            return $this->dashboardScript('trip', 'MemberSelection', [
                    'tripId' => $tripId,
                    'organizationLabel' => SettingFactory::getOrganizationLabel(),
                    'role' => 'Admin'
            ]);
        } else {
            return $this->scriptView('MemberSelection', [
                    'tripId' => $tripId,
                    'organizationLabel' => SettingFactory::getOrganizationLabel(),
                    'role' => 'Member']);
        }
    }

    /**
     * Returns shared member and admin view variables.
     * @param type $trip
     */
    private function getViewVars($trip)
    {
        $organization = OrganizationFactory::build($trip->organizationId);

        $vars = $trip->getStringVars();
        $vars['organizationName'] = $organization->name;
        $vars['organizationLabel'] = SettingFactory::getOrganizationLabel();
        $vars['organizationId'] = $organization->id;
        $vars['contactPhoneFormat'] = preg_replace('/(\d{3})(\d{3})(\d{4})/', '\\1-\\2-\\3', $trip->contactPhone);
        $vars['logout'] = OrganizationFactory::logoutLink();
        return $vars;
    }

    public function adminView(int $tripId)
    {
        $trip = TripFactory::build($tripId);
        $vars = $this->getViewVars($trip);
        if ($trip->engageEventId > 0) {
            $event = EngageFactory::getEvent($trip->engageEventId);
            if ($event) {
                $vars['event']['name'] = $event[0]->name;
                $vars['event']['url'] = 'https://engage.appstate.edu/event/' . $event[0]->id;
                $vars['event']['imageUrl'] = $event[0]->imageUrl;
                $vars['event']['startsOn'] = $event[0]->startsOn;
            } else {
                $vars['event'] = null;
            }
        }
        // if trip is approved, we show deleted members
        $members = MemberFactory::list(['tripId' => $tripId, 'isAdmin' => true, 'includeDeleted' => $trip->approved]);

        $vars['memberList'] = MemberView::memberTable($members, true);
        $vars['documents'] = DocumentView::tripList($tripId, 'Admin');

        if (TripFactory::approvalAllowed($tripId)) {
            $vars['approvalButton'] = $this->scriptView('Approval', ['approvedStatus' => $trip->approved, 'tripId' => $tripId]);
            $vars['approvalWarning'] = false;
        } else {
            $vars['approvalWarning'] = true;
            $vars['approvalButton'] = null;
        }
        $template = new \phpws2\Template($vars);
        $template->setModuleTemplate('triptrack', 'Admin/View.html');
        return $this->dashboardHTML('trip', $template->get());
    }

    public function json(int $tripId)
    {
        $trip = TripFactory::load(TripFactory::build(), $tripId);
        return $trip->getVariablesAsValue();
    }

    public function memberForm(Trip $trip)
    {
        if (!\triptrack\Factory\OrganizationFactory::exists()) {
            return '<p>No organizations were found. Please contact our office.</p>';
        }

        if (!\triptrack\Factory\MemberFactory::currentOwnsTrip($trip)) {
            throw new \triptrack\Exception\MemberDoesNotOwnTrip;
        }

        $vars = $this->getSettings();
        $vars['tripId'] = $trip->id;
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
        $vars['internationalInstructions'] = $settings['internationalInstructions'];
        $vars['confirmationInstructions'] = $settings['confirmationInstructions'];
        $vars['accommodationRequired'] = (bool) $settings['accommodationRequired'];
        $vars['confirmationRequired'] = (bool) $settings['confirmationRequired'];
        $vars['secondaryRequired'] = (bool) $settings['secondaryRequired'];
        return $vars;
    }

    public function memberView(Trip $trip)
    {
        $vars = $this->getViewVars($trip);

        $members = MemberFactory::list(['tripId' => $trip->id]);
        $vars['memberList'] = MemberView::memberTable($members);
        $vars['documents'] = DocumentView::tripList($trip->id, 'Member');
        $vars['approvalWarning'] = TripFactory::approvalAllowed($trip->id) ? false : true;
        $template = new \phpws2\Template($vars);
        $template->setModuleTemplate('triptrack', 'User/View.html');
        return $template->get();
    }

    public function memberList()
    {
        $trip = TripFactory::getCurrentSubmitterIncomplete();

        if (!empty($trip)) {
            $vars['trip'] = $trip->getStringVars();
        } else {
            $vars['trip'] = false;
        }
        $vars['logout'] = TripFactory::logoutLink();
        $vars['rows'] = TripFactory::list(['submitUsername' => \Current_User::getUsername(),
                'order' => 'submitDate', 'memberCount' => true]);
        $vars['hostLabel'] = SettingFactory::getHostLabel();

        $template = new \phpws2\Template($vars);
        $template->setModuleTemplate('triptrack', 'User/List.html');
        return $template->get();
    }

    public function upcoming()
    {
        $options['startDate'] = time();
        $options['endDate'] = time() + (86400 * 14);
        $options['approvedOnly'] = true;
        $options['formatDates'] = true;
        $options['memberCount'] = true;
        $options['includeOrganizationName'] = true;
        $options['orderBy'] = 'timeDeparting';
        $vars['list'] = TripFactory::list($options);
        $vars['organizationLabel'] = SettingFactory::getOrganizationLabel();
        $template = new \phpws2\Template($vars);
        $template->setModuleTemplate('triptrack', 'User/Upcoming.html');
        return $this->dashboardHTML('upcoming', $template->get());
    }

}
