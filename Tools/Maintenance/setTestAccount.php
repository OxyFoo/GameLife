<?php

$argv = $_SERVER['argv'];

if ($argc !== 6) {
    echo "Usage: php {$argv[0]} <host> <user> <pass> <database> <test account mode>\n";
    exit(1);
}

$host = $argv[1];
$user = $argv[2];
$pass = $argv[3];
$database = $argv[4];

$db_source = new mysqli($host, $user, $pass, $database);
if ($db_source->connect_error) {
    die("Connection failed: " . $db_source->connect_error);
}

$new_devices = $argv[5] === '0' ? '[]' : '[1]';
$query = "UPDATE `Accounts` SET `Devices` = '$new_devices' WHERE `Email` = 'gamelife-test@oxyfoo.com'";
$result = $db_source->query($query);
if (!$result) {
    die("Query failed: " . $db_source->error);
}

?>
