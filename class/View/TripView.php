<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\View;

class TripView extends AbstractView
{

    public function listHtml()
    {
        return $this->dashboard('trip', 'TripList');
    }

}
