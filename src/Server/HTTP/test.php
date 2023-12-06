<?php

/**
 * Only used for tests (with GET params).
 */

require('./src/commands.php');

$db = new DataBase();
$action = $_GET['action'];

if (!isset($action)) {
    $db->AddLog(0, 0, 'cheatSuspicion', 'Test.php called without action');
    exit(0);
}

if ($action == 'totaux') {
    $skills = GetSkills($db);
    $ref = isset($_GET['not']) ? intval($_GET['not']) : -1;
    for ($s = 0; $s < count($skills); $s++) {
        $name = $skills[$s]['Name']->fr;
        $total = 0;
        foreach ($skills[$s]['Stats'] as $key => $value) {
            $total += intval($value);
        }
        if ($total != $ref) {
            echo("$name : $total<br />");
        }
    }
}

else if ($action == 'compWithoutCreator') {
    $skills = GetSkills($db);
    for ($s = 0; $s < count($skills); $s++) {
        $Name = $skills[$s]['Name'];
        $Creator = $skills[$s]['Creator'];
        if (empty($Creator)) {
            echo("$Name<br />");
        }
    }
}

else if ($action == 'compWithCreator') {
    $skills = GetSkills($db);
    for ($s = 0; $s < count($skills); $s++) {
        $Name = $skills[$s]['Name'];
        $Creator = $skills[$s]['Creator'];
        if (!empty($Creator)) {
            echo("$Name<br />");
        }
    }
}

else if ($action === 'giveAllTo') {
    $id = $_GET['id'];
    $db->AddLog(0, 0, 'cheatSuspicion', "Give all items to $id");

    // Get account
    if (!$id) exit('Account id not defined!');
    $account = Accounts::GetByID($db, $id);
    if ($account === null) exit('Account not found!');

    // Get all items
    $items = $db->QueryPrepare('Items', 'SELECT `ID` FROM TABLE');
    if ($items === false || count($items) === 0) exit('Items not found!');
    $items = array_map(fn($row) => $row['ID'], $items);

    // Add all in inventory
    $command = 'INSERT INTO TABLE (`AccountID`, `ItemID`, `CreatedBy`) VALUES (?, ?, ?)';
    foreach ($items as $item) {
        $result = $db->QueryPrepare('Inventories', $command, 'isi', [ $account->ID, $item, $account->ID ]);
        if ($result === false) exit("Add $item in account {$account->ID}: Failed");
    }
}

?>
