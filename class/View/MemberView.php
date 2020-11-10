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
        return $this->dashboard('member', 'MemberList');
    }

    public function importForm()
    {
        return $this->dashboard('member', 'ImportForm');
    }

}
