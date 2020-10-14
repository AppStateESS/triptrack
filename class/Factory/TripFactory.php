<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Factory;

use phpws2\Database;
use Canopy\Request;
use triptrack\Resource\Trip;

class TripFactory
{

    public static function deleteByOrganizationId(int $organizationId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_trip');
        $tbl->addField('id');
        $tbl->addFieldConditional('organizationId', $organizationId);
        $rows = $db->selectColumn();
        if (!empty($rows)) {
            foreach ($rows as $orgId) {
                MemberFactory::unlinkOrganization($id);
            }
        }
        $db->delete();
    }

    public static function list(array $options = [])
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_trip');
        $tbl->addOrderBy('destinationCity');
        return $db->select();
    }

}
