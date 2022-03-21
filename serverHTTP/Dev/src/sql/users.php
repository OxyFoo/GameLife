<?php

    $DAYS_USERNAME_CHANGE = 29;

    class Users
    {
        /**
         * @param DataBase $db
         * @param Account $account
         * @param object $data Array of data to add { 'activities': [], 'xp': 0, 'achievements': [], 'titleID': 0, 'birthTime': 0 }
         */
        public static function ExecQueue($db, $account, $data) {
            $activities = $data['activities'];
            $tasks = $data['tasks'];
            $xp = $data['xp'];
            $achievements = $data['achievements'];
            $titleID = $data['titleID'];
            $birthTime = $data['birthTime'];

            if (isset($activities)) {
                self::AddActivities($db, $account, $activities);
            }
            if (isset($tasks)) {
                self::AddTasks($db, $account, $tasks);
            }
            if (isset($xp)) {
                self::setXP($db, $account->ID, $xp);
            }
            if (isset($achievements)) {
                self::AddAchievement($db, $account, $achievements);
            }
            if (isset($titleID)) {
                self::setTitle($db, $account, $titleID);
            }
            if (isset($birthTime)) {
                self::SetBirthtime($db, $account, $birthTime);
            }
        }

        /**
         * @param DataBase $db
         * @param Account $account
         * @param string $username
         * @return string \
         *     ok => Pseudo is changed (check if it's free)\
         *     alreadyUsed => Pseudo already used\
         *     alreadyChanged => Pseudo change failed (time)\
         *     incorrect => Pseudo is incorrect (wrong length...)\
         *     error => Others weird errors
         */
        public static function SetUsername($db, $account, $username) {
            global $DAYS_USERNAME_CHANGE;

            $accountID = $account->ID;
            $oldUsername = $account->Username;
            $newUsername = ucfirst(strtolower($username));

            $nowTime = time();
            $nowText = date('Y-m-d H:i:s', $nowTime);
            $lastUsernameTime = $account->LastChangeUsername === null ? $nowTime : $account->LastChangeUsername;
            $delta = ($nowTime - $lastUsernameTime) / (60 * 60 * 24);

            if ($oldUsername === $newUsername) return 'error';
            if ($delta < $DAYS_USERNAME_CHANGE) return 'alreadyChanged';
            if (!UsernameIsCorrect($newUsername)) return 'incorrect';
            if (!self::PseudoIsFree($db, $newUsername)) return 'alreadyUsed';

            $command = "UPDATE `Accounts` SET `Username` = '$newUsername', `LastChangeUsername` = '$nowText' WHERE `ID` = '$accountID'";
            $result_pseudo = $db->Query($command);
            if ($result_pseudo === false) ExitWithStatus("Error: Saving username failed");

            return 'ok';
        }

        /**
         * @param DataBase $db
         * @param Account $account
         * @param int $birthtime Timestamp
         */
        private static function SetBirthtime($db, $account, $birthtime) {
            $accountID = $account->ID;

            // If account lastchangebirth is from year ago, we can change birthtime
            $nowTime = time();
            $lastBirthTime = $account->LastChangeBirth === null ? 0 : $account->LastChangeBirth;
            $delta = ($nowTime - $lastBirthTime) / (60 * 60 * 24);
            if ($delta < 360) {
                // Suspicion of cheating
                ExitWithStatus("Error: you tried to change birthtime too often");
            }

            $command = "UPDATE `Accounts` SET `Birthtime` = '$birthtime', `LastChangeBirth` = current_timestamp() WHERE `ID` = '$accountID'";
            $result = $db->Query($command);
            if ($result === false) {
                ExitWithStatus("Error: saving birthtime failed");
            }
        }

        /**
         * @param DataBase $db
         * @param Account $account
         * @return string New data token
         */
        public static function RefreshDataToken($db, $account) {
            $accountID = $account->ID;
            $newDataToken = RandomString(6);
            $command = "UPDATE `Accounts` SET `DataToken` = '$newDataToken' WHERE `ID` = '$accountID'";
            $result = $db->Query($command);
            if ($result === false) {
                ExitWithStatus("Error: saving achievements failed");
            }
            return $newDataToken;
        }

        /**
         * @param DataBase $db
         * @param Account $account
         * @return array activity => [ skillID, startTime, duration, comment ]
         */
        public static function GetActivities($db, $account) {
            $accountID = $account->ID;
            $command = "SELECT `SkillID`, `StartTime`, `Duration`, `Comment` FROM `Activities` WHERE `UserID` = '$accountID'";
            $rows = $db->QueryArray($command);
            if ($rows === null) {
                ExitWithStatus("Error: getting activities failed");
            }
            $activities = array();
            for ($i = 0; $i < count($rows); $i++) {
                $skillID = intval($rows[$i]['SkillID']);
                $startTime = intval($rows[$i]['StartTime']);
                $duration = intval($rows[$i]['Duration']);
                $comment = $db->Decrypt($rows[$i]['Comment']);
                array_push($activities, [ $skillID, $startTime, $duration, $comment ]);
            }
            return $activities;
        }

        // Format : [ ['add|rem',SkillID,DATE,DURATION], ... ]
        /**
         * @param DataBase $db
         * @param Account $account
         * @param array $activities activity => [ skillID, startTime, duration, comment ]
         */
        private static function AddActivities($db, $account, $activities) {
            $accountID = $account->ID;

            for ($i = 0; $i < count($activities); $i++) {
                $activity = $activities[$i];
                if (count($activity) < 4 || count($activity) > 5) continue;

                $type = $activity[0];
                $skillID = $activity[1];
                $startTime = $activity[2];
                $duration = $activity[3];

                // Check if activity exists
                $exists = $db->QueryArray("SELECT `ID` FROM `Activities` WHERE `UserID` = '$accountID' AND `SkillID` = '$skillID' AND `StartTime` = '$startTime' AND `Duration` = '$duration'");
                if ($exists === null) ExitWithStatus("Error: adding activity failed");
                $exists = count($exists) > 0;

                if ($type === 'add') {
                    if ($exists) {
                        $r = $db->Query("DELETE FROM `Activities` WHERE `UserID` = '$accountID' AND `SkillID` = '$skillID' AND `StartTime` = '$startTime' AND `Duration` = '$duration'");
                        if ($r === false) ExitWithStatus("Error: saving activities failed (preadd)");
                    }
                    $comment = 'NULL';
                    if (!is_null($activity[4]) && !empty($activity[4])) {
                        $comment = "'".$db->Encrypt($activity[4])."'";
                    }
                    $r = $db->Query("INSERT INTO `Activities` (`UserID`, `SkillID`, `StartTime`, `Duration`, `Comment`) VALUES ('$accountID', '$skillID', '$startTime', '$duration', $comment)");
                    if ($r === false) ExitWithStatus("Error: saving activities failed (add)");
                } else if ($type === 'rem' && $exists) {
                    $r = $db->Query("DELETE FROM `Activities` WHERE `UserID` = '$accountID' AND `SkillID` = '$skillID' AND `StartTime` = '$startTime' AND `Duration` = '$duration'");
                    if ($r === false) ExitWithStatus("Error: saving activities failed (remove)");
                }
            }
        }

        /**
         * @param DataBase $db
         * @param Account $account
         * @return array tasks => [ Title, startTime, duration, comment ]
         */
        public static function GetTasks($db, $account) {
            $accountID = $account->ID;
            $command = "SELECT `Title`, `Description`, `Deadline`, `Schedule`, `Subtasks` FROM `Tasks` WHERE `UserID` = '$accountID'";
            $tasks = $db->QueryArray($command);
            if ($tasks === null) {
                ExitWithStatus("Error: getting tasks failed");
            }
            for ($i = 0; $i < count($tasks); $i++) {
                if ($tasks[$i]['Description'] !== null) {
                    $tasks[$i]['Description'] = $db->Decrypt($tasks[$i]['Description']);
                }
                if ($tasks[$i]['Deadline'] !== null) {
                    $tasks[$i]['Deadline'] = intval($tasks[$i]['Deadline']);
                }
                if ($tasks[$i]['Schedule'] !== null) {
                    $tasks[$i]['Schedule'] = json_decode($tasks[$i]['Schedule'], true);
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
        private static function AddTasks($db, $account, $tasks) {
            $accountID = $account->ID;

            for ($i = 0; $i < count($tasks); $i++) {
                $task = $tasks[$i];
                if (count($task) !== 6) continue;

                $Action = $task['Action'];
                $Title = $task['Title'];
                $Description = $task['Description'];
                $Deadline = $task['Deadline'];
                $Schedule = $task['Schedule'];
                $Subtasks = json_encode($task['Subtasks']);

                $Description = $Description === null ? 'NULL' : "'".$db->Encrypt($Description)."'";
                $Deadline = $Deadline === null ? 'NULL' : "'$Deadline'";
                $Schedule = $Schedule === null ? 'NULL' : "'".json_encode($Schedule)."'";

                // Check if task exists
                $exists = $db->QueryArray("SELECT `ID` FROM `Tasks` WHERE `UserID` = '$accountID' AND `Title` = '$Title'");
                if ($exists === null) ExitWithStatus("Error: adding task failed");
                $exists = count($exists) > 0;

                if ($Action === 'add') {
                    if ($exists) {
                        $r = $db->Query("DELETE FROM `Tasks` WHERE `UserID` = '$accountID' AND `Title` = '$Title'");
                        if ($r === false) ExitWithStatus("Error: saving tasks failed (preadd)");
                    }
                    $r = $db->Query("INSERT INTO `Tasks` (`UserID`, `Title`, `Description`, `Deadline`, `Schedule`, `Subtasks`) VALUES ('$accountID', '$Title', $Description, $Deadline, $Schedule, '$Subtasks')");
                    if ($r === false) ExitWithStatus("Error: saving tasks failed (add)");
                } else if ($Action === 'rem' && $exists) {
                    $r = $db->Query("DELETE FROM `Tasks` WHERE `UserID` = '$accountID' AND `Title` = '$Title'");
                    if ($r === false) ExitWithStatus("Error: saving tasks failed (remove)");
                }
            }
        }

        /**
         * @param DataBase $db
         * @param Account $account
         * @param int[] $achievements
         */
        private static function AddAchievement($db, $account, $achievements) {
            $accountID = $account->ID;
            $allAchievements = $account->Achievements;
            array_push($allAchievements, ...$achievements);
            $dbAchievements = json_encode($allAchievements);

            $command = "UPDATE `Accounts` SET `Achievements` = '$dbAchievements' WHERE `ID` = '$accountID'";
            $result = $db->Query($command);
            if ($result === false) {
                ExitWithStatus("Error: saving achievements failed");
            }
        }

        /**
         * @param DataBase $db
         * @param string $username
         * @return bool True if username is free, false otherwise
         */
        public static function PseudoIsFree($db, $username) {
            $p = ucfirst(strtolower($username));
            $command = "SELECT * FROM `Accounts` WHERE `Username` = '$p'";
            $pseudos = $db->Query($command);
            if ($pseudos !== false) {
                return $pseudos->num_rows === 0;
            }
            return false;
        }

        /**
         * @param DataBase $db
         * @param Account $account
         * @param int $title
         */
        public static function setTitle($db, $account, $title) {
            $accountID = $account->ID;
            $command = "UPDATE `Accounts` SET `Title` = '$title' WHERE `ID` = '$accountID'";
            $result = $db->Query($command);
            if ($result === false) {
                ExitWithStatus("Error: Saving title failed");
            }
        }

        /**
         * @param DataBase $db
         * @param int $accountID
         * @param int $xp
         */
        private static function setXP($db, $accountID, $xp) {
            $command = "UPDATE `Accounts` SET `XP` = '$xp' WHERE `ID` = '$accountID'";
            $result = $db->Query($command);
            if ($result === false) {
                ExitWithStatus("Error: Saving XP failed");
            }
        }

        /**
         * Get the Ox amount of the account
         * @param DataBase $db
         * @param int $accountID
         * @return int Ox amount
         */
        public static function GetOx($db, $accountID) {
            $command = "SELECT `Ox` FROM `Accounts` WHERE `ID` = '$accountID'";
            $query = $db->QueryArray($command);
            if ($query === null || count($query) === 0) {
                ExitWithStatus("Error: Getting ox failed");
            }
            $ox = intval($query[0]['Ox']);
            return $ox;
        }

        /**
         * Add or remove Ox to the account
         * @param DataBase $db
         * @param int $accountID
         * @param int $value Value to add or negative to remove
         */
        public static function AddOx($db, $accountID, $value) {
            $command = "UPDATE `Accounts` SET `Ox` = `Ox` + '$value' WHERE `ID` = '$accountID'";
            $result = $db->Query($command);
            if ($result === false) {
                ExitWithStatus("Error: Editing ox failed");
            }
        }

        /**
         * Decrement ad remaining
         * @param DataBase $db
         * @param int $accountID
         */
        public static function DecrementAdRemaining($db, $accountID) {
            $command = "UPDATE `Accounts` SET `AdRemaining` = `AdRemaining` - '1' WHERE `ID` = '$accountID'";
            $result = $db->Query($command);
            if ($result === false) {
                ExitWithStatus("Error: Decrement AdRemaining failed");
            }
        }
    }

?>