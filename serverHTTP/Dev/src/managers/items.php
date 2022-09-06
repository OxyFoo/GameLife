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
         * @return bool Success
         */
        public static function AddInventoryItem($db, $account, $itemID) {
            $command = 'INSERT INTO TABLE (`AccountID`, `ItemID`, `CreatedBy`) VALUES (?, ?, ?)';
            $args = array($account->ID, $itemID, $account->ID);
            $result = $db->QueryPrepare('Inventories', $command, 'isi', $args);
            return $result !== false;
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
            $command = 'INSERT INTO TABLE (`AccountID`, `ItemID`, `CreatedBy`) VALUES (?, ?, ?)';
            $args = array($account->ID, $itemID, $account->ID);
            $result = $db->QueryPrepare('InventoriesTitles', $command, 'iii', $args);
            return $result !== false;
        }

        /**
         * Buy a title
         * @param DataBase $db
         * @param Account $account
         * @param int $titleID
         * @return int|false Return new Ox value if success, false otherwise
         */
        public static function BuyTitle($db, $account, $titleID) {
            // Get title value from titleID
            $command = 'SELECT `Value` FROM TABLE WHERE `ID` = ? AND Buyable = 1';
            $result = $db->QueryPrepare('Titles', $command, 'i', [ $titleID ]);
            if ($result === false || count($result) === 0) return false;
            $oxAmount = intval($result[0]['Value']);

            // Check if account has enough ox
            if ($account->Ox < $oxAmount) return false;

            // Update account ox
            $command = 'UPDATE TABLE SET `Ox` = `Ox` - ? WHERE `ID` = ?';
            $result = $db->QueryPrepare('Accounts', $command, 'ii', [ $oxAmount, $account->ID ]);
            if ($result === false) return false;

            // Add title to inventory
            $result = self::AddInventoryTitle($db, $account, $titleID);
            if ($result === false) return false;

            // Return new ox value
            return $account->Ox - $oxAmount;
        }

        /**
         * Buy an item
         * @param DataBase $db
         * @param Account $account
         * @param string $itemID
         * @return int|false Return new Ox value if success, false otherwise
         */
        public static function BuyItem($db, $account, $itemID) {
            // Get item value from itemID
            $command = 'SELECT `Value` FROM TABLE WHERE `ID` = ?';
            $result = $db->QueryPrepare('Items', $command, 's', [ $itemID ]);
            if ($result === false || count($result) === 0) return false;
            $oxAmount = intval($result[0]['Value']);

            // Check if account has enough ox
            if ($account->Ox < $oxAmount) return false;

            // Update account ox
            $command = 'UPDATE TABLE SET `Ox` = `Ox` - ? WHERE `ID` = ?';
            $result = $db->QueryPrepare('Accounts', $command, 'ii', [ $oxAmount, $account->ID ]);
            if ($result === false) return false;

            // Add item to inventory
            $result = self::AddInventoryItem($db, $account, $itemID);
            if ($result === false) return false;

            // Return new ox value
            return $account->Ox - $oxAmount;
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
            $value = intval($result2[0]['Value']);

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

            $ox = intval($result5[0]['Ox']);
            return $ox;
        }

        /**
         * Get number of all ads watched
         * @param DataBase $db
         * @param int $accountID
         * @param string $code
         * @return string|false Return reward if any, null otherwise
         */
        public static function CheckGiftCode($db, $accountID, $code) {
            $command = 'SELECT `Rewards`, `Available` FROM TABLE WHERE `ID` = ?';
            $gift = $db->QueryPrepare('GiftCodes', $command, 's', [ $code ]);
            if ($gift === false || count($gift) === 0) return false;

            $rewards = $gift[0]['Rewards'];
            $available = $gift[0]['Available'];
            if (!$available) return false;

            $command2 = "SELECT `ID` FROM TABLE WHERE `AccountID` = ? AND `Type` = 'giftCode' AND `Data` = ?";
            $usedGifts = $db->QueryPrepare('Logs', $command2, 'is', [ $accountID, $code ]);
            if ($usedGifts === false || count($usedGifts) > 0) return false;

            return $rewards;
        }
    }

?>