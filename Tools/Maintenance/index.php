<?php

if ($argc !== 6) {
    echo "Usage: php index.php <host> <user> <pass> <database> <maintenance mode>\n";
    exit(1);
}

$argv = $_SERVER['argv'];
$host = $argv[1];
$user = $argv[2];
$pass = $argv[3];
$database = $argv[4];

$db_source = new mysqli($host, $user, $pass, $database);
if ($db_source->connect_error) {
    die("Connection failed: " . $db_source->connect_error);
}

// In 'App' table set 'maintenance' to 1
$maintenance = $argv[5] === '0' ? 0 : 1;
$query = "UPDATE `App` SET `Data` = $maintenance WHERE `ID` = 'Maintenance'";
$result = $db_source->query($query);
if (!$result) {
    die("Query failed: " . $db_source->error);
}

?>