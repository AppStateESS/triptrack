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

namespace triptrack\Controller\Member;

use Canopy\Request;
use triptrack\Controller\SubController;
use triptrack\Exception\MemberDoesNotOwnTrip;
use triptrack\Factory\DocumentFactory;
use triptrack\Factory\TripFactory;
use triptrack\Factory\MemberFactory;

class Document extends SubController
{

    protected function uploadPost(Request $request)
    {
        // forces a json response

        $tripId = $request->pullPostInteger('tripId');
        $trip = TripFactory::build($tripId);
        if (!MemberFactory::currentOwnsTrip($trip)) {
            throw new MemberDoesNotOwnTrip();
        }
        $_SERVER['HTTP_X_REQUESTED_WITH'] = 'XMLHttpRequest';
        if (!isset($_FILES['file'])) {
            return ['success' => false, 'error' => 'no upload file received.'];
        }

        $allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        $fileType = $_FILES['file']['type'];
//        if (!in_array($fileType, $allowedTypes)) {
//            return ['success' => false, 'error' => "incorrect file type [$fileType]"];
//        }

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
        $document = DocumentFactory::build($this->id);
        $trip = TripFactory::build($document->tripId);
        if (!MemberFactory::currentOwnsTrip($trip)) {
            throw new MemberDoesNotOwnTrip();
        }
        DocumentFactory::delete($this->id);
        return ['success' => true];
    }

    protected function viewHtml()
    {
        $document = DocumentFactory::build($this->id);
        $trip = TripFactory::build($document->tripId);
        if (!MemberFactory::currentOwnsTrip($trip)) {
            throw new MemberDoesNotOwnTrip();
        }
        DocumentFactory::download($document);
    }

}
