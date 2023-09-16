<?php

class Achievements {
    /**
     * @param DataBase $db
     * @param Account $account
     * @param int $achievementID
     * @param 'OK'|'PENDING'|'NONE' $state
     * @return string|false Reward string or false on error
     */
    public static function AddByID($db, $account, $achievementID, $state = 'OK') {
        // Check if the achievement is already completed
        $pending = false;
        $solvedAchievements = Achievements::Get($db, $account);
        foreach ($solvedAchievements as $solvedAchievement) {
            if ($solvedAchievement['AchievementID'] === $achievementID) {
                if ($solvedAchievement['State'] === 'PENDING') {
                    $pending = true;
                }
            }
        }

        // Get reward
        $command = 'SELECT `Rewards` FROM TABLE WHERE `ID` = ?';
        $result = $db->QueryPrepare('Achievements', $command, 'i', [ $achievementID ]);
        if ($result === false) ExitWithStatus('Error: Failed to get achievement reward');
        if (count($result) === 0) ExitWithStatus('Error: Achievement not found');

        $rawRewards = $result[0]['Rewards'];

        // Add rewards
        if (!$rawRewards) {
            return false;
        }

        $rewards = explode(',', $rawRewards);
        $rewardAdded = Achievements::ExecReward($db, $account, $rewards);
        if ($rewardAdded === false) {
            ExitWithStatus('Error: Failed to add achievement reward');
        }

        // Add to account
        if (!$pending) {
            $command = 'INSERT INTO TABLE (`AccountID`, `AchievementID`, `State`) VALUES (?, ?, ?)';
            $result = $db->QueryPrepare('InventoriesAchievements', $command, 'iis', [ $account->ID, $achievementID, $state ]);
            if ($result === false) ExitWithStatus('Error: Failed to add achievement to account');
        }

        // Update achievement
        else {
            $command = 'UPDATE TABLE SET `State` = "OK" WHERE `AccountID` = ? AND `AchievementID` = ?';
            $args = [ $account->ID, $achievementID ];
            $result = $db->QueryPrepare('InventoriesAchievements', $command, 'ii', $args);
            if ($result === false) ExitWithStatus('Error: Failed to update achievement state');
        }

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