<?php

    require('./mail.php');
    require('./config.php');
    require('./functions.php');

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

        private function QueryArray($command) {
            $output = [];
            $query = $this->conn->query($command);
            if ($query) {
                while ($row = $query->fetch_assoc()) {
                    array_push($output, $row);
                }
            }
            return $output;
        }

        public function GetAccountByEmail($email) {
            $command = "SELECT * FROM `Users` WHERE `Email` = '$email'";
            $account = NULL;
            $accounts = $this->QueryArray($command);

            if (!$accounts) {
                // Add new empty account
                $r = $this->AddAccount($email);
                if ($r !== TRUE) {
                    ExitWithStatus("Error: Adding device in DB failed");
                }
                return $this->GetAccountByEmail($email);
            } else if (count($accounts) === 1) {
                $account = $accounts[0];
            }

            return $account;
        }

        public function GetAccountByID($ID) {
            $command = "SELECT * FROM `Users` WHERE `ID` = '$ID'";
            $account = NULL;
            $accounts = $this->QueryArray($command);
            if (count($accounts) === 1) {
                $account = $accounts[0];
            }
            return $account;
        }

        public function GetDevice($deviceIdentifier, $deviceName) {
            $command = "SELECT * FROM `Devices` WHERE `Name` = '$deviceName'";
            $device = NULL;
            $devices = $this->QueryArray($command);

            for ($d = 0; $d < count($devices); $d++) {
                if (password_verify($deviceIdentifier, $devices[$d]['Identifier'])) {
                    $device = $devices[$d];
                    break;
                }
            }

            if (!$device) {
                // Add new device in DB
                $r = $this->AddDevice($deviceIdentifier, $deviceName);
                if ($r !== TRUE) {
                    ExitWithStatus("Error: Adding device in DB failed");
                }
                $device = $this->GetDevice($deviceIdentifier, $deviceName);
            }

            return $device;
        }

        public function GetDeviceByID($ID) {
            $command = "SELECT * FROM `Devices` WHERE `ID` = '$ID'";
            $device = NULL;
            $devices = $this->QueryArray($command);
            if (count($devices) === 1) {
                $device = $devices[0];
            }
            return $device;
        }

        public function AddAccount($email) {
            $command = "INSERT INTO `Users` (`Email`) VALUES ('$email')";
            $result = $this->conn->query($command);
            return $result;
        }

        public function AddDevice($deviceIdentifier, $deviceName) {
            $hashID = password_hash($deviceIdentifier, PASSWORD_BCRYPT);
            $command = "INSERT INTO `Devices` (`Identifier`, `Name`) VALUES ('$hashID', '$deviceName')";
            $result = $this->conn->query($command);
            return $result;
        }

        public function CheckDevicePermissions($deviceID, $account) {
            $output = NULL;
            $devices = explode(',', $account['Devices']);
            $devicesWait = explode(',', $account['DevicesWait']);
            $devicesBlacklist = explode(',', $account['DevicesBlacklist']);

            if (in_array($deviceID, $devices)) $output = 1;
            else if (in_array($deviceID, $devicesWait)) $output = 0;
            else if (in_array($deviceID, $devicesBlacklist)) $output = -1;

            return $output;
        }

        public function AddDeviceAccount($deviceID, $account, $cellName) {
            $accountID = $account['ID'];
            $cell = explode(',', $account[$cellName]);
            if ($cell[0] !== '') {
                array_push($cell, $deviceID);
                $newCell = join(',', $cell);
            } else {
                $newCell = $deviceID;
            }
            $result = $this->conn->query("UPDATE `Users` SET `$cellName` = '$newCell' WHERE `ID` = '$accountID'");
            if ($result !== TRUE) {
                ExitWithStatus("Error: Device adding failed");
            }
        }
        
        public function RemDeviceAccount($deviceID, $account, $cellName) {
            $accountID = $account['ID'];
            $cell = explode(',', $account[$cellName]);
            if (!in_array($deviceID, $cell)) {
                ExitWithStatus("Error: Device removing failed");
            }
            unset($cell[array_search($deviceID, $cell)]);
            $newCell = join(',', $cell);
            $result = $this->conn->query("UPDATE `Users` SET `$cellName` = '$newCell' WHERE `ID` = '$accountID'");
            if ($result !== TRUE) {
                ExitWithStatus("Error: Device removing failed");
            }
        }

        public function ValidDeviceAccount($deviceID, $account) {
            $this->RemDeviceAccount($deviceID, $account, 'DevicesWait');
            $this->AddDeviceAccount($deviceID, $account, 'Devices');
        }

        public function BlacklistDeviceAccount($deviceID, $account) {
        }

        public function RefreshToken($deviceID) {
            $token = RandomString();
            $result = $this->conn->query("UPDATE `Devices` SET `Token` = '$token' WHERE `ID` = '$deviceID'");
            return $result;
        }

        public function RemoveToken($deviceID) {
            return $this->conn->query("UPDATE `Devices` SET `Token` = '' WHERE `ID` = '$deviceID'");
        }

        /*public function DelUser($ID) {
            $this->conn->query("DELETE FROM `$this->db_name`.`Users` WHERE `ID` = '$ID'");
        }*/

        public function SendMail($email, $deviceID, $accountID, $lang) {
            $device = $this->GetDeviceByID($deviceID);
            $deviceID = $device['ID'];
            $deviceName = $device['Name'];
            $deviceToken = $device['Token'];

            $accept = array('action' => 'accept', 'accountID' => $accountID,
                            'deviceID' => $deviceID, 'deviceToken' => $deviceToken);
            $reject = array('action' => 'reject', 'accountID' => $accountID,
                            'deviceID' => $deviceID, 'deviceToken' => $deviceToken);

            $text_accept = base64_encode($this->Encrypt(json_encode($accept)));
            $text_reject = base64_encode($this->Encrypt(json_encode($reject)));

            SendSigninMail($email, $deviceName, $text_accept, $text_reject, $lang);
        }

        public function GeneratePrivateToken($accountID, $deviceID) {
            $random = RandomString(16);
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

        public function GetQuotes($lang = 'fr') {
            $quotes = $this->QueryArray("SELECT * FROM `Quotes`");
            $validQuotes = array();
            for ($q = 0; $q < count($quotes); $q++) {
                $Lang = $quotes[$q]["Lang"];
                $Quote = $quotes[$q]["Quote"];
                $Author = $quotes[$q]["Author"];
                if ($this->areSet([$Lang, $Quote, $Author])) {
                    if ($Lang == $lang || $Lang == 'en') {
                        array_push($validQuotes, $quotes[$q]);
                    }
                }
            }
            return $validQuotes;
        }
        public function GetTitles($lang = 'fr') {
            // TODO - Multilangue !
            return $this->QueryArray("SELECT * FROM `Titles`");
        }
        public function GetSkills($lang = 'fr') {
            $skills = $this->QueryArray("SELECT * FROM `Skills`");
            $categories = $this->QueryArray("SELECT * FROM `Categories`");
            $safeSkills = array();

            for ($i = 0; $i < count($skills); $i++) {
                // Get old stats
                $Wisdom = $skills[$i]["Wisdom"];
                $Intelligence = $skills[$i]["Intelligence"];
                $Confidence = $skills[$i]["Confidence"];
                $Strength = $skills[$i]["Strength"];
                $Stamina = $skills[$i]["Stamina"];
                $Dexterity = $skills[$i]["Dexterity"];
                $Agility = $skills[$i]["Agility"];
        
                // Remove old stats
                unset($skills[$i]["Wisdom"]);
                unset($skills[$i]["Intelligence"]);
                unset($skills[$i]["Confidence"]);
                unset($skills[$i]["Strength"]);
                unset($skills[$i]["Stamina"]);
                unset($skills[$i]["Dexterity"]);
                unset($skills[$i]["Agility"]);
        
                // Add new stats
                $Stats = array(
                    "sag" => $Wisdom,
                    "int" => $Intelligence,
                    "con" => $Confidence,
                    "for" => $Strength,
                    "end" => $Stamina,
                    "agi" => $Agility,
                    "dex" => $Dexterity
                );
                $skills[$i]["Stats"] = $Stats;

                // Verifications
                $Name = $skills[$i]["Name"];
                $CategoryID = $skills[$i]["CategoryID"];
                if (empty($Name) || $CategoryID === 0) {
                    continue;
                }

                // Set category & translations
                unset($skills[$i]["CategoryID"]);
                for ($c = 0; $c < count($categories); $c++) {
                    if ($categories[$c]["ID"] == $CategoryID) {
                        $categoryName = $categories[$c]["Name"];
                        $categoryTrans = $categories[$c]["Translations"];
                        if ($this->isJson($categoryTrans)) {
                            $trans = json_decode($categoryTrans);
                            if (!empty($trans->$lang)) {
                                $categoryName = $trans->$lang;
                            }
                        }
                        $skills[$i]["Category"] = $categoryName;
                        break;
                    }
                }

                // Verification (2)
                if (empty($skills[$i]["Category"])) {
                    continue;
                }

                // Name translations
                $Translations = $skills[$i]["Translations"];
                unset($skills[$i]["Translations"]);
                if ($this->isJson($Translations)) {
                    $trans = json_decode($Translations);
                    if (!empty($trans->$lang)) {
                        $skills[$i]["Name"] = $trans->$lang;
                    }
                }

                array_push($safeSkills, $skills[$i]);
            }

            return $safeSkills;
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

        private function areSet($vars) {
            $areSet = true;
            for ($v = 0; $v < count($vars); $v++) {
                $var = $vars[$v];
                if (!isset($var) || empty($var)) {
                    $areSet = false;
                    break;
                }
            }
            return $areSet;
        }

        private function isJson($str) {
            json_decode($str);
            return json_last_error() === 0;
        }
    }

?>