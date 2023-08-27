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
                if ($tasks[$i]['Activity'] !== null) {
                    $tasks[$i]['Activity'] = json_decode($tasks[$i]['Activity'], true);
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
                if (count($task) !== 8) continue;

                $Action = $task['Action'];                          // 'add' or 'rem'
                $Checked = $task['Checked'];                        // int
                $Title = $task['Title'];                            // string
                $Description = $db->Encrypt($task['Description']);  // string
                $Starttime = $task['Starttime'];                    // int
                $Deadline = $task['Deadline'];                      // int
                $Schedule = json_encode($task['Schedule']);         // string
                $Activity = $task['Activity'];                      // null or json
                $Subtasks = json_encode($task['Subtasks']);         // string

                if ($Activity !== null) $Activity = json_encode($Activity);
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
                        `Activity` = ?,
                        `Subtasks` = ?
                        WHERE `ID` = ?';
                    $args = [
                        $Checked,
                        $Title,
                        $Description,
                        $Starttime,
                        $Deadline,
                        $Schedule,
                        $Activity,
                        $Subtasks,
                        $reqTask[0]['ID']
                    ];

                    if ($Activity === null) {
                        array_splice($args, 6, 1);
                        $command = str_replace('`Activity` = ?,', '`Activity` = NULL,', $command);
                    }

                    $r = $db->QueryPrepare('Tasks', $command, 'issiisssi', $args);
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
                        `Activity`,
                        `Subtasks`
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)';
                    $args = [
                        $account->ID,
                        $Checked,
                        $Title,
                        $Description,
                        $Deadline,
                        $Schedule,
                        $Activity,
                        $Subtasks
                    ];

                    if ($Activity === null) {
                        array_splice($args, 6, 1);
                        $command = str_replace('`Activity`,', '', $command);
                    }

                    $r = $db->QueryPrepare('Tasks', $command, 'iississ', $args);
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