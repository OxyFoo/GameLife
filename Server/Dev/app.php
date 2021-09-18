<?php

    require('./src/sql.php');
    require('./src/add.php');

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
        $version = $data['version'];

        if (isset($deviceIdentifier, $deviceName, $email, $lang, $version)) {
            $account = $db->GetAccountByEmail($email);
            $device = $db->GetDevice($deviceIdentifier, $deviceName);

            $app = $db->QueryArray("SELECT * FROM `App`");
            $last_version = $app[0]['Version'];

            if ($version == $last_version) {
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
            } else {
                $output['status'] = 'update';
            }

        }
    }
    else if ($action === 'getInternalData') {
        $lang = $data['lang'];
        $hash = $data['hash'];
        if (!empty($lang) && isset($hash)) {
            $output['quotes'] = GetQuotes($db, $lang);
            $output['titles'] = GetTitles($db, $lang);
            $output['skills'] = GetSkills($db, $lang);
            $output['skillsIcon'] = GetSkillsIcon($db);
            $output['achievements'] = GetAchievements($db, $lang);
            $output['helpers'] = GetContributors($db, $lang);

            $data = json_encode($output);
            $hash_check = hash('md5', $data);

            // Send all data or just 'same'
            if ($hash != $hash_check) {
                $output['hash'] = $hash_check;
                $output['status'] = 'ok';
            } else {
                $output = array('status' => 'same');
            }
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
                $xp = $decoded->xp;
                unset($decoded->pseudo);
                unset($decoded->title);
                unset($decoded->solvedAchievements);
                $userData = json_encode($decoded);

                $db->setUserData($account, $userData);
                $db->setUserTitle($account, $title);
                $db->setAchievements($account, $solvedAchievements);
                $db->setXP($account, $xp);
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
    } else if ($action === 'getLeaderboard') {
        $token = $data['token'];
        if (isset($token)) {
            $dataFromToken = $db->GetDataFromToken($token);
            $accountID = $dataFromToken['accountID'];
            $account = $db->GetAccountByID($accountID);
            if (isset($account)) {
                $output['self'] = GetSelfPosition($db, $account);
            }
        }
        $output['leaderboard'] = GetLeaderboard($db);
        $output['status'] = 'ok';
    } else if ($action === 'report') {
        $token = $data['token'];
        $report_type = $data['type'];
        $report_data = $data['data'];
        $deviceID = 0;

        if (isset($token, $report_type, $report_data)) {
            if (!empty($token)) {
                $dataFromToken = $db->GetDataFromToken($token);
                $token_deviceID = $dataFromToken['deviceID'];
                if (isset($token_deviceID)) {
                    $deviceID = $token_deviceID;
                }
            }

            $report_result = AddReport($db, $deviceID, $report_type, $report_data);
            if ($report_result === TRUE) {
                $output['status'] = 'ok';
            }
        }
    }

    if (!isset($output['status'])) {
        $output['status'] = 'fail';
    }
    echo(json_encode($output));

    unset($db);

?>