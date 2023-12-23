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
    public static function Get($db, $account) {
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

    public static function Save($db, $account, $deviceID, $data) {
        if (isset($data['data'])) {
            self::Add($db, $account, $deviceID, $data['data']);
        }
        if (isset($data['sort'])) {
            self::SetSort($db, $account, $data['sort']);
        }
    }

    /**
     * @param DataBase $db
     * @param Account $account
     * @param string[] $questsSort
     */
    private static function SetSort($db, $account, $questsSort) {
        $command = 'UPDATE TABLE SET `QuestsSort` = ? WHERE `ID` = ?';
        $args = [ json_encode($questsSort), $account->ID ];
        $result = $db->QueryPrepare('Accounts', $command, 'si', $args);
        if ($result === false) {
            ExitWithStatus('Error: Saving quests sort failed');
        }
    }

    /**
     * @param DataBase $db
     * @param Account $account
     * @param int $deviceID
     * @param array $myquests
     */
    private static function Add($db, $account, $deviceID, $myquests) {
        for ($i = 0; $i < count($myquests); $i++) {
            $myquest = $myquests[$i];

            // Check if quest is valid
            $keysQuest = array_keys(get_object_vars(new MyQuestUnsaved()));
            $wrongKeys = array_diff($keysQuest, array_keys((array)$myquest));
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
                // Save in logs
                $command = 'SELECT * FROM TABLE WHERE `AccountID` = ? AND `Created` = ?';
                $questToArchive = $db->QueryPrepare('MyQuests', $command, 'ii', [ $account->ID, $created ]);
                if ($questToArchive === false) ExitWithStatus('Error: saving myquests failed (archive1)');
                if (count($questToArchive) !== 1) ExitWithStatus('Error: saving myquests failed (archive2)');
                $questToArchive = $questToArchive[0];
                $db->AddLog($account->ID, $deviceID, 'myQuestArchive', json_encode($questToArchive));

                $command = 'DELETE FROM TABLE WHERE `AccountID` = ? AND `Created` = ?';
                $r = $db->QueryPrepare('MyQuests', $command, 'ii', [ $account->ID, $created ]);
                if ($r === false) ExitWithStatus('Error: saving myquests failed (remove)');
            }
        }
    }
}

?>
