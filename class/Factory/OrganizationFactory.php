<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Factory;

use phpws2\Database;
use Canopy\Request;
use triptrack\Resource\Organization;

class OrganizationFactory extends BaseFactory
{

    public static function build()
    {
        $org = new Organization;
        return $org;
    }

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
        if (!empty($options['memberCount'])) {
            $tbl2 = $db->addTable('trip_membertoorg', null, false);
            $counter = $tbl2->addField('memberId', 'memberCount');
            $counter->showCount();
            self::joinOrgWithMember($db, $tbl, $tbl2);
        }

        if (!empty($options['memberId'])) {
            if (!isset($tbl2)) {
                $tbl2 = $db->addTable('trip_membertoorg', null, false);
                self::joinOrgWithMember($db, $tbl, $tbl2);
            }
            $tbl2->addFieldConditional('memberId', $options['memberId']);
        }
        $tbl->addOrderBy('name');
        return $db->select();
    }

    private static function joinOrgWithMember(\phpws2\Database\DB $db,
            \phpws2\Database\Table $orgTable, \phpws2\Database\Table $pivotTable)
    {
        $joinConditional = $db->createConditional($orgTable->getField('id'),
                $pivotTable->getField('organizationId'));
        $db->joinResources($orgTable, $pivotTable, $joinConditional, 'left');
        $db->setGroupBy([$orgTable->getField('id')]);
    }

    public static function post(Request $request)
    {
        $org = new \triptrack\Resource\Organization;
        $org->name = $request->pullPostString('name');
        self::saveResource($org);
    }

    public static function put(Organization $organization, Request $request)
    {
        $organization->name = $request->pullPutString('name');
        self::saveResource($organization);
    }

    public static function delete(Organization $organization)
    {
        TripFactory::deleteByOrganizationId($organization->id);
        $db = Database::getDB();
        $tbl = $db->addTable('trip_organization');
        $tbl->addFieldConditional('id', $organization->id);
        $db->delete();
    }

}
