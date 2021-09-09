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

namespace triptrack\Exception;

class MemberPermission extends \Exception
{

    public function __construct()
    {
        $message = 'You are attempting to access a member command as an admin.';
        parent::__construct($message);
    }

}
