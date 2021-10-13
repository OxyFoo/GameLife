<?php

    require('./src/sql.php');

    $action = $_GET['action'];
    if (!isset($action)) exit();

    $db = new DataBase();

    if ($action === "getUsersTypes") {
        $android = 0;
        $ios = 0;
        $total = 0;
        $devices = $db->QueryArray("SELECT * FROM `Devices`");
        for ($d = 0; $d < count($devices); $d++) {
            $device = $devices[$d]['Name'];
            if (strpos($device, 'iOS') !== FALSE || strpos($device, 'iPhone') !== FALSE) {
                $ios++;
                $total++;
            } else {
                $android++;
                $total++;
            }
        }
        $a_pc = round(($android / $total) * 100, 2);
        $i_pc = round(($ios / $total) * 100, 2);
        echo("Android : $android ($a_pc%)<br/>iOS : $ios ($i_pc%)<br/>Total : $total");
    } else if ($action === "getUser") {
        $id = $_GET['id'];
        if (!empty($id)) {
            $user = $db->QueryArray("SELECT * FROM `Users` WHERE `ID` = '$id'")[0];
            $user['Data'] = $db->Decrypt($user['Data']);
            print_r($user);
        }
    }

    unset($commands);

?>