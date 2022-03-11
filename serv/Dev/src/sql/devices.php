<?php

    class Device
    {
        /** @var int $ID */
        public $ID;

        /** @var string $Identifier */
        public $Identifier;

        /** @var string $Name */
        public $Name;

        /** @var string $OSName "Android" or "iOS" */
        public $OSName;

        /** @var string $OSVersion */
        public $OSVersion;

        /** @var string $Token */
        public $Token;

        /** @var bool $Banned */
        public $Banned;

        /** @var DateTime $Created */
        public $Created;

        /** @var DateTime $Updated */
        public $Updated;

        public function __construct($device) {
            $this->ID = intval($device['ID']);
            $this->Identifier = $device['Identifier'];
            $this->Name = $device['Name'];
            $this->OSName = $device['OSName'];
            $this->OSVersion = $device['OSVersion'];
            $this->Token = $device['Token'];
            $this->Banned = $device['Banned'] != '0';
            $this->Created = $device['Created'];
            $this->Updated = $device['Updated'];
        }
    }

    class Devices
    {
        /**
         * @param DataBase $db
         * @param string $deviceIdentifier
         * @param string $deviceName
         * @param string $osName
         * @param string $osVersion
         * @return Device|NULL
         */
        public static function Add($db, $deviceIdentifier, $deviceName, $osName, $osVersion) {
            $hashID = password_hash($deviceIdentifier, PASSWORD_BCRYPT);
            $command = "INSERT INTO `Devices` (`Identifier`, `Name`, `OSName`, `OSVersion`) VALUES ('$hashID', '$deviceName', '$osName', '$osVersion')";
            $result = $db->Query($command);
            if ($result !== TRUE) {
                ExitWithStatus("Error: Adding device in DB failed");
            }
            return Devices::GetByID($db, $db->GetLastInsertID());
        }

        /**
         * @param DataBase $db
         * @param string $deviceIdentifier
         * @param string $deviceName
         * @return Device|NULL
         */
        public static function Get($db, $deviceIdentifier, $deviceName) {
            $device = NULL;
            $command = "SELECT * FROM `Devices` WHERE `Name` = '$deviceName'";

            $devices = $db->QueryArray($command);
            if ($devices !== NULL) {
                for ($d = 0; $d < count($devices); $d++) {
                    if (password_verify($deviceIdentifier, $devices[$d]['Identifier'])) {
                        $device = $devices[$d];
                        break;
                    }
                }
            }

            return $device;
        }

        /**
         * @param DataBase $db
         * @param int $ID
         * @return Device|NULL
         */
        public static function GetByID($db, $ID) {
            $device = NULL;
            $command = "SELECT * FROM `Devices` WHERE `ID` = '$ID'";
            $devices = $db->QueryArray($command);
            if ($devices !== NULL && count($devices) === 1) {
                $device = $devices[0];
            }
            return $device;
        }

        /**
         * @param DataBase $db
         * @param Device $device
         * @param string $deviceName
         * @param string $osName
         * @param string $osVersion
         * @return void
         */
        public static function Refresh($db, $device, $deviceName, $osName, $osVersion) {
            if ($device->Name != $deviceName || $device->OSName != $osName || $device->OSVersion != $osVersion) {
                $edit = array(
                    'Name' => $deviceName,
                    'OSName' => $osName,
                    'OSVersion'  => $osVersion,
                    'Updated' => 'CURRENT_TIMESTAMP()'
                );
                $cond = array('ID' => $device->ID);
                $result = $db->QueryEdit('Devices', $edit, $cond);
                if ($result !== TRUE) {
                    ExitWithStatus("Error: Refreshing device in DB failed");
                }
            }
        }

        /**
         * @param DataBase $db
         * @param Device $device
         * @param string $type
         * @return void
         */
        public static function AddStatistic($db, $device, $type = "0") {
            $deviceID = $device->ID;
            $command = "INSERT INTO `Statistics` (`DeviceID`, `Type`) VALUES ('$deviceID', '$type')";
            $result = $db->Query($command);
            if ($result !== TRUE) {
                ExitWithStatus("Error: Adding device statistic in DB failed");
            }
        }

        public static function RefreshMailToken($db, $deviceID, $accountID) {
            $token = RandomString();
            $result1 = $db->Query("UPDATE `Devices` SET `Token` = '$token' WHERE `ID` = '$deviceID'");
            $result2 = $db->Query("UPDATE `Users` SET `LastSendMail` = current_timestamp() WHERE `ID` = '$accountID'");
            if ($result1 !== TRUE || $result2 !== TRUE) {
                ExitWithStatus("Error: Refreshing mail token in DB failed");
            }
            return $token;
        }

        public static function RemoveToken($db, $deviceID) {
            return $db->Query("UPDATE `Devices` SET `Token` = '' WHERE `ID` = '$deviceID'");
        }

        private const RANDOM_LENGTH = 24;
        private const LIMIT_TIME_HOURS = 6;
        private const SEPARATOR = "\t";

        public static function GeneratePrivateToken($db, $accountID, $deviceID) {
            $time = time();
            $sep = self::SEPARATOR;
            $random = RandomString(self::RANDOM_LENGTH);

            $cipher = "$deviceID{$sep}$accountID{$sep}$time{$sep}$random";
            $middle = $db->Encrypt($cipher);
            $result = $db->Encrypt($middle, $db->keyB);
            return $result;
        }

        public static function GetDataFromToken($db, $token) {
            $output = NULL;
            $middle = $db->Decrypt($token, $db->keyB);
            $data = $db->Decrypt($middle);

            $exploded = explode(self::SEPARATOR, $data);
            if (count($exploded) === 4) {
                list($deviceID, $accountID, $time, $random) = $exploded;
                if (is_numeric($deviceID) && is_numeric($accountID) && is_numeric($time) && strlen($random) === self::RANDOM_LENGTH) {
                    $output = array(
                        'deviceID' => intval($deviceID),
                        'accountID' => intval($accountID),
                        'inTime' => intval($time) + (self::LIMIT_TIME_HOURS * 3600) >= time()
                    );
                    // Check account existence
                    $account = Accounts::GetByID($db, $accountID);
                    if ($account === NULL) {
                        $output['inTime'] = FALSE;
                    }
                }
            }
            return $output;
        }

        public static function Delete($db, $ID) {
            $command = "DELETE FROM `Devices` WHERE `ID` = '$ID'";
            $result = $db->Query($command);
            if ($result !== TRUE) {
                ExitWithStatus("Error: Deleting device in DB failed");
            }
        }
    }

?>