<?php

    require('./src/add.php');
    require('./src/config.php');

    require('./src/functions/mail.php');
    require('./src/functions/functions.php');

    require('./src/sql/account.php');
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
         * Retrieve the application version and the database hash
         * (Hash that is updated if old)
         */
        private function GetAppData() {
            $appData = array('Version' => 0, 'DBHash' => '');
            $app = $this->db->QueryArray("SELECT * FROM `App`");
            $lastHashRefresh = 0;

            if ($app !== FALSE) {
                for ($i = 0; $i < count($app); $i++) {
                    $index = $app[$i]['ID'];
                    $value = $app[$i]['Data'];
                    $date = $app[$i]['Date'];
                    if ($index === "Version") {
                        $appData['Version'] = $value;
                    } else if ($index === "DBHash") {
                        $appData["DBHash"] = $value;
                        $lastHashRefresh = MinutesFromDate($date);
                    } else if ($index === "Maintenance") {
                        $appData["Maintenance"] = $value !== '0';
                    }
                }
            }

            if ($lastHashRefresh > 60) {
                // Refresh database hash
                $lang = $this->data['lang'];
                $db_all = GetAllInternalData($this->db, $lang);

                $data = json_encode($db_all);
                $newHash = hash('md5', $data);

                // Refresh `App` in DB
                $result = $this->db->Query("UPDATE `App` SET `Date` = current_timestamp(), `Data` = '$newHash' WHERE `ID` = 'DBHash'");
                if ($newHash !== $appData['DBHash'] && $result === TRUE) {
                    $appData['DBHash'] = $newHash;
                }
            }

            return $appData;
        }

        /**
         * Function to ping the server from the app
         * It also allows to store the device in the database (model + OS)
         * And to check the application version
         */
        public function Ping() {
            $appData = $this->GetAppData();
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
                        Device::Refresh($this->db, $device, $osName, $osVersion);
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
                $deviceID = $device['ID'];
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
            $pseudo = $this->data['pseudo'];
            $lang = $this->data['lang'];

            if (isset($deviceIdentifier, $deviceName, $email, $pseudo, $lang)) {
                // Check pseudo
                    // Return pseudoUsed
                // Add account
                // Add deviceID in confirmed devices in account
                // Return ok
                if (User::pseudoIsFree($this->db, $pseudo)) {
                    $account = Account::Add($this->db, $pseudo, $email);
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
            $lang = $this->data['lang'];
            $hash = $this->data['hash'];
            $appData = $this->GetAppData();

            if (!empty($lang) && isset($hash)) {
                $hash_check = $appData['DBHash'];

                // Send all data or just 'same'
                if ($hash != $hash_check) {
                    $this->output['tables'] = GetAllInternalData($this->db, $lang);
                    $this->output['hash'] = $hash_check;
                    $this->output['status'] = 'ok';
                } else {
                    $this->output = array('status' => 'same');
                }
            }
        }

        /**
         * Retrieves user data (activities, nickname, successes, etc)
         */
        public function GetUserData() {
            $token = $this->data['token'];
            if (isset($token)) {
                $dataFromToken = Device::GetDataFromToken($this->db, $token);
                $accountID = $dataFromToken['accountID'];
    
                if (isset($accountID)) {
                    $account = Account::GetByID($this->db, $accountID);
                    $username = $account['Username'];
                    $title = $account['Title'];
                    $userData = $this->db->Decrypt($account['Data']);
                    $solvedAchievements = $account['SolvedAchievements'];
                    if (isset($userData, $username, $title, $solvedAchievements)) {
                        $userData = json_decode($userData, true);
                        $userData['pseudo'] = $username;
                        $userData['title'] = $title;
                        $userData['solvedAchievements'] = $solvedAchievements !== "" ? array_map('intval', explode(',', $solvedAchievements)) : array();
                        $userData = json_encode($userData);
                        $this->output['data'] = $userData;
                        $this->output['status'] = 'ok';
                    }
                }
            }
        }

        public function AddUserData() {
            $token = $this->data['token'];
            $userData = $this->data['data'];
            if (isset($token, $userData)) {
                $dataFromToken = Device::GetDataFromToken($this->db, $token);
                $accountID = $dataFromToken['accountID'];
    
                if (isset($accountID)) {
                    $account = Account::GetByID($this->db, $accountID);
                    if ($account !== NULL) {
                        // TODO - Save data here
                        User::ExecQueue($this->db, $account, $userData);
                        $this->output['status'] = 'ok';
                    }
                }
            }
        }

        /**
         * Defines user data (activities, nickname, successes, etc)
         */
        public function SetUserData() {
            $token = $this->data['token'];
            $userData = $this->data['data'];
            if (isset($token, $userData)) {
                $dataFromToken = Device::GetDataFromToken($this->db, $token);
                $accountID = $dataFromToken['accountID'];
                $account = Account::GetByID($this->db, $accountID);

                if (isset($account, $userData)) {
                    // Get & remove user from data
                    $decoded = json_decode($userData);
                    $pseudo = $decoded->pseudo;
                    $title = $decoded->title;
                    $solvedAchievements = implode(',', $decoded->solvedAchievements);
                    $xp = $decoded->xp;
                    unset($decoded->pseudo);
                    unset($decoded->title);
                    unset($decoded->solvedAchievements);
                    $userData = json_encode($decoded);
    
                    User::SetData($this->db, $account, $userData);
                    User::setTitle($this->db, $account, $title);
                    User::setAchievements($this->db, $account, $solvedAchievements);
                    User::setXP($this->db, $account, $xp);
                    $pseudoChanged = User::setPseudo($this->db, $account, $pseudo);
                    if ($pseudoChanged === -1) {
                        $this->output['status'] = 'wrongtimingpseudo';
                        // App modifiée ?
                    } else if ($pseudoChanged === -2) {
                        $this->output['status'] = 'wrongpseudo';
                    } else {
                        $this->output['status'] = 'ok';
                    }
                }
            }
        }

        /**
         * Retrieves the top 100 users from the leaderboard
         * 
         * (Obsolete code, one SQL command + formatting is enough!)
         */
        /*public function GetLeaderboard() {
            $token = $this->data['token'];
            $time = $this->data['time'];
            if (isset($token)) {
                $dataFromToken = Device::GetDataFromToken($this->db, $token);
                $accountID = $dataFromToken['accountID'];
                $account = Account::GetByID($this->db, $accountID);
                if (isset($account)) {
                    $this->output['self'] = GetSelfPosition($this->db, $account, $time);
                }
            }
            $this->output['leaderboard'] = GetLeaderboard($this->db, $time);
            $this->output['status'] = 'ok';
        }*/

        /**
         * Add a report to the database
         */
        public function Report() {
            $token = $this->data['token'];
            $report_type = $this->data['type'];
            $report_data = $this->data['data'];
            $deviceID = 0;
    
            if (isset($token, $report_type, $report_data)) {
                if (!empty($token)) {
                    $dataFromToken = Device::GetDataFromToken($this->db, $token);
                    $token_deviceID = $dataFromToken['deviceID'];
                    if (isset($token_deviceID)) {
                        $deviceID = $token_deviceID;
                    }
                }
    
                $report_result = AddReport($this->db, $deviceID, $report_type, $report_data);
                if ($report_result === TRUE) {
                    $this->output['status'] = 'ok';
                }
            }
        }

        /**
         * Return the date of the server to compare it with the date of the app,
         * To avoid time changes
         */
        public function GetDate() {
            $this->output['time'] = time();
        }

    }

?>