<?php

class MyQuest {
    public $title = '';
    public $comment = '';
    public $created = 0;
    public $schedule = '[]';
    public $skills = '[]';
}
class MyQuestUnsaved extends MyQuest {
    /** @var 'add'|'rem' $type */
    public $action = '';
}

class MyQuests
{
    /**
     * @param DataBase $db
     * @param Account $account
     * @return MyQuest[]
     */
    public static function GetQuests($db, $account) {
        $command = 'SELECT `Title`, `Comment`, `Created`, `Schedule`, `Skills` FROM TABLE WHERE `AccountID` = ?';
        $rows = $db->QueryPrepare('MyQuests', $command, 'i', [ $account->ID ]);
        if ($rows === false) ExitWithStatus('Error: getting myquests failed');

        $myquests = array();
        for ($i = 0; $i < count($rows); $i++) {
            $newQuest = array(
                'title' => $rows[$i]['Title'],
                'comment' => $db->Decrypt($rows[$i]['Comment']),
                'created' => intval($rows[$i]['Created']),
                'schedule' => json_decode($rows[$i]['Schedule'], true),
                'skills' => json_decode($rows[$i]['Skills'], true)
            );

            array_push($myquests, $newQuest);
        }

        return $myquests;
    }

    /**
     * @param DataBase $db
     * @param Account $account
     * @param array $myquests
     */
    public static function AddQuests($db, $account, $myquests) {
        for ($i = 0; $i < count($myquests); $i++) {
            $myquest = $myquests[$i];

            // Check if quest is valid
            $keysTodo = array_keys(get_object_vars(new MyQuestUnsaved()));
            $wrongKeys = array_diff($keysTodo, array_keys((array)$myquest));
            if (count($wrongKeys) > 0) {
                continue;
            }

            $action = $myquest['action'];                     // 'add' or 'rem'
            $title = $myquest['title'];                       // string
            $comment = $db->Encrypt($myquest['comment']);     // string
            $created = $myquest['created'];                   // int
            $schedule = json_encode($myquest['schedule']);    // string
            $skills = json_encode($myquest['skills']);        // object => string

            // Check if quest exists
            $command = 'SELECT `ID` FROM TABLE WHERE `AccountID` = ? AND `Created` = ?';
            $reqQuest = $db->QueryPrepare('MyQuests', $command, 'ii', [ $account->ID, $created ]);
            if ($reqQuest === false) ExitWithStatus('Error: adding quest failed');
            $exists = count($reqQuest) > 0;

            // Add quest
            if ($action === 'add' && !$exists) {
                $command = 'INSERT INTO TABLE (
                    `AccountID`,
                    `Title`,
                    `Comment`,
                    `Created`,
                    `Schedule`,
                    `Skills`
                ) VALUES (?, ?, ?, ?, ?, ?)';
                $args = [
                    $account->ID,
                    $title,
                    $comment,
                    $created,
                    $schedule,
                    $skills
                ];
                $types = 'ississ';

                $r = $db->QueryPrepare('MyQuests', $command, $types, $args);
                if ($r === false) ExitWithStatus('Error: saving myquests failed (add)');
            }

            // Update quest
            else if ($action === 'add' && $exists) {
                $command = 'UPDATE TABLE SET
                    `Title` = ?,
                    `Comment` = ?,
                    `Schedule` = ?,
                    `Skills` = ?
                    WHERE `ID` = ?';
                $args = [
                    $title,
                    $comment,
                    $schedule,
                    $skills,
                    $reqQuest[0]['ID']
                ];
                $types = 'ssssi';

                $r = $db->QueryPrepare('MyQuests', $command, $types, $args);
                if ($r === false) ExitWithStatus('Error: saving myquests failed (update)');
            }

            // Remove quest
            else if ($action === 'rem' && $exists) {
                $command = 'DELETE FROM TABLE WHERE `AccountID` = ? AND `Created` = ?';
                $r = $db->QueryPrepare('MyQuests', $command, 'ii', [ $account->ID, $created ]);
                if ($r === false) ExitWithStatus('Error: saving myquests failed (remove)');
            }
        }
    }
}

?>
