<?php

/**
 * MIT License
 * Copyright (c) 2020 Electronic Student Services @ Appalachian State University
 *
 * See LICENSE file in root directory for copyright and distribution permissions.
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Factory;

use triptrack\Exception\ResourceNotFound;
use Canopy\Request;

/**
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 */
abstract class BaseFactory extends \phpws2\ResourceFactory
{

    static $fileDirectory = PHPWS_HOME_DIR . 'files/triptrack/';

    /**
     *
     * @param int $id
     * @param type $throwException
     * @return Resource
     * @throws ResourceNotFound
     */
    public static function load($resource, $id, $throwException = true)
    {
        $resource->setId($id);
        if (!parent::loadByID($resource)) {
            if ($throwException) {
                throw new ResourceNotFound($id);
            } else {
                return null;
            }
        }
        return $resource;
    }

    public static function loginLink()
    {
        $auth = \Current_User::getAuthorization();
        if (!empty($auth->login_link)) {
            return $auth->login_link;
        } else {
            return 'index.php?module=users&action=user&command=login_page';
        }
    }

    public static function logoutLink()
    {
        $auth = \Current_User::getAuthorization();
        if (!empty($auth->logout_link)) {
            return $auth->logout_link;
        } else {
            return 'index.php?module=users&action=user&command=logout';
        }
    }

    public static function save(\phpws2\Resource $resource)
    {
        return self::saveResource($resource);
    }

    protected static function addSearch(string $searchPhrase, array $columns,
        \phpws2\Database\DB $db, \phpws2\Database\Table $tbl)
    {
        foreach ($columns as $c) {
            $cond = $db->createConditional($tbl->getField($c),
                '%' . $searchPhrase . '%', 'like');
            if (isset($prevCond)) {
                $prevCond = $db->createConditional($cond, $prevCond, 'or');
            } else {
                $prevCond = $cond;
            }
        }
        $db->addConditional($prevCond);
    }

    public static function listingOptions(Request $request)
    {
        $options['search'] = $request->pullGetString('search', true);
        $options['sortBy'] = $request->pullGetString('sortBy', true);
        $options['sortByDir'] = $request->pullGetString('sortByDir', true);
        $options['limit'] = $request->pullGetString('limit', true);
        $options['offset'] = $request->pullGetString('offset', true);
        return $options;
    }

    public static function createPath($fileName)
    {
        $destinationDir = self::$fileDirectory;
        return $destinationDir . $fileName;
    }

}
