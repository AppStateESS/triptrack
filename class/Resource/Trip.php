<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Resource;

class Trip extends AbstractResource
{

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
    protected $memberCount;
    protected $table = 'trip_trip';

    public function __construct()
    {
        $this->approved = new \phpws2\Variable\BooleanVar(false, 'approved');
        $this->host = new \phpws2\Variable\TextOnly(null, 'host', 255);
        $this->contactName = new \phpws2\Variable\TextOnly(null, 'contactName', 255);
        $this->contactEmail = new \phpws2\Variable\Email(null, 'contactEmail');
        $this->contactPhone = new \phpws2\Variable\PhoneNumber(null, 'contactPhone', 30);
        $this->destinationCity = new \phpws2\Variable\TextOnly(null, 'destinationCity', 80);
        $this->destinationCountry = new \phpws2\Variable\TextOnly(null, 'destinationCountry', 100);
        $this->destinationState = new \phpws2\Variable\TextOnly(null, 'destinationState', 20);
        $this->housingAddress = new \phpws2\Variable\TextOnly(null, 'housingAddress');
        $this->organizationId = new \phpws2\Variable\IntegerVar(0, 'organizationId');
        $this->secContactName = new \phpws2\Variable\TextOnly(null, 'secContactName', 255);
        $this->secContactEmail = new \phpws2\Variable\Email(null, 'secContactEmail');
        $this->secContactPhone = new \phpws2\Variable\PhoneNumber(null, 'secContactPhone', 30);
        $this->submitDate = new \phpws2\Variable\DateTime(0, 'submitDate');
        $this->submitDate->stamp();
        $this->submitEmail = new \phpws2\Variable\Email(null, 'submitEmail');
        $this->submitUsername = new \phpws2\Variable\TextOnly(null, 'submitUsername', 50);
        $this->submitName = new \phpws2\Variable\TextOnly(null, 'submitName', 60);
        $this->timeDeparting = new \phpws2\Variable\DateTime(0, 'timeDeparting');
        $this->timeDeparting->stamp();
        $this->timeEventStarts = new \phpws2\Variable\DateTime(0, 'timeEventStarts');
        $this->timeEventStarts->stamp();
        $this->timeReturn = new \phpws2\Variable\DateTime(0, 'timeReturn');
        $this->timeReturn->stamp();
        $this->visitPurpose = new \phpws2\Variable\TextOnly(null, 'visitPurpose', 255);
        $this->memberCount = new \phpws2\Variable\SmallInteger(0, 'memberCount');
        $this->memberCount->setIsTableColumn(false);
        parent::__construct();
    }

    public function getVariablesAsValue($return_null = null, $hide = null, $null_as_empty_string = false)
    {
        $timeFormat = '%l:%M %p';
        $dateFormat = '%b %e, %Y';
        $values = parent::getVariablesAsValue($return_null, $hide, $null_as_empty_string);
        $formats = ['timeDeparting', 'timeEventStarts', 'timeReturn'];
        foreach ($formats as $varName) {
            $unix = $values[$varName];
            $values['formatted'][$varName] = ['time' => strftime($timeFormat, $unix),
                'date' => strftime($dateFormat, $unix)];
        }
        return $values;
    }

}
