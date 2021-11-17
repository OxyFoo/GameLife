<?php

    require('./src/sql/account.php');
    require('./src/sql/device.php');
    require('./src/sql/user.php');
    require('./src/sql/sql.php');

    $raw_data = $_GET['data'];
    if (!isset($raw_data)) exit();

    $db = new DataBase();

    $decoded = base64_decode($raw_data);
    $decrypted = $db->Decrypt($decoded);
    $data = json_decode($decrypted);

    $state = 'InvalidState';
    $action = $data->action;
    $lang = $data->lang;
    $accountID = $data->accountID;
    $deviceID = $data->deviceID;
    $deviceToken = $data->deviceToken;
    if (isset($action, $accountID, $deviceID, $deviceToken)) {
        $device = Device::GetByID($db, $deviceID);
        if ($device['Token'] === $deviceToken && ($action === 'accept' || $action === 'reject')) {
            $account = Account::GetByID($db, $accountID);
            $perm = Account::CheckDevicePermissions($deviceID, $account);
            if ($perm === 0) {
                Account::RemDevice($db, $deviceID, $account, 'DevicesWait');
                Device::RemoveToken($db, $deviceID);
                if ($action === 'accept') {
                    Account::AddDevice($db, $deviceID, $account, 'Devices');
                    $state = "Accept";
                }
            } else {
                $state = "InvalidPerm";
            }
        } else {
            $state = "InvalidToken";
        }
    }

    $fileLang = file_get_contents('mail/auth.json');
    $langJson = json_decode($fileLang)->$lang;

    $content = file_get_contents('mail/mail-auth.html');
    $content = str_replace('%title%', $langJson->Title, $content);
    $content = str_replace('%text%', $langJson->$state, $content);
    echo($content);

    unset($db);

?>