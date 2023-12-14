<?php

class Quest {
    public $title = '';
    public $comment = '';
    public $created = 0;
    public $schedule = '[]';
    public $skills = '[]';
}
class QuestUnsaved extends Quest {
    /** @var 'add'|'rem' $type */
    public $action = '';
}

class Quests
{
    /**
     * @param DataBase $db
     * @param Account $account
     * @return Quest[]
     */
    public static function GetQuests($db, $account) {
        $command = 'SELECT `Title`, `Comment`, `Created`, `Schedule`, `Skills` FROM TABLE WHERE `AccountID` = ?';
        $rows = $db->QueryPrepare('Quests', $command, 'i', [ $account->ID ]);
        if ($rows === false) ExitWithStatus('Error: getting quests failed');

        $quests = array();
        for ($i = 0; $i < count($rows); $i++) {
            $newQuest = array(
                'title' => $rows[$i]['Title'],
                'comment' => $db->Decrypt($rows[$i]['Comment']),
                'created' => intval($rows[$i]['Created']),
                'schedule' => json_decode($rows[$i]['Schedule'], true),
                'skills' => json_decode($rows[$i]['Skills'], true)
            );

            array_push($quests, $newQuest);
        }

        return $quests;
    }

    /**
     * @param DataBase $db
     * @param Account $account
     * @param array $quests
     */
    public static function AddQuests($db, $account, $quests) {
        for ($i = 0; $i < count($quests); $i++) {
            $quest = $quests[$i];

            // Check if quest is valid
            $keysTodo = array_keys(get_object_vars(new QuestUnsaved()));
            $wrongKeys = array_diff($keysTodo, array_keys((array)$quest));
            if (count($wrongKeys) > 0) {
                continue;
            }

            $action = $quest['action'];                     // 'add' or 'rem'
            $title = $quest['title'];                       // string
            $comment = $db->Encrypt($quest['comment']);     // string
            $created = $quest['created'];                   // int
            $schedule = json_encode($quest['schedule']);    // string
            $skills = json_encode($quest['skills']);        // object => string

            // Check if quest exists
            $command = 'SELECT `ID` FROM TABLE WHERE `AccountID` = ? AND `Created` = ?';
            $reqQuest = $db->QueryPrepare('Quests', $command, 'ii', [ $account->ID, $created ]);
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

                $r = $db->QueryPrepare('Quests', $command, $types, $args);
                if ($r === false) ExitWithStatus('Error: saving quests failed (add)');
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

                $r = $db->QueryPrepare('Quests', $command, $types, $args);
                if ($r === false) ExitWithStatus('Error: saving quests failed (update)');
            }

            // Remove quest
            else if ($action === 'rem' && $exists) {
                $command = 'DELETE FROM TABLE WHERE `AccountID` = ? AND `Created` = ?';
                $r = $db->QueryPrepare('Quests', $command, 'ii', [ $account->ID, $created ]);
                if ($r === false) ExitWithStatus('Error: saving quests failed (remove)');
            }
        }
    }
}

?>
