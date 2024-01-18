<?php

$argv = $_SERVER['argv'];
$noConfirm = in_array('--no-confirm', $argv);

if ($argc !== 7) {
    echo("Usage: php {$argv[0]} <host> <user> <pass> <db> <filepath_structure> <filepath_data>\n");
    exit(1);
}

$hostname = $argv[1];
$username = $argv[2];
$password = $argv[3];
$database = $argv[4];
$filepath_structure = $argv[5];
$filepath_data = $argv[6];

// Connect to database
$mysqli = new mysqli($hostname, $username, $password, $database);
if ($mysqli->connect_error) {
    echo("Connection failed: " . $mysqli->connect_error);
    exit(2);
}

// Get all tables
$sql = "SHOW TABLES";
$result = $mysqli->query($sql);
if (!$result) {
    echo("Erreur lors de l'exécution de la requête: " . $mysqli->error);
    exit(3);
}

// Get structure and data of each table
$structure = '';
$data = '';
while ($row = $result->fetch_row()) {
    $table = $row[0];

    // Table structure (DROP + CREATE)
    $structure .= "DROP TABLE IF EXISTS `$table`;\n";
    $createTableResult = $mysqli->query("SHOW CREATE TABLE $table");
    $createTableRow = $createTableResult->fetch_row();
    $structure .= $createTableRow[1] . ";\n\n";

    // Table data (INSERT)
    $data .= "-- Données de la table `$table`\n";
    $tableResult = $mysqli->query("SELECT * FROM `$table`");
    $numFields = $tableResult->field_count;
    $numRows = $tableResult->num_rows;

    if ($numRows > 0) {
        $data .= "INSERT INTO `$table` VALUES\n";
        $rowIndex = 0;
        while ($row = $tableResult->fetch_row()) {
            $data .= "(";
            for ($i = 0; $i < $numFields; $i++) {
                $row[$i] = addslashes($row[$i]);
                $row[$i] = str_replace("\n","\\n",$row[$i]);
                if (isset($row[$i])) {
                    $data .= '"' . $row[$i] . '"';
                } else {
                    $data .= 'NULL';
                }
                if ($i < ($numFields - 1)) {
                    $data .= ',';
                }
            }
            $data .= ")";
            if ($rowIndex < ($numRows - 1)) {
                $data .= ",";
            } else {
                $data .= ";";
            }
            $data .= "\n";
            $rowIndex++;
        }
        $data .= "\n";
    }
}

// Save structure & data
file_put_contents($filepath_structure, $structure);
file_put_contents($filepath_data, $data);

echo "Backup saved in $filepath_structure and $filepath_data\n";

// Close connection
$mysqli->close();

?>
