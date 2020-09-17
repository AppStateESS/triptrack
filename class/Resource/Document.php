<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Resource;

class Document extends \phpws2\Resource
{

    protected $filePath;
    protected $title;
    protected $tripId;
    protected $table = 'trip_document';

    public function __construct()
    {
        $this->filePath = new \phpws2\Variable\FileVar(null, 'filePath');
        $this->title = new \phpws2\Variable\TextOnly(null, 'title', 255);
        $this->tripId = new \phpws2\Variable\IntegerVar(0, 'tripId');
        parent::__construct();
    }

}
