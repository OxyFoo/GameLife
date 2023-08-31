<?php

    class Tasks
    {
        /**
         * @param DataBase $db
         * @param Account $account
         * @return array tasks => [ Title, startTime, duration, comment ]
         */
        public static function GetTasks($db, $account) {
            $command = 'SELECT `Checked`, `Title`, `Description`, `Deadline`, `Schedule`, `Subtasks` FROM TABLE WHERE `AccountID` = ?';
            $tasks = $db->QueryPrepare('Tasks', $command, 'i', [ $account->ID ]);
            if ($tasks === false) ExitWithStatus('Error: getting tasks failed');

            for ($i = 0; $i < count($tasks); $i++) {
                $tasks[$i]['Checked'] = intval($tasks[$i]['Checked']);
                $tasks[$i]['Schedule'] = json_decode($tasks[$i]['Schedule'], true);
                $tasks[$i]['Description'] = $db->Decrypt($tasks[$i]['Description']);
                $tasks[$i]['Deadline'] = intval($tasks[$i]['Deadline']);
                if ($tasks[$i]['Skill'] !== null) {
                    $tasks[$i]['Skill'] = json_decode($tasks[$i]['Skill'], true);
                }
                if ($tasks[$i]['Subtasks'] !== '[]') {
                    $tasks[$i]['Subtasks'] = $db->Decrypt($tasks[$i]['Subtasks']);
                }
                $tasks[$i]['Subtasks'] = json_decode($tasks[$i]['Subtasks'], true);
            }
            return $tasks;
        }

        /**
         * @param DataBase $db
         * @param Account $account
         * @param array $tasks
         */
        public static function AddTasks($db, $account, $tasks) {
            for ($i = 0; $i < count($tasks); $i++) {
                $task = $tasks[$i];
                if (count($task) !== 9) continue;

                $Action = $task['Action'];                          // 'add' or 'rem'
                $Checked = $task['Checked'];                        // int
                $Title = $task['Title'];                            // string
                $Description = $db->Encrypt($task['Description']);  // string
                $Starttime = $task['Starttime'];                    // int
                $Deadline = $task['Deadline'];                      // int
                $Schedule = json_encode($task['Schedule']);         // string
                $Skill = $task['Skill'];                            // null or json
                $Subtasks = json_encode($task['Subtasks']);         // string

                if ($Skill !== null) $Skill = json_encode($Skill);
                if ($Subtasks !== '[]') $Subtasks = $db->Encrypt($Subtasks);

                // Check if task exists
                $command = 'SELECT `ID` FROM TABLE WHERE `AccountID` = ? AND `Title` = ?';
                $reqTask = $db->QueryPrepare('Tasks', $command, 'is', [ $account->ID, $Title ]);
                if ($reqTask === false) ExitWithStatus('Error: adding task failed');
                $exists = count($reqTask) > 0;

                // Update task
                if ($Action === 'add' && $exists) {
                    $command = 'UPDATE TABLE SET
                        `Checked` = ?,
                        `Title` = ?,
                        `Description` = ?,
                        `Starttime` = ?,
                        `Deadline` = ?,
                        `Schedule` = ?,
                        `Skill` = ?,
                        `Subtasks` = ?
                        WHERE `ID` = ?';
                    $args = [
                        $Checked,
                        $Title,
                        $Description,
                        $Starttime,
                        $Deadline,
                        $Schedule,
                        $Skill,
                        $Subtasks,
                        $reqTask[0]['ID']
                    ];
                    $types = 'issiisssi';

                    if ($Skill === null) {
                        array_splice($args, 6, 1);
                        $command = str_replace('`Skill` = ?,', '`Skill` = NULL,', $command);
                        $types = 'issiissi';
                    }

                    $r = $db->QueryPrepare('Tasks', $command, $types, $args);
                    if ($r === false) ExitWithStatus('Error: saving tasks failed (update)');
                }

                // Add task
                else if ($Action === 'add' && !$exists) {
                    $command = 'INSERT INTO TABLE (
                        `AccountID`,
                        `Checked`,
                        `Title`,
                        `Description`,
                        `Deadline`,
                        `Schedule`,
                        `Skill`,
                        `Subtasks`
                    ) VALUES ({?})';
                    $args = [
                        $account->ID,
                        $Checked,
                        $Title,
                        $Description,
                        $Deadline,
                        $Schedule,
                        $Skill,
                        $Subtasks
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

                    $r = $db->QueryPrepare('Tasks', $command, $types, $args);
                    if ($r === false) ExitWithStatus('Error: saving tasks failed (add)');
                }

                // Remove task
                else if ($Action === 'rem' && $exists) {
                    $command = 'DELETE FROM TABLE WHERE `AccountID` = ? AND `Title` = ?';
                    $r = $db->QueryPrepare('Tasks', $command, 'is', [ $account->ID, $Title ]);
                    if ($r === false) ExitWithStatus('Error: saving tasks failed (remove)');
                }
            }
        }
    }

?>