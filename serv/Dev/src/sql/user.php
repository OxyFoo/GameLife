<?php

    $DAYS_PSEUDO_CHANGE = 6;

    class User
    {
        public static function ExecQueue($db, $account, $data) {
            $activities = $data['activities'];
            $achievements = $data['achievements'];

            if (isset($activities)) {
                self::AddActivities($db, $account, $activities);
            }

            if (isset($achievements)) {
                self::AddAchievement($db, $account, $achievements);
            }

            $newToken = self::RefreshDataToken($db, $account);
            return $newToken;
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
                    // TODO - Check ça
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

        private static function RefreshDataToken($db, $account) {
            //return 'test12';
            $accountID = $account['ID'];
            $newDataToken = RandomString(6);
            $command = "UPDATE `Users` SET `DataToken` = '$newDataToken' WHERE `ID` = '$accountID'";
            $result = $db->Query($command);
            if ($result !== TRUE) {
                ExitWithStatus("Error: saving achievements failed");
            }
            return $newDataToken;
        }

        // TODO - Check this

        public static function pseudoIsFree($db, $username) {
            $p = ucfirst(strtolower($username));
            $command = "SELECT * FROM `Users` WHERE `Username` = '$p'";
            $pseudos = $db->Query($command);
            $isFree = false;
            if ($pseudos !== FALSE) {
                $isFree = $pseudos->num_rows === 0;
            }
            return $isFree;
        }

        public static function SetData($db, $account, $data) {
            $accountID = $account['ID'];
            $crypted = $db->Encrypt($data);

            $command = "UPDATE `Users` SET `Data` = '$crypted' WHERE `ID` = '$accountID'";
            $result = $db->Query($command);

            if ($result !== TRUE) {
                ExitWithStatus("Error: Saving data failed");
            }
        }

        public static function setTitle($db, $account, $title) {
            $accountID = $account['ID'];
            $command = "UPDATE `Users` SET `Title` = '$title' WHERE `ID` = '$accountID'";
            $result = $db->Query($command);
            if ($result !== TRUE) {
                ExitWithStatus("Error: Saving title failed");
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

        // OLD function
        // TODO - Update function ("pseudoIsFree" moved)
        // 0 Nothing
        // 1 Changed
        // -1 Change failed (time)
        // -2 Change failed (wrong)
        public static function setPseudo($db, $account, $username) {
            global $DAYS_PSEUDO_CHANGE;

            $changed = 0;
            $accountID = $account['ID'];
            $oldUsername = $account['Username'];
            $lastPseudoDate = strtotime($account['LastChangeUsername']);
            $todayDate = time();
            $todayText = date('Y-m-d H:i:s', $todayDate);
            $delta = ($todayDate - $lastPseudoDate) / (60 * 60 * 24);
            $u = ucfirst(strtolower($username));
            if ($oldUsername != $u) {
                if (empty($oldUsername)) {
                    $command = "UPDATE `Users` SET `Username` = '$u', `LastChangeUsername` = '$todayText' WHERE `ID` = '$accountID'";
                    $result_pseudo = $db->Query($command);
                    if ($result_pseudo !== TRUE) {
                        ExitWithStatus("Error: Saving username failed (2)");
                    }
                } else if ($delta >= $DAYS_PSEUDO_CHANGE) {
                    $pseudoIsFree = $db->pseudoIsFree($accountID, $u);
                    if ($pseudoIsFree) {
                        $command = "UPDATE `Users` SET `Username` = '$u', `LastChangeUsername` = '$todayText' WHERE `ID` = '$accountID'";
                        $result_pseudo = $db->Query($command);
                        $changed = 1;
                        if ($result_pseudo !== TRUE) {
                            ExitWithStatus("Error: Saving username failed");
                        }
                    } else {
                        $changed = -2;
                    }
                } else {
                    $changed = -1;
                }
            }

            return $changed;
        }

        /*public static function DelUser($db, $ID) {
            $db->Query("DELETE FROM `Users` WHERE `ID` = '$ID'");
        }*/
    }

?>