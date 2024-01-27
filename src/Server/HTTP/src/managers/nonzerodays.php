<?php

class NZD {
    public $start = 0;
    public $end = 0;
    public $daysCount = 0;
    public $claimed = '[]';
}

class NonZeroDays
{
    /**
     * @param DataBase $db
     * @param Account $account
     * @return NZD[]
     */
    public static function Get($db, $account) {
        $command = 'SELECT `Start`, `End`, `DaysCount`, `Claimed` FROM TABLE WHERE `AccountID` = ?';
        $rows = $db->QueryPrepare('NonZeroDays', $command, 'i', [ $account->ID ]);
        if ($rows === false) ExitWithStatus('Error: getting nzd failed');

        $nzd = array();
        for ($i = 0; $i < count($rows); $i++) {
            $newQuest = array(
                'start' => intval($rows[$i]['Start']),
                'end' => intval($rows[$i]['End']),
                'daysCount' => intval($rows[$i]['DaysCount']),
                'claimed' => json_decode($rows[$i]['Claimed'], true)
            );

            array_push($nzd, $newQuest);
        }

        return $nzd;
    }

    public static function Save($db, $account, $data) {
        if (isset($data['data'])) {
            self::Add($db, $account, $data['data']);
        } else {
            ExitWithStatus('Error: saving nzd failed (no data)');
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
        $rows = $db->QueryPrepare('NonZeroDays', $command, 'i', [ $account->ID ]);
        if ($rows !== false && count($rows) > 0) {
            $maxSavedTime = intval($rows[0]['Start']);
        }

        for ($i = 0; $i < count($data); $i++) {
            $nzd = $data[$i];

            // Check if NZD is valid
            $keysNzd = array_keys(get_object_vars(new NZD()));
            $wrongKeys = array_diff($keysNzd, array_keys((array)$nzd));
            if (count($wrongKeys) > 0) {
                continue;
            }

            $start = $nzd['start'];                     // int
            $end = $nzd['end'];                         // int
            $daysCount = $nzd['daysCount'];             // int
            $claimed = json_encode($nzd['claimed']);    // object => string

            // Check if NZD exists
            $command = 'SELECT `ID` FROM TABLE WHERE `AccountID` = ? AND `Start` = ?';
            $reqQuest = $db->QueryPrepare('NonZeroDays', $command, 'ii', [ $account->ID, $start ]);
            if ($reqQuest === false) ExitWithStatus('Error: adding NZD failed');
            $exists = count($reqQuest) > 0;

            $alreadySaved = $start < $maxSavedTime;
            // Add NZD
            if (!$exists) {
                $command = 'INSERT INTO TABLE (
                    `AccountID`,
                    `Start`,
                    `End`,
                    `DaysCount`,
                    `Claimed`
                ) VALUES (?, ?, ?, ?, ?)';
                $args = [
                    $account->ID,
                    $start,
                    $end,
                    $daysCount,
                    $claimed
                ];
                $types = 'iiiis';

                $r = $db->QueryPrepare('NonZeroDays', $command, $types, $args);
                if ($r === false) ExitWithStatus('Error: saving nzd failed (add)');
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

                $r = $db->QueryPrepare('NonZeroDays', $command, $types, $args);
                if ($r === false) ExitWithStatus('Error: saving nzd failed (update claimed)');
            }

            // Update all NZD
            else if ($exists && !$alreadySaved) {
                $command = 'UPDATE TABLE SET
                    `End` = ?,
                    `DaysCount` = ?,
                    `Claimed` = ?
                    WHERE `ID` = ?';
                $args = [
                    $end,
                    $daysCount,
                    $claimed,
                    $reqQuest[0]['ID']
                ];
                $types = 'iisi';

                $r = $db->QueryPrepare('NonZeroDays', $command, $types, $args);
                if ($r === false) ExitWithStatus('Error: saving nzd failed (update)');
            }
        }
    }

    /**
     * @param DataBase $db
     * @param Account $account
     * @param Device $device
     * @param int $claimListStart
     * @param int $dayIndex
     * @param string|false $error Error message if failed
     * @return int[]|false New items IDs or false if failed
     */
    public static function ClaimReward($db, $account, $device, $claimListStart, $dayIndex, &$error = null) {
        global $NONZERODAYS_REWARDS;
        $error = false;

        $command = 'SELECT `ID` FROM TABLE WHERE `AccountID` = ? AND `Start` = ?';
        $rows = $db->QueryPrepare('NonZeroDays', $command, 'ii', [ $account->ID, $claimListStart ]);
        if ($rows === false) ExitWithStatus('Error: claiming nzd failed (get claimed)');

        // ClaimList not found
        if (count($rows) !== 1) {
            $message = 'ClaimList count is ' . count($rows) . " (expected 1) for '$claimListStart,$dayIndex'";
            $db->AddLog($account->ID, $device->ID, 'cheatSuspicion', $message);
            return false;
        }

        // Check if already claimed
        $command = 'SELECT `ID` FROM TABLE WHERE `AccountID` = ? AND `Type` = ? AND `Data` = ?';
        $args = [ $account->ID, 'claimNZD', "$claimListStart,$dayIndex" ];
        $rows = $db->QueryPrepare('Logs', $command, 'iss', $args);
        if ($rows === false) ExitWithStatus('Error: claiming nzd failed (check claimed)');

        // Already claimed
        if (count($rows) > 0) {
            $message = "Already claimed for '$claimListStart,$dayIndex'";
            $db->AddLog($account->ID, $device->ID, 'cheatSuspicion', $message);
            return array();
        }

        $newItems = array();
        $rewards = $NONZERODAYS_REWARDS[$dayIndex];
        for ($i = 0; $i < count($rewards); $i++) {
            $type = $rewards[$i]['type'];
            $value = $rewards[$i]['value'];

            switch ($type) {
                case 'ox':
                    if (Users::AddOx($db, $account->ID, $value) === false) {
                        $error = 'Error: claiming nzd failed (add ox)';
                        return false;
                    }
                    $account->Ox += $value;
                    break;
                case 'chest':
                    $chestItem = Shop::BuyRandomChest($db, $account, $device, $value, true, $errorBuyRandomChest);
                    if ($chestItem === false || $errorBuyRandomChest !== false) {
                        $error = "Error: claiming nzd failed (buy chest $value) => $errorBuyRandomChest";
                        return false;
                    }
                    array_push($newItems, $chestItem);
                    break;
                default:
                    $error = 'Error: claiming nzd failed (unknown reward type)';
                    $message = "Unknown reward type '$type' for '$claimListStart,$dayIndex'";
                    $db->AddLog($account->ID, $device->ID, 'cheatSuspicion', $message);
                    return false;
            }
        }

        // Confirm claim
        $db->AddLog($account->ID, $device->ID, 'claimNZD', "$claimListStart,$dayIndex");

        return $newItems;
    }
}

?>
