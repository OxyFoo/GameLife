<?php

    $DAYS_USERNAME_CHANGE = 29;
    $MAX_WACHABLE_ADS = 10;

    class Users
    {
        /**
         * @param DataBase $db
         * @param Account $account
         * @param int $deviceID
         * @param object $data Array of data to add { 'activities': [], 'xp': 0, 'achievements': [], 'titleID': 0, 'birthTime': 0 }
         */
        public static function ExecQueue($db, $account, $deviceID, $data) {
            $activities = $data['activities'];
            $tasks = $data['tasks'];
            $equipments = $data['equipments'];
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
            if (isset($equipments)) {
                self::SetEquipments($db, $account, $equipments);
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
                self::SetBirthtime($db, $account, $deviceID, $birthTime);
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
            $lastUsernameTime = $account->LastChangeUsername === null ? 0 : $account->LastChangeUsername;
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
         * @param int $deviceID
         * @param int $birthtime Timestamp
         */
        private static function SetBirthtime($db, $account, $deviceID, $birthtime) {
            $accountID = $account->ID;

            // If account lastchangebirth is from year ago, we can change birthtime
            $nowTime = time();
            $lastBirthTime = $account->LastChangeBirth === null ? 0 : $account->LastChangeBirth;
            $delta = ($nowTime - $lastBirthTime) / (60 * 60 * 24);
            if ($delta < 360) {
                // Suspicion of cheating
                $db->AddStatistic($accountID, $deviceID, 'cheatSuspicion', "Try to change birthtime too often ({$account->Email})");
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
         * @param int $accountID
         * @return string New data token
         */
        public static function RefreshDataToken($db, $accountID) {
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
            $command = "SELECT `SkillID`, `StartTime`, `Duration`, `Comment` FROM `Activities` WHERE `AccountID` = '$accountID'";
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
                $exists = $db->QueryArray("SELECT `ID` FROM `Activities` WHERE `AccountID` = '$accountID' AND `SkillID` = '$skillID' AND `StartTime` = '$startTime' AND `Duration` = '$duration'");
                if ($exists === null) ExitWithStatus("Error: adding activity failed");
                $exists = count($exists) > 0;

                if ($type === 'add') {
                    if ($exists) {
                        $r = $db->Query("DELETE FROM `Activities` WHERE `AccountID` = '$accountID' AND `SkillID` = '$skillID' AND `StartTime` = '$startTime' AND `Duration` = '$duration'");
                        if ($r === false) ExitWithStatus("Error: saving activities failed (preadd)");
                    }
                    $comment = 'NULL';
                    if (!is_null($activity[4]) && !empty($activity[4])) {
                        $comment = "'".$db->Encrypt($activity[4])."'";
                    }
                    $r = $db->Query("INSERT INTO `Activities` (`AccountID`, `SkillID`, `StartTime`, `Duration`, `Comment`) VALUES ('$accountID', '$skillID', '$startTime', '$duration', $comment)");
                    if ($r === false) ExitWithStatus("Error: saving activities failed (add)");
                } else if ($type === 'rem' && $exists) {
                    $r = $db->Query("DELETE FROM `Activities` WHERE `AccountID` = '$accountID' AND `SkillID` = '$skillID' AND `StartTime` = '$startTime' AND `Duration` = '$duration'");
                    if ($r === false) ExitWithStatus("Error: saving activities failed (remove)");
                }
            }
        }

        /**
         * @param DataBase $db
         * @param Account $account
         * @param 'stuff' | 'title' $type
         * @return array
         */
        public static function GetInventory($db, $account, $type) {
            $accountID = $account->ID;
            $cell = $type === 'stuff' ? 'ItemID' : 'TitleID';
            $command = "SELECT `$cell`, `CreatedBy`, `CreatedAt` FROM `Inventories` WHERE `AccountID` = '$accountID' AND `Type` = '$type'";
            $rows = $db->QueryArray($command);
            if ($rows === null) {
                ExitWithStatus("Error: getting inventory failed");
            }
            if ($type === 'stuff') {
                for ($i = 0; $i < count($rows); $i++) {
                    $rows[$i]['ItemID'] = $rows[$i]['ItemID'];
                }
            } else if ($type === 'title') {
                for ($i = 0; $i < count($rows); $i++) {
                    $rows[$i] = intval($rows[$i]['TitleID']);
                }
            }
            return $rows;
        }

        /**
         * @param DataBase $db
         * @param Account $account
         * @param 'stuff' | 'title' $type
         * @return bool
         */
        public static function AddItem($db, $account, $itemID, $type) {
            $accountID = $account->ID;
            $createdBy = $account->Username;
            $cell = $type === 'stuff' ? 'ItemID' : 'TitleID';
            $command = "INSERT INTO `Inventories` (`AccountID`, `Type`, `$cell`, `CreatedBy`) VALUES ('$accountID', '$type', '$itemID', '$createdBy')";
            $result = $db->Query($command);
            return $result !== false;
        }

        /**
         * @param DataBase $db
         * @param Account $account
         * @return array tasks => [ Title, startTime, duration, comment ]
         */
        public static function GetTasks($db, $account) {
            $accountID = $account->ID;
            $command = "SELECT `Checked`, `Title`, `Description`, `Deadline`, `Schedule`, `Subtasks` FROM `Tasks` WHERE `AccountID` = '$accountID'";
            $tasks = $db->QueryArray($command);
            if ($tasks === null) {
                ExitWithStatus("Error: getting tasks failed");
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
        private static function AddTasks($db, $account, $tasks) {
            $accountID = $account->ID;

            for ($i = 0; $i < count($tasks); $i++) {
                $task = $tasks[$i];
                if (count($task) !== 7) continue;

                $Action = $task['Action'];
                $Checked = $task['Checked'];
                $Title = $task['Title'];
                $Description = $task['Description'];
                $Deadline = $task['Deadline'];
                $Schedule = $task['Schedule'];
                $Subtasks = json_encode($task['Subtasks']);

                $Checked = $Checked === null ? 'NULL' : "'$Checked'";
                $Description = $Description === null ? 'NULL' : "'".$db->Encrypt($Description)."'";
                $Deadline = $Deadline === null ? 'NULL' : "'$Deadline'";
                $Schedule = $Schedule === null ? 'NULL' : "'".json_encode($Schedule)."'";
                if ($Subtasks !== '[]') $Subtasks = $db->Encrypt($Subtasks);

                // Check if task exists
                $exists = $db->QueryArray("SELECT `ID` FROM `Tasks` WHERE `AccountID` = '$accountID' AND `Title` = '$Title'");
                if ($exists === null) ExitWithStatus("Error: adding task failed");
                $exists = count($exists) > 0;

                if ($Action === 'add') {
                    if ($exists) {
                        $r = $db->Query("UPDATE `Tasks` SET
                            `AccountID` = '$accountID', `Checked` = $Checked,
                            `Title` = '$Title', `Description` = $Description,
                            `Deadline` = $Deadline, `Schedule` = $Schedule, `Subtasks` = '$Subtasks'
                            WHERE `AccountID` = '$accountID' AND `Title` = '$Title'");
                        if ($r === false) ExitWithStatus("Error: saving tasks failed (update)");
                    } else {
                        $r = $db->Query("INSERT INTO `Tasks` (`AccountID`, `Checked`, `Title`, `Description`, `Deadline`, `Schedule`, `Subtasks`) VALUES ('$accountID', $Checked, '$Title', $Description, $Deadline, $Schedule, '$Subtasks')");
                        if ($r === false) ExitWithStatus("Error: saving tasks failed (add)");
                    }
                } else if ($Action === 'rem' && $exists) {
                    $r = $db->Query("DELETE FROM `Tasks` WHERE `AccountID` = '$accountID' AND `Title` = '$Title'");
                    if ($r === false) ExitWithStatus("Error: saving tasks failed (remove)");
                }
            }
        }

        /**
         * @param DataBase $db
         * @param Account $account
         * @param object $equipments
         */
        private static function SetEquipments($db, $account, $equipments) {
            $accountID = $account->ID;
            $equipmentsText = json_encode($equipments);
            $command = "UPDATE `Accounts` SET `Equipments` = '$equipmentsText' WHERE `ID` = '$accountID'";
            $result = $db->Query($command);
            if ($result === false) {
                ExitWithStatus("Error: saving equipments failed");
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
            foreach ($achievements as $achievementID) {
                if (!in_array($achievementID, $allAchievements)) {
                    $rewardAdded = Users::ExecReward($db, $account, $achievementID);
                    if ($rewardAdded) {
                        array_push($allAchievements, ...$achievements);
                    }
                }
            }
            $dbAchievements = json_encode($allAchievements);

            $command = "UPDATE `Accounts` SET `Achievements` = '$dbAchievements' WHERE `ID` = '$accountID'";
            $result = $db->Query($command);
            if ($result === false) {
                ExitWithStatus("Error: saving achievements failed");
            }
        }

        /**
         * @param DataBase $db
         * @param Account $account
         * @param int $achievementID
         * @return bool True if reward was executed
         */
        private static function ExecReward($db, $account, $achievementID) {
            $command = "SELECT `Rewards` FROM `Achievements` WHERE `ID` = '$achievementID'";
            $result = $db->QueryArray($command);
            if ($result === false) return false;
            $rewards = explode(',', $result[0]['Rewards']);

            $output = false;
            foreach ($rewards as $reward) {
                $elements = explode(' ', $reward);
                if (count($elements) !== 2) continue;
                $type = $elements[0];
                $value = $elements[1];
                if ($type === 'OX') {
                    $output = Users::AddOx($db, $account->ID, $value);
                } else if ($type === 'XP') {
                    // TODO - Set XP (add precise "activity")
                } else if ($type === 'Title') {
                    $output = Users::AddItem($db, $account, $value, 'title');
                    if ($output) Users::RefreshDataToken($db, $account->ID);
                } else if ($type === 'Item') {
                    $output = Users::AddItem($db, $account, $value, 'stuff');
                    if ($output) Users::RefreshDataToken($db, $account->ID);
                }
            }

            return $output;
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
         * @param int $deviceID
         * @return bool True if the device has not reached the created count limit
         */
        public static function CreationIsFree($db, $deviceID) {
            $command = "SELECT * FROM `Accounts` WHERE `CreatedBy` = '$deviceID'";
            $accounts = $db->Query($command);
            if ($accounts !== false) {
                return $accounts->num_rows < 3;
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
            return $result !== false;
        }

        /**
         * Get ad remaining to watch for today
         * @param DataBase $db
         * @param int $accountID
         */
        public static function GetAdRemaining($db, $accountID) {
            global $MAX_WACHABLE_ADS;
            $nextDay = date('d') + 1;
            $dateNow = date('Y-m-d 00:00:00');
            $tomorrow = date("Y-m-$nextDay 00:00:00");
            $command = "SELECT * FROM `Logs` WHERE `AccountID` = '$accountID' AND `Type` = 'adWatched' AND `Date` BETWEEN '$dateNow' AND '$tomorrow'";
            $result = $db->QueryArray($command);
            if ($result === null) {
                ExitWithStatus("Error: Getting ad remaining failed");
            }
            return $MAX_WACHABLE_ADS - count($result);
        }

        /**
         * Get number of all ads watched
         * @param DataBase $db
         * @param int $accountID
         */
        public static function GetAdWatched($db, $accountID) {
            $command = "SELECT * FROM `Logs` WHERE `AccountID` = '$accountID' AND `Type` = 'adWatched'";
            $result = $db->QueryArray($command);
            if ($result === null) {
                ExitWithStatus("Error: Getting ad remaining failed");
            }
            return count($result);
        }
    }

?>