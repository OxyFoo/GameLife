<?php

    class Skills
    {
        /**
         * @param DataBase $db
         * @param Account $account
         * @return array activity => [ skillID, startTime, duration, comment ]
         */
        public static function GetActivities($db, $account) {
            $command = 'SELECT `SkillID`, `StartTime`, `Duration`, `Comment` FROM TABLE WHERE `AccountID` = ?';
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
                array_push($activities, [ $skillID, $startTime, $duration, $comment ]);
            }
            return $activities;
        }

        // Format : [ ['add|rem',SkillID,DATE,DURATION], ... ]
        /**
         * @param DataBase $db
         * @param Account $account
         * @param array $activities activity => [ skillID, startTime, duration, comment ]
         */
        public static function AddActivities($db, $account, $activities) {
            for ($i = 0; $i < count($activities); $i++) {
                $activity = $activities[$i];
                if (count($activity) < 4 || count($activity) > 5) continue;

                $type = $activity[0];
                $skillID = $activity[1];
                $startTime = $activity[2];
                $duration = $activity[3];

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
                    $comment = 'NULL';
                    if (!is_null($activity[4]) && !empty($activity[4])) {
                        $comment = "'".$db->Encrypt($activity[4])."'";
                    }
                    $command = 'INSERT INTO TABLE (`AccountID`, `SkillID`, `StartTime`, `Duration`, `Comment`) VALUES (?, ?, ?, ?, ?)';
                    $r = $db->QueryPrepare('Activities', $command, 'iiiis', [ $account->ID, $skillID, $startTime, $duration, $comment ]);
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