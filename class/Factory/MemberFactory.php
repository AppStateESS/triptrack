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
        return $member;
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
        return $member;
    }

    public static function unlinkAllTrips(int $memberId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_membertotrip');
        $tbl->addFieldConditional('memberId', $memberId);
        $db->delete();
    }

    public static function unlinkAllOrganizations(int $memberId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_membertoorg');
        $tbl->addFieldConditional('memberId', $memberId);
        $db->delete();
    }

    public static function delete(int $memberId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_member');
        $tbl->addFieldConditional('id', $memberId);
        $db->delete();
        self::unlinkAllTrips($memberId);
        self::unlinkAllOrganizations($memberId);
    }

    public static function addToOrganization($memberId, $orgId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_membertoorg');
        $tbl->addFieldConditional('memberId', $memberId);
        $tbl->addFieldConditional('organizationId', $orgId);
        $check = $db->selectOneRow();
        if (!$check) {
            $tbl->addValue('memberId', $memberId);
            $tbl->addValue('organizationId', $orgId);
            $db->insert();
        }
    }

    public static function addToTrip($memberId, $tripId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_membertotrip');
        $tbl->addFieldConditional('memberId', $memberId);
        $tbl->addFieldConditional('tripId', $tripId);
        $check = $db->selectOneRow();
        if (!$check) {
            $tbl->addValue('memberId', $memberId);
            $tbl->addValue('tripId', $tripId);
            $db->insert();
        }
    }

    public static function storeFile($fileArray)
    {
        $fileName = str_replace('.', '', (string) microtime(true)) . '.csv';
        $path = self::createPath($fileName);
        move_uploaded_file($fileArray['tmp_name'], $path);
        return $fileName;
    }

    public static function createPath($fileName)
    {
        $destinationDir = PHPWS_HOME_DIR . 'files/triptrack/';
        return $destinationDir . $fileName;
    }

    public static function testFile($filename)
    {
        $handle = fopen($filename, 'r');
        $header = fgetcsv($handle);
        if (!is_array($header)) {
            return false;
        }
        $testResult = in_array('first name', $header) && in_array('last name',
                        $header) && in_array('email', $header) && in_array('phone',
                        $header) && in_array('banner id', $header) && in_array('username',
                        $header);
        fclose($handle);
        return $testResult;
    }

}
