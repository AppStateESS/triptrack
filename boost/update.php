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
function triptrack_update(&$content, $currentVersion)
{
    switch ($currentVersion) {
        case version_compare($currentVersion, '1.1.0'):
            $content[] = 'Added organizationId to trip list properties.';
            $content[] = 'Added link to member listing by organization in admin view.';
            $content[] = 'Created front page interaction';
            $content[] = 'Added check all button for member selection';
    }
    return true;
}
