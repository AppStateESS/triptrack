<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\View;

use triptrack\Factory\SettingFactory;

class TripView extends AbstractView
{

    public function listHtml()
    {
        return $this->dashboard('trip', 'TripList');
    }

    public function form(int $tripId = 0)
    {
        $vars['tripId'] = $tripId;
        $settings = SettingFactory::getAll();
        $vars['allowInternational'] = (bool) $settings['allowInternational'];
        $vars['contactBannerRequired'] = (bool) $settings['contactBannerRequired'];
        return $this->scriptView('Create', $vars);
    }

}
