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

        function IsSafe($string) {
            return !preg_match('/[^a-zA-Z0-9_]/', $string);
        }

        /**
         * Used to select, insert, update or delete data.
         * @param string $table The table to replace in query.
         * @param string $command The query command to execute.
         * @param string $types The types of the parameters. ('i'(nteger), 'd'(ouble), 's'(tring), 'b'(lob))
         * @param array $variables The variables to bind to the query.
         * @return array|int|false Array if query type is select, otherwise the number of affected rows or false if the query failed.
         * @throws Exception if the connection is not open.
         */
        public function QueryPrepare($table, $command, $types = '', $variables = array()) {
            if ($this->conn === null) {
                throw(new Exception('Connection not opened'));
            }
            if (!$this->IsSafe($table)) {
                throw(new Exception('Invalid table name'));
            }
            if (gettype($variables) !== 'array') {
                throw(new Exception('Invalid variables type (must be an array)'));
            }

            $replace = 0;
            $command = str_replace('`TABLE`', "`$table`", $command, $replace);
            if ($replace === 0) {
                $command = str_replace('TABLE', "`$table`", $command, $replace);
            }

            $query = $this->conn->prepare($command);
            if ($query === false) return false;

            if (count($variables)) {
                $bind = $query->bind_param($types, ...$variables);
                if ($bind === false) return false;
            }

            try {
                $result = $query->execute();
                if ($result === false) return false;
            } catch (Exception $e) {
                //print_r($e);
                return false;
            }

            $output = $query->affected_rows;
            if (StartsWith($command, 'SELECT')) {
                $output = $query->get_result()->fetch_all(MYSQLI_ASSOC);
            }

            $query->close();
            return $output;
        }

        /**
         * @deprecated
         */
        public function Query($command) {
            return $this->conn->query($command);
        }

        /**
         * @deprecated
         */
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

        public function GetTables() {
            $tables = $this->QueryArray("SHOW TABLES");
            if ($tables === null) return null;
            $tableMap = fn($table) => $table["Tables_in_{$this->db_name}"];
            return array_map($tableMap, $tables);
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
         * @param int $accountID 0 if not connected
         * @param int $deviceID
         * @param 'mailSent'|'adWatched'|'cheatSuspicion'|'appState'|'accountState'|'accountEdition' $type
         * @param string $data
         * @return void
         */
        public function AddStatistic($accountID, $deviceID, $type, $data = null) {
            $Data = $data === null ? 'NULL' : "'$data'";
            $IP = GetClientIP();
            $command = "INSERT INTO `Logs` (`AccountID`, `DeviceID`, `IP`, `Type`, `Data`) VALUES ('$accountID', '$deviceID', '$IP', '$type', $Data)";
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