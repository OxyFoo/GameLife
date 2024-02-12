<?php

class Accounts
{
    const ACCOUNT_TEST = 'gamelife-test@oxyfoo.com';

    /**
     * Add new empty account
     * @param DataBase $db
     * @param string $username
     * @param string $email
     * @param int $deviceID
     * @return Account|null
     */
    public static function Add($db, $username, $email, $deviceID) {
        // Add account
        $command = 'INSERT INTO TABLE (`Username`, `Email`, `CreatedBy`) VALUES (?, ?, ?)';
        $args = [ $username, $email, $deviceID ];
        $result = $db->QueryPrepare('Accounts', $command, 'ssi', $args);
        if ($result === false) ExitWithStatus('Error: Adding device in DB failed');
        $account = Accounts::GetByID($db, $db->GetLastInsertID());

        /**
         * @param DataBase $db
         * @param Account $account
         * @param string[] $itemsIDs
         */
        function Rollback($db, $account, $itemsIDs) {
            // Rollback account
            $command = 'DELETE FROM TABLE WHERE `ID` = ?';
            $db->QueryPrepare('Accounts', $command, 'i', [$account->ID]);

            // Rollback items
            foreach ($itemsIDs as $itemID) {
                $command = 'DELETE FROM TABLE WHERE `ID` = ?';
                $db->QueryPrepare('Inventory', $command, 'i', [$itemID]);
            }
        }

        // Add default items
        $items = [ 'hair_01', 'top_01', 'bottom_01', 'shoes_01' ];
        $IDs = [];
        foreach ($items as $item) {
            $itemID = Items::AddInventoryItem($db, $account, $item);
            if ($itemID === false) {
                Rollback($db, $account, $IDs);
                ExitWithStatus('Error: Adding default item failed');
            }
            array_push($IDs, $itemID);
        }

        // Add avatar with default items
        $command = 'INSERT INTO TABLE (`ID`, `Hair`, `Top`, `Bottom`, `Shoes`) VALUES (?, ?, ?, ?, ?)';
        $args = [ $account->ID, ...$IDs ];
        $result = $db->QueryPrepare('Avatars', $command, 'iiiii', $args);
        if ($result === false) {
            Rollback($db, $account, $IDs);
            ExitWithStatus('Error: adding avatar failed' . implode(', ', $args));
        }

        return $account;
    }

    /**
     * @param DataBase $db
     * @param int $ID
     * @return Account|null
     */
    public static function GetByID($db, $ID) {
        $account = null;
        $command = 'SELECT * FROM TABLE WHERE `ID` = ?';
        $accounts = $db->QueryPrepare('Accounts', $command, 'i', [ $ID ]);
        if ($accounts !== null && count($accounts) === 1) {
            $account = new Account($accounts[0]);
        }
        return $account;
    }

    /**
     * @param DataBase $db
     * @param string $email
     * @return Account|null
     */
    public static function GetByEmail($db, $email) {
        $account = null;
        $command = 'SELECT * FROM TABLE WHERE `Email` = ?';
        $accounts = $db->QueryPrepare('Accounts', $command, 's', [ $email ]);

        if ($accounts !== null && count($accounts) === 1) {
            $account = new Account($accounts[0]);
        }

        return $account;
    }

    /**
     * @param DataBase $db
     * @param int $deviceID
     * @param Account $account
     * @param string $cellName "Devices" or "DevicesWait"
     */
    public static function AddDevice($db, $deviceID, $account, $cellName) {
        if ($cellName !== 'Devices' && $cellName !== 'DevicesWait') {
            ExitWithStatus('Error: Invalid cell name');
        }
        if (!$db->IsSafe($cellName)) {
            ExitWithStatus('Error: Invalid cell name');
        }

        $cell = $account->{$cellName};
        array_push($cell, $deviceID);
        $newCell = json_encode($cell);

        if ($newCell === false) {
            ExitWithStatus('Error: JSON encode failed');
        }

        $command = "UPDATE TABLE SET `$cellName` = ? WHERE `ID` = ?";
        $args = [ $newCell, $account->ID ];
        $result = $db->QueryPrepare('Accounts', $command, 'si', $args);
        if ($result === false) {
            ExitWithStatus('Error: Device adding failed');
        }
    }

    /**
     * @param DataBase $db
     * @param int $deviceID
     * @param Account $account
     * @param string $cellName "Devices" or "DevicesWait"
     */
    public static function RemDevice($db, $deviceID, $account, $cellName) {
        if ($account->Email === self::ACCOUNT_TEST) {
            return;
        }

        if ($cellName !== 'Devices' && $cellName !== 'DevicesWait') {
            ExitWithStatus('Error: Invalid cell name');
        }
        if (!$db->IsSafe($cellName)) {
            ExitWithStatus('Error: Invalid cell name');
        }

        $cell = $account->{$cellName};
        if (!in_array($deviceID, $cell)) {
            ExitWithStatus('Error: Device removing failed (device not found)');
        }

        unset($cell[array_search($deviceID, $cell)]);
        $isIndexed = array_values($cell) === $cell;
        if (!$isIndexed) $cell = array_values($cell);

        $newCell = json_encode($cell);
        if ($newCell === false) {
            ExitWithStatus('Error: JSON encode failed');
        }

        $command = "UPDATE TABLE SET `$cellName` = ? WHERE `ID` = ?";
        $args = [ $newCell, $account->ID ];
        $result = $db->QueryPrepare('Accounts', $command, 'si', $args);
        if ($result === false) {
            ExitWithStatus('Error: Device removing failed');
        }
    }

    /**
     * @param DataBase $db
     * @param Account $account
     */
    public static function ClearDevices($db, $account) {
        if ($account->Email === self::ACCOUNT_TEST) {
            return;
        }

        $command = 'UPDATE TABLE SET `Devices` = "[]" WHERE `ID` = ?';
        $result = $db->QueryPrepare('Accounts', $command, 'i', [ $account->ID ]);
        if ($result === false) {
            ExitWithStatus('Error: Clearing devices failed');
        }
    }

    /**
     * Check if device is in account's devices or devices wait list
     * @param int $deviceID
     * @param Account $account
     * @return int \
     *     -1 => Not found / Error\
     *     0  => OK\
     *     1  => Wait mail confirmation
     */
    public static function CheckDevicePermissions($deviceID, $account) {
        $isMailTest = $account->Email === self::ACCOUNT_TEST;
        if ($isMailTest && in_array(1, $account->Devices)) {
            return 0;
        }

        if (in_array($deviceID, $account->Devices)) {
            return 0;
        }

        if (in_array($deviceID, $account->DevicesWait)) {
            return 1;
        }

        return -1;
    }

    /**
     * Check if device is in account's devices or devices wait list
     * @param DataBase $db
     * @param int $accountID
     */
    public static function RefreshLastDate($db, $accountID) {
        $command = 'UPDATE TABLE SET `LastConnDate` = current_timestamp() WHERE `ID` = ?';
        $result = $db->QueryPrepare('Accounts', $command, 'i', [ $accountID ]);
        if ($result === false) {
            ExitWithStatus('Error: Saving last date failed');
        }
    }

    /**
     * Delete an account
     * @param DataBase $db
     * @param int $accountID
     * @return bool Success of deletion
     */
    public static function Delete($db, $accountID) {
        $remFriends    = $db->QueryPrepare('Friends',                   'DELETE FROM TABLE WHERE `AccountID` = ? OR `TargetID` = ?', 'ii', [ $accountID, $accountID ]);
        $remQuests     = $db->QueryPrepare('MyQuests',                  'DELETE FROM TABLE WHERE `AccountID` = ?', 'i', [ $accountID ]);
        $remNZD        = $db->QueryPrepare('NonZeroDays',               'DELETE FROM TABLE WHERE `AccountID` = ?', 'i', [ $accountID ]);
        $remTodoes     = $db->QueryPrepare('Todoes',                    'DELETE FROM TABLE WHERE `AccountID` = ?', 'i', [ $accountID ]);
        $remAvatar     = $db->QueryPrepare('Avatars',                   'DELETE FROM TABLE WHERE `ID` = ?',        'i', [ $accountID ]);
        $remActivities = $db->QueryPrepare('Activities',                'DELETE FROM TABLE WHERE `AccountID` = ?', 'i', [ $accountID ]);
        $remInventory  = $db->QueryPrepare('Inventories',               'DELETE FROM TABLE WHERE `AccountID` = ?', 'i', [ $accountID ]);
        $remInventoryT = $db->QueryPrepare('InventoriesTitles',         'DELETE FROM TABLE WHERE `AccountID` = ?', 'i', [ $accountID ]);
        $remInventoryA = $db->QueryPrepare('InventoriesAchievements',   'DELETE FROM TABLE WHERE `AccountID` = ?', 'i', [ $accountID ]);
        $remUser       = $db->QueryPrepare('Accounts',                  'DELETE FROM TABLE WHERE `ID` = ?',        'i', [ $accountID ]);
        return $remFriends !== false && $remQuests !== false && $remNZD !== false && $remTodoes !== false &&
                $remActivities !== false && $remAvatar !== false && $remUser !== false &&
                $remInventory !== false && $remInventoryT !== false && $remInventoryA !== false;
    }
}

?>
