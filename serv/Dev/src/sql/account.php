<?php

    class Account
    {
        public static function Add($db, $username, $email) {
            // Add new empty account
            $command = "INSERT INTO `Users` (`Username`, `Email`) VALUES ('$username', '$email')";
            $result = $db->Query($command);
            if ($result !== TRUE) {
                ExitWithStatus("Error: Adding device in DB failed");
            }
            return Account::GetByEmail($db, $email);
        }

        public static function GetByEmail($db, $email) {
            $account = NULL;
            $command = "SELECT * FROM `Users` WHERE `Email` = '$email'";
            $accounts = $db->QueryArray($command);

            if ($accounts !== NULL && count($accounts) === 1) {
                $account = $accounts[0];
            }

            return $account;
        }

        public static function GetByID($db, $ID) {
            $account = NULL;
            $command = "SELECT * FROM `Users` WHERE `ID` = '$ID'";
            $accounts = $db->QueryArray($command);
            if ($accounts !== NULL && count($accounts) === 1) {
                $account = $accounts[0];
            }
            return $account;
        }

        public static function AddDevice($db, $deviceID, $account, $cellName) {
            $accountID = $account['ID'];
            $cell = json_decode($account[$cellName], TRUE);
            array_push($cell, $deviceID);
            $newCell = json_encode($cell);

            $command = "UPDATE `Users` SET `$cellName` = '$newCell' WHERE `ID` = '$accountID'";
            $result = $db->Query($command);
            if ($result !== TRUE) {
                ExitWithStatus("Error: Device adding failed");
            }
        }

        public static function RemDevice($db, $deviceID, $account, $cellName) {
            $accountID = $account['ID'];
            $cell = json_decode($account[$cellName], TRUE);
            if (!in_array($deviceID, $cell)) {
                ExitWithStatus("Error: Device removing failed (device not found)");
            }

            unset($cell[array_search($deviceID, $cell)]);
            $newCell = json_encode($cell);

            $command = "UPDATE `Users` SET `$cellName` = '$newCell' WHERE `ID` = '$accountID'";
            $result = $db->Query($command);
            if ($result !== TRUE) {
                ExitWithStatus("Error: Device removing failed");
            }
        }

        /**
         * Return :
         *      -1   : Not found / Error
         *      0    : OK
         *      1    : Wait mail confirmation
         */
        public static function CheckDevicePermissions($deviceID, $account) {
            $output = -1;
            $devices = json_decode($account['Devices'], TRUE);
            $devicesWait = json_decode($account['DevicesWait'], TRUE);

            if (in_array($deviceID, $devices)) $output = 0;
            else if (in_array($deviceID, $devicesWait)) $output = 1;

            return $output;
        }

        public static function RefreshLastDate($db, $accountID) {
            $result = $db->Query("UPDATE `Users` SET `LastConnDate` = current_timestamp() WHERE `ID` = '$accountID'");
            if ($result !== TRUE) {
                ExitWithStatus("Error: Saving last date failed");
            }
        }
    }

?>