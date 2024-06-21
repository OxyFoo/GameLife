<?php

require_once('utils.php');

$argv = $_SERVER['argv'];
$noConfirm = in_array('--no-confirm', $argv);

if ($argc < 9) {
    echo "Usage: php {$argv[0]} <source_host> <source_user> <source_pass> <source_db> <target_host> <target_user> <target_pass> <target_db> [--no-confirm]\n";
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

// Handling Structure Differences
$differencesStructure = compareTableStructures($db_source, $db_target, $sourceTables, $targetTables);
if (!empty($differencesStructure)) {
    echo "Differences found in table structures:\n";
    print_r($differencesStructure);

    $applyChanges = $noConfirm ? 'y' : readline("Apply structure changes? (y/N): ");

    if (strtolower($applyChanges) === 'y') {
        $success &= applyTableChanges($differencesStructure, $db_source, $db_target);
        echo "Structure changes applied.\n";
    } else {
        echo "No structure changes applied.\n";
    }
} else {
    echo "No differences found in table structures.\n";
}

// Handling Data Differences
$tablesToSync = [
    'App',
    'Achievements',
    'Blacklist',
    'Chests',
    'Items',
    'Quotes',
    'Skills',
    'SkillsCategory',
    'SkillsIcon',
    'Titles'
];
$differencesData = compareTableData($db_source, $db_target, $tablesToSync);

if (!empty($differencesData)) {
    echo "\nDifferences found in table data:\n";
    print_r($differencesData);

    $syncData = $noConfirm ? 'y' : readline("Synchronize table data? (y/N): ");

    if (strtolower($syncData) === 'y') {
        syncTableData($db_target, $differencesData);
        echo "Data synchronization done.\n";
    } else {
        echo "No data synchronization performed.\n";
    }
} else {
    echo "No differences found in table data.\n";
}

$db_source->close();
$db_target->close();

if (!$success) {
    exit(1);
}

?>
