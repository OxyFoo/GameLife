<?php

require('./src/add.php');
require('./src/config.php');

require('./src/utils/mail.php');
require('./src/utils/utils.php');

require('./src/classes/account.php');
require('./src/classes/device.php');

require('./src/managers/items.php');
require('./src/managers/shop.php');
require('./src/managers/skills.php');
require('./src/managers/tasks.php');

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
        if ($dataFromToken === null) return;

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
        $appData = GetAppData($this->db);
        $versionApp    = $this->data['version'];
        $versionServer = $appData['Version'];
        $maintenance   = $appData['Maintenance'];
        $reset         = array_key_exists('reset', $this->data);

        if (!isset($versionApp)) {
            return;
        } else if ($versionServer < $versionApp) {
            $this->output['status'] = 'downdate';
            return;
        } else if ($versionServer > $versionApp) {
            $this->output['status'] = 'update';
            return;
        } else if ($maintenance) {
            $this->output['status'] = 'maintenance';
            return;
        } else if (!isset($versionApp) || $versionApp != $versionServer) {
            return;
        }

        $deviceIdentifier = $this->data['deviceID'];
        $deviceName = $this->data['deviceName'];
        $osName = $this->data['deviceOSName'];
        $osVersion = $this->data['deviceOSVersion'];

        if (!isset($deviceIdentifier, $deviceName, $osName, $osVersion)) {
            return;
        }

        $device = Devices::Get($this->db, $deviceIdentifier, $deviceName);
        if ($device === null) {
            $device = Devices::Add($this->db, $deviceIdentifier, $deviceName, $osName, $osVersion);
        }
        if ($device === null) {
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
        $this->output['status'] = 'ok';
    }

    /**
     * Get the status of the user account (wait mail, ban, etc.)
     */
    public function Login() {
        $deviceIdentifier = $this->data['deviceID'];
        $deviceName = $this->data['deviceName'];
        $email = $this->data['email'];
        $langKey = $this->data['lang'];

        if (!isset($deviceIdentifier, $deviceName, $email, $langKey)) {
            return;
        }

        $account = Accounts::GetByEmail($this->db, $email);
        if ($account === null) {
            $this->output['status'] = 'free';
            return;
        }

        $device = Devices::Get($this->db, $deviceIdentifier, $deviceName);
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

                $this->output['token'] = $token;
                $this->output['status'] = 'ok';

                $isBanned = $account->Banned || $device->Banned;
                if ($isBanned) $this->output['status'] = 'ban';
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
                $newToken = Devices::RefreshMailToken($this->db, $device->ID, $account->ID);

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
        $deviceIdentifier = $this->data['deviceID'];
        $deviceName = $this->data['deviceName'];
        $email = $this->data['email'];
        $username = $this->data['username'];

        if (!isset($deviceIdentifier, $deviceName, $email, $username)) {
            return;
        }

        $device = Devices::Get($this->db, $deviceIdentifier, $deviceName);
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

        $account = Accounts::Add($this->db, $username, $email, $device->ID);
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
        if (isset($account->Username, $account->Title)) {
            $userData['username']         = $account->Username;
            $userData['usernameTime']     = $account->LastChangeUsername;
            $userData['title']            = $account->Title;
            $userData['birthtime']        = $account->Birthtime;
            $userData['lastbirthtime']    = $account->LastChangeBirth;
            $userData['ox']               = $account->Ox;
            $userData['tasksSort']        = $account->TasksSort;
            $userData['tasksTotal']       = $account->TasksTotal;
            $userData['adRemaining']      = Users::GetAdRemaining($this->db, $account->ID);
            $userData['adTotalWatched']   = Users::GetAdWatched($this->db, $account->ID);
            $userData['achievements']     = Achievements::Get($this->db, $account);
        }

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
            $userData['tasks'] = Tasks::GetTasks($this->db, $account);
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

        $rewards = array();
        foreach ($achievementsID as $achievementID) {
            $newRewards = Achievements::AddByID($this->db, $account, $achievementID, 'OK');
            if ($newRewards === false) {
                $this->db->AddLog($account->ID, $device->ID, 'error', "Try to add achievement $achievementID");
                continue;
            }
            array_push($rewards, $newRewards);
        }

        $this->output['status'] = 'ok';
        $this->output['rewards'] = join(',', $rewards);
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

        $newItems = Shop::BuyRandomChest($this->db, $account, $device, $rarity);
        if ($newItems === false) return;

        $this->output['ox'] = $account->Ox;
        $this->output['newItems'] = $newItems;
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

        $newItems = Shop::BuyTargetChest($this->db, $account, $device, $slot, $rarity);
        if ($newItems === false) return;

        $this->output['ox'] = $account->Ox;
        $this->output['newItems'] = $newItems;
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
        $newToken = Devices::RefreshMailToken($this->db, $device->ID, $account->ID);
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

        $data = array(
            'deviceID' => $device->ID,
            'accountID' => $account->ID
            // TODO - return friends (servTCP ?)
            //'friends' => $account->Friends
        );

        $this->output['data'] = $data;
        $this->output['status'] = 'ok';
    }
}

?>