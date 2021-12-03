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

            if ($accounts !== FALSE && count($accounts) === 1) {
                $account = $accounts[0];
            }

            return $account;
        }

        public static function GetByID($db, $ID) {
            $account = NULL;
            $command = "SELECT * FROM `Users` WHERE `ID` = '$ID'";
            $accounts = $db->QueryArray($command);
            if ($accounts !== FALSE && count($accounts) === 1) {
                $account = $accounts[0];
            }
            return $account;
        }

        public static function AddDevice($db, $deviceID, $account, $cellName) {
            $accountID = $account['ID'];
            $cell = explode(',', $account[$cellName]);
            if ($cell[0] !== '') {
                array_push($cell, $deviceID);
                $newCell = join(',', $cell);
            } else {
                $newCell = $deviceID;
            }
            $result = $db->Query("UPDATE `Users` SET `$cellName` = '$newCell' WHERE `ID` = '$accountID'");
            if ($result !== TRUE) {
                ExitWithStatus("Error: Device adding failed");
            }
        }

        public static function RemDevice($db, $deviceID, $account, $cellName) {
            $accountID = $account['ID'];
            $cell = explode(',', $account[$cellName]);
            if (!in_array($deviceID, $cell)) {
                ExitWithStatus("Error: Device removing failed");
            }
            unset($cell[array_search($deviceID, $cell)]);
            $newCell = join(',', $cell);
            $result = $db->Query("UPDATE `Users` SET `$cellName` = '$newCell' WHERE `ID` = '$accountID'");
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
            $devices = explode(',', $account['Devices']);
            $devicesWait = explode(',', $account['DevicesWait']);

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