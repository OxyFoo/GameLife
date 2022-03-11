<?php

    $DAYS_USERNAME_CHANGE = 29;

    class Users
    {
        public static function ExecQueue($db, $account, $data) {
            $activities = $data['activities'];
            $xp = $data['xp'];
            $achievements = $data['achievements'];
            $titleID = $data['titleID'];
            $birthTime = $data['birthTime'];

            if (isset($activities)) {
                self::AddActivities($db, $account, $activities);
            }
            if (isset($xp)) {
                self::setXP($db, $account['ID'], $xp);
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

        // Return :
        // ok => Pseudo is changed (check if it's free)
        // alreadyUsed => Pseudo already used
        // alreadyChanged => Pseudo change failed (time)
        // incorrect => Pseudo is incorrect (wrong length...)
        // error => Others weird errors
        public static function SetUsername($db, $account, $username) {
            global $DAYS_USERNAME_CHANGE;

            $accountID = $account['ID'];
            $oldUsername = $account['Username'];
            $newUsername = ucfirst(strtolower($username));

            $lastUsernameTime = strtotime($account['LastChangeUsername']);
            $nowTime = time();
            $nowText = date('Y-m-d H:i:s', $nowTime);
            $delta = ($nowTime - $lastUsernameTime) / (60 * 60 * 24);

            if ($oldUsername === $newUsername) return 'error';
            if ($delta < $DAYS_USERNAME_CHANGE) return 'alreadyChanged';
            if (!UsernameIsCorrect($newUsername)) return 'incorrect';
            if (!self::PseudoIsFree($db, $newUsername)) return 'alreadyUsed';

            $command = "UPDATE `Users` SET `Username` = '$newUsername', `LastChangeUsername` = '$nowText' WHERE `ID` = '$accountID'";
            $result_pseudo = $db->Query($command);
            if ($result_pseudo !== TRUE) ExitWithStatus("Error: Saving username failed");

            return 'ok';
        }

        private static function SetBirthtime($db, $account, $birthtime) {
            $accountID = $account['ID'];
            $lastChangeBirth = $account['LastChangeBirth'];
            if ($lastChangeBirth !== NULL) $lastChangeBirth = strtotime($lastChangeBirth);
            // TODO - Check last change birth time

            $command = "UPDATE `Users` SET `Birthtime` = '$birthtime', `LastChangeBirth` = current_timestamp() WHERE `ID` = '$accountID'";
            $result = $db->Query($command);
            if ($result !== TRUE) {
                ExitWithStatus("Error: saving birthtime failed");
            }
        }

        public static function RefreshDataToken($db, $account) {
            $accountID = $account['ID'];
            $newDataToken = RandomString(6);
            $command = "UPDATE `Users` SET `DataToken` = '$newDataToken' WHERE `ID` = '$accountID'";
            $result = $db->Query($command);
            if ($result !== TRUE) {
                ExitWithStatus("Error: saving achievements failed");
            }
            return $newDataToken;
        }

        public static function GetActivities($db, $account) {
            $accountID = $account['ID'];
            $command = "SELECT `SkillID`, `StartTime`, `Duration`, `Comment` FROM `Activities` WHERE `UserID` = '$accountID'";
            $rows = $db->QueryArray($command);
            if ($rows === NULL) {
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
        private static function AddActivities($db, $account, $activities) {
            $accountID = $account['ID'];

            for ($i = 0; $i < count($activities); $i++) {
                $activity = $activities[$i];
                if (count($activity) < 4 || count($activity) > 5) continue;

                $type = $activity[0];
                $skillID = $activity[1];
                $startTime = $activity[2];
                $duration = $activity[3];

                // Check if activity exists
                $exists = $db->QueryArray("SELECT `ID` FROM `Activities` WHERE `UserID` = '$accountID' AND `SkillID` = '$skillID' AND `StartTime` = '$startTime' AND `Duration` = '$duration'");
                if ($exists === NULL) ExitWithStatus("Error: adding activity failed");
                $exists = count($exists) > 0;

                if ($type === 'add') {
                    if ($exists) {
                        $r = $db->Query("DELETE FROM `Activities` WHERE `UserID` = '$accountID' AND `SkillID` = '$skillID' AND `StartTime` = '$startTime' AND `Duration` = '$duration'");
                        if ($r !== TRUE) ExitWithStatus("Error: saving activities failed (remove)");
                    }
                    $comment = 'NULL';
                    if (!is_null($activity[4]) && !empty($activity[4])) {
                        $comment = "'".$db->Encrypt($activity[4])."'";
                    }
                    $r = $db->Query("INSERT INTO `Activities` (`UserID`, `SkillID`, `StartTime`, `Duration`, `Comment`) VALUES ('$accountID', '$skillID', '$startTime', '$duration', $comment)");
                    if ($r !== TRUE) ExitWithStatus("Error: saving activities failed");
                } else if ($type === 'rem' && $exists) {
                    $r = $db->Query("DELETE FROM `Activities` WHERE `UserID` = '$accountID' AND `SkillID` = '$skillID' AND `StartTime` = '$startTime' AND `Duration` = '$duration'");
                    if ($r !== TRUE) ExitWithStatus("Error: saving activities failed (remove)");
                }
            }
        }

        // Format : [1, 2, 3, ...]
        private static function AddAchievement($db, $account, $achievements) {
            $accountID = $account['ID'];
            $dbAchievements = $account['Achievements'];

            for ($i = 0; $i < count($achievements); $i++) {
                $achievementID = $achievements[$i];
                if (strlen($dbAchievements) === 0) {
                    $dbAchievements = $achievementID;
                } else {
                    $dbAchievements .= ',' . $achievementID;
                }
            }

            $command = "UPDATE `Users` SET `Achievements` = '$dbAchievements' WHERE `ID` = '$accountID'";
            $result = $db->Query($command);
            if ($result !== TRUE) {
                ExitWithStatus("Error: saving achievements failed");
            }
        }

        public static function PseudoIsFree($db, $username) {
            $p = ucfirst(strtolower($username));
            $command = "SELECT * FROM `Users` WHERE `Username` = '$p'";
            $pseudos = $db->Query($command);
            $isFree = false;
            if ($pseudos !== FALSE) {
                $isFree = $pseudos->num_rows === 0;
            }
            return $isFree;
        }

        public static function setTitle($db, $account, $title) {
            $accountID = $account['ID'];
            $command = "UPDATE `Users` SET `Title` = '$title' WHERE `ID` = '$accountID'";
            $result = $db->Query($command);
            if ($result !== TRUE) {
                ExitWithStatus("Error: Saving title failed");
            }
        }

        private static function setXP($db, $accountID, $xp) {
            $command = "UPDATE `Users` SET `XP` = '$xp' WHERE `ID` = '$accountID'";
            $result = $db->Query($command);
            if ($result !== TRUE) {
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
            $command = "SELECT `Ox` FROM `Users` WHERE `ID` = '$accountID'";
            $query = $db->QueryArray($command);
            if ($query === NULL || count($query) === 0) {
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
            $command = "UPDATE `Users` SET `Ox` = `Ox` + '$value' WHERE `ID` = '$accountID'";
            $result = $db->Query($command);
            if ($result !== TRUE) {
                ExitWithStatus("Error: Saving title failed");
            }
        }
    }

?>