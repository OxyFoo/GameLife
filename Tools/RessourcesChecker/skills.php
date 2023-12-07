<?php

if ($argc !== 5) {
    echo "Usage: php index.php <host> <user> <pass> <database>\n";
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

$query = "SELECT `ID`, `Name`, `Intelligence`, `Social`, `Strength`, `Stamina`, `Dexterity`, `Agility` FROM `Skills`";
$result = $db_source->query($query);
if (!$result) {
    die("Query failed: " . $db_source->error);
}

// Get sum of statistic
$success = true;
while ($row = $result->fetch_assoc()) {
    $sum = $row['Intelligence'] + $row['Social'] + $row['Strength'] + $row['Stamina'] + $row['Dexterity'] + $row['Agility'];
    if ($sum !== 0 && $sum !== 7) {
        echo "Skill " . $row['Name'] . " has a sum of " . $sum . "<br />";
        $success = false;
    }
}

$db_source->close();

if ($success) {
    echo "All skills are valid<br />";
    exit(0);
} else {
    echo "Some skills are invalid<br />";
    exit(1);
}

?>
