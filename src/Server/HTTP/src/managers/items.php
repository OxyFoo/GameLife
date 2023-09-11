<?php

    class Items
    {
        /**
         * @param DataBase $db
         * @param Account $account
         * @return array
         */
        public static function GetInventory($db, $account) {
            $command = 'SELECT `ID`, `ItemID`, `CreatedBy`, `CreatedAt` FROM TABLE WHERE `AccountID` = ?';
            $rows = $db->QueryPrepare('Inventories', $command, 'i', [ $account->ID ]);
            if ($rows === null) {
                ExitWithStatus('Error: getting inventory failed');
            }
            for ($i = 0; $i < count($rows); $i++) {
                $rows[$i]['ID'] = intval($rows[$i]['ID']);
            }
            return $rows;
        }

        /**
         * @param DataBase $db
         * @param Account $account
         * @param string $itemID
         * @return int|false ID of new item in inventory or false on error
         */
        public static function AddInventoryItem($db, $account, $itemID) {
            $command = 'INSERT INTO TABLE (`AccountID`, `ItemID`, `CreatedBy`) VALUES (?, ?, ?)';
            $args = array($account->ID, $itemID, $account->ID);
            $result = $db->QueryPrepare('Inventories', $command, 'isi', $args);
            if ($result === false) return false;

            $id = $db->GetLastInsertID();
            Users::RefreshDataToken($db, $account->ID);
            return $id;
        }

        /**
         * @param DataBase $db
         * @param Account $account
         * @param int $id
         * @param string $newItemID
         * @return bool Success
         */
        public static function EditInventoryItemID($db, $account, $id, $newItemID) {
            $command = 'UPDATE TABLE SET `ItemID` = ? WHERE `ID` = ?';
            $args = array($newItemID, $id);
            $result = $db->QueryPrepare('Inventories', $command, 'si', $args);
            if ($result === false) return false;

            Users::RefreshDataToken($db, $account->ID);
            return true;
        }

        /**
         * @param DataBase $db
         * @param Account $account
         * @return array
         */
        public static function GetInventoryTitles($db, $account) {
            $command = 'SELECT `ItemID` FROM TABLE WHERE `AccountID` = ?';
            $rows = $db->QueryPrepare('InventoriesTitles', $command, 'i', [ $account->ID ]);
            if ($rows === null) {
                ExitWithStatus('Error: getting inventory failed');
            }
            for ($i = 0; $i < count($rows); $i++) {
                $rows[$i] = intval($rows[$i]['ItemID']);
            }
            return $rows;
        }

        /**
         * @param DataBase $db
         * @param Account $account
         * @param int $itemID
         * @return bool Success
         */
        public static function AddInventoryTitle($db, $account, $itemID) {
            // If user have already this title. convert into Ox
            $command = 'SELECT `ItemID` FROM TABLE WHERE `AccountID` = ?';
            $result = $db->QueryPrepare('InventoriesTitles', $command, 'i', [ $account->ID ]);
            if ($result === false || count($result) === 0) return false;
            $accountTitles = array_map(fn($row) => intval($row['ItemID']), $result);
            if (in_array($itemID, $accountTitles, true)) {
                // Get and return Title Ox price
                $command = 'SELECT `Value` FROM TABLE WHERE `ID` = ?';
                $result = $db->QueryPrepare('Titles', $command, 'i', [ $itemID ]);
                if ($result === false || count($result) === 0) return false;
                $oxAmount = intval($result[0]['Value']);
                return Users::AddOx($db, $account->ID, $oxAmount);
            }

            // Add title in inventory
            $command = 'INSERT INTO TABLE (`AccountID`, `ItemID`, `CreatedBy`) VALUES (?, ?, ?)';
            $args = array($account->ID, $itemID, $account->ID);
            $result = $db->QueryPrepare('InventoriesTitles', $command, 'iii', $args);
            if ($result !== false) {
                Users::RefreshDataToken($db, $account->ID);
                return true;
            }
            return false;
        }

        /**
         * Sell a stuff
         * @param DataBase $db
         * @param int $accountID
         * @param int $stuffID
         * @return int|false Return new Ox value if success, false otherwise
         */
        public static function SellStuff($db, $accountID, $deviceID, $stuffID) {
            // Check if item is equipped
            $checkCommand = 'SELECT `Hair`, `Top`, `Bottom`, `Shoes` FROM TABLE WHERE `ID` = ?';
            $checkResult = $db->QueryPrepare('Avatars', $checkCommand, 'i', [ $accountID ]);
            if ($checkResult === false || count($checkResult) === 0) return false;
            $avatar = $checkResult[0];
            $avatarItems = array($avatar['Hair'], $avatar['Top'], $avatar['Bottom'], $avatar['Shoes']);
            $alreadyEquipped = in_array($stuffID, $avatarItems);
            if ($alreadyEquipped) {
                // Suspicion of cheating
                $db->AddLog($accountID, $deviceID, 'cheatSuspicion', "Try to sell an equipped stuff ($stuffID)");
                return false;
            }

            // Get itemID from stuff
            $command = 'SELECT `ItemID` FROM TABLE WHERE `ID` = ? AND `AccountID` = ?';
            $result = $db->QueryPrepare('Inventories', $command, 'ii', [ $stuffID, $accountID ]);
            if ($result === false || count($result) === 0) return false;
            $itemID = $result[0]['ItemID'];

            // Get value of item
            $command2 = 'SELECT `Value` FROM TABLE WHERE `ID` = ?';
            $result2 = $db->QueryPrepare('Items', $command2, 's', [ $itemID ]);
            if ($result2 === false || count($result2) === 0) return false;
            $value = ceil(floatval($result2[0]['Value']) * .75);

            // Remove item from inventory
            $command3 = 'DELETE FROM TABLE WHERE `ID` = ?';
            $result3 = $db->QueryPrepare('Inventories', $command3, 'i', [ $stuffID ]);
            if ($result3 === false) return false;

            // Add value in Ox to account
            $command4 = 'UPDATE TABLE SET `Ox` = `Ox` + ? WHERE `ID` = ?';
            $result4 = $db->QueryPrepare('Accounts', $command4, 'ii', [ $value, $accountID ]);
            if ($result4 === false) return false;

            // Get new Ox value
            $command5 = 'SELECT `Ox` FROM TABLE WHERE `ID` = ?';
            $result5 = $db->QueryPrepare('Accounts', $command5, 'i', [ $accountID ]);
            if ($result5 === false || count($result5) === 0) return false;

            // Add result in logs, refresh data token and return new Ox amount
            Users::RefreshDataToken($db, $accountID);
            $db->AddLog($accountID, $deviceID, 'sellStuff', "$stuffID");
            $ox = intval($result5[0]['Ox']);
            return $ox;
        }
    }

?>