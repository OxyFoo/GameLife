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
            $avatar = $data['avatar'];
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
            if (isset($avatar)) {
                self::SetAvatar($db, $account, $avatar);
            }
            if (isset($xp)) {
                self::setXP($db, $account->ID, $xp);
            }
            if (isset($achievements)) {
                Achievements::AddAchievement($db, $account, $achievements);
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
         * @return array
         */
        public static function GetInventory($db, $account) {
            $accountID = $account->ID;
            $command = "SELECT `ID`, `ItemID`, `CreatedBy`, `CreatedAt` FROM `Inventories` WHERE `AccountID` = '$accountID'";
            $rows = $db->QueryArray($command);
            if ($rows === null) {
                ExitWithStatus("Error: getting inventory failed");
            }
            for ($i = 0; $i < count($rows); $i++) {
                $rows[$i]['ID'] = intval($rows[$i]['ID']);
            }
            return $rows;
        }

        /**
         * @param DataBase $db
         * @param Account $account
         * @return array
         */
        public static function GetInventoryTitles($db, $account) {
            $accountID = $account->ID;
            $command = "SELECT `ItemID` FROM `InventoriesTitles` WHERE `AccountID` = '$accountID'";
            $rows = $db->QueryArray($command);
            if ($rows === null) {
                ExitWithStatus("Error: getting inventory failed");
            }
            for ($i = 0; $i < count($rows); $i++) {
                $rows[$i] = intval($rows[$i]['ItemID']);
            }
            return $rows;
        }

        /**
         * @param DataBase $db
         * @param Account $account
         * @param string $itemID
         * @return bool Success
         */
        public static function AddInventoryItem($db, $account, $itemID) {
            $command = "INSERT INTO TABLE (`AccountID`, `ItemID`, `CreatedBy`) VALUES (?, ?, ?)";
            $args = array($account->ID, $itemID, $account->ID);
            $result = $db->QueryPrepare('Inventories', $command, 'isi', $args);
            return $result !== false;
        }

        /**
         * @param DataBase $db
         * @param Account $account
         * @param int $itemID
         * @return bool Success
         */
        public static function AddInventoryTitle($db, $account, $itemID) {
            $command = "INSERT INTO TABLE (`AccountID`, `ItemID`, `CreatedBy`) VALUES (?, ?, ?)";
            $args = array($account->ID, $itemID, $account->ID);
            $result = $db->QueryPrepare('InventoriesTitles', $command, 'iii', $args);
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
                $Starttime = $task['Starttime'];
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
                            `Starttime` = '$Starttime', `Deadline` = $Deadline,
                            `Schedule` = $Schedule, `Subtasks` = '$Subtasks'
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
         */
        public static function GetAvatar($db, $account) {
            $command = "SELECT * FROM TABLE WHERE `ID` = ?";
            $avatar = $db->QueryPrepare('Avatars', $command, 'i', [ $account->ID ]);
            if ($avatar === false) ExitWithStatus("Error: getting avatar failed");
            if (count($avatar) === 0) ExitWithStatus("Error: avatar not found");

            $avatar = $avatar[0];

            $avatar['sexe']      = $avatar['Sexe'];
            $avatar['skin']      = $avatar['Skin'];
            $avatar['skinColor'] = intval($avatar['SkinColor']);
            $avatar['hair']      = intval($avatar['Hair']);
            $avatar['top']       = intval($avatar['Top']);
            $avatar['bottom']    = intval($avatar['Bottom']);
            $avatar['shoes']     = intval($avatar['Shoes']);

            unset($avatar['ID']);
            unset($avatar['SkinColor']);
            unset($avatar['Hair']);
            unset($avatar['Top']);
            unset($avatar['Bottom']);
            unset($avatar['Shoes']);

            return $avatar;
        }

        /**
         * @param DataBase $db
         * @param Account $account
         * @param object $avatar
         */
        private static function SetAvatar($db, $account, $avatar) {
            $Sexe      = $avatar['sexe'];
            $Skin      = $avatar['skin'];
            $SkinColor = $avatar['skinColor'];
            $Hair      = $avatar['hair'];
            $Top       = $avatar['top'];
            $Bottom    = $avatar['bottom'];
            $Shoes     = $avatar['shoes'];

            if (!isset($Sexe, $Skin, $SkinColor, $Hair, $Top, $Bottom, $Shoes)) {
                ExitWithStatus("Error: invalid avatar");
            }

            $command = "UPDATE TABLE SET
                `Sexe` = ?, `Skin` = ?, `SkinColor` = ?,
                `Hair` = ?, `Top` = ?, `Bottom` = ?, `Shoes` = ?
                WHERE `ID` = ?";

            $args = [
                $Sexe, $Skin, $SkinColor,
                $Hair, $Top, $Bottom, $Shoes,
                $account->ID
            ];

            $result = $db->QueryPrepare('Avatars', $command, 'ssissssi', $args);
            if ($result === false) {
                ExitWithStatus("Error: saving avatar failed");
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

        /**
         * Get number of all ads watched
         * @param DataBase $db
         * @param int $accountID
         * @param string $code
         * @return string|null Return reward if any, null otherwise
         */
        public static function CheckGiftCode($db, $accountID, $code) {
            $command = "SELECT `Rewards`, `Available` FROM `GiftCodes` WHERE `ID` = '$code'";
            $gift = $db->QueryArray($command);
            if ($gift === null || count($gift) === 0) {
                return null;
            }

            $rewards = $gift[0]['Rewards'];
            $available = $gift[0]['Available'];
            if ($available == 0) return null;

            $command2 = "SELECT `ID` FROM `Logs` WHERE `AccountID` = '$accountID' AND `Type` = 'giftCode' AND `Data` = '$code'";
            $usedGifts = $db->QueryArray($command2);
            if ($usedGifts === null || count($usedGifts) > 0) return null;

            return $rewards;
        }
    }

?>