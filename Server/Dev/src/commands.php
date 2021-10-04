<?php

    require('./src/sql.php');
    require('./src/add.php');

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

        private function GetAppData() {
            $appData = array();
            $app = $this->db->QueryArray("SELECT * FROM `App`");
            $lastHashRefresh = 0;
            for ($i = 0; $i < count($app); $i++) {
                $index = $app[$i]['ID'];
                $value = $app[$i]['Data'];
                $date = $app[$i]['Date'];
                if ($index === "Version") {
                    $appData['Version'] = $value;
                } else if ($index === "DBHash") {
                    $appData["DBHash"] = $value;
                    $lastHashRefresh = MinutesFromDate($date);
                }
            }

            if ($lastHashRefresh > 60) {
                // Refresh database hash
                $lang = $this->data['lang'];
                $db_all = GetAllInternalData($this->db, $lang);

                $data = json_encode($db_all);
                $newHash = hash('md5', $data);

                if ($newHash !== $appData['DBHash']) {
                    // Refresh `App` in DB
                    $result = $this->db->Query("UPDATE `App` SET `Date` = current_timestamp(), `Data` = '$newHash' WHERE `ID` = 'DBHash'");
                    if ($result === TRUE) {
                        $appData['DBHash'] = $newHash;
                    }
                }
            }

            return $appData;
        }

        public function Ping() {
            $appData = $this->GetAppData();
            $version = $this->data['version'];
            if (isset($version) && $version == $appData['Version']) {
                $deviceIdentifier = $this->data['deviceID'];
                $deviceName = $this->data['deviceName'];

                if (isset($deviceIdentifier, $deviceName)) {
                    $device = $this->db->GetDevice($deviceIdentifier, $deviceName);
                    $this->output['status'] = 'ok';
                }
            } else {
                $this->output['status'] = 'update';
            }
        }

        public function GetToken() {
            $deviceIdentifier = $this->data['deviceID'];
            $deviceName = $this->data['deviceName'];
            $email = $this->data['email'];
            $lang = $this->data['lang'];

            if (isset($deviceIdentifier, $deviceName, $email, $lang)) {
                $account = $this->db->GetAccountByEmail($email);
                $device = $this->db->GetDevice($deviceIdentifier, $deviceName);

                // Check permissions
                $deviceID = $device['ID'];
                $perm = $this->db->CheckDevicePermissions($deviceID, $account);
                if ($perm === -1) {
                    // Blacklisted
                    $this->output['status'] = 'blacklist';
                } else if ($perm === 0) {
                    // Waiting mail confirmation
                    $this->output['status'] = 'waitMailConfirmation';
                } else if ($perm === 1) {
                    if ($account['Banned'] == 0) {
                        // OK
                        $accountID = $account['ID'];
                        $this->db->RefreshLastDate($accountID);
                        $this->output['token'] = $this->db->GeneratePrivateToken($accountID, $deviceID);
                        $this->output['status'] = 'ok';
                    } else {
                        $this->output['status'] = 'ban';
                    }
                } else {
                    // No device in account
                    $accountID = $account['ID'];
                    $this->db->RefreshLastDate($accountID);
                    $this->db->AddDeviceAccount($deviceID, $account, 'DevicesWait');
                    $this->db->RefreshToken($deviceID);
                    $this->db->SendMail($email, $deviceID, $accountID, $lang);
                    $this->output['status'] = 'signin';
                }

            }
        }

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

        public function GetUserData() {
            $token = $this->data['token'];
            if (isset($token)) {
                $dataFromToken = $this->db->GetDataFromToken($token);
                $accountID = $dataFromToken['accountID'];
    
                if (isset($accountID)) {
                    $account = $this->db->GetAccountByID($accountID);
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

        public function SetUserData() {
            $token = $this->data['token'];
            $userData = $this->data['data'];
            if (isset($token, $userData)) {
                $dataFromToken = $this->db->GetDataFromToken($token);
                $accountID = $dataFromToken['accountID'];
                $account = $this->db->GetAccountByID($accountID);
    
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
    
                    $this->db->setUserData($account, $userData);
                    $this->db->setUserTitle($account, $title);
                    $this->db->setAchievements($account, $solvedAchievements);
                    $this->db->setXP($account, $xp);
                    $pseudoChanged = $this->db->setUsername($account, $pseudo);
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

        public function GetLeaderboard() {
            $token = $this->data['token'];
            $time = $this->data['time'];
            if (isset($token)) {
                $dataFromToken = $this->db->GetDataFromToken($token);
                $accountID = $dataFromToken['accountID'];
                $account = $this->db->GetAccountByID($accountID);
                if (isset($account)) {
                    $this->output['self'] = GetSelfPosition($this->db, $account, $time);
                }
            }
            $this->output['leaderboard'] = GetLeaderboard($this->db, $time);
            $this->output['status'] = 'ok';
        }

        public function Report() {
            $token = $this->data['token'];
            $report_type = $this->data['type'];
            $report_data = $this->data['data'];
            $deviceID = 0;
    
            if (isset($token, $report_type, $report_data)) {
                if (!empty($token)) {
                    $dataFromToken = $this->db->GetDataFromToken($token);
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

        public function GetDate() {
            $this->output['status'] = 'ok';
            $this->output['time'] = time();
        }

    }

?>