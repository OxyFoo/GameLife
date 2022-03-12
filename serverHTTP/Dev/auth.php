<?php

    require('./src/config.php');
    require('./src/functions/mail.php');
    require('./src/classes/account.php');
    require('./src/classes/device.php');
    require('./src/sql/accounts.php');
    require('./src/sql/devices.php');
    require('./src/sql/users.php');
    require('./src/sql/sql.php');

    $raw_data = $_GET['data'];
    if (!isset($raw_data)) exit();

    $db = new DataBase();

    $decoded = base64_decode($raw_data);
    $decrypted = $db->Decrypt($decoded);
    $data = json_decode($decrypted);

    $state = 'auth-invalid-state';
    $action = $data->action;
    $langKey = $data->lang;
    $accountID = intval($data->accountID);
    $deviceID = intval($data->deviceID);
    $deviceToken = $data->deviceToken;
    $lang = GetMailLangText($langKey);

    function EchoAndExit($content) {
        global $db;
        echo($content);
        unset($db);
        exit(0);
    }

    if (isset($action, $accountID, $deviceID, $deviceToken)) {
        $device = Devices::GetByID($db, $deviceID);
        if ($device !== null) {

            if ($action === 'view' && isset($_GET['action'])) {
                // Check accept data
                $acceptData = json_decode($db->Decrypt(base64_decode($_GET['action'])));
                if (isset($acceptData->accountID, $acceptData->deviceID, $acceptData->deviceToken)) {
                    if ($acceptData->action === 'accept') {

                        $title = $lang->{'signin-title'};
                        $text = $lang->{'signin-text'};
                        $textButton = $lang->{'signin-button'};
                        $textLink = $lang->link;
                        $content = GetMailContent($title, $text, $textButton, $textLink, $device->Name, $_GET['action'], null);
                        EchoAndExit($content);

                    } else if ($acceptData->action === 'delete') {

                        $title = $lang->{'delete-title'};
                        $text = $lang->{'delete-text'};
                        $textButton = $lang->{'delete-button'};
                        $textLink = $lang->link;
                        $content = GetMailContent($title, $text, $textButton, $textLink, $device->Name, $_GET['action'], null);
                        EchoAndExit($content);

                    }
                }
            }

            else if ($action === 'accept') {
                $account = Accounts::GetByID($db, $accountID);
                if ($device->Token === $deviceToken && $account !== null) {
                    $perm = Accounts::CheckDevicePermissions($deviceID, $account);
                    if ($perm === 1) {
                        Accounts::RemDevice($db, $deviceID, $account, 'DevicesWait');
                        Devices::RemoveToken($db, $deviceID);
                        Accounts::AddDevice($db, $deviceID, $account, 'Devices');
                        $state = "auth-accept";
                    }
                } else {
                    $state = "auth-invalid-token";
                }
            }

            else if ($action === 'delete') {
                if ($device->Token === $deviceToken) {
                    Devices::RemoveToken($db, $deviceID);
                    if (Accounts::Delete($db, $accountID)) {
                        $state = "auth-remove-account";
                    }
                } else {
                    $state = "auth-invalid-token";
                }
            }

        }
    }

    $content = file_get_contents('mail/mail-auth.html');
    $content = str_replace('%title%', $lang->{'auth-title'}, $content);
    $content = str_replace('%text%', $lang->$state, $content);
    echo($content);

    unset($db);

?>