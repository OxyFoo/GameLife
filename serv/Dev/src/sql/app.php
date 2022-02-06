<?php

    /**
     * Retrieve the application version and the database hash
     * (Hash that is updated if old)
     */
    function GetAppData($db) {
        $appData = array('Version' => 0, 'Hashes' => '');
        $app = $db->QueryArray("SELECT * FROM `App`");
        $lastHashRefresh = 0;

        if ($app !== NULL) {
            for ($i = 0; $i < count($app); $i++) {
                $ID = $app[$i]['ID'];
                $data = $app[$i]['Data'];
                $date = $app[$i]['Date'];

                if ($ID === "Version") {
                    $appData['Version'] = $data;
                } else if ($ID === "Hashes") {
                    $appData["Hashes"] = json_decode($data, true);
                    $lastHashRefresh = MinutesFromDate($date);
                } else if ($ID === "Maintenance") {
                    $appData["Maintenance"] = $data !== '0';
                } else if ($ID === 'News') {
                    $appData["News"] = json_decode($data, true);
                }
            }
        }

        if ($lastHashRefresh > 60) {
            // Refresh database hash
            $db_all = GetAllInternalData($db);

            // Get all hashes
            $hashSkills = md5(json_encode(array($db_all['skills'], $db_all['skillsIcon'], $db_all['skillsCategory'])));
            $hashEquips = md5(json_encode(array($db_all['achievements'], $db_all['titles'])));
            $hashApptxt = md5(json_encode(array($db_all['contributors'], $db_all['quotes'])));
            $newHashes = array(
                'skills' => $hashSkills,
                'equips' => $hashEquips,
                'apptxt' => $hashApptxt
            );

            // Refresh `App` in DB
            $newHashesString = json_encode($newHashes);
            $result = $db->Query("UPDATE `App` SET `Date` = current_timestamp(), `Data` = '$newHashesString' WHERE `ID` = 'Hashes'");
            if ($result === TRUE && $newHash !== $appData['Hashes']) {
                $appData['Hashes'] = $newHashes;
            }
        }

        return $appData;
    }

?>