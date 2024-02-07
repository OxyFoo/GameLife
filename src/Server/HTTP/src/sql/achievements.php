<?php

class Achievements {
    /**
     * @param DataBase $db
     * @param Account $account
     * @param int $deviceID
     * @param int $achievementID
     * @return bool True if the achievement was added, false if it was already completed
     */
    public static function AddByID($db, $account, $deviceID, $achievementID) {
        // Check if the achievement is already completed
        $solvedAchievements = Achievements::Get($db, $account);
        $solvedAchievementsIDs = array_map(fn($solvedAchievement) => $solvedAchievement['AchievementID'], $solvedAchievements);
        if (in_array($achievementID, $solvedAchievementsIDs)) {
            return false;
        }

        // Add as pending achievement to account
        $command = 'INSERT INTO TABLE (`AccountID`, `AchievementID`) VALUES (?, ?)';
        $result = $db->QueryPrepare('InventoriesAchievements', $command, 'ii', [ $account->ID, $achievementID ]);
        if ($result === false) {
            ExitWithStatus('Error: Failed to add achievement to account');
        }

        return true;
    }

    /**
     * @param DataBase $db
     * @param Account $account
     * @param int $deviceID
     * @param int $achievementID
     * @return string|false Reward string or false on error
     */
    public static function Claim($db, $account, $deviceID, $achievementID) {
        // Check if the achievement is already completed
        $solvedAchievements = Achievements::Get($db, $account);
        $solvedAchievementsIDs = array_map(fn($solvedAchievement) => $solvedAchievement['AchievementID'], $solvedAchievements);
        if (!in_array($achievementID, $solvedAchievementsIDs)) {
            return false;
        }

        // Get reward
        $command = 'SELECT `Rewards` FROM TABLE WHERE `ID` = ?';
        $result = $db->QueryPrepare('Achievements', $command, 'i', [ $achievementID ]);
        if ($result === false) {
            ExitWithStatus('Error: Failed to get achievement reward');
        }
        if (count($result) === 0) {
            $db->AddLog($account->ID, $deviceID, 'cheatSuspicion', "Achievement '$achievementID' not found");
            return false;
        }

        $rawRewards = $result[0]['Rewards'];
        $rewards = explode(',', $rawRewards);
        $rewardAdded = Achievements::ExecReward($db, $account, $rewards);
        if ($rewardAdded === false) {
            ExitWithStatus('Error: Failed to add achievement reward');
        }

        // Update achievement state
        $command = 'UPDATE TABLE SET `State` = "OK" WHERE `AccountID` = ? AND `AchievementID` = ?';
        $args = [ $account->ID, $achievementID ];
        $result = $db->QueryPrepare('InventoriesAchievements', $command, 'ii', $args);
        if ($result === false) ExitWithStatus('Error: Failed to claim achievement');

        return $rewardAdded;
    }

    /**
     * @param DataBase $db
     * @param Account $account
     */
    public static function Get($db, $account) {
        $command = 'SELECT `AchievementID`, `State`, `Date` FROM TABLE WHERE `AccountID` = ?';
        $result = $db->QueryPrepare('InventoriesAchievements', $command, 'i', [ $account->ID ]);
        if ($result === false) ExitWithStatus('Error: Failed to get achievements');

        $achievements = array_map(function($achievement) {
            return [
                'AchievementID' => intval($achievement['AchievementID']),
                'State' => $achievement['State'],
                'Date' => strtotime($achievement['Date'])
            ];
        }, $result);

        return $achievements;
    }

    /**
     * @param DataBase $db
     * @param Account $account
     * @param string[] $rewards
     * @return string|false Reward string or false on error
     */
    public static function ExecReward($db, $account, $rewards) {
        $realRewards = [];

        foreach ($rewards as $reward) {
            $elements = explode(' ', $reward);
            if (count($elements) !== 2) continue;
            $type = $elements[0];
            $value = $elements[1];
            if ($type === 'OX') {
                $success = Users::AddOx($db, $account->ID, intval($value));
                if ($success === false) return false;
                array_push($realRewards, "OX $value");
            } else if ($type === 'Title') {
                $success = Items::AddInventoryTitle($db, $account, intval($value), $newReward);
                if ($success === false) return false;
                array_push($realRewards, $newReward);
            } else if ($type === 'Item') {
                $success = Items::AddInventoryItem($db, $account, $value);
                if ($success === false) return false;
                array_push($realRewards, "Item $value");
            }
        }

        return join(',', $realRewards);
    }
}

?>
