<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack;

require_once PHPWS_SOURCE_DIR . 'mod/triptrack/config/defines.php';

class BannerAPI
{

    public static function getStudent($identity)
    {

        $url = TRIPTRACK_BANNER_API;
        $pluggedUrl = str_replace('{id}', $identity, $url);

        $curl = curl_init();
        curl_setopt_array($curl, array(CURLOPT_RETURNTRANSFER => 1, CURLOPT_URL => $pluggedUrl, CURLOPT_FAILONERROR => 1, CURLOPT_TIMEOUT => 8, CURLOPT_SSL_VERIFYHOST => 0, CURLOPT_SSL_VERIFYPEER => 0));

        $result = curl_exec($curl);

        if (!$result) {
            $errNo = curl_errno($curl);

            $errorMessage = curl_error($curl);
            $endProcess = true;
            switch ($errNo) {
                case 7:
                    $error = 'Could not connect to API server.';
                    break;

                case 28:
                    $error = 'Request timed out.';
                    break;

                case 22:
                    $error = 'Student not found.';
                    $endProcess = false;
                    break;

                case '51':
                    $error = 'Something is wrong with the SSL connection.';
                    break;

                default:
                    $error = 'Unknown error: ' . $errorMessage;
                    break;
            }
            return ['success' => false, 'error' => $error, 'errNo' => $errNo, 'endProcess' => $endProcess];
        } else {
            return json_decode($result);
        }
    }

}
