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
                    $defaultValue = $missingColumn['Default'];
                    if (strtoupper($defaultValue) === 'CURRENT_TIMESTAMP()') {
                        $columnDef .= " DEFAULT CURRENT_TIMESTAMP()";
                    } else {
                        $columnDef .= " DEFAULT '{$defaultValue}'";
                    }
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
                    $defaultValue = $sourceColumn['Default'];
                    if (strtoupper($defaultValue) === 'CURRENT_TIMESTAMP()') {
                        $columnDef .= " DEFAULT CURRENT_TIMESTAMP()";
                    } else {
                        $columnDef .= " DEFAULT '{$defaultValue}'";
                    }
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

function compareTableData($db_source, $db_target, $tablesToCompare) {
    $differences = [];

    echo "\nComparing table data...\n";
    foreach ($tablesToCompare as $table) {
        // Fetch source data
        $sourceData = fetchAllData($db_source, $table);
        if ($sourceData === false) {
            echo "Error fetching data from source for table: $table. Skipping this table.\n";
            continue;
        }

        // Fetch target data
        $targetData = fetchAllData($db_target, $table);
        if ($targetData === false) {
            echo "Error fetching data from target for table: $table. Skipping this table.\n";
            continue;
        }

        $tableDifferences = [
            'missing_in_target' => [],
            'missing_in_source' => [],
            'differing_rows'    => []
        ];

        // Identify rows missing in the target
        foreach ($sourceData as $ID => $rowData) {
            if (!isset($targetData[$ID])) {
                $tableDifferences['missing_in_target'][$ID] = $rowData;
            } elseif ($rowData !== $targetData[$ID]) {
                $tableDifferences['differing_rows'][$ID] = [
                    'source' => $rowData,
                    'target' => $targetData[$ID]
                ];
            }
        }

        // Identify rows missing in the source
        foreach ($targetData as $ID => $rowData) {
            if (!isset($sourceData[$ID])) {
                $tableDifferences['missing_in_source'][$ID] = $rowData;
            }
        }

        // If any differences exist, add them to the main $differences array
        if (!empty($tableDifferences['missing_in_target']) || !empty($tableDifferences['differing_rows']) || !empty($tableDifferences['missing_in_source'])) {
            $differences[$table] = $tableDifferences;
        }
    }

    return $differences;
}

function syncTableData($db_target, $differencesData) {
    foreach ($differencesData as $table => $differences) {
        echo "\n== $table ==\n";

        // Handle rows missing in target
        if (isset($differences['missing_in_target'])) {
            foreach ($differences['missing_in_target'] as $ID => $rowData) {
                insertRow($db_target, $table, $rowData);
                echo "Inserted row with ID $ID into target table $table.\n";
            }
        }

        // Handle differing rows
        if (isset($differences['differing_rows'])) {
            foreach ($differences['differing_rows'] as $ID => $diffData) {
                updateRow($db_target, $table, $ID, $diffData['source']); // Synchronizing source to target
                echo "Updated row with ID $ID in target table $table.\n";
            }
        }

        // Handle rows missing in source and delete them from target
        if (isset($differences['missing_in_source'])) {
            foreach ($differences['missing_in_source'] as $ID => $rowData) {
                deleteRow($db_target, $table, $ID);
                echo "Deleted row with ID $ID from target table $table.\n";
            }
        }
    }
}

function fetchAllData($db, $table) {
    $rows = [];
    $result = $db->query("SELECT * FROM $table");
    while ($row = $result->fetch_assoc()) {
        $rows[$row['ID']] = $row;
    }
    return $rows;
}

function insertRow($db, $table, $rowData) {
    $placeholders = array_fill(0, count($rowData), '?');
    $bindTypes = str_repeat('s', count($rowData));

    // Ajout des backticks autour des noms des colonnes pour éviter les erreurs avec les mots réservés de SQL
    $escapedColumnNames = array_map(function($columnName) {
        return "`$columnName`";
    }, array_keys($rowData));

    $command = "INSERT INTO $table (" . implode(",", $escapedColumnNames) . ") VALUES (" . implode(",", $placeholders) . ")";
    echo "Executing SQL: $command\n";
    $stmt = $db->prepare($command);

    if ($stmt) {
        $stmt->bind_param($bindTypes, ...array_values($rowData));
        $stmt->execute();
    } else {
        // Gestion des erreurs pour debug
        echo "Error preparing SQL statement: " . $db->error . "\n";
    }
}

function updateRow($db, $table, $ID, $rowData) {
    $setPart = [];
    $params = [];

    foreach ($rowData as $columnName => $value) {
        $setPart[] = "`$columnName` = ?";
        $params[] = $value;
    }

    $sql = "UPDATE $table SET " . implode(', ', $setPart) . " WHERE ID = ?";

    echo "Executing SQL: $sql\n";
    $stmt = $db->prepare($sql);

    if (!$stmt) {
        echo "Error in preparing the statement for updating row in $table with ID $ID.\n";
        return false;
    }

    // Check the type of ID and set the binding type accordingly
    $IDBindType = is_numeric($ID) ? 'i' : 's';
    $bindTypes = str_repeat('s', count($rowData)) . $IDBindType;
    $params[] = $ID;
    $stmt->bind_param($bindTypes, ...$params);

    if (!$stmt->execute()) {
        echo "Error in updating row in $table with ID $ID.\n";
        $stmt->close();
        return false;
    }

    $stmt->close();
    return true;
}

function deleteRow($db, $table, $ID) {
    $IDBindType = is_numeric($ID) ? 'i' : 's';
    $command = "DELETE FROM $table WHERE ID = ?";
    echo "Executing SQL: $command\n";

    $stmt = $db->prepare($command);
    $stmt->bind_param($IDBindType, $ID);
    $stmt->execute();
}

?>