<?php

class NZD {
    public $start = 0;
    public $end = 0;
    public $daysCount = 0;
    public $claimed = '[]';
}

class NonZeroDays
{
    /**
     * @param DataBase $db
     * @param Account $account
     * @return NZD[]
     */
    public static function Get($db, $account) {
        $command = 'SELECT `Start`, `End`, `DaysCount`, `Claimed` FROM TABLE WHERE `AccountID` = ?';
        $rows = $db->QueryPrepare('NonZeroDays', $command, 'i', [ $account->ID ]);
        if ($rows === false) ExitWithStatus('Error: getting nzd failed');

        $nzd = array();
        for ($i = 0; $i < count($rows); $i++) {
            $newQuest = array(
                'start' => intval($rows[$i]['Start']),
                'end' => intval($rows[$i]['End']),
                'daysCount' => intval($rows[$i]['DaysCount']),
                'claimed' => json_decode($rows[$i]['Claimed'], true)
            );

            array_push($nzd, $newQuest);
        }

        return $nzd;
    }

    public static function Save($db, $account, $data) {
        if (isset($data['data'], $data['lastSavedTime'])) {
            self::Add($db, $account, $data['data'], $data['lastSavedTime']);
        } else {
            ExitWithStatus('Error: saving nzd failed (no data)');
        }
    }

    /**
     * @param DataBase $db
     * @param Account $account
     * @param array $data
     * @param int $lastSavedTime
     */
    private static function Add($db, $account, $data, $lastSavedTime) {
        for ($i = 0; $i < count($data); $i++) {
            $nzd = $data[$i];

            // Check if NZD is valid
            $keysNzd = array_keys(get_object_vars(new NZD()));
            $wrongKeys = array_diff($keysNzd, array_keys((array)$nzd));
            if (count($wrongKeys) > 0) {
                continue;
            }

            $start = $nzd['start'];                     // int
            $end = $nzd['end'];                         // int
            $daysCount = $nzd['daysCount'];             // int
            $claimed = json_encode($nzd['claimed']);    // object => string

            // Already saved
            if ($start < $lastSavedTime) {
                continue;
            }

            // Check if NZD exists
            $command = 'SELECT `ID` FROM TABLE WHERE `AccountID` = ? AND `Start` = ?';
            $reqQuest = $db->QueryPrepare('NonZeroDays', $command, 'ii', [ $account->ID, $start ]);
            if ($reqQuest === false) ExitWithStatus('Error: adding NZD failed');
            $exists = count($reqQuest) > 0;

            // Add NZD
            if (!$exists) {
                $command = 'INSERT INTO TABLE (
                    `AccountID`,
                    `Start`,
                    `End`,
                    `DaysCount`,
                    `Claimed`
                ) VALUES (?, ?, ?, ?, ?)';
                $args = [
                    $account->ID,
                    $start,
                    $end,
                    $daysCount,
                    $claimed
                ];
                $types = 'iiiis';

                $r = $db->QueryPrepare('NonZeroDays', $command, $types, $args);
                if ($r === false) ExitWithStatus('Error: saving nzd failed (add)');
            }

            // Update NZD
            else if ($exists) {
                $command = 'UPDATE TABLE SET
                    `End` = ?,
                    `DaysCount` = ?,
                    `Claimed` = ?
                    WHERE `ID` = ?';
                $args = [
                    $end,
                    $daysCount,
                    $claimed,
                    $reqQuest[0]['ID']
                ];
                $types = 'iisi';

                $r = $db->QueryPrepare('NonZeroDays', $command, $types, $args);
                if ($r === false) ExitWithStatus('Error: saving nzd failed (update)');
            }
        }
    }
}

?>
