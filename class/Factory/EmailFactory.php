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

if (!defined('TRIPTRACK_SENDMAIL_COMMAND')) {
    define('TRIPTRACK_SENDMAIL_COMMAND', '/usr/sbin/sendmail -t -i');
}

if (!defined('TRIPTRACK_SWIFT_OLD_VERSION')) {
    define('TRIPTRACK_SWIFT_OLD_VERSION', false);
}

class EmailFactory
{

    public static function send(string $subject, string $body, array $emailList)
    {

        if (TRIPTRACK_SWIFT_OLD_VERSION) {
            $transport = \Swift_SendmailTransport::newInstance(TRIPTRACK_SENDMAIL_COMMAND);
            $message = \Swift_Message::newInstance();
        } else {
            $transport = new \Swift_SendmailTransport(TRIPTRACK_SENDMAIL_COMMAND);
            $message = new \Swift_Message;
        }

        $from = SettingFactory::getContact();
        $message->setSubject($subject);
        $message->setFrom($from['siteContactEmail']);
        $message->setBody($body);
        $mailer = new \Swift_Mailer($transport);
        foreach ($emailList as $to) {
            $message->setTo($to['email']);
            $mailer->send($message);
        }
    }

}
