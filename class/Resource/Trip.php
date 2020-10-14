<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Resource;

class Trip extends \phpws2\Resource
{

    protected $additionalMembers;
    protected $approved;
    protected $contactName;
    protected $contactEmail;
    protected $contactPhone;
    protected $destinationCity;
    protected $destinationCountry;
    protected $destinationState;
    protected $host;
    protected $housingAddress;
    protected $organizationId;
    protected $secContactName;
    protected $secContactEmail;
    protected $secContactPhone;
    protected $submitDate;
    protected $submitEmail;
    protected $submitName;
    protected $submitUsername;
    protected $timeDeparting;
    protected $timeEventStarts;
    protected $timeReturn;
    protected $visitPurpose;
    protected $table = 'trip_trip';

    public function __construct()
    {
        $this->additionalMembers = new \phpws2\Variable\TextOnly(null,
                'additionalMembers');
        $this->additionalMembers->allowNull(true);
        $this->approved = new \phpws2\Variable\BooleanVar(false, 'approved');
        $this->host = new \phpws2\Variable\TextOnly(null, 'host', 255);
        $this->contactName = new \phpws2\Variable\TextOnly(null, 'contactName',
                255);
        $this->contactEmail = new \phpws2\Variable\Email(null, 'contactEmail');
        $this->contactPhone = new \phpws2\Variable\PhoneNumber(null,
                'contactPhone');
        $this->destinationCity = new \phpws2\Variable\TextOnly(null,
                'destinationCity', 80);
        $this->destinationCountry = new \phpws2\Variable\TextOnly(null,
                'destinationCountry', 2);
        $this->destinationState = new \phpws2\Variable\TextOnly(null,
                'destinationState', 20);
        $this->housingAddress = new \phpws2\Variable\TextOnly(null,
                'housingAddress');
        $this->organizationId = new \phpws2\Variable\IntegerVar(0,
                'organizationId');
        $this->secContactName = new \phpws2\Variable\TextOnly(null,
                'contactName', 255);
        $this->secContactEmail = new \phpws2\Variable\Email(null,
                'secContactEmail');
        $this->secContactPhone = new \phpws2\Variable\PhoneNumber(null,
                'contactPhone');
        $this->submitDate = new \phpws2\Variable\DateTime(0, 'submitDate');
        $this->submitEmail = new \phpws2\Variable\Email(null, 'submitEmail');
        $this->submitUsername = new \phpws2\Variable\TextOnly(null,
                'submitUsername', 50);
        $this->submitName = new \phpws2\Variable\TextOnly(null, 'submitName', 60);
        $this->timeDeparting = new \phpws2\Variable\DateTime(0, 'timeDeparting');
        $this->timeEventStarts = new \phpws2\Variable\DateTime(0,
                'timeEventStarts');
        $this->timeReturn = new \phpws2\Variable\DateTime(0, 'timeReturn');
        $this->visitPurpose = new \phpws2\Variable\TextOnly(null,
                'visitPurpose', 255);
        parent::__construct();
        $this->submitDate->stamp();
    }

}
