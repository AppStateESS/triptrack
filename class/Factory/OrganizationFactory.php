<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Factory;

use phpws2\Database;
use Canopy\Request;

class OrganizationFactory extends \phpws2\ResourceFactory
{

    public static function exists()
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_organization');
        $tbl->addField('id');
        $db->setLimit(1);
        return (bool) $db->select();
    }

    public static function list(array $options = [])
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_organization');
        return $db->select();
    }

    public static function post(Request $request)
    {
        $org = new \triptrack\Resource\Organization;
        $org->name = $request->pullPostString('name');
        self::saveResource($org);
    }

}
