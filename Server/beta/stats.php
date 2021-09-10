<?php

    require('./sql.php');

    $action = $_GET['action'];

    if (!isset($action)) exit();
    $db = new DataBase();

    if ($action === "devices") {
        $devices = $db->QueryArray("SELECT * FROM `Devices`");
        echo(count($devices));
    }

    unset($db);

?>