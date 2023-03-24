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
         * Buy a title
         * @param DataBase $db
         * @param Account $account
         * @param Device $device
         * @param int $titleID
         * @return int|false Return new Ox value if success, false otherwise
         */
        public static function BuyTitle($db, $account, $device, $titleID) {
            // Check if user have already this title
            $command = 'SELECT `ItemID` FROM TABLE WHERE `AccountID` = ?';
            $result = $db->QueryPrepare('InventoriesTitles', $command, 'i', [ $account->ID ]);
            if ($result === false || count($result) === 0) return false;
            $accountTitles = array_map(fn($row) => intval($row['ItemID']), $result);
            if (in_array($titleID, $accountTitles, true)) {
                $db->AddLog($account->ID, $device->ID, 'cheatSuspicion', "Try to buy a title ($titleID) already owns");
                return false;
            }

            // Get title value from titleID
            $command = 'SELECT `Value` FROM TABLE WHERE `ID` = ? AND Buyable = 1';
            $result = $db->QueryPrepare('Titles', $command, 'i', [ $titleID ]);
            if ($result === false || count($result) === 0) return false;
            $oxAmount = intval($result[0]['Value']);

            // Check if account has enough ox
            if ($account->Ox < $oxAmount) {
                $db->AddLog($account->ID, $device->ID, 'cheatSuspicion', "Try to buy a title with not enough Ox ($account->Ox/$oxAmount)");
                return false;
            }

            // Update account ox
            $command = 'UPDATE TABLE SET `Ox` = `Ox` - ? WHERE `ID` = ?';
            $result = $db->QueryPrepare('Accounts', $command, 'ii', [ $oxAmount, $account->ID ]);
            if ($result === false) return false;

            // Add title to inventory
            $result = self::AddInventoryTitle($db, $account, $titleID);
            if ($result === false) return false;

            // Add result in logs and return new ox value
            $db->AddLog($account->ID, $device->ID, 'buyTitle', "$titleID");
            return $account->Ox - $oxAmount;
        }

        /**
         * Buy an item
         * @param DataBase $db
         * @param Account $account
         * @param Device $device
         * @param string $itemID
         * @return int|false Return new Ox value if success, false otherwise
         */
        public static function BuyItem($db, $account, $device, $itemID) {
            // Get item value from itemID
            $command = 'SELECT `Value` FROM TABLE WHERE `ID` = ?';
            $result = $db->QueryPrepare('Items', $command, 's', [ $itemID ]);
            if ($result === false || count($result) === 0) return false;
            $oxAmount = intval($result[0]['Value']);

            // Check if account has enough ox
            if ($account->Ox < $oxAmount) {
                $db->AddLog($account->ID, $device->ID, 'cheatSuspicion', "Try to buy an item with not enough Ox ($account->Ox/$oxAmount)");
                return false;
            }

            // Update account ox
            $command = 'UPDATE TABLE SET `Ox` = `Ox` - ? WHERE `ID` = ?';
            $result = $db->QueryPrepare('Accounts', $command, 'ii', [ $oxAmount, $account->ID ]);
            if ($result === false) return false;

            // Add item to inventory
            $result = self::AddInventoryItem($db, $account, $itemID);
            if ($result === false) return false;

            // Add result in logs and return new ox value
            $db->AddLog($account->ID, $device->ID, 'buyItem', "$itemID");
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

        /**
         * Get number of all ads watched
         * @param DataBase $db
         * @param Account $account
         * @param Device $device
         * @param string $code
         * @return string|false|null Return reward if any, false otherwise and null if user exceed 100 tries
         */
        public static function CheckGiftCode($db, $account, $device, $code) {
            // Get Reward and available number
            $command = 'SELECT `Rewards`, `Available` FROM TABLE WHERE `ID` = ?';
            $gift = $db->QueryPrepare('GiftCodes', $command, 's', [ $code ]);
            if ($gift === false) return false;

            // Check if user spam and add try to logs
            $attempts = Users::GetGiftCodeAttemptsToday($db, $account);
            if ($attempts === false || $attempts > 100) {
                return null;
            }
            if ($attempts === 100) {
                $db->AddLog($account->ID, $device->ID, 'cheatSuspicion', 'User has tried more than 100 gift codes');
            }
            $db->AddLog($account->ID, $device->ID, 'giftCodeTry', "$code");

            if (count($gift) === 0) return false;
            $rewards = $gift[0]['Rewards'];
            $available = intval($gift[0]['Available']);

            // Check BETA code
            if (strtolower($code) === 'beta') {
                $command = 'SELECT `MaxTiper`, `Beta` FROM TABLE WHERE `Email` = ?';
                $betaTesters = $db->QueryPrepare('Contributors', $command, 's', [ $account->Email ]);
                if ($betaTesters === false || count($betaTesters) === 0) return false;
                $maxTiper = $betaTesters[0]['MaxTiper'] != 0;
                $beta = $betaTesters[0]['beta'] != 0;

                // Simple tiper (None of both)
                $rewardOx = 1000;
                $rewardItems = array('Title 18');

                // Beta tester
                if ($beta) {
                    $rewardOx = 2000;
                    array_push($rewardItems, 'Title 16');
                }

                // Max tiper (tiper was gave more than 100e)
                if ($maxTiper) {
                    $rewardOx = 3000;
                    array_push($rewardItems, 'Title 17');
                }

                array_push($rewardItems, "OX $rewardOx");
                return implode(',', $rewardItems);
            } else if (!$available) {
                return false;
            }

            // Check if user hasn't already use the code
            $command2 = "SELECT `ID` FROM TABLE WHERE `AccountID` = ? AND `Type` = 'giftCode' AND `Data` = ?";
            $usedGifts = $db->QueryPrepare('Logs', $command2, 'is', [ $account->ID, $code ]);
            if ($usedGifts === false || count($usedGifts) > 0) return false;

            return $rewards;
        }

        /**
         * Decrement number of available codes & add to logs
         * @param DataBase $db
         * @param int $accountID
         * @param int $deviceID
         * @param string $code
         * @return bool Return success
         */
        public static function ConsumeGiftCode($db, $accountID, $deviceID, $code) {
            $result = $db->QueryPrepare('GiftCodes', 'UPDATE TABLE SET `Available` = `Available` - 1 WHERE `ID` = ?', 's', [ $code ]);
            if ($result === false) return false;

            $db->AddLog($accountID, $deviceID, 'giftCode', $code);
            return true;
        }
    }

?>