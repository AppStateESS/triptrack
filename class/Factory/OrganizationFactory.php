<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Factory;

use phpws2\Database;

class OrganizationFactory
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

}
