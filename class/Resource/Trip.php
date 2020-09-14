<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */
class Trip extends phpws2\Resource
{

    protected $submitDate;
    protected $destinationAddress;
    protected $purpose;
    protected $competingTeam;
    protected $timeDeparting;
    protected $timeEventStarts;
    protected $timeReturn;
    protected $housingAddress;
    protected $contactName;
    protected $contactPhone;
    protected $secContantname;
    protected $secContactPhone;
    protected $additionalMembers;
    protected $submitName;
    protected $submitEmail;

    public function __construct()
    {
        $this->destinationAddress = new \phpws2\Variable\StringVar(null,
                'destinationAddress');
        $this->purpose = new \phpws2\Variable\StringVar(null, 'purpose', 255);
        $this->competingTeam = new \phpws2\Variable\StringVar(null,
                'competingTeam', 255);
        $this->timeDeparting = new phpws2\Variable\DateTime(0, 'timeDeparting');
        $this->timeEventStarts = new phpws2\Variable\DateTime(0,
                'timeEventStarts');
        $this->timeReturn = new phpws2\Variable\DateTime(0, 'timeReturn');
        $this->housingAddress = new \phpws2\Variable\StringVar(null,
                'housingAddress');
        $this->contactName = new \phpws2\Variable\StringVar(null, 'contactName',
                255);
        $this->contactPhone = new phpws2\Variable\PhoneNumber(null,
                'contactPhone');
        $this->secContactName = new \phpws2\Variable\StringVar(null,
                'contactName', 255);
        $this->secContactPhone = new phpws2\Variable\PhoneNumber(null,
                'contactPhone');
        $this->additionalMembers = new \phpws2\Variable\StringVar(null,
                'additionalMembers');
        $this->additionalMembers->allowNull(true);
        $this->submitDate = new phpws2\Variable\DateTime(0, 'submitDate');
        $this->submitName = new \phpws2\Variable\StringVar(null, 'submitName');
        $this->submitEmail = new phpws2\Variable\Email(null, 'submitEmail');
        parent::__construct();
        if ($this->submitDate->isEmpty()) {
            $this->submitDate->stamp();
        }
    }

}
