<?php

    class Skills
    {
        /**
         * @param DataBase $db
         * @param Account $account
         * @return array activity => [ skillID, startTime, duration, comment, timezone ]
         */
        public static function GetActivities($db, $account) {
            $command = 'SELECT `SkillID`, `StartTime`, `Duration`, `Comment`, `TimeZone` FROM TABLE WHERE `AccountID` = ?';
            $rows = $db->QueryPrepare('Activities', $command, 'i', [ $account->ID ]);
            if ($rows === null) {
                ExitWithStatus('Error: getting activities failed');
            }
            $activities = array();
            for ($i = 0; $i < count($rows); $i++) {
                $skillID = intval($rows[$i]['SkillID']);
                $startTime = intval($rows[$i]['StartTime']);
                $duration = intval($rows[$i]['Duration']);
                $comment = $db->Decrypt($rows[$i]['Comment']);
                $timezone = intval($rows[$i]['TimeZone']);
                array_push($activities, [ $skillID, $startTime, $duration, $comment, $timezone ]);
            }
            return $activities;
        }

        // Format : [ ['add|rem',SkillID,DATE,DURATION], ... ]
        /**
         * @param DataBase $db
         * @param Account $account
         * @param array $activities activity => [ skillID, startTime, duration, comment, timezone ]
         */
        public static function AddActivities($db, $account, $activities) {
            for ($i = 0; $i < count($activities); $i++) {
                $activity = $activities[$i];
                if (count($activity) < 5 || count($activity) > 6) continue;

                $type = $activity[0];
                $skillID = $activity[1];
                $startTime = $activity[2];
                $duration = $activity[3];
                $timezone = $activity[5];

                // Check if activity exists
                $command = 'SELECT `ID` FROM TABLE WHERE `AccountID` = ? AND `SkillID` = ? AND `StartTime` = ? AND `Duration` = ?';
                $args = [ $account->ID, $skillID, $startTime, $duration ];
                $exists = $db->QueryPrepare('Activities', $command, 'iiii', $args);
                if ($exists === null) ExitWithStatus('Error: adding activity failed');
                $exists = count($exists) > 0;

                if ($type === 'add') {
                    if ($exists) {
                        $command = 'DELETE FROM TABLE WHERE `AccountID` = ? AND `SkillID` = ? AND `StartTime` = ? AND `Duration` = ?';
                        $r = $db->QueryPrepare('Activities', $command, 'iiii', [ $account->ID, $skillID, $startTime, $duration ]);
                        if ($r === false) ExitWithStatus('Error: saving activities failed (preadd)');
                    }
                    $comment = null;
                    if (!is_null($activity[4]) && !empty($activity[4])) {
                        $comment = "'".$db->Encrypt($activity[4])."'";
                    }
                    $command = 'INSERT INTO TABLE (`AccountID`, `SkillID`, `StartTime`, `Duration`, `Comment`, `TimeZone`) VALUES (?, ?, ?, ?, ?, ?)';
                    $r = $db->QueryPrepare('Activities', $command, 'iiiisi', [ $account->ID, $skillID, $startTime, $duration, $comment, $timezone ]);
                    if ($r === false) ExitWithStatus('Error: saving activities failed (add)');
                } else if ($type === 'rem' && $exists) {
                    $command = 'DELETE FROM TABLE WHERE `AccountID` = ? AND `SkillID` = ? AND `StartTime` = ? AND `Duration` = ?';
                    $r = $db->QueryPrepare('Activities', $command, 'iiii', [ $account->ID, $skillID, $startTime, $duration ]);
                    if ($r === false) ExitWithStatus('Error: saving activities failed (remove)');
                }
            }
        }
    }

?>