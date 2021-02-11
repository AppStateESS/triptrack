<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Factory;

use phpws2\Database;
use Canopy\Request;
use triptrack\Resource\Member;
use triptrack\BannerAPI;

class MemberFactory extends BaseFactory
{

    static $fileDirectory = PHPWS_HOME_DIR . 'files/triptrack/';

    public static function currentUserIsMember()
    {
        $username = \Current_User::getUserName();
        if ($username === null) {
            return false;
        }
        if (isset($_SESSION['TT_MEMBER_IS_USER']) && $_SESSION['TT_MEMBER_IS_USER'] === $username) {
            return true;
        } else {
            $member = self::loadByUsername($username);
            if ($member) {
                $_SESSION['TT_MEMBER_IS_USER'] = $member->username;
                return true;
            } else {
                $_SESSION['TT_MEMBER_IS_USER'] = '';
                return false;
            }
        }
    }

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
        $destinationDir = self::$fileDirectory;
        return $destinationDir . $fileName;
    }

    public static function testFile($filename)
    {

        $handle = fopen($filename, 'r');
        $header = fgetcsv($handle);
        if (!is_array($header)) {
            return false;
        }
        if (is_numeric($header[0])) {
            $testResult = true;
        } elseif (preg_match('/banner(id|_id|\sid)/', $header[0])) {
            $testRow = fgetcsv($handle);
            $testResult = is_numeric($testRow[0]);
        } else {
            $testResult = in_array('firstName', $header) && in_array('lastName', $header) && in_array('email',
                            $header) && in_array('phone', $header) && in_array('bannerId', $header) && in_array('username',
                            $header);
        }
        fclose($handle);
        return $testResult;
    }

    public static function importFile(string $fileName, int $orgId, int $tripId)
    {
        if (!preg_match('/^\d+\.csv$/', $fileName)) {
            throw new \Exception('Bad file name');
        }
        $path = self::$fileDirectory . $fileName;
        if (!is_file($path)) {
            throw new \Exception('File missing');
        }

        $handle = fopen($path, 'r');
        $header = fgetcsv($handle);
        fclose($handle);
        if (is_numeric($header[0])) {
            $stats = self::bannerImport($path, 0, $orgId, $tripId);
        } elseif (preg_match('/banner(id|_id|\sid)/', $header[0])) {
            $stats = self::bannerImport($path, 1, $orgId, $tripId);
        } else {
            $stats = self::csvImport($path, $orgId, $tripId);
        }
        return $stats;
    }

    private static function bannerImport(string $path, int $startRow, int $orgId, int $tripId)
    {
        $stats['errorRow'] = [];
        $stats['badRow'] = 0;
        $stats['previousMember'] = 0;
        $stats['added'] = 0;
        $stats['counting'] = 0;

        $handle = fopen($path, 'r');
        if ($startRow === 1) {
            // first row is the header, skipping
            fgetcsv($handle);
        }
        while ($row = fgetcsv($handle)) {
            $stats['counting']++;
            $bannerId = $row[0];
            if (!is_numeric($bannerId) || strlen($bannerId) !== 9) {
                $badRow++;
                $stats['errorRow'][] = $stats['counting'];
            } elseif ($member = self::pullByBannerId($bannerId)) {
                $stats['previousMember']++;
            } else {
                if ($result = BannerAPI::getStudent($bannerId)) {
                    $member = self::buildMemberFromBannerData($result);
                    self::saveResource($member);
                    if ($tripId) {
                        self::addToTrip($member->id, $tripId);
                    }
                    if ($orgId) {
                        self::addToOrganization($member->id, $orgId);
                    }
                    $stats['added']++;
                } else {
                    $stats['badRow']++;
                    $stats['errorRow'][] = $stats['counting'];
                }
            }
        }
        return $stats;
    }

    public static function buildMemberFromBannerData(\stdClass $valueObj)
    {
        $member = new Member();
        $member->bannerId = $valueObj->ID;
        $member->email = $valueObj->emailAddress;
        $member->firstName = $valueObj->preferredName ?? $valueObj->firstName;
        $member->lastName = $valueObj->lastName;
        $member->phone = $valueObj->phoneNumber;
        $member->username = $valueObj->userName;
        return $member;
    }

    public static function pullByBannerId($bannerId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_member');
        $tbl->addFieldConditional('bannerId', $bannerId);
        return $db->selectOneRow();
    }

    public static function pullByUsername($username)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_member');
        $tbl->addFieldConditional('username', $username);
        return $db->selectOneRow();
    }

    private static function csvImport(string $path, int $orgId, int $tripId)
    {
        $handle = fopen($path, 'r');
        $header = fgetcsv($handle);
        $stats['errorRow'] = [];
        $stats['badRow'] = 0;
        $stats['previousMember'] = 0;
        $stats['added'] = 0;
        $stats['counting'] = 0;

        while ($row = fgetcsv($handle)) {
            $stats['counting']++;
            if (count($row) !== 6) {
                $stats['badRow']++;
                $stats['errorRow'][] = $stats['counting'];
                continue;
            }
            $insertRow = array_combine($header, $row);
            if (self::checkRowValues($insertRow)) {
                $member = self::loadByBannerId($insertRow['bannerId']);
                if ($member) {
                    $stats['previousMember']++;
                } else {
                    $member = self::importFullRow($insertRow);
                    $stats['added']++;
                }
                if ($tripId) {
                    self::addToTrip($member->id, $tripId);
                }
                if ($orgId) {
                    self::addToOrganization($member->id, $orgId);
                }
            } else {
                $stats['badRow']++;
                $stats['errorRow'][] = $stats['counting'];
            }
        }
        fclose($handle);
        return $stats;
    }

    public static function loadByBannerId(int $bannerId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_member');
        $tbl->addFieldConditional('bannerId', $bannerId);
        $result = $db->selectOneRow();
        if (empty($result)) {
            return false;
        } else {
            $member = new Member();
            $member->setVars($result);
            return $member;
        }
    }

    public static function loadByUsername(string $username)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_member');
        $tbl->addFieldConditional('username', $username);
        $result = $db->selectOneRow();
        if (empty($result)) {
            return false;
        } else {
            $member = new Member();
            $member->setVars($result);
            return $member;
        }
    }

    private static function importFullRow(array $insertRow)
    {
        $member = new Member();
        $member->setVars($insertRow);
        self::save($member);
        return $member;
    }

    private static function checkRowValues(array $insertRow)
    {
        return preg_match('/[\w\s]+/', $insertRow['firstName']) &&
                preg_match('/[\w\s]+/', $insertRow['lastName']) &&
                preg_match('/^[a-zA-Z0-9+_.\-]+@[a-zA-Z0-9.\-]+$/', $insertRow['email']) &&
                preg_match('/\d{9}/', $insertRow['bannerId']) &&
                strlen(preg_replace('/\D/', '', $insertRow['phone']) > 6) &&
                preg_match('/\w+/', $insertRow['username']);
    }

}
