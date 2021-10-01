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

namespace triptrack\Controller\Admin;

use triptrack\Controller\SubController;
use Canopy\Request;
use triptrack\Factory\EngageFactory;

class Engage extends SubController
{

    public static function countJson()
    {
        return EngageFactory::totalOrganizations();
    }

    public static function importJson()
    {
        $result = EngageFactory::import();
        if (!$result) {
            return ['success' => false];
        } else {
            return ['success' => true, 'count' => $result];
        }
    }

    public static function searchJson(Request $request)
    {
        $name = $request->pullGetString('name');
        return EngageFactory::list(['name' => $name, 'limit' => 50, 'noDuplicates' => true]);
    }

}
