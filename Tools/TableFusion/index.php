<?php

require_once('utils.php');

$argv = $_SERVER['argv'];
$noConfirm = in_array('--no-confirm', $argv);

if ($argc < 9) {
    echo "Usage: php index.php <source_host> <source_user> <source_pass> <source_db> <target_host> <target_user> <target_pass> <target_db> [--no-confirm]\n";
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

$success = true;
$differences = compareTableStructures($db_source, $db_target, $sourceTables, $targetTables);

if (!empty($differences)) {
    echo "Differences found in table structures:\n";
    print_r($differences);

    $applyChanges = $noConfirm ? 'y' : readline("Apply changes? (y/N): ");

    if (strtolower($applyChanges) === 'y') {
        $success = applyTableChanges($differences, $db_source, $db_target);
        echo "Changes applied.\n";
    } else {
        echo "No changes applied.\n";
    }
} else {
    echo "No differences found in table structures.\n";
}

$db_source->close();
$db_target->close();

if (!$success) {
    exit(1);
}

?>