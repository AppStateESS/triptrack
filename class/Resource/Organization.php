<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Resource;

class Organization extends AbstractResource
{

    protected $name;
    protected $engageId = 0;
    protected $table = 'trip_organization';

    public function __construct()
    {
        $this->name = new \phpws2\Variable\TextOnly('', 'name', 255);
        $this->engageId = new \phpws2\Variable\IntegerVar(0, 'engageId');
        parent::__construct();
    }

}
