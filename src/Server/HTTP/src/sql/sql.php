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

    function IsTestEnvironment() {
        return strpos($this->db_name, 'Test') !== false && strpos($this->db_username, 'Test') !== false;
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
        if ($table !== null && !$this->IsSafe($table)) {
            throw(new Exception('Invalid table name'));
        }
        if (gettype($variables) !== 'array') {
            throw(new Exception('Invalid variables type (must be an array)'));
        }

        if ($table !== null) {
            $command = str_replace('TABLE', "`$table`", $command);
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

    public function GetTables() {
        $tables = null;
        $query = $this->conn->query('SHOW TABLES');
        if ($query === false) return false;

        $tables = array();
        while ($row = $query->fetch_assoc()) {
            array_push($tables, $row);
        }
        if ($tables === null) return null;

        $tableMap = fn($table) => $table["Tables_in_{$this->db_name}"];
        return array_map($tableMap, $tables);
    }

    public function GetLastInsertID() {
        return $this->conn->insert_id;
    }

    /**
     * @param int $accountID 0 if not connected
     * @param int $deviceID
     * @param 'mail'|'adWatched'|'cheatSuspicion'|'appState'|'accountState'|'accountEdition'|'giftCodeTry'|'giftCode'|'buyDailyDeals'|'buyRandomChest'|'buyTargetedChest'|'buyDye'|'sellStuff'|'claimNZD'|'myQuestArchive'|'error' $type
     * @param string $data
     * @return void
     */
    public function AddLog($accountID, $deviceID, $type, $data = null) {
        $IP = GetClientIP();
        $command = 'INSERT INTO TABLE (`AccountID`, `DeviceID`, `IP`, `Type`, `Data`) VALUES (?, ?, ?, ?, ?)';
        $args = [ $accountID, $deviceID, $IP, $type, $data ];
        $result = $this->QueryPrepare('Logs', $command, 'iisss', $args);
        if ($result === false) {
            ExitWithStatus('Error: Adding device statistic in DB failed');
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
    public function SendMail($email, $device, $deviceToken, $accountID, $langKey, $type='') {
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
        if (strlen($str) === 0) return '';

        $k = $key === null ? $this->keyA : $key;
        $ivlen = openssl_cipher_iv_length($this->algorithm);
        if ($ivlen === false) return '';

        $rnd = openssl_random_pseudo_bytes($ivlen / 2);
        if ($rnd === false) return '';

        $iv = bin2hex($rnd);
        $output = openssl_encrypt($str, $this->algorithm, $k, 0, $iv);

        return $output === false ? '' : $iv . $output;
    }

    public function Decrypt($str, $key = null) {
        if (strlen($str) === 0) return '';

        $k = $key === null ? $this->keyA : $key;
        $ivlen = openssl_cipher_iv_length($this->algorithm);
        if ($ivlen === false) return '';

        $iv = substr($str, 0, $ivlen);
        $output = openssl_decrypt(substr($str, $ivlen), $this->algorithm, $k, 0, $iv);
        if ($output === false) return '';

        return $output;
    }
}

?>
