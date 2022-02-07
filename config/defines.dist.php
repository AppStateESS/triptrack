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
/**
 * Do not change the below unless developing
 */
define('TRIPTRACK_SYSTEM_SETTINGS',
    [
        'productionMode' => true,
        'friendlyErrors' => true
    ]);

define('TRIPTRACK_ALLOWED_TAGS',
    ['<p>', '<strong>', '<em>', '<blockquote>', '<ul>', '<ol>', '<li>', '<a>']);

define('TRIPTRACK_BANNER_API', '');

/**
 * Should point to a configuration file with the following
 * defines for the essapi library
 *
 * WAREHOUSE_INSTALL_DIR
 * ENGAGE_API_KEY
 * ENGAGE_API_V3_KEY
 * ENGAGE_BASE_URL
 * ENGAGE_BASE_URL_V3
 */
define('TRIPTRACK_ENGAGE_CONFIG', '');

define('CAMPUS_EMAIL_DOMAIN', 'appstate.edu');

/**
 * This is the web address for the site. Links to organizations and events come
 * from this address.
 */
define('ENGAGE_SITE_URL', '');

define('TRIPTRACK_SWIFT_OLD_VERSION', true);
