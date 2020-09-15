<?php

/**
 * MIT License
 * Copyright (c) 2020 Electronic Student Services @ Appalachian State University
 *
 * See LICENSE file in root directory for copyright and distribution permissions.
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Role;

use triptrack\Factory\VisitorFactory;

class Admin extends Base
{

    public function isAdmin()
    {
        return true;
    }

    public function isVisitor()
    {
        return VisitorFactory::isLoggedIn();
    }

}
