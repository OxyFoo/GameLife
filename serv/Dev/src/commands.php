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
            $appData = array('Version' => 0, 'Hashes' => '');
            $app = $this->db->QueryArray("SELECT * FROM `App`");
            $lastHashRefresh = 0;

            if ($app !== FALSE) {
                for ($i = 0; $i < count($app); $i++) {
                    $ID = $app[$i]['ID'];
                    $data = $app[$i]['Data'];
                    $date = $app[$i]['Date'];

                    if ($ID === "Version") {
                        $appData['Version'] = $data;
                    } else if ($ID === "Hashes") {
                        $appData["Hashes"] = json_decode($data, true);
                        $lastHashRefresh = MinutesFromDate($date);
                    } else if ($ID === "Maintenance") {
                        $appData["Maintenance"] = $data !== '0';
                    } else if ($ID === 'News') {
                        $appData["News"] = json_decode($data, true);
                    }
                }
            }

            if ($lastHashRefresh > 60) {
                // Refresh database hash
                $db_all = GetAllInternalData($this->db);

                // Get all hashes
                $hashSkills = md5(json_encode(array($db_all['skills'], $db_all['skillsIcon'], $db_all['skillsCategory'])));
                $hashEquips = md5(json_encode(array($db_all['achievements'], $db_all['titles'])));
                $hashApptxt = md5(json_encode(array($db_all['contributors'], $db_all['quotes'])));
                $newHashes = array(
                    'skills' => $hashSkills,
                    'equips' => $hashEquips,
                    'apptxt' => $hashApptxt
                );

                // Refresh `App` in DB
                $newHashesString = json_encode($newHashes);
                $result = $this->db->Query("UPDATE `App` SET `Date` = current_timestamp(), `Data` = '$newHashesString' WHERE `ID` = 'Hashes'");
                if ($result === TRUE && $newHash !== $appData['Hashes']) {
                    $appData['Hashes'] = $newHashes;
                }
            }

            return $appData;
        }

        /**
         * Function to ping the server from the app
         * It also allows to store the device in the database (model + OS)
         * And to check the application version or if it is in maintenance mode
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
            $username = $this->data['username'];
            $lang = $this->data['lang'];

            if (isset($deviceIdentifier, $deviceName, $email, $username, $lang)) {
                // Check username
                    // Return pseudoUsed
                // Add account
                // Add deviceID in confirmed devices in account
                // Return ok
                if (User::pseudoIsFree($this->db, $username)) {
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
            $appData = $this->GetAppData();
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
            if (isset($token)) {
                $dataFromToken = Device::GetDataFromToken($this->db, $token);
                $accountID = $dataFromToken['accountID'];
    
                if (isset($accountID)) {
                    $account = Account::GetByID($this->db, $accountID);

                    $username = $account['Username'];
                    $usernameTime = strtotime($account['LastChangeUsername']);
                    $title = intval($account['Title']);

                    $activities = $this->db->Decrypt($account['Data']);
                    $solvedAchievements = $account['SolvedAchievements'];
                    if (isset($activities, $username, $title, $solvedAchievements)) {
                        $userData = array(
                            'username' => $username,
                            'usernameTime' => $usernameTime,
                            'title' => $title,
                            'activities' => json_decode($activities, true)
                        );
                        // TODO - Terminer le chargement des données ici
                        // date_default_timezone_set('UTC');

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