<?php

    require('./sql.php');

    $raw_data = $_GET['data'];
    if (!isset($raw_data)) exit();

    $db = new DataBase();

    $decoded = base64_decode($raw_data);
    $decrypted = $db->Decrypt($decoded);
    $data = json_decode($decrypted);

    $state = 'InvalidState';
    $action = $data->action;
    $accountID = $data->accountID;
    $deviceID = $data->deviceID;
    $deviceToken = $data->deviceToken;
    if (isset($action, $accountID, $deviceID, $deviceToken)) {
        $device = $db->GetDeviceByID($deviceID);
        if ($device['Token'] === $deviceToken && ($action === 'accept' || $action === 'reject')) {
            $account = $db->GetAccountByID($accountID);
            $perm = $db->CheckDevicePermissions($deviceID, $account);
            if ($perm === 0) {
                $db->RemDeviceAccount($deviceID, $account, 'DevicesWait');
                $db->RemoveToken($deviceID);
                if ($action === 'accept') {
                    $db->AddDeviceAccount($deviceID, $account, 'Devices');
                    $state = "Accept";
                } else if ($action === 'reject') {
                    $db->AddDeviceAccount($deviceID, $account, 'DevicesBlacklist');
                    $state = "Reject";
                }
            } else {
                $state = "InvalidPerm";
            }
        } else {
            $state = "InvalidToken";
        }
    }

    echo($state);

    unset($db);

?>