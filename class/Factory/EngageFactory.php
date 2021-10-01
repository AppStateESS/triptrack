<?php

/**
 * MIT License
 * Copyright (c) 2021 Electronic Student Services @ Appalachian State University
 *
 * See LICENSE file in root directory for copyright and distribution permissions.
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Factory;

use phpws2\Database;

require_once '/var/www/html/essapi_config.php';


require_once WAREHOUSE_INSTALL_DIR . 'lib/Curl.php';
require_once WAREHOUSE_INSTALL_DIR . 'lib/Organization.php';

class EngageFactory
{

    public static function totalOrganizations()
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_engageorg');
        $tbl->addField('engageId')->showCount();
        return $db->selectColumn();
    }

    public static function import()
    {
        $result = \Organization::getAllOrgs(true);
        if (empty($result) || !is_array($result)) {
            return false;
        }
        $db = Database::getDB();
        $tbl = $db->addTable('trip_engageorg');
        $db->delete();
        $count = 0;
        foreach ($result as $org) {
            $tbl->resetValues();
            $tbl->addValue('engageId', $org->id);
            $tbl->addValue('name', $org->name);
            $tbl->addValue('websiteKey', $org->websiteKey);
            $db->insert();
            $count++;
        }
        return $count;
    }

    public static function list(array $options)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_engageorg');
        if (!empty($options['name'])) {
            $tbl->addFieldConditional('name', '%' . $options['name'] . '%', 'like');
        }

        if (!empty($options['limit'])) {
            $db->setLimit((int) $options['limit']);
        }

        if (!empty($options['noDuplicates'])) {
            $tbl2 = $db->addTable('trip_organization', null, false);
            $cond = new Database\Conditional($db, $tbl->getField('engageId'), $tbl2->getField('engageId'), '=');
            $db->joinResources($tbl, $tbl2, $cond, 'left');
            $tbl2->addFieldConditional($tbl2->getField('id'), null, 'is');
        }

        $tbl->addOrderBy('name');

        return $db->select();
    }

}
