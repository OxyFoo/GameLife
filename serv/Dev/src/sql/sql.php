<?php

    date_default_timezone_set('UTC');

    class DataBase
    {
        private $conn;
        private $db_hostname;
        private $db_name;
        private $db_username;
        private $db_password;

        private $keyA;
        public $keyB;
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