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
use triptrack\Factory\DocumentFactory;

class Document extends SubController
{

    protected function uploadPost(Request $request)
    {
        // forces a json response

        $tripId = $request->pullPostInteger('tripId');
        $_SERVER['HTTP_X_REQUESTED_WITH'] = 'XMLHttpRequest';
        if (!isset($_FILES['file'])) {
            return ['success' => false, 'error' => 'no upload file received.'];
        }

        $allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        $fileType = $_FILES['file']['type'];
        if (!in_array($fileType, $allowedTypes)) {
            return ['success' => false, 'error' => "incorrect file type [$fileType]"];
        }

        $file = $_FILES['file'];
        $tsFilename = DocumentFactory::storeFile($file);
        $document = DocumentFactory::build();
        $document->filePath = $tsFilename;
        $document->tripId = $tripId;
        $document->title = preg_replace('/\.\w{1,4}$/', '', $tsFilename);
        DocumentFactory::save($document);
        return ['success' => true, 'document' => $document->getStringVars()];
    }

    protected function listJson(Request $request)
    {
        return DocumentFactory::list(['tripId' => (int) $request->pullGetInteger('tripId', true)]);
    }

    protected function delete(Request $request)
    {
        DocumentFactory::delete($this->id);
        return ['success' => true];
    }

}
