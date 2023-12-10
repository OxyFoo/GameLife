<?php

class Todos
{
    /**
     * @param DataBase $db
     * @param Account $account
     * @return array todos => [ Title, startTime, duration, comment ]
     */
    public static function GetTodos($db, $account) {
        $command = 'SELECT `Checked`, `Title`, `Description`, `Deadline`, `Schedule`, `Tasks` FROM TABLE WHERE `AccountID` = ?';
        $todos = $db->QueryPrepare('Todos', $command, 'i', [ $account->ID ]);
        if ($todos === false) ExitWithStatus('Error: getting todos failed');

        for ($i = 0; $i < count($todos); $i++) {
            $todos[$i]['Checked'] = intval($todos[$i]['Checked']);
            $todos[$i]['Schedule'] = json_decode($todos[$i]['Schedule'], true);
            $todos[$i]['Description'] = $db->Decrypt($todos[$i]['Description']);
            $todos[$i]['Deadline'] = intval($todos[$i]['Deadline']);
            if ($todos[$i]['Skill'] !== null) {
                $todos[$i]['Skill'] = json_decode($todos[$i]['Skill'], true);
            }
            if ($todos[$i]['Tasks'] !== '[]') {
                $todos[$i]['Tasks'] = $db->Decrypt($todos[$i]['Tasks']);
            }
            $todos[$i]['Tasks'] = json_decode($todos[$i]['Tasks'], true);
        }
        return $todos;
    }

    /**
     * @param DataBase $db
     * @param Account $account
     * @param array $todos
     */
    public static function AddTodos($db, $account, $todos) {
        for ($i = 0; $i < count($todos); $i++) {
            $todo = $todos[$i];
            if (count($todo) !== 9) continue;

            $Action = $todo['Action'];                          // 'add' or 'rem'
            $Checked = $todo['Checked'];                        // int
            $Title = $todo['Title'];                            // string
            $Description = $db->Encrypt($todo['Description']);  // string
            $Starttime = $todo['Starttime'];                    // int
            $Deadline = $todo['Deadline'];                      // int
            $Schedule = json_encode($todo['Schedule']);         // string
            $Skill = $todo['Skill'];                            // null or json
            $Tasks = json_encode($todo['Tasks']);               // string

            if ($Skill !== null) $Skill = json_encode($Skill);
            if ($Tasks !== '[]') $Tasks = $db->Encrypt($Tasks);

            // Check if todo exists
            $command = 'SELECT `ID` FROM TABLE WHERE `AccountID` = ? AND `Title` = ?';
            $reqTodo = $db->QueryPrepare('Todos', $command, 'is', [ $account->ID, $Title ]);
            if ($reqTodo === false) ExitWithStatus('Error: adding todo failed');
            $exists = count($reqTodo) > 0;

            // Update todo
            if ($Action === 'add' && $exists) {
                $command = 'UPDATE TABLE SET
                    `Checked` = ?,
                    `Title` = ?,
                    `Description` = ?,
                    `Starttime` = ?,
                    `Deadline` = ?,
                    `Schedule` = ?,
                    `Skill` = ?,
                    `Tasks` = ?
                    WHERE `ID` = ?';
                $args = [
                    $Checked,
                    $Title,
                    $Description,
                    $Starttime,
                    $Deadline,
                    $Schedule,
                    $Skill,
                    $Tasks,
                    $reqTodo[0]['ID']
                ];
                $types = 'issiisssi';

                if ($Skill === null) {
                    array_splice($args, 6, 1);
                    $command = str_replace('`Skill` = ?,', '`Skill` = NULL,', $command);
                    $types = 'issiissi';
                }

                $r = $db->QueryPrepare('Todos', $command, $types, $args);
                if ($r === false) ExitWithStatus('Error: saving todos failed (update)');
            }

            // Add todo
            else if ($Action === 'add' && !$exists) {
                $command = 'INSERT INTO TABLE (
                    `AccountID`,
                    `Checked`,
                    `Title`,
                    `Description`,
                    `Deadline`,
                    `Schedule`,
                    `Skill`,
                    `Tasks`
                ) VALUES ({?})';
                $args = [
                    $account->ID,
                    $Checked,
                    $Title,
                    $Description,
                    $Deadline,
                    $Schedule,
                    $Skill,
                    $Tasks
                ];
                $types = 'iississs';

                if ($Skill === null) {
                    array_splice($args, 6, 1);
                    $command = str_replace('`Skill`,', '', $command);
                    $types = 'iississ';
                }

                // Replace {?} with ?, ?, ?, ... with the correct number of arguments
                $commandArgs = implode(', ', array_fill(0, count($args), '?'));
                $command = str_replace('{?}', $commandArgs, $command);

                $r = $db->QueryPrepare('Todos', $command, $types, $args);
                if ($r === false) ExitWithStatus('Error: saving todos failed (add)');
            }

            // Remove todo
            else if ($Action === 'rem' && $exists) {
                $command = 'DELETE FROM TABLE WHERE `AccountID` = ? AND `ID` = ?';
                $args = [ $account->ID, $reqTodo[0]['ID'] ];
                $r = $db->QueryPrepare('Todos', $command, 'ii', $args);
                if ($r === false) ExitWithStatus('Error: saving todos failed (remove)');
            }
        }
    }
}

?>
