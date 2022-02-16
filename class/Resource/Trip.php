<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Resource;

require_once PHPWS_SOURCE_DIR . 'mod/triptrack/config/travel_methods.php';

class Trip extends AbstractResource
{

    protected $approved;
    protected $completed;
    protected $confirmedDate;
    protected $contactName;
    protected $contactEmail;
    protected $contactPhone;
    protected $destinationCity;
    protected $destinationCountry;
    protected $destinationState;
    protected $engageEventId;
    protected $host;
    protected $housingAddress;
    protected $memberCount;
    protected $organizationId;
    protected $secContactName;
    protected $secContactEmail;
    protected $secContactPhone;
    protected $submitUserId;
    protected $submitDate;
    protected $submitEmail;
    protected $submitName;
    protected $submitUsername;
    protected $table = 'trip_trip';
    protected $timeDeparting;
    protected $timeEventStarts;
    protected $timeReturn;

    /**
     * Method of transportation to reach destination.
     * See travel_methods.php file for complete list.
     *
     * TT_PERSONAL
     * TT_CAR_SHARE
     * TT_UNI_VAN
     * TT_RENTAL
     * TT_BUS
     * TT_AIR
     * @var int
     */
    protected $travelMethod;
    protected $visitPurpose;

    public function __construct()
    {
        $this->approved = new \phpws2\Variable\BooleanVar(false, 'approved');
        $this->completed = new \phpws2\Variable\BooleanVar(false, 'completed');
        $this->confirmedDate = new \phpws2\Variable\DateTime(0, 'confirmedDate');
        $this->contactName = new \phpws2\Variable\TextOnly(null, 'contactName', 255);
        $this->contactEmail = new \phpws2\Variable\Email(null, 'contactEmail');
        $this->contactPhone = new \phpws2\Variable\PhoneNumber(null, 'contactPhone', 30);
        $this->destinationCity = new \phpws2\Variable\TextOnly(null, 'destinationCity', 80);
        $this->destinationCountry = new \phpws2\Variable\TextOnly(null, 'destinationCountry', 100);
        $this->destinationState = new \phpws2\Variable\TextOnly(null, 'destinationState', 20);
        $this->engageEventId = new \phpws2\Variable\IntegerVar(0, 'engageEventId');
        $this->host = new \phpws2\Variable\TextOnly(null, 'host', 255);
        $this->housingAddress = new \phpws2\Variable\TextOnly(null, 'housingAddress');
        $this->memberCount = new \phpws2\Variable\SmallInteger(0, 'memberCount');
        $this->memberCount->setIsTableColumn(false);
        $this->organizationId = new \phpws2\Variable\IntegerVar(0, 'organizationId');
        $this->secContactName = new \phpws2\Variable\TextOnly(null, 'secContactName', 255);
        $this->secContactEmail = new \phpws2\Variable\Email(null, 'secContactEmail');
        $this->secContactPhone = new \phpws2\Variable\PhoneNumber(null, 'secContactPhone', 30);
        $this->submitUserId = new \phpws2\Variable\IntegerVar(0, 'submitUserId');
        $this->submitDate = new \phpws2\Variable\DateTime(0, 'submitDate');
        $this->submitDate->stamp();
        $this->submitEmail = new \phpws2\Variable\Email(null, 'submitEmail');
        $this->submitName = new \phpws2\Variable\TextOnly(null, 'submitName', 60);
        $this->submitUsername = new \phpws2\Variable\TextOnly(null, 'submitUsername', 50);
        $this->timeDeparting = new \phpws2\Variable\DateTime(0, 'timeDeparting');
        $this->timeDeparting->stamp();
        $this->timeDeparting->setFormat('%A, %b. %e, %Y');
        $this->timeEventStarts = new \phpws2\Variable\DateTime(0, 'timeEventStarts');
        $this->timeEventStarts->stamp();
        $this->timeEventStarts->setFormat('%A, %b. %e, %Y');
        $this->timeReturn = new \phpws2\Variable\DateTime(0, 'timeReturn');
        $this->timeReturn->stamp();
        $this->timeReturn->setFormat('%A, %b. %e, %Y');
        $this->travelMethod = new \phpws2\Variable\IntegerVar(TT_PERSONAL, 'travelMethod');
        $this->visitPurpose = new \phpws2\Variable\TextOnly(null, 'visitPurpose', 255);
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

    public function getStringVars($return_null = false, $hide = null)
    {
        $vars = parent::getStringVars($return_null, $hide);
        $vars['travelMethodFormat'] = $this->getTravelMethodString();
        return $vars;
    }

    public function getTravelMethodString()
    {
        switch ($this->travelMethod->get()) {
            case TT_PERSONAL:
                return 'Personal';
            case TT_CAR_SHARE:
                return 'Car sharing';
            case TT_UNI_VAN:
                return 'University vehicle';
            case TT_RENTAL:
                return 'Vehicle rental';
            case TT_BUS:
                return 'Chartered bus';
            case TT_TRAIN:
                return 'Train';
            case TT_AIR:
                return 'Flight';
            default:
                return 'Unknown';
        }
    }

    public function stampConfirmed()
    {
        $this->confirmedDate->stamp();
    }

}
