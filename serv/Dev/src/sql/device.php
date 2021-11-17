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

        public static function Get($db, $deviceIdentifier, $deviceName) {
            $device = NULL;
            $command = "SELECT * FROM `Devices` WHERE `Name` = '$deviceName'";
            $devices = $db->QueryArray($command);

            for ($d = 0; $d < count($devices); $d++) {
                if (password_verify($deviceIdentifier, $devices[$d]['Identifier'])) {
                    $device = $devices[$d];
                    break;
                }
            }

            return $device;
        }

        public static function Refresh($db, $device, $osName, $osVersion) {
            if ($device['OSName'] != $osName || $device['OSVersion'] != $osVersion) {
                $ID = $device['ID'];
                $update_command = "UPDATE `Devices` SET `OSName` = '$osName', `OSVersion` = '$osVersion', `Updated` = CURRENT_TIMESTAMP() WHERE `Devices`.`ID` = $ID";
                $result = $db->Query($update_command);
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
    }

?>