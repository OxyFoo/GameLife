<?php

    date_default_timezone_set('UTC');

    class DataBase
    {
        /**
         * @var mysqli $conn
         */
        private $conn;
        private $db_hostname;
        private $db_name;
        private $db_username;
        private $db_password;

        private $keyA;
        public $keyB;
        private $algorithm;

        public function __construct($init_conn = true) {
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
            $output = null;
            $query = $this->Query($command);
            if ($query !== false) {
                $output = array();
                while ($row = $query->fetch_assoc()) {
                    array_push($output, $row);
                }
            }
            return $output;
        }

        /**
         * @param string $table
         * @param array $cells Format { 'key' => 'value' }
         * @param array $conditions Format { 'key' => 'value' }
         * @return \mysqli_result|bool
         */
        public function QueryEdit($table, $cells, $conditions) {
            $formatCells = array();
            $formatConds = array();
            foreach ($cells as $key => $value) {
                array_push($formatCells, "`$key` = '$value'");
            }
            foreach ($conditions as $key => $value) {
                array_push($formatConds, "`$key` = '$value'");
            }
            $SET = implode(',', $formatCells);
            $COND = implode(' AND ', $formatConds);
            $command = "UPDATE `$table` SET $SET WHERE $COND";
            return $this->Query($command);
        }

        public function GetLastInsertID() {
            return $this->conn->insert_id;
        }

        /**
         * @param int $deviceID
         * @param 'mailSent'|'adWatched'|'cheatSuspicion'|'appState'|'accountState'|'accountEdition' $type
         * @param string $data
         * @return void
         */
        public function AddStatistic($deviceID, $type, $data = null) {
            $Data = $data === null ? 'NULL' : "'$data'";
            $command = "INSERT INTO `Logs` (`DeviceID`, `Type`, `Data`) VALUES ('$deviceID', '$type', $Data)";
            $result = $this->Query($command);
            if ($result === false) {
                ExitWithStatus("Error: Adding device statistic in DB failed");
            }
        }

        /**
         * Send mail to user with link to confirm account creation or account deletion
         * @param string $email
         * @param Device $device
         * @param string $deviceToken
         * @param int $accountID
         * @param string $langKey
         * @param string|'add'|'rem' $type
         */
        public function SendMail($email, $device, $deviceToken, $accountID, $langKey, $type="") {
            if ($type !== 'add' && $type !== 'rem') return false;

            $accept = array('action' => 'accept', 'accountID' => $accountID,
                            'deviceID' => $device->ID, 'deviceToken' => $deviceToken, 'lang' => $langKey);
            $delete = array('action' => 'delete', 'accountID' => $accountID,
                            'deviceID' => $device->ID, 'deviceToken' => $deviceToken, 'lang' => $langKey);
            $view = array('action' => 'view', 'accountID' => $accountID,
                            'deviceID' => $device->ID, 'deviceToken' => $deviceToken, 'lang' => $langKey);
            $actionAccept = base64_encode($this->Encrypt(json_encode($accept)));
            $actionDelete = base64_encode($this->Encrypt(json_encode($delete)));
            $actionView = base64_encode($this->Encrypt(json_encode($view)));

            $output = false;
            if ($type === 'add') {
                $output = SendSigninMail($email, $device->Name, $actionAccept, $actionView, $langKey);
            } else if ($type === 'rem') {
                $output = SendDeleteAccountMail($email, $device->Name, $actionDelete, $actionView, $langKey);
            }
            return $output;
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