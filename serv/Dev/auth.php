<?php

    require('./src/config.php');
    require('./src/functions/mail.php');
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
    $accountID = intval($data->accountID);
    $deviceID = intval($data->deviceID);
    $deviceToken = $data->deviceToken;

    if (isset($action, $accountID, $deviceID, $deviceToken)) {
        $device = Device::GetByID($db, $deviceID);
        if ($device !== NULL) {
            if ($action === 'view' && isset($_GET['accept'])) {
                // Check accept data
                $acceptData = json_decode($db->Decrypt(base64_decode($_GET['accept'])));
                if ($acceptData->action === 'accept' && isset($acceptData->accountID, $acceptData->deviceID, $acceptData->deviceToken)) {
                    $content = GetMailContent($device['Name'], $_GET['accept'], NULL, $lang);
                    echo($content['message']);
                    unset($db);
                    exit(0);
                }
            }
            else if ($action === 'accept') {
                if ($device['Token'] === $deviceToken) {
                    $account = Account::GetByID($db, $accountID);
                    $perm = Account::CheckDevicePermissions($deviceID, $account);
                    if ($perm === 1) {
                        Account::RemDevice($db, $deviceID, $account, 'DevicesWait');
                        Device::RemoveToken($db, $deviceID);
                        Account::AddDevice($db, $deviceID, $account, 'Devices');
                        $state = "Accept";
                    }
                } else {
                    $state = "InvalidToken";
                }
            }
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