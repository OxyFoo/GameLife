<?php

$argv = $_SERVER['argv'];

if ($argc !== 5) {
    echo "Usage: php {$argv[0]} <host> <user> <pass> <database>\n";
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

$query = "SELECT `Data` FROM `App` WHERE `ID` = 'Version'";
$result = $db_source->query($query);
if (!$result) {
    die("Query failed: " . $db_source->error);
}

$row = $result->fetch_assoc();
echo($row['Data']);

?>
