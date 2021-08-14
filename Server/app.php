<?php

    require('./sql.php');

    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    $action = $data['action'];

    if (!isset($action)) exit();

    $db = new DataBase();
    $output = array();

    if ($action === 'ping') {
        $output['status'] = 'OK';
    }
    else if ($action === 'gettoken') {
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
                $output['status'] = 'backlist';
            } else if ($perm === 0) {
                // Waiting mail confirmation
                $output['status'] = 'waitMailConfirmation';
            } else if ($perm === 1) {
                if ($account['Banned'] == 0) {
                    // OK
                    $output['status'] = 'ok';
                    $output['key'] = $db->GetPrivateKey($account);
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

    echo(json_encode($output));

    unset($database);

?>