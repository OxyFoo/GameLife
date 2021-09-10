<?php

    require('./sql.php');

    $db = new DataBase();

    $action = $_GET["action"];
    if (isset($action)) {
        if ($action === 'resetBeta') {
            $mail = $_GET["mail"];
            if (!empty($mail)) {
                $betaUsers = $db->QueryArray("SELECT * FROM `Beta` WHERE `Mail` = '$mail'");
                $betaLength = count($betaUsers);
                if ($betaLength === 1) {
                    $enabled = $betaUsers[0]['Enabled'];
                    if ($enabled == 0) {
                        echo("Compte déjà ouvert !");
                    } else {
                        $req = $db->Query("UPDATE `Beta` SET `Enabled` = '0' WHERE `Mail` = '$mail'");
                        if ($req === TRUE) {
                            echo("Compte beta remis à 0 !");
                        } else {
                            echo("Erreur, impossible de reset le compte beta");
                        }
                    }
                } else if ($betaLength > 1) {
                    echo("Ya plusieurs fois ce mail ? CHELOU !");
                } else {
                    echo("Aucune adresse mail correspondante");
                }
            }
        } else if ($action === 'leaderboard') {
            $leaderboard = GetLeaderboard($db);
            for ($l = 0; $l < count($leaderboard); $l++) {
                echo("$l - ");
                print_r($leaderboard[$l]);
                echo("<br />");
            }
        } else if ($action === 'users') {
            $users = $db->QueryArray("SELECT * FROM `Users`");

            while (1) {
                $alive = 1;
                for ($i = 0; $i < count($users); $i++) {
                    if (intval($users[$i]['XP']) === 0) {
                        array_splice($users, $i, 1);
                        $alive = 0;
                        break;
                    }
                }
                if ($alive === 1) break;
            }

            $count = 0;
            for ($l = 0; $l < count($users); $l++) {
                $username = $users[$l]['Username'];
                $xp = intval($users[$l]['XP']);
                echo("$l - $username : $xp");
                echo("<br />");
                $count++;
            }
            echo($count);
        }
    }

?>