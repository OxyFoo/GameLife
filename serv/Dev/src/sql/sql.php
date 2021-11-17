<?php

    $DAYS_PSEUDO_CHANGE = 6;

    class DataBase
    {
        private $conn;
        private $db_hostname;
        private $db_name;
        private $db_username;
        private $db_password;

        private $keyA;
        private $keyB;
        private $algorithm;

        public function __construct($init_conn = TRUE) {
            list(
                $this->db_hostname,
                $this->db_name,
                $this->db_username,
                $this->db_password,
                $this->keyA,
                $this->keyB,
                $this->algorithm
            ) = GetCredentials();
            if ($init_conn) {
                $this->OpenConnection();
            }
        }

        public function __destruct() {
            $this->conn->close();
        }

        private function OpenConnection() {
            $this->conn = new mysqli($this->db_hostname, $this->db_username, $this->db_password, $this->db_name);
            if ($this->conn->connect_error) {
                die('Connection failed: ' . $this->conn->connect_error);
            }
        }

        public function Query($command) {
            return $this->conn->query($command);
        }

        public function QueryArray($command) {
            $output = FALSE;
            $query = $this->Query($command);
            if ($query !== FALSE) {
                $output = array();
                while ($row = $query->fetch_assoc()) {
                    array_push($output, $row);
                }
            }
            return $output;
        }

        /*public function DelUser($ID) {
            $this->Query("DELETE FROM `$this->db_name`.`Users` WHERE `ID` = '$ID'");
        }*/

        public function SendMail($email, $deviceID, $accountID, $lang) {
            $device = Device::GetByID($this, $deviceID);
            $deviceID = $device['ID'];
            $deviceName = $device['Name'];
            $deviceToken = $device['Token'];

            $accept = array('action' => 'accept', 'accountID' => $accountID,
                            'deviceID' => $deviceID, 'deviceToken' => $deviceToken, 'lang' => $lang);
            $text_accept = base64_encode($this->Encrypt(json_encode($accept)));

            SendSigninMail($email, $deviceName, $text_accept, $lang);
        }

        public function GeneratePrivateToken($accountID, $deviceID) {
            $random = RandomString(24);
            $cipher = "$deviceID\t$accountID\t$random";
            $middle = $this->Encrypt($cipher);
            $result = $this->Encrypt($middle, $this->keyB);
            return $result;
        }

        public function GetDataFromToken($token) {
            $middle = $this->Decrypt($token, $this->keyB);
            $data = $this->Decrypt($middle);

            list($deviceID, $accountID, $random) = explode("\t", $data);
            return array('deviceID' => $deviceID, 'accountID' => $accountID);
        }

        public function setUserData($account, $data) {
            $accountID = $account['ID'];
            $crypted = $this->Encrypt($data);
            $result = $this->Query("UPDATE `Users` SET `Data` = '$crypted' WHERE `ID` = '$accountID'");
            if ($result !== TRUE) {
                ExitWithStatus("Error: Saving data failed");
            }
        }

        public function setUserTitle($account, $title) {
            $accountID = $account['ID'];
            $result = $this->Query("UPDATE `Users` SET `Title` = '$title' WHERE `ID` = '$accountID'");
            if ($result !== TRUE) {
                ExitWithStatus("Error: Saving title failed");
            }
        }

        public function setAchievements($account, $achievements) {
            $accountID = $account['ID'];
            $result = $this->Query("UPDATE `Users` SET `SolvedAchievements` = '$achievements' WHERE `ID` = '$accountID'");
            if ($result !== TRUE) {
                ExitWithStatus("Error: Saving title failed");
            }
        }

        public function setXP($account, $xp) {
            $accountID = $account['ID'];
            $result = $this->Query("UPDATE `Users` SET `XP` = '$xp' WHERE `ID` = '$accountID'");
            if ($result !== TRUE) {
                ExitWithStatus("Error: Saving XP failed");
            }
        }

        // 0 Nothing
        // 1 Changed
        // -1 Change failed (time)
        // -2 Change failed (wrong)
        public function setUsername($account, $username) {
            global $DAYS_PSEUDO_CHANGE;

            $changed = 0;
            $accountID = $account['ID'];
            $oldUsername = $account['Username'];
            $lastPseudoDate = strtotime($account['LastPseudoDate']);
            $todayDate = time();
            $todayText = date('Y-m-d H:i:s', $todayDate);
            $delta = ($todayDate - $lastPseudoDate) / (60 * 60 * 24);
            $u = ucfirst(strtolower($username));
            if ($oldUsername != $u) {
                if (empty($oldUsername)) {
                    $command = "UPDATE `Users` SET `Username` = '$u', `LastPseudoDate` = '$todayText' WHERE `ID` = '$accountID'";
                    $result_pseudo = $this->Query($command);
                    if ($result_pseudo !== TRUE) {
                        ExitWithStatus("Error: Saving pseudo failed (2)");
                    }
                } else if ($delta >= $DAYS_PSEUDO_CHANGE) {
                    $pseudoIsFree = $this->pseudoIsFree($accountID, $u);
                    if ($pseudoIsFree) {
                        $command = "UPDATE `Users` SET `Username` = '$u', `LastPseudoDate` = '$todayText' WHERE `ID` = '$accountID'";
                        $result_pseudo = $this->Query($command);
                        $changed = 1;
                        if ($result_pseudo !== TRUE) {
                            ExitWithStatus("Error: Saving pseudo failed");
                        }
                    } else {
                        $changed = -2;
                    }
                } else {
                    $changed = -1;
                }
            }

            return $changed;
        }

        private function pseudoIsFree($accountID, $username) {
            $usernames = $this->Query("SELECT * FROM `Users` WHERE `ID` != '$accountID' AND `Username` = '$username'");
            $isFree = NULL;
            if ($usernames !== FALSE) $isFree = $usernames->num_rows === 0;
            return $isFree;
        }

        public function Encrypt($str, $key = null) {
            $output = "";
            $k = $key === null ? $this->keyA : $key;
            if ($str) $output = openssl_encrypt($str, $this->algorithm, $k);
            return $output;
        }

        public function Decrypt($str, $key = null) {
            $output = "";
            $k = $key === null ? $this->keyA : $key;
            if ($str) $output = openssl_decrypt($str, $this->algorithm, $k);
            return $output;
        }
    }

?>