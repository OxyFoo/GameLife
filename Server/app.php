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
        /*$token = $data['token'];
        if (isset($token)) {
            $data = $db->GetDataFromToken($token);
            $deviceID = $data['deviceID'];
            $accountID = $data['accountID'];

            if (isset($accountID, $deviceID)) {
            }

            //$device = $db->GetDeviceByID($deviceID);
            //$account = $db->GetAccountByID($accountID);
        }*/
    }
    else if ($action === 'getToken') {
        $deviceIdentifier = $data['deviceID'];
        $deviceName = $data['deviceName'];
        $email = $data['email'];

        if (isset($deviceIdentifier, $deviceName, $email)) {
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
                    $output['token'] = $db->GeneratePrivateToken($accountID, $deviceID);
                    $output['status'] = 'ok';
                } else {
                    $output['status'] = 'ban';
                }
            } else {
                // No device in account
                $accountID = $account['ID'];
                $db->AddDeviceAccount($deviceID, $account, 'DevicesWait');
                $db->RefreshToken($deviceID);
                $db->SendMail($email, $deviceID, $accountID);
                $output['status'] = 'signin';
            }
        }
    }
    else if ($action === 'getInternalData') {
        $lang = $data['lang'];
        if (!empty($lang)) {
            $output['quotes'] = $db->GetQuotes($lang);
            $output['titles'] = $db->GetTitles($lang);
            $output['skills'] = $db->GetSkills($lang);
            $output['status'] = 'ok';
        }
        /*$token = $data['token'];
        if (isset($token)) {
            $data = $db->GetDataFromToken($token);
            $deviceID = $data['deviceID'];
            $accountID = $data['accountID'];

            if (isset($accountID, $deviceID)) {
            }

            //$device = $db->GetDeviceByID($deviceID);
            //$account = $db->GetAccountByID($accountID);
        }*/
    }
    
    if (!isset($output['status'])) {
        $output['status'] = 'fail';
    }
    echo(json_encode($output));

    unset($database);

?>