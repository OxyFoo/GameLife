<?php

    class Device
    {
        public static function Add($db, $deviceIdentifier, $deviceName, $osName, $osVersion) {
            $hashID = password_hash($deviceIdentifier, PASSWORD_BCRYPT);
            $command = "INSERT INTO `Devices` (`Identifier`, `Name`, `OSName`, `OSVersion`) VALUES ('$hashID', '$deviceName', '$osName', '$osVersion')";
            $result = $db->Query($command);
            if ($result !== TRUE) {
                ExitWithStatus("Error: Adding device in DB failed");
            }
        }

        public static function Get($db, $deviceIdentifier, $deviceName, $searchAll = FALSE) {
            $device = NULL;
            $command = "SELECT * FROM `Devices`";
            if (!$searchAll) $command .= " WHERE `Name` = '$deviceName'";

            $devices = $db->QueryArray($command);
            for ($d = 0; $d < count($devices); $d++) {
                if (password_verify($deviceIdentifier, $devices[$d]['Identifier'])) {
                    $device = $devices[$d];
                    break;
                }
            }

            if ($device === NULL && !$searchAll) {
                return Device::Get($db, $deviceIdentifier, $deviceName, TRUE);
            }

            return $device;
        }

        public static function Refresh($db, $device, $deviceName, $osName, $osVersion) {
            if ($device['Name'] != $deviceName || $device['OSName'] != $osName || $device['OSVersion'] != $osVersion) {
                $ID = $device['ID'];
                $edit = array(
                    'Name' => $deviceName,
                    'OSName' => $osName,
                    'OSVersion'  => $osVersion,
                    'Updated' => 'CURRENT_TIMESTAMP()'
                );
                $cond = array('ID' => $ID);
                $result = $db->QueryEdit('Devices', $edit, $cond);
                if ($result !== TRUE) {
                    ExitWithStatus("Error: Refreshing device in DB failed");
                }
            }
        }

        public static function AddStatistic($db, $device, $type = "0") {
            $deviceID = $device['ID'];
            $command = "INSERT INTO `Statistics` (`DeviceID`, `Type`) VALUES ('$deviceID', '$type')";
            $result = $db->Query($command);
            if ($result !== TRUE) {
                ExitWithStatus("Error: Adding device statistic in DB failed");
            }
        }

        public static function GetByID($db, $ID) {
            $device = NULL;
            $command = "SELECT * FROM `Devices` WHERE `ID` = '$ID'";
            $devices = $db->QueryArray($command);
            if ($devices !== FALSE && count($devices) === 1) {
                $device = $devices[0];
            }
            return $device;
        }

        public static function RefreshToken($db, $deviceID) {
            $token = RandomString();
            $result = $db->Query("UPDATE `Devices` SET `Token` = '$token' WHERE `ID` = '$deviceID'");
            return $result;
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
                        'deviceID' => $deviceID,
                        'accountID' => $accountID,
                        'inTime' => intval($time) + (self::LIMIT_TIME_HOURS * 3600) >= time()
                    );
                }
            }
            return $output;
        }
    }

?>