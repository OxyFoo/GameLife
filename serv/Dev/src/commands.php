<?php

    require('./src/add.php');
    require('./src/config.php');

    require('./src/functions/mail.php');
    require('./src/functions/functions.php');

    require('./src/sql/account.php');
    require('./src/sql/app.php');
    require('./src/sql/device.php');
    require('./src/sql/user.php');
    require('./src/sql/internalData.php');
    require('./src/sql/sql.php');

    class Commands {
        public function __construct($data) {
            $this->data = $data;
            $this->db = new DataBase();
            $this->output = array("status" => "fail");
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
                    $device = Device::Get($this->db, $deviceIdentifier, $deviceName);
                    if ($device === NULL) {
                        $device = Device::Add($this->db, $deviceIdentifier, $deviceName, $osName, $osVersion);
                    }
                    if ($device === NULL) {
                        $this->output['status'] = 'error';
                    } else {
                        Device::Refresh($this->db, $device, $deviceName, $osName, $osVersion);
                        Device::AddStatistic($this->db, $device);
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
            $lang = $this->data['lang'];

            if (isset($deviceIdentifier, $deviceName, $email, $lang)) {
                $account = Account::GetByEmail($this->db, $email);
                $device = Device::Get($this->db, $deviceIdentifier, $deviceName);

                if ($account === NULL) {
                    $this->output['status'] = 'free';
                    return;
                }

                // Check permissions
                $deviceID = intval($device['ID']);
                $perm = Account::CheckDevicePermissions($deviceID, $account);
                switch ($perm) {
                    case 0: // OK
                        if ($account['Banned'] != 0) {
                            $this->output['status'] = 'ban';
                            break;
                        }
                        $accountID = $account['ID'];
                        Account::RefreshLastDate($this->db, $accountID);
                        $this->output['token'] = Device::GeneratePrivateToken($this->db, $accountID, $deviceID);
                        $this->output['status'] = 'ok';
                        break;
                    case 1: // Wait mail confirmation
                        $this->output['status'] = 'waitMailConfirmation';
                        break;
                    default: // Device isn't in account
                    case -1:
                        $accountID = $account['ID'];
                        Account::RefreshLastDate($this->db, $accountID);
                        Account::AddDevice($this->db, $deviceID, $account, 'DevicesWait');
                        Device::RefreshToken($this->db, $deviceID);
                        $this->db->SendMail($email, $deviceID, $accountID, $lang);
                        $this->output['status'] = 'newDevice';
                        break;
                }
            }
        }

        public function Signin() {
            $deviceIdentifier = $this->data['deviceID'];
            $deviceName = $this->data['deviceName'];
            $email = $this->data['email'];
            $username = $this->data['username'];
            $lang = $this->data['lang'];

            if (isset($deviceIdentifier, $deviceName, $email, $username, $lang)) {
                // Check username
                    // Return pseudoUsed
                // Add account
                // Add deviceID in confirmed devices in account
                // Return ok
                if (User::PseudoIsFree($this->db, $username)) {
                    $account = Account::Add($this->db, $username, $email);
                    if ($account === NULL) {
                        $this->output['status'] = 'error';
                    } else {
                        $this->output['status'] = 'ok';
                    }
                } else {
                    $this->output['status'] = 'pseudoUsed';
                }
            }
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

            $dataFromToken = Device::GetDataFromToken($this->db, $token);
            if ($dataFromToken === NULL) return;
            if (!$dataFromToken['inTime']) {
                $this->output['status'] = 'tokenExpired';
                return;
            }

            $accountID = $dataFromToken['accountID'];
            $account = Account::GetByID($this->db, $accountID);
            if ($account === NULL) return;

            $dbDataToken = $account['DataToken'];
            $appDataToken = $this->data['dataToken'];
            if (!isset($appDataToken, $dbDataToken)) return;

            $username = $account['Username'];
            $usernameTime = $account['LastChangeUsername'];
            $title = intval($account['Title']);
            $birthtime = $account['Birthtime'];

            if ($usernameTime !== NULL) $usernameTime = strtotime($usernameTime);
            if ($birthtime !== NULL) $birthtime = intval($birthtime);

            $userData = array();
            if (isset($username, $title)) {
                $userData['username'] = $username;
                $userData['usernameTime'] = $usernameTime;
                $userData['title'] = $title;
                $userData['birthtime'] = $birthtime;
                $userData['lastbirthtime'] = $birthtime;
            }

            if ($appDataToken != $dbDataToken) {
                //$activities = $this->db->Decrypt($account['Activities']);
                $activities = $account['Activities'];
                $userData['activities'] = json_decode($activities, true);
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

            $dataFromToken = Device::GetDataFromToken($this->db, $token);
            if ($dataFromToken === NULL) return;
            if (!$dataFromToken['inTime']) {
                $this->output['status'] = 'tokenExpired';
                return;
            }

            $accountID = $dataFromToken['accountID'];
            $account = Account::GetByID($this->db, $accountID);
            if ($account === NULL) return;
            $dbDataToken = $account['DataToken'];

            User::ExecQueue($this->db, $account, $userData);
            $newDataToken = User::RefreshDataToken($this->db, $account);

            // TODO - Save XP

            if ($this->data['dataToken'] === $dbDataToken) {
                $this->output['dataToken'] = $newDataToken;
            }

            $this->output['status'] = 'ok';
        }

        public function SetUsername() {
            $token = $this->data['token'];
            $newUsername = $this->data['username'];
            if (!isset($token, $newUsername)) return;

            $dataFromToken = Device::GetDataFromToken($this->db, $token);
            if ($dataFromToken === NULL) return;
            if (!$dataFromToken['inTime']) {
                $this->output['status'] = 'tokenExpired';
                return;
            }

            $accountID = $dataFromToken['accountID'];
            $account = Account::GetByID($this->db, $accountID);
            if ($account === NULL) return;

            $usernameChangeState = User::SetUsername($this->db, $account, $newUsername);

            $this->output['usernameChangeState'] = $usernameChangeState;
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

            $dataFromToken = Device::GetDataFromToken($this->db, $token);
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

            $dataFromToken = Device::GetDataFromToken($this->db, $token);
            if ($dataFromToken === NULL) return;
            if (!$dataFromToken['inTime']) {
                $this->output['status'] = 'tokenExpired';
                return;
            }

            $deviceID = $dataFromToken['deviceID'];
            $accountID = $dataFromToken['accountID'];
            $account = Account::GetByID($this->db, $accountID);
            if ($account === NULL) return;

            Account::RemDevice($this->db, $deviceID, $account, 'Devices');

            $this->output['status'] = 'ok';
        }

    }

?>