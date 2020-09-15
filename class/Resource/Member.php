<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Resource;

class Member extends \phpws2\Resource
{

    protected $firstName;
    protected $lastName;
    protected $bannerId;
    protected $username;
    protected $email;
    protected $table = 'trip_member';

    public function __construct()
    {
        $this->firstName = new \ phpws2\Variable\TextOnly(null, 'firstName', 50);
        $this->lastName = new \phpws2\Variable\TextOnly(null, 'lastName', 50);
        $this->bannerId = new \phpws2\Variable\IntegerVar(0, 'bannerId');
        $this->username = new \phpws2\Variable\TextOnly(null, 'username', 50);
        $this->email = new \phpws2\Variable\Email(null, 'email', 100);
        parent::__construct();
    }

}
