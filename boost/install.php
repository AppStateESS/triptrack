<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */
use phpws2\Database;
use phpws2\Database\ForeignKey;

require_once PHPWS_SOURCE_DIR . 'mod/stories/boost/StoriesTables.php';

function triptrack_install(&$content)
{
    $db = Database::getDB();
    $db->begin();

    try {
        $memberTable = createMemberTable();
        $organizationTable = createOrganizationTable();
        $tripTable = createTripTable();
        $memberToTripTable = createMemberToTripTable();
        $documentTable = createDocumentTable();
    } catch (\Exception $e) {
        \phpws2\Error::log($e);
        $db->rollback();

        if (isset($documentTable)) {
            $documentTable->drop();
        }
        if (isset($memberToTripTable)) {
            $memberToTripTable->drop();
        }
        if (isset($tripTable)) {
            $tripTable->drop();
        }
        if (isset($organizationTable)) {
            $organizationTable->drop();
        }
        if (isset($memberTable)) {
            $memberTable->drop();
        }
        throw $e;
    }
    $db->commit();

    $content[] = 'Tables created';
    return true;
}

function createDocumentTable()
{
    $db = Database::getDB();
    $tripTable = $db->addTable('trip_trip');
    $document = new \triptrack\Resource\Document;
    $documentTable = $document->createTable($db);

    $foreign = new ForeignKey($documentTable->getDataType('tripId'),
            $tripTable->getDataType('id'), ForeignKey::CASCADE);
    $foreign->add();

    return $documentTable;
}

function createMemberTable()
{
    $db = Database::getDB();
    $member = new \triptrack\Resource\Member;
    return $member->createTable($db);
}

function createOrganizationTable()
{
    $db = Database::getDB();
    $organization = new \triptrack\Resource\Organization;
    return $organization->createTable($db);
}

function createTripTable()
{
    $db = Database::getDB();
    $trip = new \triptrack\Resource\Trip;
    return $trip->createTable($db);
}

function createMemberToTripTable()
{
    $db = Database::getDB();
    $orgTable = $db->addTable('trip_organization');
    $memberToTripTable = $db->buildTable('trip_membertotrip');
    $orgId = $memberToTripTable->addDataType('organizationId', 'int');
    $memberId = $memberToTripTable->addDataType('memberId', 'int');
    $memberToTripTable->create();

    $unique = new \phpws2\Database\Unique([$orgId, $memberId]);
    $unique->add();

    $foreign = new ForeignKey($memberToTripTable->getDataType('organizationId'),
            $orgTable->getDataType('id'), ForeignKey::CASCADE);
    $foreign->add();

    return $memberToTripTable;
}
