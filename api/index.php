<?php

/**
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */
require_once '../../../canopy/src/TextString.php';


$identity = $_GET['identity'];
if (is_numeric($identity)) {
    if (preg_match('/\D/', $identity)) {
        throw new \Exception('Improperly formatted Banner Id');
    }
    if ($identity < 900000000) {
        echo '{}';
        exit;
    }
    $useBannerId = true;
} elseif (preg_match('/\W/', $identity)) {
    throw new \Exception('Improperly formatted username');
} else {
    $useBannerId = false;
}

$fn = array('Matt', 'Doug', 'Lorrie', 'Sam', 'Morris', 'Elvis', 'Mike', 'Michelle', 'Lisa', 'Greg', 'Juan', 'Jacob');
$ln = array('Douglas', 'Smith', 'Jones', 'Ito', 'Sampson', 'Valdez', 'Dallas', 'Simpson', 'Voggler', 'Husslehip', 'Nichols');
if (!$useBannerId) {
    $userFound = random_int(0, 5);
    if ($userFound === 0 || strlen($identity) < 8 || strlen($identity) > 9) {
        echo '{}';
        exit;
    }
    $banner_id = random_int(700000000, 799999999);
    $username = $identity;
} else {
    $banner_id = $identity;
    $username = \Canopy\TextString::randomString();
}


$data = array(
    'bannerID' => $banner_id,
    'emailAddress' => $username . '@appstate.edu',
    'firstName' => $fn[rand(0, count($fn) - 1)],
    'preferredName' => rand(0, 1) ? $fn[rand(0, count($fn) - 1)] : null,
    'lastName' => $ln[rand(0, count($ln) - 1)],
    'phoneNumber' => '828' . rand(2620000, 2659999),
    'userName' => $username,
    'studentLevel' => 'U',
);

echo json_encode($data);
