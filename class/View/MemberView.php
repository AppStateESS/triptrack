<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\View;

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
            $filename = 'Admin/MemberListTable.tpl';
        } else {
            $filename = 'Member/MemberListTable.tpl';
        }
        $template = new \phpws2\Template(['listing' => $memberList]);
        $template->setModuleTemplate('triptrack', $filename);
        return $template->get();
    }

}
