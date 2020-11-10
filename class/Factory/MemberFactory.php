<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Factory;

use phpws2\Database;
use Canopy\Request;
use triptrack\Resource\Member;

class MemberFactory extends BaseFactory
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

        if (!empty($options['orgId'])) {
            $orgId = (int) $options['orgId'];
            $tbl2 = $db->addTable('trip_membertoorg', null, false);
            $tbl2->addFieldConditional('organizationId', $orgId);
            $joinCond = new Database\Conditional($db, $tbl->getField('id'),
                    $tbl2->getField('memberId'), '=');
            $db->joinResources($tbl, $tbl2, $joinCond, 'left');
        }
        $tbl->addOrderBy($orderBy, $direction);
        return $db->select();
    }

    public static function post(Request $request)
    {
        $member = new Member;
        $member->bannerId = (string) $request->pullPostInteger('bannerId');
        $member->email = $request->pullPostString('email');
        $member->firstName = $request->pullPostString('firstName');
        $member->lastName = $request->pullPostString('lastName');
        $member->phone = $request->pullPostString('phone');
        $member->username = $request->pullPostString('username');
        self::saveResource($member);
    }

    public static function put(int $id, Request $request)
    {
        $member = new Member;
        self::load($member, $id);
        $member->bannerId = (string) $request->pullPutInteger('bannerId');
        $member->email = $request->pullPutString('email');
        $member->firstName = $request->pullPutString('firstName');
        $member->lastName = $request->pullPutString('lastName');
        $member->phone = $request->pullPutString('phone');
        $member->username = $request->pullPutString('username');
        self::saveResource($member);
    }

}
