<?php

    class Achievements {
        /**
         * @param DataBase $db
         * @param Account $account
         * @param int[] $achievements
         */
        public static function AddAchievement($db, $account, $achievements) {
            $allAchievements = $account->Achievements;
            $achievementQueueComplete = false;

            foreach ($achievements as $achievementID) {
                // Check if the achievement is in the queue
                if ($account->AchievementQueue !== null && $account->AchievementQueue === $achievementID) {
                    $achievementQueueComplete = true;
                }

                // Check if is new achievement: get reward and add to account
                if (!in_array($achievementID, $allAchievements)) {
                    $command = 'SELECT `Rewards` FROM TABLE WHERE `ID` = ?';
                    $result = $db->QueryPrepare('Achievements', $command, 'i', [ $achievementID ]);
                    if ($result === false) {
                        ExitWithStatus('Error: Failed to get achievement reward');
                    }
                    $rawRewards = $result[0]['Rewards'];
                    $rewardAdded = false;

                    // Add rewards
                    if ($rawRewards) {
                        $rewards = explode(',', $rawRewards);
                        $rewardAdded = Achievements::ExecReward($db, $account, $rewards);
                    }

                    // No reward, add directly
                    else {
                        $rewardAdded = true;
                    }

                    if ($rewardAdded) {
                        array_push($allAchievements, ...$achievements);
                    }
                }
            }
            $dbAchievements = json_encode($allAchievements);
            if ($dbAchievements === false) {
                ExitWithStatus('Error: JSON encode failed');
            }

            if ($achievementQueueComplete) {
                $command = 'UPDATE TABLE SET `AchievementQueue` = NULL WHERE `ID` = ?';
                $result = $db->QueryPrepare('Accounts', $command, 'i', [ $account->ID ]);
                if ($result === false) {
                    ExitWithStatus('Error: saving achievementQueue failed');
                }
            }

            $command = 'UPDATE TABLE SET `Achievements` = ? WHERE `ID` = ?';
            $result = $db->QueryPrepare('Accounts', $command, 'si', [ $dbAchievements, $account->ID ]);
            if ($result === false) {
                ExitWithStatus('Error: saving achievements failed');
            }
        }

        /**
         * @param DataBase $db
         * @param Account $account
         * @param string[] $rewards
         * @return bool True if reward was executed
         */
        public static function ExecReward($db, $account, $rewards) {
            $output = false;
            foreach ($rewards as $reward) {
                $elements = explode(' ', $reward);
                if (count($elements) !== 2) continue;
                $type = $elements[0];
                $value = $elements[1];
                if ($type === 'OX') {
                    $output |= Users::AddOx($db, $account->ID, $value);
                } else if ($type === 'Title') {
                    $output |= Users::AddInventoryTitle($db, $account, intval($value));
                } else if ($type === 'Item') {
                    $output |= Users::AddInventoryItem($db, $account, $value);
                }
            }

            if ($output) Users::RefreshDataToken($db, $account->ID);
            return $output;
        }
    }

?>