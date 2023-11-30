<?php

class Devices
{
    /**
     * @param DataBase $db
     * @param string $deviceID
     * @param string $deviceName
     * @param string $osName
     * @param string $osVersion
     * @return Device|null
     */
    public static function Add($db, $deviceID, $deviceName, $osName, $osVersion) {
        $identifier = hash('xxh64', $deviceID);
        $hash = password_hash($deviceID, PASSWORD_BCRYPT);
        $command = "INSERT INTO TABLE (`Identifier`, `Hash`, `Name`, `OSName`, `OSVersion`) VALUES (?, ?, ?, ?, ?)";
        $args = [ $identifier, $hash, $deviceName, $osName, $osVersion ];
        $result = $db->QueryPrepare('Devices', $command, 'sssss', $args);
        if ($result === false) {
            ExitWithStatus("Error: Adding device in DB failed");
        }
        return Devices::GetByID($db, $db->GetLastInsertID());
    }

    /**
     * @param DataBase $db
     * @param string $deviceID
     * @param string $deviceName TODO: Remove after 1.0.3
     * @return Device|null
     */
    public static function Get($db, $deviceID, $deviceName) {
        $deviceIdentifier = hash('xxh64', $deviceID);
        $command = "SELECT * FROM TABLE WHERE `Identifier` = ?";
        $devices = $db->QueryPrepare('Devices', $command, 's', [ $deviceIdentifier ]);
        if ($devices !== null) {
            for ($d = 0; $d < count($devices); $d++) {
                if (password_verify($deviceID, $devices[$d]['Hash'])) {
                    return new Device($devices[$d]);
                }
            }
        }

        // Old identifier with slow hash | TODO: Remove after 1.0.3
        $commandOld = "SELECT * FROM TABLE WHERE `Name` = ?";
        $devicesOld = $db->QueryPrepare('Devices', $commandOld, 's', [ $deviceName ]);
        if ($devicesOld !== null) {
            for ($d = 0; $d < count($devicesOld); $d++) {
                if (password_verify($deviceID, $devicesOld[$d]['Hash'])) {
                    $device = new Device($devicesOld[$d]);

                    $commandUpdate = "UPDATE TABLE SET `Identifier` = ? WHERE `ID` = ?";
                    $args = [ $deviceIdentifier, $device->ID ];
                    $result = $db->QueryPrepare('Devices', $commandUpdate, 'si', $args);
                    if ($result === false) {
                        ExitWithStatus('Error: Updating device in DB failed');
                    }

                    return self::GetByID($db, $device->ID);
                }
            }
        }

        return null;
    }

    /**
     * @param DataBase $db
     * @param int $ID
     * @return Device|null
     */
    public static function GetByID($db, $ID) {
        $device = null;
        $command = "SELECT * FROM TABLE WHERE `ID` = ?";
        $devices = $db->QueryPrepare('Devices', $command, 'i', [ $ID ]);
        if ($devices !== null && count($devices) === 1) {
            $device = new Device($devices[0]);
        }
        return $device;
    }

    /**
     * @param DataBase $db
     * @param Device $device
     * @param string $deviceName
     * @param string $osName
     * @param string $osVersion
     */
    public static function Refresh($db, $device, $deviceName, $osName, $osVersion) {
        if ($device->Name != $deviceName || $device->OSName != $osName || $device->OSVersion != $osVersion) {
            $command = 'UPDATE TABLE SET `Name` = ?, `OSName` = ?, `OSVersion` = ?, `Updated` = CURRENT_TIMESTAMP() WHERE `ID` = ?';
            $args = [ $deviceName, $osName, $osVersion, $device->ID ];
            $result = $db->QueryPrepare('Devices', $command, 'sssi', $args);
            if ($result === false) {
                ExitWithStatus('Error: Refreshing device in DB failed');
            }
        }
    }

    /**
     * @param DataBase $db
     * @param int $deviceID
     * @param int $accountID
     * @return string Return new token
     */
    public static function RefreshLoginToken($db, $deviceID, $accountID) {
        $token = RandomString();
        $result1 = $db->QueryPrepare('Devices', 'UPDATE TABLE SET `Token` = ? WHERE `ID` = ?', 'si', [ $token, $deviceID ]);
        $result2 = $db->QueryPrepare('Accounts', 'UPDATE TABLE SET `LastSendMail` = current_timestamp() WHERE `ID` = ?', 'i', [ $accountID ]);
        if ($result1 === false || $result2 === false) {
            ExitWithStatus('Error: Refreshing mail token in DB failed');
        }
        return $token;
    }

    /**
     * @param DataBase $db
     * @param int $deviceID
     * @return \mysqli_result|bool
     */
    public static function RemoveLoginToken($db, $deviceID) {
        return $db->QueryPrepare('Devices', "UPDATE TABLE SET `Token` = '' WHERE `ID` = ?", 'i', [ $deviceID ]);
    }

    private const RANDOM_LENGTH = 24;
    private const LIMIT_TIME_HOURS = 6;
    private const SEPARATOR = "\t";

    /**
     * @param DataBase $db
     * @param int $accountID
     * @param int $deviceID
     * @return string|null Return new token or null if failed
     */
    public static function GeneratePrivateToken($db, $accountID, $deviceID) {
        $time = time();
        $sep = self::SEPARATOR;
        $random = RandomString(self::RANDOM_LENGTH);

        $cipher = "$deviceID{$sep}$accountID{$sep}$time{$sep}$random";
        $middle = $db->Encrypt($cipher);
        $result = $db->Encrypt($middle, $db->keyB);
        return strlen($result) > 0 ? $result : null;
    }

    /**
     * @param DataBase $db
     * @param string $token
     * @return object|null Return { deviceID: int, accountID: int, inTime: bool } or null if failed
     */
    public static function GetDataFromToken($db, $token) {
        $output = null;
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
                if ($account === null) {
                    $output['inTime'] = false;
                }
            }
        }
        return $output;
    }

    /**
     * @param DataBase $db
     * @param int $ID
     */
    public static function Delete($db, $ID) {
        $command = 'DELETE FROM TABLE WHERE `ID` = ?';
        $result = $db->QueryPrepare('Devices', $command, 'i', [ $ID ]);
        if ($result === false) {
            ExitWithStatus('Error: Deleting device in DB failed');
        }
    }
}

?>
