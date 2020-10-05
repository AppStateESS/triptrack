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

use triptrack\Resource\SettingResource;
use phpws2\Database;
use phpws2\Settings;

class SettingFactory
{

    public static function getAll()
    {
        $settings = [];
        $settings['approvalRequired'] = Settings::get('triptrack',
                        'approvalRequired');
        $settings['siteContactName'] = Settings::get('triptrack',
                        'siteContactName');
        $settings['siteContactEmail'] = Settings::get('triptrack',
                        'siteContactEmail');
        $settings['hostLabel'] = Settings::get('triptrack', 'hostLabel');
        $settings['organizationLabel'] = Settings::get('triptrack',
                        'organizationLabel');
        $settings['allowInternational'] = Settings::get('triptrack',
                        'allowInternational');
        $settings['allowUpload'] = Settings::get('triptrack', 'allowUpload');
        $settings['uploadRequired'] = Settings::get('triptrack',
                        'uploadRequired');
        $settings['uploadInstructions'] = Settings::get('triptrack',
                        'uploadInstructions');
        $settings['contactBannerRequired'] = Settings::get('triptrack',
                        'contactBannerRequired');
        return $settings;
    }

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

    public static function save(string $varName, $value)
    {
        switch ($varName) {
            case 'approvalRequired':
            case 'allowInternational':
            case 'allowUpload':
            case 'uploadRequired':
            case 'contactBannerRequired':
                Settings::set('triptrack', $varName, (bool) $value);
                break;


            case 'siteContactEmail':
                Settings::set('triptrack', $varName,
                        filter_var($value, FILTER_SANITIZE_EMAIL));
                break;

            case 'siteContactName':
            case 'hostLabel':
            case 'organizationLabel':
            case 'uploadInstructions':
                Settings::set('triptrack', $varName,
                        filter_var($value, FILTER_SANITIZE_STRING));
                break;

            default:
                throw new \Exception('Unknown setting');
        }
    }

}
