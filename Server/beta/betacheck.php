<?php

    require('./sql.php');

    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    $action = $data['action'];

    if (!isset($action)) exit();

    $db = new DataBase();
    $output = array();

    if ($action === 'check') {
        $mail = $data['mail'];
        if (isset($mail)) {
            $output['status'] = 'incorrect';
            $potential = $db->QueryArray("SELECT * FROM `Beta` WHERE `Mail` = '$mail'");
            $potential_length = count($potential);
            if ($potential_length) {
                for ($i = 0; $i < $potential_length; $i++) {
                    if ($potential[$i]['Enabled'] == 0) {
                        $betaTesteurID = $potential[$i]['ID'];
                        $db->Query("UPDATE `Beta` SET `Enabled` = '1' WHERE `ID` = '$betaTesteurID'");
                        $output['status'] = 'ok';
                    }
                }
            }
        }
    }

    if (!isset($output['status'])) {
        $output['status'] = 'fail';
    }
    echo(json_encode($output));

    unset($db);

?>