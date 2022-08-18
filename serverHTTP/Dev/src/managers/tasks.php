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
            if ($tasks === null) {
                ExitWithStatus('Error: getting tasks failed');
            }
            for ($i = 0; $i < count($tasks); $i++) {
                $tasks[$i]['Checked'] = boolval($tasks[$i]['Checked']);
                if ($tasks[$i]['Description'] !== null) {
                    $tasks[$i]['Description'] = $db->Decrypt($tasks[$i]['Description']);
                }
                if ($tasks[$i]['Deadline'] !== null) {
                    $tasks[$i]['Deadline'] = intval($tasks[$i]['Deadline']);
                }
                if ($tasks[$i]['Schedule'] !== null) {
                    $tasks[$i]['Schedule'] = json_decode($tasks[$i]['Schedule'], true);
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
                if (count($task) !== 7) continue;

                $Action = $task['Action'];
                $Checked = $task['Checked'];
                $Title = $task['Title'];
                $Description = $task['Description'];
                $Starttime = $task['Starttime'];
                $Deadline = $task['Deadline'];
                $Schedule = $task['Schedule'];
                $Subtasks = json_encode($task['Subtasks']);

                if ($Description !== null) $Description = $db->Encrypt($Description);
                if ($Schedule !== null) $Schedule = json_encode($Schedule);
                if ($Subtasks !== '[]') $Subtasks = $db->Encrypt($Subtasks);

                // Check if task exists
                $command = 'SELECT `ID` FROM TABLE WHERE `AccountID` = ? AND `Title` = ?';
                $exists = $db->QueryPrepare('Tasks', $command, [ $account->ID, $Title ]);
                if ($exists === null) ExitWithStatus('Error: adding task failed');
                $exists = count($exists) > 0;

                if ($Action === 'add') {
                    if ($exists) {
                        $command = 'UPDATE TABLE SET
                            `AccountID` = ?,
                            `Checked` = ?,
                            `Title` = ?,
                            `Description` = ?,
                            `Starttime` = ?,
                            `Deadline` = ?,
                            `Schedule` = ?,
                            `Subtasks` = ?
                            WHERE `AccountID` = ? AND `Title` = ?';
                        $args = [
                            $account->ID,
                            $Checked,
                            $Title,
                            $Description,
                            $Starttime,
                            $Deadline,
                            $Schedule,
                            $Subtasks,
                            $account->ID, $Title
                        ];
                        $r = $db->QueryPrepare('Tasks', $command, 'isssiissis', $args);
                        if ($r === false) ExitWithStatus('Error: saving tasks failed (update)');
                    } else {
                        $command = 'INSERT INTO TABLE (`AccountID`, `Checked`, `Title`, `Description`, `Deadline`, `Schedule`, `Subtasks`) VALUES (?, ?, ?, ?, ?, ?, ?)';
                        $args = [ $account->ID, $Checked, $Title, $Description, $Deadline, $Schedule, $Subtasks ];
                        $r = $db->QueryPrepare('Tasks', $command, 'isssiis', $args);
                        if ($r === false) ExitWithStatus('Error: saving tasks failed (add)');
                    }
                } else if ($Action === 'rem' && $exists) {
                    $command = 'DELETE FROM TABLE WHERE `AccountID` = ? AND `Title` = ?';
                    $r = $db->QueryPrepare('Tasks', $command, 'is', [ $account->ID, $Title ]);
                    if ($r === false) ExitWithStatus('Error: saving tasks failed (remove)');
                }
            }
        }
    }

?>