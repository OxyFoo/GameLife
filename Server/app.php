<?php

    require('./sql.php');

    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    $action = $data['action'];

    if (!isset($action)) exit();

    $db = new DataBase();
    $output = array();

    if ($action === 'ping') {
        $deviceIdentifier = $data['deviceID'];
        $deviceName = $data['deviceName'];
        if (isset($deviceIdentifier, $deviceName)) {
            $device = $db->GetDevice($deviceIdentifier, $deviceName);
            $output['status'] = 'ok';
        }
    }
    else if ($action === 'getToken') {
        $deviceIdentifier = $data['deviceID'];
        $deviceName = $data['deviceName'];
        $email = $data['email'];
        $lang = $data['lang'];

        if (isset($deviceIdentifier, $deviceName, $email, $lang)) {
            $account = $db->GetAccountByEmail($email);
            $device = $db->GetDevice($deviceIdentifier, $deviceName);

            // Check permissions
            $deviceID = $device['ID'];
            $perm = $db->CheckDevicePermissions($deviceID, $account);
            if ($perm === -1) {
                // Blacklisted
                $output['status'] = 'blacklist';
            } else if ($perm === 0) {
                // Waiting mail confirmation
                $output['status'] = 'waitMailConfirmation';
            } else if ($perm === 1) {
                if ($account['Banned'] == 0) {
                    // OK
                    $accountID = $account['ID'];
                    $db->RefreshLastDate($accountID);
                    $output['token'] = $db->GeneratePrivateToken($accountID, $deviceID);
                    $output['status'] = 'ok';
                } else {
                    $output['status'] = 'ban';
                }
            } else {
                // No device in account
                $accountID = $account['ID'];
                $db->RefreshLastDate($accountID);
                $db->AddDeviceAccount($deviceID, $account, 'DevicesWait');
                $db->RefreshToken($deviceID);
                $db->SendMail($email, $deviceID, $accountID, $lang);
                $output['status'] = 'signin';
            }
        }
    }
    else if ($action === 'getInternalData') {
        $lang = $data['lang'];
        if (!empty($lang)) {
            $output['quotes'] = GetQuotes($db, $lang);
            $output['titles'] = GetTitles($db, $lang);
            $output['skills'] = GetSkills($db, $lang);
            $output['achievements'] = GetAchievements($db, $lang);
            $output['helpers'] = GetHelpers($db);
            $output['status'] = 'ok';
        }
    } else if ($action === 'getUserData') {
        $token = $data['token'];
        if (isset($token)) {
            $dataFromToken = $db->GetDataFromToken($token);
            $accountID = $dataFromToken['accountID'];

            if (isset($accountID)) {
                $account = $db->GetAccountByID($accountID);
                $username = $account['Username'];
                $title = $account['Title'];
                $userData = $account['Data'];
                $solvedAchievements = $account['SolvedAchievements'];
                if (isset($userData, $username, $title)) {
                    $decoded = json_decode($userData);
                    $decoded->pseudo = $username;
                    $decoded->title = $title;
                    $decoded->solvedAchievements = $solvedAchievements !== "" ? array_map('intval', explode(',', $solvedAchievements)) : array();
                    $userData = json_encode($decoded);
                    $output['data'] = $userData;
                    $output['status'] = 'ok';
                }
            }
        }
    } else if ($action === 'setUserData') {
        $token = $data['token'];
        $userData = $data['data'];
        if (isset($token, $userData)) {
            $dataFromToken = $db->GetDataFromToken($token);
            $accountID = $dataFromToken['accountID'];
            $account = $db->GetAccountByID($accountID);

            if (isset($account, $userData)) {
                // Get & remove user from data
                $decoded = json_decode($userData);
                $pseudo = $decoded->pseudo;
                $title = $decoded->title;
                $solvedAchievements = implode(',', $decoded->solvedAchievements);
                unset($decoded->pseudo);
                unset($decoded->title);
                unset($decoded->solvedAchievements);
                $userData = json_encode($decoded);

                $db->setUserData($account, $userData);
                $db->setUserTitle($account, $title);
                $db->setAchievements($account, $solvedAchievements);
                $pseudoChanged = $db->setUsername($account, $pseudo);
                if ($pseudoChanged === -1) {
                    $output['status'] = 'wrongtimingpseudo';
                    // App modifiée ?
                } else if ($pseudoChanged === -2) {
                    $output['status'] = 'wrongpseudo';
                } else {
                    $output['status'] = 'ok';
                }
            }
        }
    }

    if (!isset($output['status'])) {
        $output['status'] = 'fail';
    }
    echo(json_encode($output));

    unset($database);

?>