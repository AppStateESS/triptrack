<?php

declare(strict_types=1);
/**
 * MIT License
 * Copyright (c) 2022 Electronic Student Services @ Appalachian State University
 *
 * See LICENSE file in root directory for copyright and distribution permissions.
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Controller\AbstractController;

use Canopy\Request;
use triptrack\Factory\MemberFactory;
use triptrack\Controller\SubController;

class AbstractMember extends SubController
{

    protected function eventAttendingJson(Request $request)
    {
        $eventId = $request->pullGetInteger('eventId');
        if (empty($eventId)) {
            return false;
        }
        return MemberFactory::getEventAttending($eventId);
    }

}
