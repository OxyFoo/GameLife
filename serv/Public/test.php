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
    } else if ($action == "compWithoutCreator") {
        $skills = GetSkills($db);
        for ($s = 0; $s < count($skills); $s++) {
            $Name = $skills[$s]["Name"];
            $Creator = $skills[$s]["Creator"];
            if (empty($Creator)) {
                echo("$Name<br />");
            }
        }
    } else if ($action == "getSkills") {
        $skills = GetSkills($db);
        $sep = "//";
        echo("ID{$sep}Name{$sep}XP{$sep}sag{$sep}int{$sep}con{$sep}for{$sep}end{$sep}agi{$sep}dex{$sep}Category<br/>");
        for ($s = 0; $s < count($skills); $s++) {
            $skill = $skills[$s];

            extract($skill["Stats"]);
            $ID = $skill["ID"];
            $Name = $skill["Name"];
            $XP = $skill["XP"];
            $Stats = "$sag{$sep}$int{$sep}$con{$sep}$for{$sep}$end{$sep}$agi{$sep}$dex";
            $Category = $skill["Category"];

            echo("$ID{$sep}$Name{$sep}$XP{$sep}$Stats{$sep}$Category<br/>");
        }
    }

    unset($commands);

?>
