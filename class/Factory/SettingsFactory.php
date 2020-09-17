<?php

/**
 * MIT License
 * Copyright (c) 2019 Electronic Student Services @ Appalachian State University
 *
 * See LICENSE file in root directory for copyright and distribution permissions.
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Factory;

use triptrack\Resource\SettingsResource;
use phpws2\Database;
use phpws2\Settings;

class SettingsFactory
{

    public static function saveContact($name, $email)
    {
        Settings::set('triptrack', 'contactName', $name);
        Settings::set('triptrack', 'contactEmail', $email);
    }

    public static function getContact()
    {
        return ['siteContactName' => Settings::get('triptrack',
                    'siteContactName'),
            'siteContactEmail' => Settings::get('triptrack', 'siteContactEmail')];
    }

    /**
     * Returns a SwiftMailer ready reply-to address
     * @param bool $onlyNoReply If true, return the no-reply version
     * @return string
     */
    public static function getSwiftMailReply(bool $onlyNoReply = false)
    {
        $contact = self::getContact();
        if ($onlyNoReply || empty($contact['email'])) {
            $contact['email'] = 'noreply@' . \Canopy\Server::getSiteUrl(false,
                            false, false);
        }

        if ($onlyNoReply || empty($contact['name'])) {
            return [$contact['email']];
        } else {
            return [$contact['email'] => $contact['name']];
        }
    }

    public static function getEmailAddressOnly()
    {
        $contact = self::getContact();
        if (empty($contact['email'])) {
            return 'noreply@' . \Canopy\Server::getSiteUrl(false, false, false);
        } else {
            return $contact['email'];
        }
    }

}
