<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Resource;

class Member extends \phpws2\Resource
{

    protected $bannerId;
    protected $email;
    protected $firstName;
    protected $lastName;
    protected $organizationId;
    protected $username;
    protected $table = 'trip_member';

    public function __construct()
    {
        $this->bannerId = new \phpws2\Variable\IntegerVar(0, 'bannerId');
        $this->email = new \phpws2\Variable\Email(null, 'email', 100);
        $this->firstName = new \ phpws2\Variable\TextOnly(null, 'firstName', 50);
        $this->lastName = new \phpws2\Variable\TextOnly(null, 'lastName', 50);
        $this->organizationId = new \phpws2\Variable\IntegerVar(0,
                'organizationId');
        $this->username = new \phpws2\Variable\TextOnly(null, 'username', 50);
        parent::__construct();
    }

}
