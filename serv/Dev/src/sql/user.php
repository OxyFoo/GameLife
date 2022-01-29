<?php

    $DAYS_USERNAME_CHANGE = 29;

    class User
    {
        public static function ExecQueue($db, $account, $data) {
            $activities = $data['activities'];
            $achievements = $data['achievements'];
            $titleID = $data['titleID'];
            $birthTime = $data['birthTime'];

            if (isset($activities)) {
                self::AddActivities($db, $account, $activities);
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
        // error => Others weird errors
        public static function SetUsername($db, $account, $username) {
            global $DAYS_USERNAME_CHANGE;

            $output = 'error';
            $accountID = $account['ID'];
            $oldUsername = $account['Username'];
            $newUsername = ucfirst(strtolower($username));

            $lastUsernameTime = strtotime($account['LastChangeUsername']);
            $nowTime = time();
            $nowText = date('Y-m-d H:i:s', $nowTime);
            $delta = ($nowTime - $lastUsernameTime) / (60 * 60 * 24);

            if ($oldUsername != $newUsername) {
                if ($delta >= $DAYS_USERNAME_CHANGE) {
                    $pseudoIsFree = self::PseudoIsFree($db, $newUsername);
                    if ($pseudoIsFree) {
                        $command = "UPDATE `Users` SET `Username` = '$newUsername', `LastChangeUsername` = '$nowText' WHERE `ID` = '$accountID'";
                        $result_pseudo = $db->Query($command);
                        if ($result_pseudo !== TRUE) {
                            ExitWithStatus("Error: Saving username failed");
                        }
                        $output = 'ok';
                    } else {
                        $output = 'alreadyUsed';
                    }
                } else {
                    $output = 'alreadyChanged';
                }
            }

            return $output;
        }

        private static function SetBirthtime($db, $account, $birthtime) {
            $accountID = $account['ID'];
            $lastChangeBirth = $account['LastChangeBirth'];
            if ($lastChangeBirth !== NULL) $lastChangeBirth = strtotime($lastChangeBirth);
            // TODO - Check last change birth time

            $command = "UPDATE `Users` SET `Birthtime` = '$birthtime', `LastChangeBirth` = 'current_timestamp()' WHERE `ID` = '$accountID'";
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

        // Format : [ ['add|rem',SkillID,DATE,DURATION], ... ]
        private static function AddActivities($db, $account, $activities) {
            $accountID = $account['ID'];
            $dbActivities = json_decode($account['Activities'], true);

            for ($i = 0; $i < count($activities); $i++) {
                $activity = $activities[$i];
                if (count($activity) !== 4) continue;

                $type = $activity[0];
                $skillID = $activity[1];
                $startTime = $activity[2];
                $duration = $activity[3];
                $newActivity = [ $skillID, $startTime, $duration ];

                if ($type === 'add') {
                    array_push($dbActivities, $newActivity);
                } else if ($type === 'rem') {
                    $index = array_search($newActivity, $dbActivities);
                    if ($index !== false) {
                        array_splice($dbActivities, $index, 1);
                    }
                }
            }

            $newActivities = json_encode($dbActivities);
            $command = "UPDATE `Users` SET `Activities` = '$newActivities' WHERE `ID` = '$accountID'";
            $result = $db->Query($command);
            if ($result !== TRUE) {
                ExitWithStatus("Error: saving achievements failed");
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

        // TODO - Check this

        public static function SetData($db, $account, $data) {
            $accountID = $account['ID'];
            $crypted = $db->Encrypt($data);

            $command = "UPDATE `Users` SET `Data` = '$crypted' WHERE `ID` = '$accountID'";
            $result = $db->Query($command);

            if ($result !== TRUE) {
                ExitWithStatus("Error: Saving data failed");
            }
        }

        public static function setAchievements($db, $account, $achievements) {
            $accountID = $account['ID'];
            $command = "UPDATE `Users` SET `Achievements` = '$achievements' WHERE `ID` = '$accountID'";
            $result = $db->Query($command);
            if ($result !== TRUE) {
                ExitWithStatus("Error: Saving title failed");
            }
        }

        public static function setXP($db, $account, $xp) {
            $accountID = $account['ID'];
            $command = "UPDATE `Users` SET `XP` = '$xp' WHERE `ID` = '$accountID'";
            $result = $db->Query($command);
            if ($result !== TRUE) {
                ExitWithStatus("Error: Saving XP failed");
            }
        }

        /*public static function DelUser($db, $ID) {
            $db->Query("DELETE FROM `Users` WHERE `ID` = '$ID'");
        }*/
    }

?>