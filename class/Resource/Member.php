<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Resource;

class Member extends AbstractResource
{

    protected $bannerId;
    protected $email;
    protected $firstName;
    protected $lastName;
    protected $phone;
    protected $username;
    protected $restricted;
    protected $deleted;
    protected $table = 'trip_member';

    public function __construct()
    {
        $this->bannerId = new \phpws2\Variable\IntegerVar(0, 'bannerId');
        $this->email = new \phpws2\Variable\Email(null, 'email', 100);
        $this->firstName = new \phpws2\Variable\TextOnly(null, 'firstName', 50);
        $this->phone = new \phpws2\Variable\PhoneNumber(null, 'phone');
        $this->lastName = new \phpws2\Variable\TextOnly(null, 'lastName', 50);
        $this->username = new \phpws2\Variable\TextOnly(null, 'username', 50);
        $this->restricted = new \phpws2\Variable\BooleanVar(false, 'restricted');
        $this->deleted = new \phpws2\Variable\BooleanVar(false, 'deleted');
        parent::__construct();
    }

    public function setPhone($phone)
    {
        $strippedPhone = preg_replace('/\D/', '', $phone);
        $this->phone->set($strippedPhone);
    }

    public function getFullName()
    {
        return $this->firstName->get() . ' ' . $this->lastName->get();
    }

}
