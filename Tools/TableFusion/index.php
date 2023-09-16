<?php

require_once('utils.php');

$argv = $_SERVER['argv'];
$noConfirm = in_array('--no-confirm', $argv);

$db_source = new mysqli('localhost', 'username', 'password', 'database');
$db_target = new mysqli('localhost', 'username', 'password', 'database');

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