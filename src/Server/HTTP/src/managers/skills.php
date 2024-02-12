<?php

class Activity {
    public $skillID = 0;
    public $startTime = 0;
    public $duration = 0;
    public $comment = '';
    public $timezone = 0;
    public $addedType = '';
    public $addedTime = 0;
}
class ActivityUnsaved extends Activity {
    /** @var 'add'|'rem' $type */
    public $type = '';
}

class Skills
{
    /**
     * @param DataBase $db
     * @param Account $account
     * @return Activity[]
     */
    public static function GetActivities($db, $account) {
        $command = 'SELECT `SkillID`, `StartTime`, `Duration`, `Comment`, `TimeZone`, `AddedType`, `AddedTime` FROM TABLE WHERE `AccountID` = ?';
        $rows = $db->QueryPrepare('Activities', $command, 'i', [ $account->ID ]);
        if ($rows === null) {
            ExitWithStatus('Error: getting activities failed');
        }
        $activities = array();
        for ($i = 0; $i < count($rows); $i++) {
            /** @var Activity $newActivity */
            $newActivity = array(
                'skillID'   => intval($rows[$i]['SkillID']),
                'startTime' => intval($rows[$i]['StartTime']),
                'duration'  => intval($rows[$i]['Duration']),
                'comment'   => $db->Decrypt($rows[$i]['Comment']),
                'timezone'  => intval($rows[$i]['TimeZone']),
                'addedType' => $rows[$i]['AddedType'],
                'addedTime' => intval($rows[$i]['AddedTime'])
            );
            array_push($activities, $newActivity);
        }
        return $activities;
    }

    /**
     * @param DataBase $db
     * @param Account $account
     * @param ActivityUnsaved[] $activities
     */
    public static function AddActivities($db, $account, $activities) {
        for ($i = 0; $i < count($activities); $i++) {
            $activity = $activities[$i];

            // Check if activity is valid
            $keysActivity = array_keys(get_object_vars(new ActivityUnsaved()));
            $wrongKeys = array_diff($keysActivity, array_keys((array)$activity));
            if (count($wrongKeys) > 0) {
                continue;
            }

            $type       = $activity['type'];
            $skillID    = $activity['skillID'];
            $startTime  = $activity['startTime'];
            $duration   = $activity['duration'];
            $comment    = $activity['comment'];
            $timezone   = $activity['timezone'];
            $addedType  = $activity['addedType'];
            $addedTime  = $activity['addedTime'];

            // Check if activity exists
            $command = 'SELECT `ID` FROM TABLE WHERE `AccountID` = ? AND `SkillID` = ? AND `StartTime` = ? AND `Duration` = ?';
            $args = [ $account->ID, $skillID, $startTime, $duration ];
            $selectedActivity = $db->QueryPrepare('Activities', $command, 'iiii', $args);
            if ($selectedActivity === false) ExitWithStatus('Error: adding activity failed');

            $exists = count($selectedActivity) > 0;

            // Add activity
            if ($type === 'add') {
                $commentFormat = null;
                if (strlen($comment) > 0) {
                    $commentFormat = "'".$db->Encrypt($comment)."'";
                }

                // Update activity if exists
                if ($exists) {
                    $activityID = intval($selectedActivity[0]['ID']);
                    $command = 'UPDATE TABLE SET `Comment` = ? WHERE `ID` = ?';
                    $args = [ $commentFormat, $activityID ];
                    $r = $db->QueryPrepare('Activities', $command, 'si', $args);
                    if ($r === false) ExitWithStatus('Error: saving activities failed (update)');
                }

                // Add activity if not exists
                else {
                    $command = 'INSERT INTO TABLE (`AccountID`, `SkillID`, `StartTime`, `Duration`, `Comment`, `TimeZone`, `AddedType`, `AddedTime`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
                    $args = [ $account->ID, $skillID, $startTime, $duration, $commentFormat, $timezone, $addedType, $addedTime ];
                    $r = $db->QueryPrepare('Activities', $command, 'iiiisisi', $args);
                    if ($r === false) ExitWithStatus('Error: saving activities failed (add)');
                }
            }

            // Remove activity
            else if ($type === 'rem' && $exists) {
                $activityID = intval($selectedActivity[0]['ID']);
                $command = 'DELETE FROM TABLE WHERE `ID` = ?';
                $r = $db->QueryPrepare('Activities', $command, 'i', [ $activityID ]);
                if ($r === false) ExitWithStatus('Error: saving activities failed (remove)');
            }
        }
    }
}

?>
