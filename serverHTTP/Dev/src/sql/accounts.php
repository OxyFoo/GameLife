<?php

    class Accounts
    {
        /**
         * Add new empty account
         * @param DataBase $db
         * @param string $username
         * @param string $email
         * @param int $deviceID
         * @return Account|null
         */
        public static function Add($db, $username, $email, $deviceID) {
            $command = "INSERT INTO `Accounts` (`Username`, `Email`, `CreatedBy`) VALUES ('$username', '$email', '$deviceID')";
            $result = $db->Query($command);
            if ($result === false) {
                ExitWithStatus("Error: Adding device in DB failed");
            }
            return Accounts::GetByID($db, $db->GetLastInsertID());
        }

        /**
         * @param DataBase $db
         * @param int $ID
         * @return Account|null
         */
        public static function GetByID($db, $ID) {
            $account = null;
            $command = "SELECT * FROM `Accounts` WHERE `ID` = '$ID'";
            $accounts = $db->QueryArray($command);
            if ($accounts !== null && count($accounts) === 1) {
                $account = new Account($accounts[0]);
            }
            return $account;
        }

        /**
         * @param DataBase $db
         * @param string $email
         * @return Account|null
         */
        public static function GetByEmail($db, $email) {
            $account = null;
            $command = "SELECT * FROM `Accounts` WHERE `Email` = '$email'";
            $accounts = $db->QueryArray($command);

            if ($accounts !== null && count($accounts) === 1) {
                $account = new Account($accounts[0]);
            }

            return $account;
        }

        /**
         * @param DataBase $db
         * @param int $deviceID
         * @param Account $account
         * @param string $cellName "Devices" or "DevicesWait"
         */
        public static function AddDevice($db, $deviceID, $account, $cellName) {
            if ($cellName !== "Devices" && $cellName !== "DevicesWait") {
                ExitWithStatus("Error: Invalid cell name");
            }
            $accountID = $account->ID;
            $cell = $account->{$cellName};
            array_push($cell, $deviceID);
            $newCell = json_encode($cell);

            $command = "UPDATE `Accounts` SET `$cellName` = '$newCell' WHERE `ID` = '$accountID'";
            $result = $db->Query($command);
            if ($result === false) {
                ExitWithStatus("Error: Device adding failed");
            }
        }

        /**
         * @param DataBase $db
         * @param int $deviceID
         * @param Account $account
         * @param string $cellName "Devices" or "DevicesWait"
         */
        public static function RemDevice($db, $deviceID, $account, $cellName) {
            if ($cellName !== "Devices" && $cellName !== "DevicesWait") {
                ExitWithStatus("Error: Invalid cell name");
            }
            $accountID = $account->ID;
            $cell = $account->{$cellName};
            if (!in_array($deviceID, $cell)) {
                ExitWithStatus("Error: Device removing failed (device not found)");
            }

            unset($cell[array_search($deviceID, $cell)]);
            $newCell = json_encode($cell);

            $command = "UPDATE `Accounts` SET `$cellName` = '$newCell' WHERE `ID` = '$accountID'";
            $result = $db->Query($command);
            if ($result === false) {
                ExitWithStatus("Error: Device removing failed");
            }
        }

        /**
         * Check if device is in account's devices or devices wait list
         * @param int $deviceID
         * @param Account $account
         * @return int \
         *     -1 => Not found / Error\
         *     0  => OK\
         *     1  => Wait mail confirmation
         */
        public static function CheckDevicePermissions($deviceID, $account) {
            $output = -1;
            if (in_array($deviceID, $account->Devices)) $output = 0;
            else if (in_array($deviceID, $account->DevicesWait)) $output = 1;
            return $output;
        }

        /**
         * Check if device is in account's devices or devices wait list
         * @param DataBase $db
         * @param int $accountID
         */
        public static function RefreshLastDate($db, $accountID) {
            $result = $db->Query("UPDATE `Accounts` SET `LastConnDate` = current_timestamp() WHERE `ID` = '$accountID'");
            if ($result === false) {
                ExitWithStatus("Error: Saving last date failed");
            }
        }

        /**
         * Delete an account
         * @param DataBase $db
         * @param int $accountID
         * @return bool Success of deletion
         */
        public static function Delete($db, $accountID) {
            $remActivities = $db->Query("DELETE FROM `Activities` WHERE `UserID` = '$accountID'");
            $remUser = $db->Query("DELETE FROM `Accounts` WHERE `ID` = '$accountID'");
            return $remActivities && $remUser;
        }
    }

?>