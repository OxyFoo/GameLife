<?php

class DQ {
    public $start = 0;
    public $daysCount = 0;
    public $claimed = '[]';
}

class DailyQuest
{
    /**
     * @param DataBase $db
     * @param Account $account
     * @return DQ[]
     */
    public static function Get($db, $account) {
        $command = 'SELECT `Start`, `DaysCount`, `Claimed` FROM TABLE WHERE `AccountID` = ?';
        $rows = $db->QueryPrepare('DailyQuests', $command, 'i', [ $account->ID ]);
        if ($rows === false) ExitWithStatus('Error: getting daily quest failed');

        $dq = array();
        for ($i = 0; $i < count($rows); $i++) {
            $newQuest = array(
                'start' => intval($rows[$i]['Start']),
                'daysCount' => intval($rows[$i]['DaysCount']),
                'claimed' => json_decode($rows[$i]['Claimed'], true)
            );

            array_push($dq, $newQuest);
        }

        return $dq;
    }

    public static function Save($db, $account, $data) {
        if (isset($data['data'])) {
            self::Add($db, $account, $data['data']);
        } else {
            ExitWithStatus('Error: saving daily quest failed (no data)');
        }
    }

    /**
     * @param DataBase $db
     * @param Account $account
     * @param array $data
     */
    private static function Add($db, $account, $data) {
        $maxSavedTime = 0;
        $command = 'SELECT `Start` FROM TABLE WHERE `AccountID` = ? ORDER BY `Start` DESC LIMIT 1';
        $rows = $db->QueryPrepare('DailyQuests', $command, 'i', [ $account->ID ]);
        if ($rows !== false && count($rows) > 0) {
            $maxSavedTime = intval($rows[0]['Start']);
        }

        for ($i = 0; $i < count($data); $i++) {
            $dq = $data[$i];

            // Check if DQ is valid
            $keysDailyQuest = array_keys(get_object_vars(new DQ()));
            $wrongKeys = array_diff($keysDailyQuest, array_keys((array)$dq));
            if (count($wrongKeys) > 0) {
                continue;
            }

            $start = $dq['start'];                     // int
            $daysCount = $dq['daysCount'];             // int
            $claimed = json_encode($dq['claimed']);    // object => string

            // Check if DQ exists
            $command = 'SELECT `ID` FROM TABLE WHERE `AccountID` = ? AND `Start` = ?';
            $reqQuest = $db->QueryPrepare('DailyQuests', $command, 'is', [ $account->ID, $start ]);
            if ($reqQuest === false) ExitWithStatus('Error: adding DQ failed');
            $exists = count($reqQuest) > 0;

            $alreadySaved = $start < $maxSavedTime;
            // Add DQ
            if (!$exists) {
                $command = 'INSERT INTO TABLE (
                    `AccountID`,
                    `Start`,
                    `DaysCount`,
                    `Claimed`
                ) VALUES (?, ?, ?, ?)';
                $args = [
                    $account->ID,
                    $start,
                    $daysCount,
                    $claimed
                ];
                $types = 'isis';

                $r = $db->QueryPrepare('DailyQuests', $command, $types, $args);
                if ($r === false) ExitWithStatus('Error: saving daily quest failed (add)');
            }

            // Update only claimed
            else if ($exists && $alreadySaved) {
                $command = 'UPDATE TABLE SET
                    `Claimed` = ?
                    WHERE `ID` = ?';
                $args = [
                    $claimed,
                    $reqQuest[0]['ID']
                ];
                $types = 'si';

                $r = $db->QueryPrepare('DailyQuests', $command, $types, $args);
                if ($r === false) ExitWithStatus('Error: saving daily quest failed (update claimed)');
            }

            // Update all DQ
            else if ($exists && !$alreadySaved) {
                $command = 'UPDATE TABLE SET
                    `DaysCount` = ?,
                    `Claimed` = ?
                    WHERE `ID` = ?';
                $args = [
                    $daysCount,
                    $claimed,
                    $reqQuest[0]['ID']
                ];
                $types = 'isi';

                $r = $db->QueryPrepare('DailyQuests', $command, $types, $args);
                if ($r === false) ExitWithStatus('Error: saving daily quest failed (update)');
            }
        }
    }

    /**
     * @param DataBase $db
     * @param Account $account
     * @param Device $device
     * @param string $claimListStart
     * @param int[] $dayIndexes
     * @param string|false $error Error message if failed
     * @return int[]|false New items IDs or false if failed
     */
    public static function ClaimRewards($db, $account, $device, $claimListStart, $dayIndexes, &$error = null) {
        $error = false;
        $newItems = array();

        for ($i = 0; $i < count($dayIndexes); $i++) {
            $dayIndex = $dayIndexes[$i];
            $items = self::ClaimReward($db, $account, $device, $claimListStart, $dayIndex, $errorClaimReward);
            if ($items === false || $errorClaimReward !== false) {
                $error = "Error: claiming daily quest failed (claim reward $dayIndex) => $errorClaimReward";
                return false;
            }
            $newItems = array_merge($newItems, $items);
        }

        return $newItems;
    }

    /**
     * @param DataBase $db
     * @param Account $account
     * @param Device $device
     * @param string $claimListStart
     * @param int $dayIndex
     * @param string|false $error Error message if failed
     * @return int[]|false New items IDs or false if failed
     */
    public static function ClaimReward($db, $account, $device, $claimListStart, $dayIndex, &$error = null) {
        global $DAILY_QUEST_REWARDS;
        $error = false;

        $command = 'SELECT `ID` FROM TABLE WHERE `AccountID` = ? AND `Start` = ?';
        $rows = $db->QueryPrepare('DailyQuests', $command, 'is', [ $account->ID, $claimListStart ]);
        if ($rows === false) ExitWithStatus('Error: claiming daily quest failed (get claimed)');

        // ClaimList not found
        if (count($rows) !== 1) {
            $message = 'ClaimList count is ' . count($rows) . " (expected 1) for '$claimListStart,$dayIndex'";
            $db->AddLog($account->ID, $device->ID, 'cheatSuspicion', $message);
            return false;
        }

        // Check if already claimed
        $command = 'SELECT `ID` FROM TABLE WHERE `AccountID` = ? AND `Type` = ? AND `Data` = ?';
        $args = [ $account->ID, 'claimDailyQuest', "$claimListStart,$dayIndex" ];
        $rows = $db->QueryPrepare('Logs', $command, 'iss', $args);
        if ($rows === false) ExitWithStatus('Error: claiming daily quest failed (check claimed)');

        // Already claimed
        if (count($rows) > 0) {
            $message = "Already claimed for '$claimListStart,$dayIndex'";
            $db->AddLog($account->ID, $device->ID, 'cheatSuspicion', $message);
            return array();
        }

        $newItems = array();
        $rewards = $DAILY_QUEST_REWARDS[$dayIndex];
        for ($i = 0; $i < count($rewards); $i++) {
            $type = $rewards[$i]['type'];
            $value = $rewards[$i]['value'];

            switch ($type) {
                case 'ox':
                    if (Users::AddOx($db, $account->ID, $value) === false) {
                        $error = 'Error: claiming daily quest failed (add ox)';
                        return false;
                    }
                    $account->Ox += $value;
                    break;
                case 'chest':
                    $chestItem = Shop::BuyRandomChest($db, $account, $device->ID, $value, true, $errorBuyRandomChest);
                    if ($chestItem === false || $errorBuyRandomChest !== false) {
                        $error = "Error: claiming daily quest failed (buy chest $value) => $errorBuyRandomChest";
                        return false;
                    }
                    array_push($newItems, $chestItem);
                    break;
                default:
                    $error = 'Error: claiming daily quest failed (unknown reward type)';
                    $message = "Unknown reward type '$type' for '$claimListStart,$dayIndex'";
                    $db->AddLog($account->ID, $device->ID, 'cheatSuspicion', $message);
                    return false;
            }
        }

        // Confirm claim
        $db->AddLog($account->ID, $device->ID, 'claimDailyQuest', "$claimListStart,$dayIndex");

        return $newItems;
    }
}

?>
