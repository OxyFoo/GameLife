<?php

/**
 * Only used to update database from version 1.0.2 to 1.0.3.
 */

require('./src/commands.php');

$db = new DataBase();

// Measures
$time_start = microtime(true);
$edited_activity = 0;
$edited_account = 0;



// Select all activities
$activities = $db->QueryPrepare('Activities', "SELECT `ID`, `StartTime`, `AddedTime`, `Date` FROM TABLE");
if ($activities === false) exit('Error 1');

// Set AddedTime from Date
for ($i = 0; $i < count($activities); $i++) {
    $ID = $activities[$i]['ID'];
    $startTime = $activities[$i]['StartTime'];
    $date = $activities[$i]['Date'];
    $addedTime = strtotime($date);

    $oldAddedTime = intval($activities[$i]['AddedTime']);
    if ($oldAddedTime === 0) {
        $command = "UPDATE TABLE SET `AddedTime` = ? WHERE `ID` = ?";
        $args = [ $addedTime, $ID ];
        $result = $db->QueryPrepare('Activities', $command, 'ii', $args);
        if ($result === false) exit('Error 2');
        $edited_activity++;
    }
}



// Update all accounts token
if ($edited_activity > 0) {
    $accounts = $db->QueryPrepare('Accounts', "SELECT `ID` FROM TABLE");
    if ($accounts === false) exit('Error 3');

    for ($i = 0; $i < count($accounts); $i++) {
        $ID = intval($accounts[$i]['ID']);
        Users::RefreshDataToken($db, $ID);
        $edited_account++;
    }
}



// Measure time
$time_end = microtime(true);
$time_delta = $time_end - $time_start;
$time_ms = round($time_delta * 1000, 2);



// Show results
echo 'Done.';
echo '<br>';
echo 'You can now delete this file.';
echo '<br>';
echo 'Rows affected: ' . $edited_activity;
echo '<br>';
echo 'Token updated: ' . $edited_account;
echo '<br>';
echo 'Time: ' . $time_ms . ' ms';

?>
