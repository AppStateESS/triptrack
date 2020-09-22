<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\View;

class SettingView extends AbstractView
{

    public function listHtml()
    {
        return $this->dashboard('setting', 'Settings');
    }

}
