<?php

/**
 * @param DataBase $db
 * @param int $deviceID
 * @param string $type
 * @param string $data
 */
function AddReport($db, $deviceID, $type, $data) {
    $command = 'INSERT INTO TABLE (`DeviceID`, `Type`, `Content`) VALUES (?, ?, ?)';
    $args = [ $deviceID, $type, $data ];
    $result = $db->QueryPrepare('Reports', $command, 'iss', $args);
    return $result;
}

?>
