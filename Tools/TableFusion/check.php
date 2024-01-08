<?php

require_once('utils.php');

$argv = $_SERVER['argv'];

if ($argc < 9) {
    echo "Usage: php {$argv[0]} <source_host> <source_user> <source_pass> <source_db> <target_host> <target_user> <target_pass> <target_db>\n";
    exit(1);
}

$source_host = $argv[1];
$source_user = $argv[2];
$source_pass = $argv[3];
$source_db = $argv[4];
$target_host = $argv[5];
$target_user = $argv[6];
$target_pass = $argv[7];
$target_db = $argv[8];

$db_source = new mysqli($source_host, $source_user, $source_pass, $source_db);
$db_target = new mysqli($target_host, $target_user, $target_pass, $target_db);

if ($db_source->connect_error || $db_target->connect_error) {
    die("Connection failed: " . $db_source->connect_error . " / " . $db_target->connect_error);
}

$sourceTables = getTableNames($db_source);
$targetTables = getTableNames($db_target);

// Handling Structure Differences
$differencesStructure = compareTableStructures($db_source, $db_target, $sourceTables, $targetTables);
if (!empty($differencesStructure)) {
    echo "Differences found in table structures:\n";
    print_r($differencesStructure);
    exit(1);
}

echo "No differences found in table structures.\n";

?>
