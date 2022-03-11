<?php

    require('./src/add.php');
    require('./src/config.php');

    require('./src/functions/mail.php');
    require('./src/functions/functions.php');

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
                    if ($device === NULL) {
                        $device = Devices::Add($this->db, $deviceIdentifier, $deviceName, $osName, $osVersion);
                    }
                    if ($device === NULL) {
                        $this->output['status'] = 'error';
                    } else {
                        Devices::Refresh($this->db, $device, $deviceName, $osName, $osVersion);
                        Devices::AddStatistic($this->db, $device);
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
            $device = Devices::Get($this->db, $deviceIdentifier, $deviceName);

            if ($account === NULL) {
                $this->output['status'] = 'free';
                return;
            }

            // Check permissions
            $perm = Accounts::CheckDevicePermissions($device->ID, $account);
            switch ($perm) {
                case 0: // OK
                    $accountID = $account['ID'];
                    Accounts::RefreshLastDate($this->db, $accountID);
                    $this->output['token'] = Devices::GeneratePrivateToken($this->db, $accountID, $device->ID);
                    $this->output['status'] = 'ok';

                    $isBanned = $account['Banned'] != 0 || $device->Banned;
                    if ($isBanned) $this->output['status'] = 'ban';
                    break;
                case 1: // Wait mail confirmation
                    // Remove the device after 30 minutes
                    $remainMailTime = strtotime($account['LastSendMail']);
                    $now = time();
                    $max = 30 * 60;
                    $remainTime = $max - ($now - $remainMailTime);
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
                    $accountID = $account['ID'];
                    Accounts::RefreshLastDate($this->db, $accountID);
                    Accounts::AddDevice($this->db, $device->ID, $account, 'DevicesWait');
                    $newToken = Devices::RefreshMailToken($this->db, $device->ID, $accountID);

                    $sended = $this->db->SendMail($email, $device, $newToken, $accountID, $langKey, 'add');
                    if ($sended) $this->output['status'] = 'newDevice';
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

            if (!Users::PseudoIsFree($this->db, $username)) {
                $this->output['status'] = 'pseudoUsed';
                return;
            }
            if (!UsernameIsCorrect($username)) {
                $this->output['status'] = 'pseudoIncorrect';
                return;
            }

            $account = Accounts::Add($this->db, $username, $email);
            if ($account === NULL) return;

            // Legion - mail bypass
            if (strpos($email, 'bot-') === 0) {
                if (!$this->enableBots) return;
                $device = Devices::Get($this->db, $deviceIdentifier, $deviceName);
                $deviceID = intval($device['ID']);
                Accounts::AddDevice($this->db, $deviceID, $account, 'Devices');
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

            if (isset($reqHashes) || $reqHashes === NULL) {
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
            if ($dataFromToken === NULL) return;
            if (!$dataFromToken['inTime']) {
                $this->output['status'] = 'tokenExpired';
                return;
            }

            $accountID = $dataFromToken['accountID'];
            $account = Accounts::GetByID($this->db, $accountID);
            if ($account === NULL) return;

            $dbDataToken = $account['DataToken'];
            $appDataToken = $this->data['dataToken'];
            if (!isset($appDataToken, $dbDataToken)) return;

            $username = $account['Username'];
            $usernameTime = $account['LastChangeUsername'];
            $title = intval($account['Title']);
            $birthtime = $account['Birthtime'];
            $lastbirthtime = $account['LastChangeBirth'];
            $ox = intval($account['Ox']);

            if ($usernameTime !== NULL) $usernameTime = strtotime($usernameTime);
            if ($birthtime !== NULL) $birthtime = intval($birthtime);
            if ($lastbirthtime !== NULL) $lastbirthtime = strtotime($lastbirthtime);

            $userData = array();
            if (isset($username, $title)) {
                $userData['username'] = $username;
                $userData['usernameTime'] = $usernameTime;
                $userData['title'] = $title;
                $userData['birthtime'] = $birthtime;
                $userData['lastbirthtime'] = $lastbirthtime;
                $userData['ox'] = $ox;
            }

            if ($appDataToken != $dbDataToken) {
                $userData['activities'] = Users::GetActivities($this->db, $account);
                $userData['dataToken'] = $dbDataToken;
            }

            $achievements = json_decode($account['Achievements'], true);
            $userData['achievements'] = $achievements;

            $this->output['data'] = $userData;
            $this->output['status'] = 'ok';
        }

        public function AddUserData() {
            $token = $this->data['token'];
            $userData = $this->data['data'];
            if (!isset($token, $userData)) return;

            $dataFromToken = Devices::GetDataFromToken($this->db, $token);
            if ($dataFromToken === NULL) return;
            if (!$dataFromToken['inTime']) {
                $this->output['status'] = 'tokenExpired';
                return;
            }

            $accountID = $dataFromToken['accountID'];
            $account = Accounts::GetByID($this->db, $accountID);
            if ($account === NULL) return;
            $dbDataToken = $account['DataToken'];

            Users::ExecQueue($this->db, $account, $userData);
            $newDataToken = Users::RefreshDataToken($this->db, $account);

            if ($this->data['dataToken'] === $dbDataToken) {
                $this->output['dataToken'] = $newDataToken;
            }

            $this->output['status'] = 'ok';
        }

        public function SetUsername() {
            $token = $this->data['token'];
            $newUsername = $this->data['username'];
            if (!isset($token, $newUsername)) return;

            $dataFromToken = Devices::GetDataFromToken($this->db, $token);
            if ($dataFromToken === NULL) return;
            if (!$dataFromToken['inTime']) {
                $this->output['status'] = 'tokenExpired';
                return;
            }

            $accountID = $dataFromToken['accountID'];
            $account = Accounts::GetByID($this->db, $accountID);
            if ($account === NULL) return;

            $usernameChangeState = Users::SetUsername($this->db, $account, $newUsername);

            $this->output['usernameChangeState'] = $usernameChangeState;
            $this->output['status'] = 'ok';
        }

        public function AdWatched() {
            $token = $this->data['token'];
            if (!isset($token)) return;

            // TODO - Check if there is ad to watch & return remain

            $dataFromToken = Devices::GetDataFromToken($this->db, $token);
            if ($dataFromToken === NULL) return;
            if (!$dataFromToken['inTime']) {
                $this->output['status'] = 'tokenExpired';
                return;
            }
            $accountID = $dataFromToken['accountID'];

            $oxAmount = 10;
            Users::AddOx($this->db, $accountID, $oxAmount);
            $ox = Users::GetOx($this->db, $accountID);

            $this->output['ox'] = $ox;
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
            if ($dataFromToken === NULL) return;
            if (!$dataFromToken['inTime']) {
                $this->output['status'] = 'tokenExpired';
                return;
            }
            $deviceID = $dataFromToken['deviceID'];

            $reportResult = AddReport($this->db, $deviceID, $reportType, $reportData);
            if ($reportResult !== TRUE) return;

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
            if ($dataFromToken === NULL) return;
            if (!$dataFromToken['inTime']) {
                $this->output['status'] = 'tokenExpired';
                return;
            }

            $deviceID = $dataFromToken['deviceID'];
            $accountID = $dataFromToken['accountID'];
            $account = Accounts::GetByID($this->db, $accountID);
            if ($account === NULL) return;

            Accounts::RemDevice($this->db, $deviceID, $account, 'Devices');

            $this->output['status'] = 'ok';
        }

        public function DeleteAccount() {
            $token = $this->data['token'];
            $email = $this->data['email'];
            $langKey = $this->data['lang'];
            if (!isset($token, $email, $langKey)) return;

            $dataFromToken = Devices::GetDataFromToken($this->db, $token);
            if ($dataFromToken === NULL) return;
            if (!$dataFromToken['inTime']) {
                $this->output['status'] = 'tokenExpired';
                return;
            }
            $deviceID = $dataFromToken['deviceID'];
            $accountID = $dataFromToken['accountID'];
            $account = Accounts::GetByID($this->db, $accountID);
            if ($account === NULL) return;
            $device = Devices::GetByID($this->db, $deviceID);
            if ($device === NULL) return;

            if (strpos($email, 'bot-') === 0) {
                if (!$this->enableBots) return;
                Devices::Delete($this->db, $deviceID);
                Accounts::Delete($this->db, $accountID);
                $this->output['status'] = 'ok';
                return;
            }

            Accounts::RefreshLastDate($this->db, $accountID);
            $newToken = Devices::RefreshMailToken($this->db, $deviceID, $accountID);
            $sended = $this->db->SendMail($email, $device, $newToken, $accountID, $langKey, 'rem');
            if (!$sended) return;

            $this->output['status'] = 'ok';
        }

        public function CheckToken() {
            $token = $this->data['token'];
            if (!isset($token)) return;

            $dataFromToken = Devices::GetDataFromToken($this->db, $token);
            if ($dataFromToken === NULL) return;
            if (!$dataFromToken['inTime']) {
                $this->output['status'] = 'tokenExpired';
                return;
            }
            $deviceID = $dataFromToken['deviceID'];
            $accountID = $dataFromToken['accountID'];
            $account = Accounts::GetByID($this->db, $accountID);
            if ($account === NULL) return;

            $data = array(
                'deviceID' => $deviceID,
                'accountID' => $accountID,
                'friends' => $account['Friends']
            );

            $this->output['data'] = $data;
            $this->output['status'] = 'ok';
        }
    }

?>