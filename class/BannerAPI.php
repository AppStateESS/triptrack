<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack;

require_once PHPWS_SOURCE_DIR . 'mod/triptrack/config/defines.php';

class BannerAPI
{

    public static function getStudent($bannerId)
    {

        $url = TRIPTRACK_BANNER_API;
        $pluggedUrl = str_replace('{id}', $bannerId, $url);

        $curl = curl_init();
        curl_setopt_array($curl,
                array(CURLOPT_RETURNTRANSFER => 1, CURLOPT_URL => $pluggedUrl));
        $result = json_decode(curl_exec($curl));

        if (empty($result->userName)) {
            return false;
        }

        if (empty($result->userName)) {
            return false;
        } else {
            return $result;
        }
    }

}
