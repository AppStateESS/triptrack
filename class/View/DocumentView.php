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

namespace triptrack\View;

use triptrack\Factory\DocumentFactory;

class DocumentView extends AbstractView
{

    public static function tripList(int $tripId, string $role)
    {
        $documents = DocumentFactory::list(['tripId' => $tripId]);
        if (empty($documents)) {
            return '<p>No documents uploaded to this trip.</p>';
        }
        $template = new \phpws2\Template(['documents' => $documents, 'role' => $role]);
        $template->setModuleTemplate('triptrack', 'User/Document.html');
        return $template->get();
    }

}
