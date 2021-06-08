<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Role;

class Member extends Base
{

    public $memberId = 0;

    public function isMember()
    {
        return true;
    }

}
