<?php

class Shop
{
    /**
     * Get daily deals
     * @param DataBase $db
     * @param Account $account
     * @return array
     */
    public static function GetDailyDeals($db, $account) {
        // Get all items
        $command = 'SELECT `ID`, `Rarity`, `Value` FROM TABLE WHERE `Buyable` = 1';
        $items = $db->QueryPrepare('Items', $command);
        if ($items === false) return false;

        // Get 3 random items from rarity 0
        $itemsByRarity = array(
            '0' => array_filter($items, fn($item) => intval($item['Rarity']) === 0),
            '1' => array_filter($items, fn($item) => intval($item['Rarity']) === 1),
            '2' => array_filter($items, fn($item) => intval($item['Rarity']) === 2),
            '3' => array_filter($items, fn($item) => intval($item['Rarity']) === 3)
        );

        // Select 3 random items: 1 common, 1 rare, 1 epic or legendary
        $rand0 = Randay("{$account->Email}-0");
        $count0 = count($itemsByRarity['0']) - 1;
        $index0 = round($rand0 * $count0);
        $item0 = array_values($itemsByRarity['0'])[$index0];

        $rand1 = Randay("{$account->Email}-1");
        $count1 = count($itemsByRarity['1']) - 1;
        $index1 = round($rand1 * $count1);
        $item1 = array_values($itemsByRarity['1'])[$index1];

        // Last will be epic or legendary ? (95% epic, 5% legendary)
        $randRarity = Randay("{$account->ID}-rarity") < 0.95 ? 2 : 3;
        $rand2 = Randay("{$account->Email}-2");
        $count2 = count($itemsByRarity[$randRarity]) - 1;
        $index2 = round($rand2 * $count2);
        $item2 = array_values($itemsByRarity[$randRarity])[$index2];

        // Return items ID
        return array($item0['ID'], $item1['ID'], $item2['ID']);
    }

    /**
     * Buy an item
     * @param DataBase $db
     * @param Account $account
     * @param Device $device
     * @param string $itemID
     * @return int|false Return new Ox value if success, false otherwise
     */
    public static function BuyDailyDeals($db, $account, $device, $itemID) {
        // Get item value from itemID
        $command = 'SELECT `Value` FROM TABLE WHERE `ID` = ?';
        $result = $db->QueryPrepare('Items', $command, 's', [ $itemID ]);
        if ($result === false || count($result) === 0) return false;

        $multiplier = Shop::GetPriceFactor($db, $error);
        if ($multiplier === false) return false;

        $oxAmount = intval($result[0]['Value']);
        $finalPrice = intval(round($oxAmount * $multiplier, 0));

        // Check if account has enough ox
        if ($account->Ox < $finalPrice) {
            $db->AddLog($account->ID, $device->ID, 'cheatSuspicion', "Try to buy an item with not enough Ox ($account->Ox/$finalPrice)");
            return false;
        }

        // Update account ox
        $command = 'UPDATE TABLE SET `Ox` = `Ox` - ? WHERE `ID` = ?';
        $result = $db->QueryPrepare('Accounts', $command, 'ii', [ $finalPrice, $account->ID ]);
        if ($result === false) return false;

        // Add item to inventory
        $result = Items::AddInventoryItem($db, $account, $itemID);
        if ($result === false) return false;

        // Add result in logs and return new ox value
        $db->AddLog($account->ID, $device->ID, 'buyDailyDeals', "$itemID");
        return $account->Ox - $finalPrice;
    }

    /**
     * Buy a random chest
     * @param DataBase $db
     * @param Account $account
     * @param int $deviceID
     * @param int $rarity 0 = common, 1 = rare, 2 = epic
     * @param string|false $error Error message if failed
     * @return object|false Return item if success, false otherwise
     */
    public static function BuyRandomChest($db, $account, $deviceID, $rarity, $isFree = false, &$error = null) {
        $error = false;
        if ($rarity < 0 || $rarity > 3) {
            $error = 'Error: invalid rarity';
            return false;
        }

        $rarities = array('common', 'rare', 'epic', 'legendary');
        $prices = array(50, 200, 500, 1250);
        $stats = array(
            /* Common */    array('common' => .90, 'rare' => .09, 'epic' => .0099, 'legendary' => 0.0001),
            /* Rare */      array('common' => .20, 'rare' => .75, 'epic' => .045,  'legendary' => .005),
            /* Epic */      array('common' => 0,   'rare' => .29, 'epic' => .70,   'legendary' => .01),
            /* Legendary */ array('common' => 0,   'rare' => .05, 'epic' => .80,   'legendary' => .15)
        );

        $multiplier = Shop::GetPriceFactor($db, $error);
        if ($multiplier === false) return false;

        $finalPrice = 0;
        if (!$isFree) {
            $finalPrice = intval(round($prices[$rarity] * $multiplier, 0));
        }

        // Check if account has enough ox
        if (!$isFree && $account->Ox < $finalPrice) {
            $db->AddLog($account->ID, $deviceID, 'cheatSuspicion', "Try to buy a chest with not enough Ox ($account->Ox/$finalPrice)");
            return false;
        }

        // Update account ox
        if (!$isFree) {
            $command = 'UPDATE TABLE SET `Ox` = `Ox` - ? WHERE `ID` = ?';
            $result = $db->QueryPrepare('Accounts', $command, 'ii', [ $finalPrice, $account->ID ]);
            if ($result === false) {
                $error = 'Error: Update account ox failed';
                return false;
            }
            $account->Ox -= $finalPrice;
        }

        // Get random rarity (with stats)
        $random = (rand()&1000000)/1000001;
        $randomRarity = null;
        foreach ($stats[$rarity] as $currentRarity => $chance) {
            if ($random < $chance) {
                $randomRarity = array_search($currentRarity, $rarities);
                break;
            }
            $random -= $chance;
        }
        if ($randomRarity === null) {
            $error = "Error: random rarity failed ($random)";
            return false;
        }

        // Get buyable items from rarity
        $command = 'SELECT `ID` FROM TABLE WHERE `Rarity` = ? AND `Buyable` = 1';
        $items = $db->QueryPrepare('Items', $command, 'i', [ $randomRarity ]);
        if ($items === false || count($items) === 0) {
            $error = 'Error: random item failed';
            return false;
        }

        // Pick random item and add it to inventory
        $randomItem = $items[rand(0, count($items) - 1)];
        $result = Items::AddInventoryItem($db, $account, $randomItem['ID']);

        // Get new item
        $command = 'SELECT `ID`, `ItemID`, `CreatedBy`, `CreatedAt` FROM TABLE WHERE `ID` = ?';
        $result = $db->QueryPrepare('Inventories', $command, 'i', [ $result ]);
        if ($result === false || count($result) === 0) {
            $error = 'Error: get new item failed';
            return false;
        }
        $addedItem = $result[0];

        // Add result in logs and return new values (item, ox ?)
        $db->AddLog($account->ID, $deviceID, 'buyRandomChest', "$rarity/$randomRarity/$randomItem[ID]");

        return $addedItem;
    }

    /**
     * Buy a targeted chest
     * @param DataBase $db
     * @param Account $account
     * @param Device $device
     * @param 'hair'|'top'|'bottom'|'shoes' $slot
     * @param int $rarity 0 = common, 1 = rare, 2 = epic, 3 = legendary
     * @return object|false Return items if success, false otherwise
     */
    public static function BuyTargetChest($db, $account, $device, $slot, $rarity) {
        if ($rarity < 0 || $rarity > 3) return false;
        $rarities = array('common', 'rare', 'epic', 'legendary');
        $prices = array(60, 240, 600, 1500);
        $stats = array(
            /* Common */    array('common' => .99, 'rare' => .009, 'epic' => .001, 'legendary'  => 0),
            /* Rare */      array('common' => .27, 'rare' => .70,  'epic' => .029,  'legendary' => .001),
            /* Epic */      array('common' => 0,   'rare' => .3,   'epic' => .65,   'legendary' => .05),
            /* Legendary */ array('common' => 0,   'rare' => .08,  'epic' => .82,   'legendary1' => .10)
        );

        $multiplier = Shop::GetPriceFactor($db, $error);
        if ($multiplier === false) return false;

        // Check if account has enough ox
        $finalPrice = intval(round($prices[$rarity] * $multiplier, 0));
        if ($account->Ox < $finalPrice) {
            $db->AddLog($account->ID, $device->ID, 'cheatSuspicion', "Try to buy a chest with not enough Ox ($account->Ox/$finalPrice)");
            return false;
        }

        // Update account ox
        $command = 'UPDATE TABLE SET `Ox` = `Ox` - ? WHERE `ID` = ?';
        $result = $db->QueryPrepare('Accounts', $command, 'ii', [ $finalPrice, $account->ID ]);
        if ($result === false) return false;
        $account->Ox -= $finalPrice;

        // Get random rarity (with stats)
        $random = (rand()&1000000)/1000001;
        $randomRarity = null;
        foreach ($stats[$rarity] as $currentRarity => $chance) {
            if ($random < $chance) {
                $randomRarity = array_search($currentRarity, $rarities);
                break;
            }
            $random -= $chance;
        }
        if ($randomRarity === null) return false;

        // Get random item from slot & rarity
        $command = 'SELECT `ID` FROM TABLE WHERE `Slot` = ? AND `Rarity` = ? AND `Buyable` = 1';
        $items = $db->QueryPrepare('Items', $command, 'si', [ $slot, $randomRarity ]);
        if ($items === false || count($items) === 0) return false;

        // Add item to inventory
        $randomItem = $items[rand(0, count($items) - 1)];
        $result = Items::AddInventoryItem($db, $account, $randomItem['ID']);

        // Get new item
        $command = 'SELECT `ID`, `ItemID`, `CreatedBy`, `CreatedAt` FROM TABLE WHERE `ID` = ?';
        $result = $db->QueryPrepare('Inventories', $command, 'i', [ $result ]);
        if ($result === false || count($result) === 0) return false;
        $addedItem = $result[0];

        // Add result in logs and return new values (item, ox ?)
        $db->AddLog($account->ID, $device->ID, 'buyRandomChest', "$rarity/$randomRarity/$randomItem[ID]");

        return $addedItem;
    }

    /**
     * Buy a dye
     * @param DataBase $db
     * @param Account $account
     * @param Device $device
     * @param int $ID
     * @param string $newItemID
     * @return int|false Return new Ox value if success, false otherwise
     */
    public static function BuyDye($db, $account, $device, $ID, $newItemID) {
        // Check if user have already this item
        $command = 'SELECT `ItemID` FROM TABLE WHERE `ID` = ?';
        $result = $db->QueryPrepare('Inventories', $command, 'i', [ $ID ]);
        if ($result === false || count($result) === 0) return false;
        $itemID = $result[0]['ItemID'];

        // Try to cheat changing raw item ID
        $rawItemID = strpos($itemID, '-') !== false ? explode('-', $itemID)[0] : $itemID;
        $rawNewID = strpos($newItemID, '-') !== false ? explode('-', $newItemID)[0] : $newItemID;
        if ($ID === $newItemID || $rawItemID !== $rawNewID) {
            $db->AddLog($account->ID, $device->ID, 'cheatSuspicion', "Try to change item ID ($ID/$newItemID)");
            return false;
        }

        // Get item value from item with new ID
        $command = 'SELECT `Value` FROM TABLE WHERE `ID` = ?';
        $result = $db->QueryPrepare('Items', $command, 's', [ $newItemID ]);
        if ($result === false || count($result) === 0) return false;
        $oxAmount = intval($result[0]['Value']);
        $oxAmount = intval($oxAmount * 3 / 4);

        $multiplier = Shop::GetPriceFactor($db, $error);
        if ($multiplier === false) return false;
        $finalPrice = intval(round($oxAmount * $multiplier, 0));

        // Check if account has enough ox
        if ($account->Ox < $finalPrice) {
            $db->AddLog($account->ID, $device->ID, 'cheatSuspicion', "Try to buy a dye with not enough Ox ($account->Ox/$finalPrice)");
            return false;
        }

        // Update account ox
        $command = 'UPDATE TABLE SET `Ox` = `Ox` - ? WHERE `ID` = ?';
        $result = $db->QueryPrepare('Accounts', $command, 'ii', [ $finalPrice, $account->ID ]);
        if ($result === false) return false;

        // Add item to inventory
        $result = Items::EditInventoryItemID($db, $account, $ID, $newItemID);
        if ($result === false) return false;

        // Add result in logs and return new ox value
        $db->AddLog($account->ID, $device->ID, 'buyDye', "$ID/$itemID/$newItemID");
        return $account->Ox - $finalPrice;
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
        if ($attempts === false) return null;
        if ($attempts === 100) {
            $db->AddLog($account->ID, $device->ID, 'cheatSuspicion', 'User has tried more than 100 gift codes');
        }
        if ($attempts > 100) {
            return null;
        }
        $db->AddLog($account->ID, $device->ID, 'giftCodeTry', "$code");

        if (count($gift) === 0) return false;
        $rewards = $gift[0]['Rewards'];
        $available = intval($gift[0]['Available']);

        // Check if user has already used the code
        $command2 = "SELECT `ID` FROM TABLE WHERE `AccountID` = ? AND `Type` = 'giftCode' AND `Data` = ?";
        $usedGifts = $db->QueryPrepare('Logs', $command2, 'is', [ $account->ID, $code ]);
        if ($usedGifts === false || count($usedGifts) > 0) return false;

        // Check BETA code
        if (strtolower($code) === 'beta') {
            $command = 'SELECT `MaxTiper`, `Beta` FROM TABLE WHERE `Email` = ?';
            $betaTesters = $db->QueryPrepare('Contributors', $command, 's', [ $account->Email ]);
            if ($betaTesters === false || count($betaTesters) === 0) return false;
            $maxTiper = $betaTesters[0]['MaxTiper'] != 0;
            $beta = $betaTesters[0]['Beta'] != 0;

            // Simple tiper (None of both)
            $rewardOx = 250;
            $rewardItems = array('Title 18');

            // Beta tester
            if ($beta) {
                $rewardOx = 500;
                array_push($rewardItems, 'Title 16');
            }

            // Max tiper (tiper was gave more than 100e)
            if ($maxTiper) {
                $rewardOx = 1500;
                array_push($rewardItems, 'Title 17');
            }

            array_push($rewardItems, "OX $rewardOx");
            return implode(',', $rewardItems);
        } else if (!$available) {
            return false;
        }

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

    /**
     * Get price factor
     * @param DataBase $db
     * @return float|false Return price factor if success, false otherwise
     */
    public static function GetPriceFactor($db, &$error = null) {
        $command = 'SELECT `Data` FROM TABLE WHERE `ID` = "PriceFactor"';
        $result = $db->QueryPrepare('App', $command);
        if ($result === false || count($result) === 0) {
            $error = 'Error: get price factor failed';
            return false;
        }
        return floatval($result[0]['Data']);
    }
}

?>
