<?php

require('./src/add.php');
require('./src/config.php');

require('./src/utils/mail.php');
require('./src/utils/utils.php');

require('./src/classes/account.php');
require('./src/classes/device.php');

require('./src/managers/items.php');
require('./src/managers/myquests.php');
require('./src/managers/nonzerodays.php');
require('./src/managers/NZD_rewards.php');
require('./src/managers/shop.php');
require('./src/managers/skills.php');
require('./src/managers/todoes.php');

require('./src/sql/app.php');
require('./src/sql/accounts.php');
require('./src/sql/achievements.php');
require('./src/sql/devices.php');
require('./src/sql/users.php');
require('./src/sql/internalData.php');
require('./src/sql/sql.php');

class Commands {
    /** @var DataBase $db */
    private $db;

    /** @var bool $tokenChecked */
    private $tokenChecked = false;

    /** @var \Account */
    private $account;

    /** @var \Device */
    private $device;

    /** @var array $output */
    private $output;

    /** @var array $enableBots */
    private $enableBots = false;

    /** @var array $data */
    private $data;

    public function __construct($data) {
        $this->db = new DataBase();
        $this->output = array('status' => 'error');

        $this->data = $data;
        $this->__checkToken();
    }

    public function __destruct() {
        unset($this->db);
    }

    private function __checkToken() {
        $token = $this->data['token'];
        if (!isset($token)) return;

        $dataFromToken = Devices::GetDataFromToken($this->db, $token);
        if ($dataFromToken === null) {
            $this->db->AddLog(0, 0, 'cheatSuspicion', "Token not found: $token");
            return;
        }

        if (!$dataFromToken['inTime']) {
            $this->output['status'] = 'tokenExpired';
            return;
        }

        $account = Accounts::GetByID($this->db, $dataFromToken['accountID']);
        if ($account === null) return;

        $device = Devices::GetByID($this->db, $dataFromToken['deviceID']);
        if ($device === null) return;

        $this->account = $account;
        $this->device = $device;
        $this->tokenChecked = true;
    }

    public function GetOutput() {
        return json_encode($this->output);
    }

    /**
     * Function to ping the server from the app
     * It also allows to store the device in the database (model + OS)
     * And to check the application version or if it is in maintenance mode
     */
    public function Ping() {
        $appData        = GetAppData($this->db);
        $versionApp     = $this->data['version'];
        $versionServer  = $appData['Version'];
        $maintenance    = $appData['Maintenance'];
        $reset          = array_key_exists('reset', $this->data);

        $deviceID = $this->data['deviceID'];
        $deviceName = $this->data['deviceName'];
        $osName = $this->data['deviceOSName'];
        $osVersion = $this->data['deviceOSVersion'];

        if (!isset($deviceID, $deviceName, $osName, $osVersion)) {
            return;
        }

        $device = Devices::Get($this->db, $deviceID, $deviceName);
        if ($device === null) {
            $device = Devices::Add($this->db, $deviceID, $deviceName, $osName, $osVersion);
            if ($device === null) {
                return;
            }
        }

        $this->output['status'] = 'ok';

        if (!isset($versionApp)) {
            return;
        } else if ($versionServer < $versionApp) {
            $this->output['status'] = 'downdate';
            // Don't return to download resources (internalData) if the app is newer than the server
        } else if ($maintenance) {
            $this->output['status'] = 'maintenance';
            return;
        } else if ($versionServer > $versionApp) {
            $this->output['status'] = 'update';
            return;
        } else if (!isset($versionApp) || $versionApp != $versionServer) {
            return;
        }

        if ($reset) {
            $command = "SELECT `ID` FROM TABLE WHERE `Devices` REGEXP '^.*(\\\\[|,)$device->ID(\\\\]|,).*$'";
            $focusAccounts = $this->db->QueryPrepare('Accounts', $command);
            if ($focusAccounts === false) return;

            foreach ($focusAccounts as $row) {
                $ID = intval($row['ID']);
                $account = Accounts::GetByID($this->db, $ID);
                $this->output["$ID"] = $account;
                Accounts::RemDevice($this->db, $device->ID, $account, 'Devices');
            }
        }

        Devices::Refresh($this->db, $device, $deviceName, $osName, $osVersion);
        $this->output['devMode'] = $device->DevMode;
    }

    /**
     * Get the status of the user account (wait mail, ban, etc.)
     */
    public function Login() {
        $deviceID = $this->data['deviceID'];
        $deviceName = $this->data['deviceName'];
        $email = $this->data['email'];
        $langKey = $this->data['lang'];
        $version = $this->data['version'];

        if (!isset($deviceID, $deviceName, $email, $langKey, $version)) {
            return;
        }

        // Get account
        $account = Accounts::GetByEmail($this->db, $email);
        if ($account === null) {
            $this->output['status'] = 'free';
            return;
        }

        // Update account version
        if ($account->Version !== $version) {
            Accounts::UpdateVersion($this->db, $account, $version);
        }

        // Get device
        $device = Devices::Get($this->db, $deviceID, $deviceName);
        if ($device === null) {
            $this->output['status'] = 'error';
            $this->output['error'] = 'Device was not created';
            return;
        }

        // Check if account has less than 5 devices
        if (!in_array($device->ID, $account->Devices) && count($account->Devices) >= 5) {
            $this->output['status'] = 'limitDevice';
            return;
        }

        // Check permissions
        $perm = Accounts::CheckDevicePermissions($device->ID, $account);
        switch ($perm) {
            case 0: // OK
                Accounts::RefreshLastDate($this->db, $account->ID);
                $this->db->AddLog($account->ID, $device->ID, 'appState', 'Login');
                $token = Devices::GeneratePrivateToken($this->db, $account->ID, $device->ID);
                if ($token === null) {
                    $this->output['error'] = 'Token was not created';
                    return;
                }

                // Account or device is banned
                if ($account->Banned || $device->Banned) {
                    $this->output['isBanned'] = true;
                }

                $this->output['token'] = $token;
                $this->output['status'] = 'ok';

                break;
            case 1: // Wait mail confirmation, remove the device after 30 minutes
                $now = time();
                $max = 30 * 60;
                $lastSendMail = $account->LastSendMail === null ? 0 : $account->LastSendMail;
                $remainTime = $max - ($now - $lastSendMail);
                if ($remainTime <= 0) {
                    $remainTime = 0;
                    Accounts::RemDevice($this->db, $device->ID, $account, 'DevicesWait');
                    $this->output['status'] = 'remDevice';
                    break;
                }
                $this->output['remainMailTime'] = $remainTime;
                $this->output['status'] = 'waitMailConfirmation';
                break;
            default: // Device isn't in account
            case -1:
                Accounts::RefreshLastDate($this->db, $account->ID);
                Accounts::AddDevice($this->db, $device->ID, $account, 'DevicesWait');
                $newToken = Devices::RefreshLoginToken($this->db, $device->ID, $account->ID);

                $sended = $this->db->SendMail($email, $device, $newToken, $account->ID, $langKey, 'add');
                if ($sended) {
                    $this->db->AddLog($account->ID, $device->ID, 'mail', $email);
                    $this->output['status'] = 'newDevice';
                } else {
                    $this->db->AddLog($account->ID, $device->ID, 'error', "[Link account] Mail not sent to: $email");
                }
                break;
        }
    }

    public function Signin() {
        $deviceID = $this->data['deviceID'];
        $deviceName = $this->data['deviceName'];
        $email = $this->data['email'];
        $username = $this->data['username'];

        if (!isset($deviceID, $deviceName, $email, $username)) {
            return;
        }

        $device = Devices::Get($this->db, $deviceID, $deviceName);
        if ($device === null) return;

        if (!Users::CreationIsFree($this->db, $device->ID)) {
            $this->output['status'] = 'limitAccount';
            return;
        }
        if (!Users::PseudoIsFree($this->db, $username)) {
            $this->output['status'] = 'pseudoUsed';
            return;
        }
        if (!UsernameIsCorrect($this->db, $username)) {
            $this->output['status'] = 'pseudoIncorrect';
            return;
        }

        $account = Accounts::Add($this->db, $device, $username, $email);
        if ($account === null) return;

        // Legion - mail bypass
        $byPass = $this->enableBots && strpos($email, 'bot-') === 0;
        if ($byPass) {
            Accounts::AddDevice($this->db, $device->ID, $account, 'Devices');
        }

        if (!$byPass) {
            $this->db->AddLog($account->ID, $device->ID, 'appState', "Signin: {$account->Email}");
        }

        $this->output['status'] = 'ok';
    }

    /**
     * Recover all the internal data of the application if it has them
     * namely: activities, quotes, icons, titles, successes etc.
     */
    public function GetInternalData() {
        $appData = GetAppData($this->db);
        $reqHashes = $this->data['hashes'];

        if (isset($reqHashes) || $reqHashes === null) {
            $appHashes = $appData['Hashes'];
            $newTables = GetNewInternalData($this->db, $reqHashes, $appHashes);

            // Return new hashes & data
            $this->output['news'] = $appData['News'];
            $this->output['tables'] = $newTables;
            $this->output['hashes'] = $appHashes;
            $this->output['music-links'] = $appData['MusicLinks'];
            $this->output['status'] = 'ok';
        }
    }

    /**
     * Retrieves user data (activities, nickname, successes, etc)
     */
    public function GetUserData() {
        if ($this->tokenChecked === false) return;
        $account = $this->account;

        $dbDataToken = $account->DataToken;
        $appDataToken = $this->data['dataToken'];
        if (!isset($appDataToken, $dbDataToken)) return;

        $userData = array();
        $userData['username']         = $account->Username;
        $userData['usernameTime']     = $account->LastChangeUsername;
        $userData['title']            = $account->Title;
        $userData['birthtime']        = $account->Birthtime;
        $userData['lastbirthtime']    = $account->LastChangeBirth;
        $userData['ox']               = $account->Ox;
        $userData['adRemaining']      = Users::GetAdRemaining($this->db, $account->ID);
        $userData['adTotalWatched']   = Users::GetAdWatched($this->db, $account->ID);
        $userData['achievements']     = Achievements::Get($this->db, $account);

        // Some data, load only if needed
        if ($appDataToken != $dbDataToken) {
            $userData['activities'] = Skills::GetActivities($this->db, $account);
            $userData['inventory'] = array(
                'avatar' => Users::GetAvatar($this->db, $account),
                'stuffs' => Items::GetInventory($this->db, $account),
                'titles' => Items::GetInventoryTitles($this->db, $account)
            );
            $userData['shop'] = array(
                'buyToday' => Users::GetBuyToday($this->db, $account)
            );
            $userData['quests'] = array(
                'myquests' => array(
                    'data' => MyQuests::Get($this->db, $account),
                    'sort' => $account->QuestsSort
                ),
                'nonzerodays' => array(
                    'data' => NonZeroDays::Get($this->db, $account)
                )
            );
            $userData['todoes'] = array(
                'data' => Todoes::Get($this->db, $account),
                'sort' => $account->TodoesSort
            );
            $userData['dataToken'] = $dbDataToken;
        }

        $this->output['data'] = $userData;
        $this->output['status'] = 'ok';
    }

    public function AddUserData() {
        $userData = $this->data['data'];
        if (!isset($userData) || !$this->tokenChecked) return;
        $account = $this->account;
        $device = $this->device;

        Users::ExecQueue($this->db, $account, $device->ID, $userData);
        $newDataToken = Users::RefreshDataToken($this->db, $account->ID);

        // Update dataToken if app is already up to date
        if ($this->data['dataToken'] === $account->DataToken) {
            $this->output['dataToken'] = $newDataToken;
        }

        $this->output['status'] = 'ok';
    }

    public function AddAchievements() {
        $achievementsID = $this->data['achievementsID'];
        if (!isset($achievementsID) || !$this->tokenChecked) return;
        $account = $this->account;
        $device = $this->device;

        $achevementsAdded = array();
        foreach ($achievementsID as $achievementID) {
            $addedSuccess = Achievements::AddByID($this->db, $account, $device->ID, $achievementID);
            if ($addedSuccess === false) {
                $this->db->AddLog($account->ID, $device->ID, 'error', "Try to add achievement $achievementID");
                continue;
            }
            array_push($achevementsAdded, $achievementID);
        }

        $this->output['status'] = 'ok';
        $this->output['newAchievements'] = Achievements::Get($this->db, $account);
    }

    public function ClaimAchievement() {
        $achievementID = $this->data['achievementID'];
        if (!isset($achievementID) || !$this->tokenChecked) return;
        $account = $this->account;
        $device = $this->device;

        $newRewards = Achievements::Claim($this->db, $account, $device->ID, $achievementID);
        if ($newRewards === false) return;

        $this->output['status'] = 'ok';
        $this->output['rewards'] = $newRewards;
    }

    public function SetUsername() {
        $newUsername = $this->data['username'];
        if (!isset($newUsername) || !$this->tokenChecked) return;
        $account = $this->account;
        $device = $this->device;

        $usernameChangeState = Users::SetUsername($this->db, $account, $newUsername);
        if ($usernameChangeState !== 'ok') return;

        $this->db->AddLog($account->ID, $device->ID, 'accountEdition', "Username changed: {$account->Username} -> {$newUsername}");
        $this->output['usernameChangeState'] = $usernameChangeState;
        $this->output['status'] = 'ok';
    }

    public function GetDailyDeals() {
        if (!$this->tokenChecked) return;
        $account = $this->account;

        $this->output['dailyDeals'] = Shop::GetDailyDeals($this->db, $account);
        $this->output['status'] = 'ok';
    }

    public function BuyDailyDeals() {
        $itemID = $this->data['itemID'];
        if (!isset($itemID) || !$this->tokenChecked) return;
        $account = $this->account;
        $device = $this->device;

        $ox = Shop::BuyDailyDeals($this->db, $account, $device, $itemID);
        if ($ox === false) return;

        $this->output['ox'] = $ox;
        $this->output['stuffs'] = Items::GetInventory($this->db, $account);
        $this->output['status'] = 'ok';
    }

    public function BuyRandomChest() {
        $rarity = $this->data['rarity'];
        if (!$this->tokenChecked || !isset($rarity)) return;
        $account = $this->account;
        $device = $this->device;

        $newItem = Shop::BuyRandomChest($this->db, $account, $device, $rarity);
        if ($newItem === false) return;

        $this->output['ox'] = $account->Ox;
        $this->output['newItem'] = $newItem;
        $this->output['status'] = 'ok';
    }

    public function BuyTargetChest() {
        $slot = $this->data['slot'];
        $rarity = $this->data['rarity'];
        if (!isset($slot, $rarity) || !$this->tokenChecked) return;
        $account = $this->account;
        $device = $this->device;

        # Valid slots
        $slots = array('hair', 'top', 'bottom', 'shoes');
        if (!in_array($slot, $slots) || $rarity < 0 || $rarity > 2) {
            $this->db->AddLog($account->ID, $device->ID, 'cheatSuspicion', "Try to buy a chest with invalid slot or rarity ($slot/$rarity)");
            return false;
        }

        $newItem = Shop::BuyTargetChest($this->db, $account, $device, $slot, $rarity);
        if ($newItem === false) return;

        $this->output['ox'] = $account->Ox;
        $this->output['newItem'] = $newItem;
        $this->output['status'] = 'ok';
    }

    public function BuyDye() {
        $ID = $this->data['ID'];
        $newID = $this->data['newID'];
        if (!isset($ID, $newID) || !$this->tokenChecked) return;
        $account = $this->account;
        $device = $this->device;

        $ox = Shop::BuyDye($this->db, $account, $device, $ID, $newID);
        if ($ox === false) return;

        $this->output['ox'] = $ox;
        $this->output['inventory'] = array(
            'avatar' => Users::GetAvatar($this->db, $account),
            'stuffs' => Items::GetInventory($this->db, $account),
            'buyToday' => Users::GetBuyToday($this->db, $account)
        );
        $this->output['status'] = 'ok';
    }

    public function SellStuff() {
        $stuffID = $this->data['stuffID'];
        if (!isset($stuffID) || !$this->tokenChecked) return;
        $account = $this->account;
        $device = $this->device;

        $ox = Items::SellStuff($this->db, $account->ID, $device->ID, $stuffID);
        if ($ox === false) return;

        $this->output['ox'] = $ox;
        $this->output['stuffs'] = Items::GetInventory($this->db, $account);
        $this->output['status'] = 'ok';
    }

    public function ClaimNonZeroDays() {
        $claimListStart = $this->data['claimListStart'];
        $dayIndexes = $this->data['dayIndexes'];
        if (!isset($claimListStart, $dayIndexes) || !$this->tokenChecked) return;

        $newItems = NonZeroDays::ClaimRewards(
            $this->db,
            $this->account,
            $this->device,
            $claimListStart,
            $dayIndexes,
            $error
        );
        if ($newItems === false || $error !== false) {
            $this->output['error'] = $error;
            return;
        }

        $this->output['ox'] = $this->account->Ox;
        $this->output['newItems'] = $newItems;
        $this->output['status'] = 'ok';
    }

    public function ClaimGlobalNotifs() {
        $notifID = $this->data['notifID'];
        if (!isset($notifID) || !$this->tokenChecked) return;

        $account = $this->account;
        $device = $this->device;

        // Check if the notification exists
        $command = "SELECT `Action`, `Data` FROM TABLE WHERE `ID` = ? AND `AccountID` = ? AND `Readed` = 0";
        $args = array($notifID, $account->ID);
        $notif = $this->db->QueryPrepare('GlobalNotifications', $command, 'ii', $args);
        if ($notif === false || count($notif) === 0) {
            $this->output['status'] = 'error';
            $this->output['error'] = 'Global notification not found';
            return;
        }

        // Check if the notification is a reward (Ox or chest)
        if ($notif[0]['Action'] !== 'reward-chest' && $notif[0]['Action'] !== 'reward-ox') {
            $this->db->AddLog($account->ID, $device->ID, 'cheatSuspicion', 'Try to claim a non-reward notification');
            $this->output['status'] = 'error';
            $this->output['error'] = 'Invalid notification';
            return;
        }

        // 1. Reward ox
        if ($notif[0]['Action'] === 'reward-ox') {
            $oxAmount = intval($notif[0]['Data']);
            Users::AddOx($this->db, $account->ID, $oxAmount);
            $this->output['ox'] = $account->Ox + $oxAmount;
            $this->output['status'] = 'ok';
            return;
        }

        // 2. Reward chest
        // Check if the rarity is valid
        $rarities = array('common', 'rare', 'epic', 'legendary');
        if (!in_array($notif[0]['Data'], $rarities)) {
            $this->output['status'] = 'error';
            $this->output['error'] = 'Invalid rarity';
            return;
        }

        $rarity = array_search($notif[0]['Data'], $rarities);

        // Update the notification as read
        $command = "UPDATE TABLE SET `Readed` = 1 WHERE `ID` = ?";
        $result = $this->db->QueryPrepare('GlobalNotifications', $command, 'i', [ $notifID ]);
        if ($result === false) {
            $this->output['status'] = 'error';
            $this->output['error'] = 'Error while updating the notification';
            return;
        }

        $newItem = Shop::BuyRandomChest($this->db, $account, $device, $rarity, true, $error);
        if ($newItem === false) {
            $this->output['status'] = 'error';
            $this->output['error'] = $error;
            return;
        }

        $this->output['newItem'] = $newItem;
        $this->output['status'] = 'ok';
    }

    public function AdWatched() {
        if (!$this->tokenChecked) return;
        $account = $this->account;
        $device = $this->device;

        if (Users::GetAdRemaining($this->db, $account->ID) <= 0) {
            // Suspicion of cheating
            $this->db->AddLog($account->ID, $device->ID, 'cheatSuspicion', 'Try to watch another ad');
            $this->output['ox'] = $account->Ox;
            $this->output['status'] = 'ok';
            return;
        }

        $oxAmount = 10;
        Users::AddOx($this->db, $account->ID, $oxAmount);

        $newOxAmount = $account->Ox + $oxAmount;
        $this->db->AddLog($account->ID, $device->ID, 'adWatched', "Account: {$account->Email}, New Ox amount: {$newOxAmount}");
        $this->output['ox'] = $account->Ox + $oxAmount;
        $this->output['status'] = 'ok';
    }

    /**
     * Add a report to the database
     */
    public function Report() {
        $reportType = $this->data['type'];
        $reportData = $this->data['data'];
        if (!isset($reportType, $reportData) || !$this->tokenChecked) return;

        $device = $this->device;
        $reportResult = AddReport($this->db, $device->ID, $reportType, $reportData);
        if ($reportResult === false) return;

        $this->output['status'] = 'ok';
    }

    /**
     * Return the date of the server to compare it with the date of the app,
     * To avoid time changes
     */
    public function GetDate() {
        $date = $this->data['date'];
        if (!isset($date)) return;
        $account = $this->account;
        $device = $this->device;

        $delta = (time() - $date) / (60 * 60);
        if (abs($delta) > 24) {
            $deltaText = round($delta, 2);
            $this->db->AddLog($account->ID, $device->ID, 'cheatSuspicion', "Time change: $deltaText");
        }

        $this->output['time'] = time();
        $this->output['status'] = 'ok';
    }

    /**
     * Check code & return rewards
     */
    public function GiftCode() {
        $code = $this->data['code'];
        if (!isset($code) || !$this->tokenChecked) return;
        $account = $this->account;
        $device = $this->device;

        $gift = Shop::CheckGiftCode($this->db, $account, $device, $code);
        if ($gift === null) return;
        if ($gift === false) {
            $this->output['gift'] = null;
            $this->output['status'] = 'ok';
            return;
        }

        $consume = Shop::ConsumeGiftCode($this->db, $account->ID, $device->ID, $code);
        if (!$consume) return;

        $rewardAdded = Achievements::ExecReward($this->db, $account, explode(',', $gift));
        if ($rewardAdded === false) return;

        $this->output['gift'] = $rewardAdded;
        $this->output['status'] = 'ok';
    }

    public function GetDevices() {
        if (!$this->tokenChecked) return;
        $account = $this->account;
        $device = $this->device;

        if ($account->Email === Accounts::ACCOUNT_TEST) {
            $this->output['devices'] = array($device->Name);
            $this->output['status'] = 'ok';
            return;
        }

        $devicesNames = array($device->Name);
        foreach ($account->Devices as $deviceID) {
            $device = Devices::GetByID($this->db, $deviceID);
            if ($device !== null && $device->ID !== $this->device->ID) {
                array_push($devicesNames, $device->Name);
            }
        }

        $this->output['devices'] = $devicesNames;
        $this->output['status'] = 'ok';
    }

    public function Disconnect() {
        if (!$this->tokenChecked) return;
        $account = $this->account;
        $device = $this->device;
        $allDevices = $this->data['allDevices'];

        // Disconnect all devices
        if (isset($this->data['allDevices']) && $allDevices) {
            Accounts::ClearDevices($this->db, $account);
            $this->db->AddLog($account->ID, $device->ID, 'appState', 'Disconnect all devices');
        }

        // Disconnect only this device
        else {
            Accounts::RemDevice($this->db, $device->ID, $account, 'Devices');
            $this->db->AddLog($account->ID, $device->ID, 'appState', 'Disconnect');
        }

        $this->output['status'] = 'ok';
    }

    /**
     * Delete account
     */
    public function DeleteAccount() {
        $email = $this->data['email'];
        $langKey = $this->data['lang'];
        if (!isset($email, $langKey) || !$this->tokenChecked) return;
        $account = $this->account;
        $device = $this->device;

        if (strpos($email, 'bot-') === 0) {
            if (!$this->enableBots) return;
            Devices::Delete($this->db, $device->ID);
            Accounts::Delete($this->db, $account->ID);
            $this->output['status'] = 'ok';
            return;
        }

        Accounts::RefreshLastDate($this->db, $account->ID);
        $newToken = Devices::RefreshLoginToken($this->db, $device->ID, $account->ID);
        $sended = $this->db->SendMail($email, $device, $newToken, $account->ID, $langKey, 'rem');

        if ($sended) {
            $this->db->AddLog($account->ID, $device->ID, 'mailSent', 'Delete account');
            $this->output['status'] = 'ok';
        }
    }

    /**
     * Check if the token is valid and return the user IDs and friends
     */
    public function CheckToken() {
        if (!$this->tokenChecked) return;
        $account = $this->account;
        $device = $this->device;

        // Account or device is banned, return nothing
        if ($account->Banned || $device->Banned) {
            return;
        }

        $data = array(
            'deviceID' => $device->ID,
            'accountID' => $account->ID,
            'username' => $account->Username
        );

        $this->output['data'] = $data;
        $this->output['status'] = 'ok';
    }
}

?>
