<?php

/**
 * Retrieve the application version and the database hash
 * @param DataBase $db
 */
function GetAppData($db) {
    $appData = array('Version' => '0.0.0', 'Hashes' => '', 'Maintenance' => false, 'News' => array());
    $app = $db->QueryPrepare('App', 'SELECT * FROM TABLE');
    $lastHashRefresh = 0;

    if ($app !== null) {
        for ($i = 0; $i < count($app); $i++) {
            $ID = $app[$i]['ID'];
            $data = $app[$i]['Data'];
            $date = $app[$i]['Date'];

            if ($ID === 'Version') {
                $appData['Version'] = $data;
            } else if ($ID === 'Hashes') {
                $appData['Hashes'] = json_decode($data, true);
                $lastHashRefresh = MinutesFromDate($date);
            } else if ($ID === 'Maintenance') {
                $appData['Maintenance'] = $data !== '0';
            } else if ($ID === 'News') {
                $appData['News'] = json_decode($data, true);
            }
        }
    }

    if ($lastHashRefresh > 60) {
        // RefreshHashes($db);
    }

    return $appData;
}

/**
 * Calculate hashes of all internal data
 * @param DataBase $db
 */
function RefreshHashes($db) {
    // Refresh database hash
    $db_all = GetAllInternalData($db);

    // Get all hashes
    $hashSkills = md5(json_encode(array($db_all['skills'], $db_all['skillsIcon'], $db_all['skillsCategory'])));
    $hashEquips = md5(json_encode(array($db_all['achievements'], $db_all['titles'], $db_all['items'])));
    $hashApptxt = md5(json_encode(array($db_all['contributors'], $db_all['quotes'])));
    $newHashes = array(
        'skills' => $hashSkills,
        'equips' => $hashEquips,
        'apptxt' => $hashApptxt
    );

    // Refresh `App` in DB
    $newHashesString = json_encode($newHashes);
    $command = "UPDATE TABLE SET `Date` = current_timestamp(), `Data` = ? WHERE `ID` = 'Hashes'";
    $result = $db->QueryPrepare('App', $command, 's', [ $newHashesString ]);
    if ($result === false) {
        ExitWithStatus('Failed to update database hashes');
    }
}

?>
