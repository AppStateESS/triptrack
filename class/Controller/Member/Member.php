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

namespace triptrack\Controller\Member;

use triptrack\Controller\SubController;
use triptrack\Factory\MemberFactory;
use Canopy\Request;

class Member extends SubController
{

    protected function listJson(Request $request)
    {
        $options = [];
        $options['isAdmin'] = false;
        $options['orgId'] = $request->pullGetString('orgId', true);
        $options['tripId'] = $request->pullGetString('tripId', true);
        return MemberFactory::list($options);
    }

}
