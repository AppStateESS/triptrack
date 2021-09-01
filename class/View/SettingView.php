<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\View;

use triptrack\Factory\SettingFactory;

class SettingView extends AbstractView
{

    public function listHtml()
    {
        return $this->dashboardScript('setting', 'SettingList',
                        ['settings' => SettingFactory::getAll()]);
    }

}
