<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Factory;

use phpws2\Database;
use Canopy\Request;
use triptrack\Resource\Member;

class MemberFactory
{

    public static function unlinkTrip(int $tripId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_membertotrip');
        $tbl->addFieldConditional('tripId', $tripId);
        return $db->delete();
    }

    public static function list(array $options = [])
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_member');
        if (!empty($options['orderBy'])) {
            $orderBy = $options['orderBy'];
        } else {
            $orderBy = 'lastName';
        }
        if (isset($options['dir'])) {
            $direction = (int) $options['dir'] ? 'asc' : 'desc';
        } else {
            $direction = 'asc';
        }
        $tbl->addOrderBy($orderBy, $direction);
        return $db->select();
    }

}
