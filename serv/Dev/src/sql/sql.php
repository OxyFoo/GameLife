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
            $output = NULL;
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

        public function GetLastInsertID() {
            return $this->conn->insert_id;
        }

        /**
         * Types : add, rem
         * Send mail to user with link to confirm account creation or account deletion
         * @param string $email
         * @param Device $device
         */
        public function SendMail($email, $device, $deviceToken, $accountID, $langKey, $type) {
            if ($type !== 'add' && $type !== 'rem') return FALSE;

            $deviceID = $device->ID;
            $deviceName = $device->Name;

            $accept = array('action' => 'accept', 'accountID' => $accountID,
                            'deviceID' => $deviceID, 'deviceToken' => $deviceToken, 'lang' => $langKey);
            $delete = array('action' => 'delete', 'accountID' => $accountID,
                            'deviceID' => $deviceID, 'deviceToken' => $deviceToken, 'lang' => $langKey);
            $view = array('action' => 'view', 'accountID' => $accountID,
                            'deviceID' => $deviceID, 'deviceToken' => $deviceToken, 'lang' => $langKey);
            $actionAccept = base64_encode($this->Encrypt(json_encode($accept)));
            $actionDelete = base64_encode($this->Encrypt(json_encode($delete)));
            $actionView = base64_encode($this->Encrypt(json_encode($view)));

            $output = FALSE;
            if ($type === 'add') {
                $output = SendSigninMail($email, $deviceName, $actionAccept, $actionView, $langKey);
            } else if ($type === 'rem') {
                $output = SendDeleteAccountMail($email, $deviceName, $actionDelete, $actionView, $langKey);
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