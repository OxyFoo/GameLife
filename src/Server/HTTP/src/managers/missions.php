<?php

$MISSIONS_STATES = [ 'pending', 'completed', 'claimed' ];

class Missions
{
    /**
     * @param DataBase $db
     * @param Account $account
     * @return array
     */
    public static function Get($db, $account) {
        $command = 'SELECT `Name`, `State` FROM TABLE WHERE `AccountID` = ?';
        $rows = $db->QueryPrepare('Missions', $command, 'i', [ $account->ID ]);
        if ($rows === null) {
            ExitWithStatus('Error: getting inventory failed');
        }
        array_walk($rows, function(&$row) {
            $row['name'] = $row['Name'];
            $row['state'] = $row['State'];
            unset($row['Name']);
            unset($row['State']);
        });
        return $rows;
    }

    /**
     * @param DataBase $db
     * @param Account $account
     * @param int $deviceID
     * @param string $itemID
     * @return int|false
     */
    public static function Set($db, $account, $deviceID, $missions) {
        global $MISSIONS, $MISSIONS_STATES;

        for ($i = 0; $i < count($missions); $i++) {
            $name = $missions[$i]['name'];
            $state = $missions[$i]['state'];

            $MISSIONS_NAMES = array_column($MISSIONS, 'name');
            if (!in_array($name, $MISSIONS_NAMES) || !in_array($state, $MISSIONS_STATES)) {
                $db->AddLog($account->ID, $deviceID, 'cheatSuspicion', "Invalid mission name or state: $name, $state");
                return false;
            }

            // Check if mission already exists
            $command = 'SELECT `Name`, `State` FROM TABLE WHERE `AccountID` = ? AND `Name` = ?';
            $rows = $db->QueryPrepare('Missions', $command, 'is', [ $account->ID, $name ]);
            if ($rows === null) {
                return false;
            }

            if (count($rows) > 0) {
                // Update mission
                if ($rows[0]['State'] === 'pending' && $state === 'completed') {
                    $command = 'UPDATE TABLE SET `State` = ? WHERE `AccountID` = ? AND `Name` = ?';
                    $args = array($state, $account->ID, $name);
                    $result = $db->QueryPrepare('Missions', $command, 'sis', $args);
                    if ($result === false) {
                        return false;
                    }
                }
            } else {
                // Insert mission
                $command = 'INSERT INTO TABLE (`AccountID`, `Name`, `State`) VALUES (?, ?, ?)';
                $args = array($account->ID, $name, $state);
                $result = $db->QueryPrepare('Missions', $command, 'iss', $args);
                if ($result === false) {
                    return false;
                }
            }
        }
    }

    /**
     * @param DataBase $db
     * @param Account $account
     * @param int $deviceID
     * @param string $name
     * @return bool
     */
    public static function Claim($db, $account, $deviceID, $name) {
        global $MISSIONS;

        $MISSIONS_NAMES = array_column($MISSIONS, 'name');
        if (!in_array($name, $MISSIONS_NAMES)) {
            $db->AddLog($account->ID, $deviceID, 'cheatSuspicion', "Invalid mission name: $name");
            return false;
        }

        // Check if mission already exists
        $command = 'SELECT `Name`, `State` FROM TABLE WHERE `AccountID` = ? AND `Name` = ?';
        $rows = $db->QueryPrepare('Missions', $command, 'is', [ $account->ID, $name ]);
        if ($rows === null) {
            return false;
        }

        if (count($rows) === 0) {
            $db->AddLog($account->ID, $deviceID, 'cheatSuspicion', "Trying to claim non-existing mission: $name");
            return false;
        }

        if ($rows[0]['State'] !== 'completed') {
            $db->AddLog($account->ID, $deviceID, 'cheatSuspicion', "Trying to claim non-completed mission: $name");
            return false;
        }

        // Set mission as claimed
        $command = 'UPDATE TABLE SET `State` = ? WHERE `AccountID` = ? AND `Name` = ?';
        $args = array('claimed', $account->ID, $name);
        $result = $db->QueryPrepare('Missions', $command, 'sis', $args);
        if ($result === false) {
            return false;
        }

        // Claim rewards
        $rewards = array();

        $mission = $MISSIONS[array_search($name, $MISSIONS_NAMES)];
        $rewardType = $mission['rewardType'];
        $rewardValue = $mission['rewardValue'];

        if ($rewardType === 'ox') {
            $oxAdded = Users::AddOx($db, $account->ID, $rewardValue);
            if ($oxAdded === false) {
                return false;
            }
            $rewards['ox'] = $account->Ox + $rewardValue;
        } else if ($rewardType === 'chest') {
            $item = Shop::BuyRandomChest($db, $account, $deviceID, $rewardValue, true);
            if ($item === false) {
                return false;
            }
            $rewards['item'] = $item;
        }

        $db->AddLog($account->ID, $deviceID, 'claimMission', "Claimed mission: $name => " . json_encode($rewards));

        return $rewards;
    }
}

?>
