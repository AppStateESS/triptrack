<?php

/**
 * MIT License
 * Copyright (c) 2021 Electronic Student Services @ Appalachian State University
 *
 * See LICENSE file in root directory for copyright and distribution permissions.
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\View;

class EmailView extends AbstractView
{

    public function emailMembers(string $control, int $organizationId, int $tripId = 0)
    {
        return $this->dashboardScript($control, 'EmailMembers', ['orgId' => $organizationId, 'tripId' => $tripId]);
    }

}
