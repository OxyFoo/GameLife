<?php

    require('./src/add.php');
    require('./src/config.php');

    require('./src/functions/mail.php');
    require('./src/functions/functions.php');

    require('./src/classes/account.php');
    require('./src/classes/device.php');

    require('./src/sql/accounts.php');
    require('./src/sql/app.php');
    require('./src/sql/devices.php');
    require('./src/sql/users.php');
    require('./src/sql/internalData.php');
    require('./src/sql/sql.php');

    class Commands {
        /** @var DataBase $db */
        private $db;

        public function __construct($data) {
            $this->data = $data;

            $this->db = new DataBase();
            $this->output = array("status" => "error");
            $this->enableBots = false;
        }

        public function __destruct() {
            unset($this->db);
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
            $version = $this->data['version'];
            $serverVersion = $appData['Version'];
            if (isset($version) && $version == $serverVersion) {
                $deviceIdentifier = $this->data['deviceID'];
                $deviceName = $this->data['deviceName'];
                $osName = $this->data['deviceOSName'];
                $osVersion = $this->data['deviceOSVersion'];

                if (isset($deviceIdentifier, $deviceName, $osName, $osVersion)) {
                    $device = Devices::Get($this->db, $deviceIdentifier, $deviceName);
                    if ($device === null) {
                        $device = Devices::Add($this->db, $deviceIdentifier, $deviceName, $osName, $osVersion);
                    }
                    if ($device === null) {
                        $this->output['status'] = 'error';
                    } else {
                        Devices::Refresh($this->db, $device, $deviceName, $osName, $osVersion);
                        $this->output['status'] = 'ok';
                    }
                }
            } else if ($serverVersion < $appData) {
                $this->output['status'] = 'downdate';
            } else if ($serverVersion > $appData) {
                $this->output['status'] = 'update';
            } else if ($appData["Maintenance"]) {
                $this->output['status'] = 'maintenance';
            }
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
                    $this->db->AddStatistic($device->ID, 'appState', "Login: {$account->Email}");
                    $this->output['token'] = Devices::GeneratePrivateToken($this->db, $account->ID, $device->ID);
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
                        $this->db->AddStatistic($device->ID, 'mailSent', "Link account: $email");
                        $this->output['status'] = 'newDevice';
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
            if (!UsernameIsCorrect($username)) {
                $this->output['status'] = 'pseudoIncorrect';
                return;
            }

            $account = Accounts::Add($this->db, $username, $email, $device->ID);
            if ($account === null) return;

            // Legion - mail bypass
            if (strpos($email, 'bot-') === 0 && $this->enableBots) {
                Accounts::AddDevice($this->db, $device->ID, $account, 'Devices');
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

            $dbDataToken = $account->DataToken;
            $appDataToken = $this->data['dataToken'];
            if (!isset($appDataToken, $dbDataToken)) return;

            $userData = array();
            if (isset($account->Username, $account->Title)) {
                $userData['username'] = $account->Username;
                $userData['usernameTime'] = $account->LastChangeUsername;
                $userData['title'] = $account->Title;
                $userData['birthtime'] = $account->Birthtime;
                $userData['lastbirthtime'] = $account->LastChangeBirth;
                $userData['ox'] = $account->Ox;
                $userData['adRemaining'] = $account->AdRemaining;
                $userData['achievements'] = $account->Achievements;
            }

            // Some data, load only if needed
            if ($appDataToken != $dbDataToken) {
                $userData['activities'] = Users::GetActivities($this->db, $account);
                $userData['tasks'] = Users::GetTasks($this->db, $account);
                $userData['dataToken'] = $dbDataToken;
            }

            $this->output['data'] = $userData;
            $this->output['status'] = 'ok';
        }

        public function AddUserData() {
            $token = $this->data['token'];
            $userData = $this->data['data'];
            if (!isset($token, $userData)) return;

            $dataFromToken = Devices::GetDataFromToken($this->db, $token);
            if ($dataFromToken === null) return;
            if (!$dataFromToken['inTime']) {
                $this->output['status'] = 'tokenExpired';
                return;
            }

            $deviceID = $dataFromToken['deviceID'];
            $account = Accounts::GetByID($this->db, $dataFromToken['accountID']);
            if ($account === null) return;

            Users::ExecQueue($this->db, $account, $deviceID, $userData);
            $newDataToken = Users::RefreshDataToken($this->db, $account);

            // Update dataToken if app is already up to date
            if ($this->data['dataToken'] === $account->DataToken) {
                $this->output['dataToken'] = $newDataToken;
            }

            $this->output['status'] = 'ok';
        }

        public function SetUsername() {
            $token = $this->data['token'];
            $newUsername = $this->data['username'];
            if (!isset($token, $newUsername)) return;

            $dataFromToken = Devices::GetDataFromToken($this->db, $token);
            if ($dataFromToken === null) return;
            if (!$dataFromToken['inTime']) {
                $this->output['status'] = 'tokenExpired';
                return;
            }

            $deviceID = $dataFromToken['deviceID'];
            $account = Accounts::GetByID($this->db, $dataFromToken['accountID']);
            if ($account === null) return;

            $usernameChangeState = Users::SetUsername($this->db, $account, $newUsername);

            if ($usernameChangeState === 'ok') {
                $this->db->AddStatistic($deviceID, 'accountEdition', "Username changed: {$account->Username} -> {$newUsername} ({$account->Email})");
            }
            $this->output['usernameChangeState'] = $usernameChangeState;
            $this->output['status'] = 'ok';
        }

        public function AdWatched() {
            $token = $this->data['token'];
            if (!isset($token)) return;

            $dataFromToken = Devices::GetDataFromToken($this->db, $token);
            if ($dataFromToken === null) return;
            if (!$dataFromToken['inTime']) {
                $this->output['status'] = 'tokenExpired';
                return;
            }

            $oxAmount = 10;
            $deviceID = $dataFromToken['deviceID'];
            $accountID = $dataFromToken['accountID'];
            $account = Accounts::GetByID($this->db, $accountID);
            if ($account === null) return;

            if ($account->AdRemaining === 0) {
                // Suspicion of cheating
                $this->db->AddStatistic($deviceID, 'cheatSuspicion', "Try to watch another ad ({$account->Email})");
                $this->output['ox'] = $account->Ox;
                $this->output['status'] = 'ok';
                return;
            }

            Users::DecrementAdRemaining($this->db, $accountID);
            Users::AddOx($this->db, $accountID, $oxAmount);

            $newOxAmount = $account->Ox + $oxAmount;
            $this->db->AddStatistic($deviceID, 'adWatched', "Account: {$account->Email}, New Ox amount: {$newOxAmount}");
            $this->output['ox'] = $account->Ox + $oxAmount;
            $this->output['status'] = 'ok';
        }

        /**
         * Add a report to the database
         */
        public function AddReport() {
            $token = $this->data['token'];
            $reportType = $this->data['type'];
            $reportData = $this->data['data'];
            if (!isset($token, $reportType, $reportData)) return;

            $dataFromToken = Devices::GetDataFromToken($this->db, $token);
            if ($dataFromToken === null) return;
            if (!$dataFromToken['inTime']) {
                $this->output['status'] = 'tokenExpired';
                return;
            }

            $deviceID = $dataFromToken['deviceID'];
            $reportResult = AddReport($this->db, $deviceID, $reportType, $reportData);
            if ($reportResult === false) return;

            $this->output['status'] = 'ok';
        }

        /**
         * Return the date of the server to compare it with the date of the app,
         * To avoid time changes
         */
        public function GetDate() {
            $this->output['time'] = time();
        }

        public function Disconnect() {
            $token = $this->data['token'];
            if (!isset($token)) return;

            $dataFromToken = Devices::GetDataFromToken($this->db, $token);
            if ($dataFromToken === null) return;
            if (!$dataFromToken['inTime']) {
                $this->output['status'] = 'tokenExpired';
                return;
            }

            $deviceID = $dataFromToken['deviceID'];
            $accountID = $dataFromToken['accountID'];
            $account = Accounts::GetByID($this->db, $accountID);
            if ($account === null) return;

            Accounts::RemDevice($this->db, $deviceID, $account, 'Devices');

            $this->db->AddStatistic($deviceID, 'appState', "Disconnect: {$account->Email}");
            $this->output['status'] = 'ok';
        }

        /**
         * Delete account
         */
        public function DeleteAccount() {
            $token = $this->data['token'];
            $email = $this->data['email'];
            $langKey = $this->data['lang'];
            if (!isset($token, $email, $langKey)) return;

            $dataFromToken = Devices::GetDataFromToken($this->db, $token);
            if ($dataFromToken === null) return;
            if (!$dataFromToken['inTime']) {
                $this->output['status'] = 'tokenExpired';
                return;
            }

            $device = Devices::GetByID($this->db, $dataFromToken['deviceID']);
            $account = Accounts::GetByID($this->db, $dataFromToken['accountID']);
            if ($device === null || $account === null) return;

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
                $this->db->AddStatistic($device->ID, 'mailSent', "Delete account: $email");
                $this->output['status'] = 'ok';
            }
        }

        /**
         * Check if the token is valid and return the user IDs and friends
         */
        public function CheckToken() {
            $token = $this->data['token'];
            if (!isset($token)) return;

            $dataFromToken = Devices::GetDataFromToken($this->db, $token);
            if ($dataFromToken === null) return;
            if (!$dataFromToken['inTime']) {
                $this->output['status'] = 'tokenExpired';
                return;
            }
            $deviceID = $dataFromToken['deviceID'];
            $accountID = $dataFromToken['accountID'];
            $account = Accounts::GetByID($this->db, $accountID);
            if ($account === null) return;

            $data = array(
                'deviceID' => $deviceID,
                'accountID' => $accountID,
                'friends' => $account->Friends
            );

            $this->output['data'] = $data;
            $this->output['status'] = 'ok';
        }
    }

?>