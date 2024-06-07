<?php

$DAYS_USERNAME_CHANGE = 29;
$MAX_WACHABLE_ADS = 10;

class Users
{
    /**
     * @param DataBase $db
     * @param Account $account
     * @param int $deviceID
     * @param object $data Array of data to add { 'activities': [], 'xp': 0, 'achievements': [], 'titleID': 0, 'birthTime': 0 }
     */
    public static function ExecQueue($db, $account, $deviceID, $data) {
        $activities = $data['activities'];
        $todoes = $data['todoes'];
        $quests = $data['quests'];
        $missions = $data['missions'];
        $avatar = $data['avatar'];
        $xp = $data['xp'];
        $stats = $data['stats'];
        $titleID = $data['titleID'];
        $birthTime = $data['birthTime'];

        if (isset($activities)) {
            Skills::AddActivities($db, $account, $activities);
        }
        if (isset($todoes)) {
            Todoes::Save($db, $account, $todoes);
        }
        if (isset($quests) && isset($quests['myquests'])) {
            MyQuests::Save($db, $account, $deviceID, $quests['myquests']);
        }
        if (isset($quests) && isset($quests['dailyquest'])) {
            DailyQuest::Save($db, $account, $quests['dailyquest']);
        }
        if (isset($missions)) {
            Missions::Set($db, $account, $deviceID, $missions);
        }
        if (isset($avatar)) {
            self::SetAvatar($db, $account, $avatar);
        }
        if (isset($xp)) {
            self::setXP($db, $account->ID, $xp);
        }
        if (isset($stats)) {
            self::setStats($db, $account, $stats);
        }
        if (isset($titleID)) {
            self::setTitle($db, $account, $titleID);
        }
        if (isset($birthTime)) {
            self::SetBirthtime($db, $account, $deviceID, $birthTime);
        }
    }

    /**
     * @param DataBase $db
     * @param Account $account
     * @param string $username
     * @return string \
     *     ok => Pseudo is changed (check if it's free)\
     *     alreadyUsed => Pseudo already used\
     *     alreadyChanged => Pseudo change failed (time)\
     *     incorrect => Pseudo is incorrect (wrong length...)\
     *     error => Others weird errors
     */
    public static function SetUsername($db, $account, $username) {
        global $DAYS_USERNAME_CHANGE;

        $oldUsername = $account->Username;
        $newUsername = ucfirst(strtolower($username));

        $nowTime = time();
        $nowText = date('Y-m-d H:i:s', $nowTime);
        $lastUsernameTime = $account->LastChangeUsername === null ? 0 : $account->LastChangeUsername;
        $delta = ($nowTime - $lastUsernameTime) / (60 * 60 * 24);

        if ($oldUsername === $newUsername) return 'error';
        if ($delta < $DAYS_USERNAME_CHANGE) return 'alreadyChanged';
        if (!UsernameIsCorrect($db, $newUsername)) return 'incorrect';
        if (!self::PseudoIsFree($db, $newUsername)) return 'alreadyUsed';

        $command = 'UPDATE TABLE SET `Username` = ?, `LastChangeUsername` = ? WHERE `ID` = ?';
        $args = [ $newUsername, $nowText, $account->ID ];
        $result_pseudo = $db->QueryPrepare('Accounts', $command, 'ssi', $args);
        if ($result_pseudo === false) ExitWithStatus('Error: Saving username failed');

        return 'ok';
    }

    /**
     * @param DataBase $db
     * @param Account $account
     * @param int $deviceID
     * @param int $birthtime Timestamp
     */
    private static function SetBirthtime($db, $account, $deviceID, $birthtime) {
        // If account lastchangebirth is from year ago, we can change birthtime
        $nowTime = time();
        $lastBirthTime = $account->LastChangeBirth === null ? 0 : $account->LastChangeBirth;
        $delta = ($nowTime - $lastBirthTime) / (60 * 60 * 24);
        if ($delta < 360) {
            // Suspicion of cheating
            $db->AddLog($account->ID, $deviceID, 'cheatSuspicion', "Try to change birthtime too often ({$account->Email})");
            ExitWithStatus('Error: you tried to change birthtime too often');
        }

        $command = 'UPDATE TABLE SET `Birthtime` = ?, `LastChangeBirth` = current_timestamp() WHERE `ID` = ?';
        $args = [ $birthtime, $account->ID ];
        $result = $db->QueryPrepare('Accounts', $command, 'ii', $args);
        if ($result === false) {
            ExitWithStatus('Error: saving birthtime failed');
        }
    }

    /**
     * @param DataBase $db
     * @param int $accountID
     * @return string New data token
     */
    public static function RefreshDataToken($db, $accountID) {
        $newDataToken = RandomString(6);
        $command = 'UPDATE TABLE SET `DataToken` = ? WHERE `ID` = ?';
        $args = [ $newDataToken, $accountID ];
        $result = $db->QueryPrepare('Accounts', $command, 'si', $args);
        if ($result === false) {
            ExitWithStatus('Error: refresh data token');
        }
        return $newDataToken;
    }

    /**
     * @param DataBase $db
     * @param Account $account
     */
    public static function GetAvatar($db, $account) {
        $command = 'SELECT * FROM TABLE WHERE `ID` = ?';
        $avatar = $db->QueryPrepare('Avatars', $command, 'i', [ $account->ID ]);
        if ($avatar === false) ExitWithStatus('Error: getting avatar failed');
        if (count($avatar) === 0) ExitWithStatus('Error: avatar not found');

        $avatar = $avatar[0];

        $avatar['sexe']      = $avatar['Sexe'];
        $avatar['skin']      = $avatar['Skin'];
        $avatar['skinColor'] = intval($avatar['SkinColor']);
        $avatar['hair']      = intval($avatar['Hair']);
        $avatar['top']       = intval($avatar['Top']);
        $avatar['bottom']    = intval($avatar['Bottom']);
        $avatar['shoes']     = intval($avatar['Shoes']);

        unset($avatar['ID']);
        unset($avatar['SkinColor']);
        unset($avatar['Hair']);
        unset($avatar['Top']);
        unset($avatar['Bottom']);
        unset($avatar['Shoes']);

        return $avatar;
    }

    /**
     * @param DataBase $db
     * @param Account $account
     * @param object $avatar
     */
    private static function SetAvatar($db, $account, $avatar) {
        $Sexe      = $avatar['sexe'];
        $Skin      = $avatar['skin'];
        $SkinColor = $avatar['skinColor'];
        $Hair      = $avatar['hair'];
        $Top       = $avatar['top'];
        $Bottom    = $avatar['bottom'];
        $Shoes     = $avatar['shoes'];

        if (!isset($Sexe, $Skin, $SkinColor, $Hair, $Top, $Bottom, $Shoes)) {
            ExitWithStatus('Error: invalid avatar');
        }

        $command = 'UPDATE TABLE SET
            `Sexe` = ?, `Skin` = ?, `SkinColor` = ?,
            `Hair` = ?, `Top` = ?, `Bottom` = ?, `Shoes` = ?
            WHERE `ID` = ?';

        $args = [
            $Sexe, $Skin, $SkinColor,
            $Hair, $Top, $Bottom, $Shoes,
            $account->ID
        ];

        $result = $db->QueryPrepare('Avatars', $command, 'ssiiiiii', $args);
        if ($result === false) {
            ExitWithStatus('Error: saving avatar failed');
        }
    }

    /**
     * @param DataBase $db
     * @param Account $account
     */
    public static function GetBuyToday($db, $account) {
        $nextDay = date('d') + 1;
        $dateNow = date('Y-m-d 00:00:00');
        $tomorrow = date("Y-m-$nextDay 00:00:00");

        $items = array();
        $command = "SELECT `Data` FROM TABLE WHERE `AccountID` = ? AND `Type` = 'buyDailyDeals' AND `Date` BETWEEN ? AND ?";
        $result = $db->QueryPrepare('Logs', $command, 'iss', [ $account->ID, $dateNow, $tomorrow ]);
        foreach ($result as $row) array_push($items, $row['Data']);

        $dyes = array();
        $command = "SELECT `Data` FROM TABLE WHERE `AccountID` = ? AND `Type` = 'buyDye' AND `Date` BETWEEN ? AND ?";
        $result = $db->QueryPrepare('Logs', $command, 'iss', [ $account->ID, $dateNow, $tomorrow ]);
        foreach ($result as $row) array_push($dyes, intval(explode('/', $row['Data'])[0]));

        return array(
            'items' => $items, 
            'dyes' => $dyes
        );
    }

    /**
     * @param DataBase $db
     * @param Account $account
     * @return int|false Number of gift codes the user has tried
     */
    public static function GetGiftCodeAttemptsToday($db, $account) {
        $nextDay = date('d') + 1;
        $dateNow = date('Y-m-d 00:00:00');
        $tomorrow = date("Y-m-$nextDay 00:00:00");

        $command = "SELECT `Data` FROM TABLE WHERE `AccountID` = ? AND `Type` = 'giftCodeTry' AND `Date` BETWEEN ? AND ?";
        $result = $db->QueryPrepare('Logs', $command, 'iss', [ $account->ID, $dateNow, $tomorrow ]);
        if ($result === false) return false;
        return count($result);
    }

    /**
     * @param DataBase $db
     * @param string $username
     * @return bool True if username is free, false otherwise
     */
    public static function PseudoIsFree($db, $username) {
        $p = ucfirst(strtolower($username));
        $command = 'SELECT * FROM TABLE WHERE `Username` = ?';
        $pseudos = $db->QueryPrepare('Accounts', $command, 's', [ $p ]);
        if ($pseudos !== false) {
            return count($pseudos) === 0;
        }
        return false;
    }

    /**
     * @param DataBase $db
     * @param int $deviceID
     * @return bool True if the device has not reached the created count limit
     */
    public static function CreationIsFree($db, $deviceID) {
        $command = 'SELECT * FROM TABLE WHERE `CreatedBy` = ?';
        $accounts = $db->QueryPrepare('Accounts', $command, 'i', [ $deviceID ]);
        if ($accounts !== false) {
            return count($accounts) < 3;
        }
        return false;
    }

    /**
     * @param DataBase $db
     * @param Account $account
     * @param int $title
     */
    public static function setTitle($db, $account, $title) {
        $command = 'UPDATE TABLE SET `Title` = ? WHERE `ID` = ?';
        $result = $db->QueryPrepare('Accounts', $command, 'si', [ $title, $account->ID ]);
        if ($result === false) {
            ExitWithStatus('Error: Saving title failed');
        }
    }

    /**
     * @param DataBase $db
     * @param int $accountID
     * @param int $xp
     */
    private static function setXP($db, $accountID, $xp) {
        $command = 'UPDATE TABLE SET `XP` = ? WHERE `ID` = ?';
        $result = $db->QueryPrepare('Accounts', $command, 'ii', [ $xp, $accountID ]);
        if ($result === false) {
            ExitWithStatus('Error: Saving XP failed');
        }
    }

    /**
     * @param DataBase $db
     * @param Account $account
     * @param object $stats
     */
    private static function setStats($db, $account, $stats) {
        $command = 'UPDATE TABLE SET `Stats` = ? WHERE `ID` = ?';
        $result = $db->QueryPrepare('Accounts', $command, 'si', [ json_encode($stats), $account->ID ]);
        if ($result === false) {
            ExitWithStatus('Error: Saving stats failed');
        }
    }

    /**
     * Get the Ox amount of the account
     * @param DataBase $db
     * @param int $accountID
     * @return int Ox amount
     */
    public static function GetOx($db, $accountID) {
        $command = 'SELECT `Ox` FROM TABLE WHERE `ID` = ?';
        $query = $db->QueryPrepare('Accounts', $command, 'i', [ $accountID ]);
        if ($query === false || count($query) === 0) {
            ExitWithStatus('Error: Getting ox failed');
        }
        $ox = intval($query[0]['Ox']);
        return $ox;
    }

    /**
     * Add or remove Ox to the account
     * @param DataBase $db
     * @param int $accountID
     * @param int $value Value to add or negative to remove
     * @return bool Success
     */
    public static function AddOx($db, $accountID, $value) {
        $command = 'UPDATE TABLE SET `Ox` = `Ox` + ? WHERE `ID` = ?';
        $result = $db->QueryPrepare('Accounts', $command, 'ii', [ $value, $accountID ]);
        return $result !== false;
    }

    /**
     * Get ad remaining to watch for today
     * @param DataBase $db
     * @param int $accountID
     */
    public static function GetAdRemaining($db, $accountID) {
        global $MAX_WACHABLE_ADS;
        $nextDay = date('d') + 1;
        $dateNow = date('Y-m-d 00:00:00');
        $tomorrow = date("Y-m-$nextDay 00:00:00");
        $command = "SELECT * FROM TABLE WHERE `AccountID` = ? AND `Type` = 'adWatched' AND `Date` BETWEEN ? AND ?";
        $result = $db->QueryPrepare('Logs', $command, 'iss', [ $accountID, $dateNow, $tomorrow ]);
        if ($result === null) {
            ExitWithStatus('Error: Getting ad remaining failed');
        }
        return $MAX_WACHABLE_ADS - count($result);
    }

    /**
     * Get number of all ads watched
     * @param DataBase $db
     * @param int $accountID
     */
    public static function GetAdWatched($db, $accountID) {
        $command = "SELECT * FROM TABLE WHERE `AccountID` = ? AND `Type` = 'adWatched'";
        $result = $db->QueryPrepare('Logs', $command, 'i', [ $accountID ]);
        if ($result === null) {
            ExitWithStatus('Error: Getting ad remaining failed');
        }
        return count($result);
    }

    /**
     * Get number of all Ox purchased
     * @param DataBase $db
     * @param int $accountID
     */
    public static function GetPurchasedCount($db, $accountID) {
        $command = "SELECT * FROM TABLE WHERE `AccountID` = ? AND `Type` = 'buyOx'";
        $result = $db->QueryPrepare('Logs', $command, 'i', [ $accountID ]);
        if ($result === null) {
            ExitWithStatus('Error: Getting purchase failed');
        }
        return count($result);
    }
}

?>
