<?php

function getTableNames($db) {
    $tables = array();
    $result = $db->query("SHOW TABLES");

    while ($row = $result->fetch_row()) {
        $tables[] = $row[0];
    }

    return $tables;
}

function compareTableStructures($db_source, $db_target, $sourceTables, $targetTables) {
    $differences = array();

    foreach ($sourceTables as $table) {
        if (in_array($table, $targetTables)) {
            $sourceTableStructure = describeTable($db_source, $table);
            $targetTableStructure = describeTable($db_target, $table);

            // Initial structures to store columns that are different or missing.
            $differentColumns = array();
            $missingInTarget = array();
            $missingInSource = array();

            // Check for columns that are different or missing in target.
            foreach ($sourceTableStructure as $sourceColumn) {
                $columnInTarget = array_filter($targetTableStructure, function($col) use ($sourceColumn) {
                    return $col['Field'] == $sourceColumn['Field'];
                });

                if (empty($columnInTarget)) {
                    $missingInTarget[] = $sourceColumn;
                } else {
                    $columnInTarget = array_values($columnInTarget)[0];
                    if ($sourceColumn !== $columnInTarget) {
                        $differentColumns[] = array(
                            'source' => $sourceColumn,
                            'target' => $columnInTarget
                        );
                    }
                }
            }

            // Check for columns that are missing in source.
            foreach ($targetTableStructure as $targetColumn) {
                $columnInSource = array_filter($sourceTableStructure, function($col) use ($targetColumn) {
                    return $col['Field'] == $targetColumn['Field'];
                });

                if (empty($columnInSource)) {
                    $missingInSource[] = $targetColumn;
                }
            }

            if (!empty($differentColumns) || !empty($missingInTarget) || !empty($missingInSource)) {
                $differences[$table] = array(
                    'different' => $differentColumns,
                    'missingInTarget' => $missingInTarget,
                    'missingInSource' => $missingInSource
                );
            }

        } else {
            $differences[$table] = "Table not present in target database.";
        }
    }

    return $differences;
}

function describeTable($db, $table) {
    $result = $db->query("DESCRIBE $table");
    $structure = array();

    while ($row = $result->fetch_assoc()) {
        $structure[] = $row;
    }

    return $structure;
}

function applyTableChanges($differences, $db_source, $db_target) {
    $allSuccess = true;

    foreach ($differences as $table => $diff) {
        if (is_array($diff)) {
            
            // Handle columns missing in target
            foreach ($diff['missingInTarget'] as $missingColumn) {
                $columnDef = "{$missingColumn['Type']}";
                if ($missingColumn['Null'] === 'NO') {
                    $columnDef .= " NOT NULL";
                }
                if (isset($missingColumn['Default'])) {
                    $columnDef .= " DEFAULT '{$missingColumn['Default']}'";
                }
                if (!empty($missingColumn['Extra'])) {
                    $columnDef .= " {$missingColumn['Extra']}";
                }

                $alterSql = "ALTER TABLE $table ADD COLUMN {$missingColumn['Field']} $columnDef";
                if ($db_target->query($alterSql)) {
                    echo "Column {$missingColumn['Field']} added to table $table successfully.\n";
                } else {
                    echo "Failed to add column {$missingColumn['Field']} to table $table. Error: " . $db_target->error . "\n";
                    $allSuccess = false;
                }
            }

            // Handle columns missing in source
            foreach ($diff['missingInSource'] as $extraColumn) {
                $alterSql = "ALTER TABLE $table DROP COLUMN {$extraColumn['Field']}";
                if ($db_target->query($alterSql)) {
                    echo "Column {$extraColumn['Field']} removed from table $table successfully.\n";
                } else {
                    echo "Failed to remove column {$extraColumn['Field']} from table $table. Error: " . $db_target->error . "\n";
                    $allSuccess = false;
                }
            }

            // Handle columns that are different
            foreach ($diff['different'] as $differentColumn) {
                $sourceColumn = $differentColumn['source'];
                $columnDef = "{$sourceColumn['Type']}";
                if ($sourceColumn['Null'] === 'NO') {
                    $columnDef .= " NOT NULL";
                }
                if (isset($sourceColumn['Default'])) {
                    $columnDef .= " DEFAULT '{$sourceColumn['Default']}'";
                }
                if (!empty($sourceColumn['Extra'])) {
                    $columnDef .= " {$sourceColumn['Extra']}";
                }

                $alterSql = "ALTER TABLE $table MODIFY COLUMN {$sourceColumn['Field']} $columnDef";
                if ($db_target->query($alterSql)) {
                    echo "Column {$sourceColumn['Field']} in table $table modified successfully.\n";
                } else {
                    echo "Failed to modify column {$sourceColumn['Field']} in table $table. Error: " . $db_target->error . "\n";
                    $allSuccess = false;
                }
            }

            // TODO: Additional handling for indexes and constraints here.

        } else {
            // Table not present in target database, so let's create it.
            $createTableSql = $db_source->query("SHOW CREATE TABLE $table")->fetch_assoc()['Create Table'];
            if ($db_target->query($createTableSql)) {
                echo "Table $table created successfully.\n";
            } else {
                echo "Failed to create table $table. Error: " . $db_target->error . "\n";
                $allSuccess = false;
            }
        }
    }

    return $allSuccess;
}

?>