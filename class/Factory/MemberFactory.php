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

    public static function build(int $id = 0, $throwException = true)
    {
        $member = new Member;
        if ($id) {
            $member = self::load($member, $id, $throwException);
        }
        return $member;
    }

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
                $_SESSION['TT_MEMBER_ID'] = $member->id;
                return true;
            } else {
                if (isset($_SESSION['TT_MEMBER_IS_USER'])) {
                    unset($_SESSION['TT_MEMBER_IS_USER']);
                }

                if (isset($_SESSION['TT_MEMBER_ID'])) {
                    unset($_SESSION['TT_MEMBER_ID']);
                }
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

    public static function currentOwnsTrip(\triptrack\Resource\Trip $trip)
    {
        return $trip->submitUserId === (int) \Current_User::getId();
    }

    public static function list(array $options = [])
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_member');

        if (!empty($options['emailOnly'])) {
            $tbl->addField('email');
        } else {
            $tbl->addField('id');
            $tbl->addField('email');
            $tbl->addField('firstName');
            $tbl->addField('lastName');
            $tbl->addField('phone');
            $tbl->addField('restricted');
            if (!empty($options['isAdmin'])) {
                $tbl->addField('deleted');
                $tbl->addField('bannerId');
                $tbl->addField('username');
            }
        }

        if (!empty($options['onlyDeleted'])) {
            $tbl->addFieldConditional('deleted', 1);
        } elseif (empty($options['includeDeleted'])) {
            $tbl->addFieldConditional('deleted', 0);
        }

        if (!empty($options['orderBy'])) {
            $orderBy = $options['orderBy'];
        } else {
            $orderBy = 'lastName';
        }
        if (isset($options['dir']) && in_array($options['dir'], ['asc', 'desc'])) {
            $direction = $options['dir'];
        } else {
            $direction = 'asc';
        }

        if (!empty($options['tripId'])) {
            $tripId = $options['tripId'];
            $tbl2 = $db->addTable('trip_membertotrip', null, false);
            $tbl2->addFieldConditional('tripId', $tripId);
            $joinCond = new Database\Conditional($db, $tbl->getField('id'),
                    $tbl2->getField('memberId'), '=');
            $db->joinResources($tbl, $tbl2, $joinCond, 'left');
        } elseif (!empty($options['orgId'])) {
            $orgId = (int) $options['orgId'];
            $tbl2 = $db->addTable('trip_membertoorg', null, false);
            $tbl2->addFieldConditional('organizationId', $orgId);
            $joinCond = new Database\Conditional($db, $tbl->getField('id'),
                    $tbl2->getField('memberId'), '=');
            $db->joinResources($tbl, $tbl2, $joinCond, 'left');
        }

        if (!empty($options['search'])) {
            $search = '%' . $options['search'] . '%';
            $searchCond1 = $db->createConditional($tbl->getField('firstName'), $search, 'like');
            $searchCond2 = $db->createConditional($tbl->getField('lastName'), $search, 'like');
            $searchCond3 = $db->createConditional($tbl->getField('username'), $search, 'like');
            $searchCond4 = $db->createConditional($tbl->getField('bannerId'), $search, 'like');

            $subjoin1 = $db->createConditional($searchCond1, $searchCond2, 'or');
            $subjoin2 = $db->createConditional($searchCond3, $searchCond4, 'or');

            $join = $db->createConditional($subjoin1, $subjoin2, 'or');

            $db->addConditional($join);
        }

        $db->setLimit(50);
        $tbl->addOrderBy($orderBy, $direction);

        return $db->select();
    }

    public static function dropFromTrip(int $memberId, int $tripId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_membertotrip');
        $tbl->addFieldConditional('tripId', $tripId);
        $tbl->addFieldConditional('memberId', $memberId);
        $db->delete();
    }

    public static function dropFromOrganization(int $memberId, int $orgId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_membertoorg');
        $tbl->addFieldConditional('organizationId', $orgId);
        $tbl->addFieldConditional('memberId', $memberId);
        $db->delete();
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

    public static function restrict(int $memberId)
    {
        $member = self::build($memberId);
        $member->restricted = true;
        self::save($member);
        self::unlinkAllTrips($memberId, true);
    }

    public static function unlinkAllTrips(int $memberId, $unapprovedOnly = false)
    {
        $db = Database::getDB();
        if ($unapprovedOnly) {
            $pdo = $db->getPDO();
            $deleteSql = <<<EOF
DELETE trip_membertotrip FROM `trip_membertotrip` LEFT OUTER JOIN `trip_trip` ON
    (`trip_membertotrip`.`tripId` = `trip_trip`.`id`) WHERE ((`trip_membertotrip`.`memberId` = :memberId) AND (`trip_trip`.`approved` = 0))
EOF;
            $prep = $pdo->prepare($deleteSql);
            $prep->execute([':memberId' => $memberId]);
        } else {
            $tbl = $db->addTable('trip_membertotrip');
            $tbl->addFieldConditional('memberId', $memberId);
            $db->delete();
        }
    }

    public static function unlinkAllOrganizations(int $memberId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_membertoorg');
        $tbl->addFieldConditional('memberId', $memberId);
        $db->delete();
    }

    public static function delete(int $memberId, $permanent = false)
    {
        /**
         * See if there are any approved trips containing this member.
         * If there aren't any, then we can delete this member permanently.
         */
        $trips = TripFactory::list(['memberId' => $memberId, 'approvedOnly' => 1]);
        if (empty($trips)) {
            $permanent = true;
        }
        $db = Database::getDB();
        $tbl = $db->addTable('trip_member');
        $tbl->addFieldConditional('id', $memberId);
        if ($permanent) {
            $db->delete();
            $unapprovedOnly = false;
        } else {
            $tbl->addValue('deleted', 1);
            $db->update();
            $unapprovedOnly = true;
        }
        self::unlinkAllTrips($memberId, $unapprovedOnly);
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
        $stats['restrictedTrip'] = 0;

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
                if ($tripId) {
                    if ($member['restricted'] == 1) {
                        $stats['restrictedTrip']++;
                    } else {
                        self::addToTrip($member['id'], $tripId);
                    }
                }
                if ($orgId) {
                    self::addToOrganization($member['id'], $orgId);
                }
            } else {
                if ($result = BannerAPI::getStudent($bannerId)) {
                    $member = self::buildMemberFromBannerData($result);
                    self::saveResource($member);
                    if ($tripId) {
                        if ($member['restricted'] == 0) {
                            $stats['restrictedTrip']++;
                        } else {
                            self::addToTrip($member->id, $tripId);
                        }
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

    /**
     *
     * @param array $memberList Numeric array of member ids
     * @param int $tripId
     */
    public static function addListToTrip(array $memberList, int $tripId)
    {
        foreach ($memberList as $memberId) {
            self::addToTrip($memberId, $tripId);
        }
    }

    public static function buildMemberFromBannerData(\stdClass $valueObj)
    {
        $member = new Member();

        $member->bannerId = $valueObj->bannerID;
        $member->email = $valueObj->emailAddress;
        $member->firstName = $valueObj->preferredName ?? $valueObj->firstName;
        $member->lastName = $valueObj->lastName;
        $member->phone = $valueObj->phoneNumber;
        $member->username = $valueObj->userName;
        return $member;
    }

    public static function getCurrentMemberId()
    {
        $username = \Current_User::getUsername();
        $member = self::pullByUsername($username, true);

        if (empty($member)) {
            return null;
        } else {
            return $member->id;
        }
    }

    public static function pullByBannerId($bannerId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_member');
        $tbl->addFieldConditional('bannerId', $bannerId);
        return $db->selectOneRow();
    }

    /**
     *
     * @param string $username
     * @return array
     */
    public static function pullByUsername(string $username, $asObject = false)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_member');
        $tbl->addFieldConditional('username', $username);
        $result = $db->selectOneRow();
        if (!$result) {
            return null;
        }
        if ($asObject) {
            $member = new Member();
            $member->setVars($result);
            return $member;
        } else {
            return $result;
        }
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

    public static function getTripParticipants(int $tripId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_membertotrip');
        $tbl->addField('memberId');
        $tbl->addFieldConditional('tripId', $tripId);
        $result = [];
        while ($col = $db->selectColumn()) {
            $result[] = $col;
        }
        return $result;
    }

}
