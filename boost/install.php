<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */
use phpws2\Database;
use phpws2\Database\ForeignKey;

function triptrack_install(&$content)
{
    $db = Database::getDB();
    $db->begin();

    try {
        $memberTable = createMemberTable();
        $organizationTable = createOrganizationTable();
        $tripTable = createTripTable();
        $memberToTripTable = createMemberToTripTable();
        $memberToOrgTable = createMemberToOrgTable();
        $documentTable = createDocumentTable();
        $engageOrgTable = createEngageOrgTable();
    } catch (\Exception $e) {
        \phpws2\Error::log($e);
        $db->rollback();

        if (isset($engageOrgTable)) {
            $engageOrgTable->drop();
        }
        if (isset($documentTable)) {
            $documentTable->drop();
        }
        if (isset($memberToTripTable)) {
            $memberToTripTable->drop();
        }
        if (isset($memberToOrgTable)) {
            $memberToOrgTable->drop();
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
    $tripTable = $db->addTable('trip_trip');
    $memberToTripTable = $db->buildTable('trip_membertotrip');
    $tripId = $memberToTripTable->addDataType('tripId', 'int');
    $memberId = $memberToTripTable->addDataType('memberId', 'int');
    $memberToTripTable->create();

    $unique = new \phpws2\Database\Unique([$tripId, $memberId]);
    $unique->add();

    $foreign = new ForeignKey($memberToTripTable->getDataType('tripId'),
            $tripTable->getDataType('id'), ForeignKey::CASCADE);
    $foreign->add();

    return $memberToTripTable;
}

function createEngageOrgTable()
{
    $db = phpws2\Database::getDB();
    $engageOrgTable = $db->buildTable('trip_engageorg');
    $nameField = $engageOrgTable->addDataType('name', 'varchar');
    $nameField->setSize(255);
    $idField = $engageOrgTable->addDataType('engageId', 'int');
    $websiteKey = $engageOrgTable->addDataType('websiteKey', 'varchar');
    $websiteKey->setSize(255);
    $engageOrgTable->create();

    $unique = new phpws2\Database\Unique($idField);
    $unique->add();
}

function createMemberToOrgTable()
{
    $db = Database::getDB();
    $orgTable = $db->addTable('trip_organization');
    $memberToOrgTable = $db->buildTable('trip_membertoorg');
    $orgId = $memberToOrgTable->addDataType('organizationId', 'int');
    $memberId = $memberToOrgTable->addDataType('memberId', 'int');
    $memberToOrgTable->create();

    $unique = new \phpws2\Database\Unique([$orgId, $memberId]);
    $unique->add();

    $foreign = new ForeignKey($memberToOrgTable->getDataType('organizationId'),
            $orgTable->getDataType('id'), ForeignKey::CASCADE);
    $foreign->add();

    return $memberToOrgTable;
}
