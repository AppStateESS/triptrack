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
use Canopy\Request;
use triptrack\Resource\Document;

class DocumentFactory extends BaseFactory
{

    /**
     *
     * @param int $id
     * @param type $throwException
     * @return \triptrack\Resource\Document
     */
    public static function build(int $id = 0, $throwException = true)
    {
        $document = new Document;
        if ($id) {
            $document = self::load($document, $id, $throwException);
        }
        return $document;
    }

    public static function storeFile($fileArray)
    {
        $fileName = $fileArray['name'];
        $path = self::createPath($fileName);
        move_uploaded_file($fileArray['tmp_name'], $path);
        return $fileName;
    }

    public static function post(int $tripId)
    {
        $file = $_FILES['file'];
        $tsFilename = self::storeFile($file);
        $document = self::build();
        $document->filePath = $tsFilename;
        $document->tripId = $tripId;
        $document->title = preg_replace('/\.\w{1,4}$/', '', $tsFilename);
        DocumentFactory::save($document);
        return $document;
    }

    public static function delete(int $documentId)
    {
        $document = DocumentFactory::build($documentId);
        unlink(self::createPath($document->filePath));
        DocumentFactory::deleteResource($document);
    }

    public static function list(array $options = [])
    {
        $db = Database::getDB();
        $tbl = $db->addTable('trip_document');
        if (!empty($options['tripId'])) {
            $tbl->addFieldConditional('tripId', $options['tripId']);
        }
        return $db->select();
    }

}
