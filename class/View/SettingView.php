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
        $dir = PHPWS_HOME_DIR . 'files/triptrack/';
        $fileDirectory = is_dir($dir) && is_writable($dir);
        return $this->dashboardScript('setting', 'SettingList',
                ['settings' => SettingFactory::getAll(), 'fileDirectory' => $fileDirectory]);
    }

}
