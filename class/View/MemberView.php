<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\View;

use triptrack\Factory\TripFactory;
use triptrack\Factory\MemberFactory;
use phpws2\Template;

class MemberView extends AbstractView
{

    public function listHtml()
    {
        return $this->dashboardScript('member', 'MemberList');
    }

    public function importForm()
    {
        return $this->dashboardScript('member', 'ImportForm');
    }

    public static function memberTable(array $memberList, bool $isAdmin = false)
    {
        if (count($memberList) === 0) {
            return '<div class="alert alert-danger">No members signed up for trip</div>';
        }
        if ($isAdmin) {
            $filename = 'Admin/MemberListTable.html';
        } else {
            $filename = 'Member/MemberListTable.html';
        }
        $template = new Template(['listing' => $memberList]);
        $template->setModuleTemplate('triptrack', $filename);
        return $template->get();
    }

    /**
     *
     * @param int $memberId
     * @return string Member's trip listing.
     */
    public function view(int $memberId)
    {
        $member = MemberFactory::build($memberId);
        $vars['member'] = $member->getStringVars();
        $trips = TripFactory::list(['memberId' => $memberId, 'orderBy' => 'timeDeparting', 'includeOrganizationName' => true]);
        $vars['trips'] = $trips;

        $template = new Template($vars);
        $template->setModuleTemplate('triptrack', 'Admin/MemberView.html');

        return $this->dashboardHTML('member', $template->get());
    }

}
