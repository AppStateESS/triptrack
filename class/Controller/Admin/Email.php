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

namespace triptrack\Controller\Admin;

use triptrack\Controller\SubController;
use triptrack\Factory\EmailFactory;
use triptrack\Factory\MemberFactory;
use Canopy\Request;

class Email extends SubController
{

    protected function post(Request $request)
    {
        $subject = $request->pullPostString('subject');
        $message = $request->pullPostString('message');
        $orgId = $request->pullPostInteger('orgId');
        $tripId = (int) $request->pullPostInteger('tripId', true);
        $options['emailOnly'] = true;
        if ($tripId > 0) {
            $options['tripId'] = $tripId;
        } else {
            $options['orgId'] = $orgId;
        }

        $emailList = MemberFactory::list($options);
        EmailFactory::send($subject, $message, $emailList);
        return ['success' => true];
    }

}
