<?php

class Quests
{
    /**
     * @param DataBase $db
     * @param Account $account
     * @return array quests => [ Title, startTime, duration, comment ]
     */
    public static function GetQuests($db, $account) {
        $command = 'SELECT `Checked`, `Title`, `Description`, `Deadline`, `Schedule` FROM TABLE WHERE `AccountID` = ?';
        $quests = $db->QueryPrepare('Quests', $command, 'i', [ $account->ID ]);
        if ($quests === false) ExitWithStatus('Error: getting quests failed');

        for ($i = 0; $i < count($quests); $i++) {
            $quests[$i]['Checked'] = intval($quests[$i]['Checked']);
            $quests[$i]['Schedule'] = json_decode($quests[$i]['Schedule'], true);
            $quests[$i]['Description'] = $db->Decrypt($quests[$i]['Description']);
            $quests[$i]['Deadline'] = intval($quests[$i]['Deadline']);
            if ($quests[$i]['Skill'] !== null) {
                $quests[$i]['Skill'] = json_decode($quests[$i]['Skill'], true);
            }
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
            if (count($quest) !== 9) continue;

            $Action = $quest['Action'];                          // 'add' or 'rem'
            $Checked = $quest['Checked'];                        // int
            $Title = $quest['Title'];                            // string
            $Description = $db->Encrypt($quest['Description']);  // string
            $Starttime = $quest['Starttime'];                    // int
            $Deadline = $quest['Deadline'];                      // int
            $Schedule = json_encode($quest['Schedule']);         // string
            $Skill = $quest['Skill'];                            // null or json

            if ($Skill !== null) {
                $Skill = json_encode($Skill);
            }

            // Check if quest exists
            $command = 'SELECT `ID` FROM TABLE WHERE `AccountID` = ? AND `Title` = ?';
            $reqQuest = $db->QueryPrepare('Quests', $command, 'is', [ $account->ID, $Title ]);
            if ($reqQuest === false) ExitWithStatus('Error: adding quest failed');
            $exists = count($reqQuest) > 0;

            // Update quest
            if ($Action === 'add' && $exists) {
                $command = 'UPDATE TABLE SET
                    `Checked` = ?,
                    `Title` = ?,
                    `Description` = ?,
                    `Starttime` = ?,
                    `Deadline` = ?,
                    `Schedule` = ?,
                    `Skill` = ?
                    WHERE `ID` = ?';
                $args = [
                    $Checked,
                    $Title,
                    $Description,
                    $Starttime,
                    $Deadline,
                    $Schedule,
                    $Skill,
                    $reqQuest[0]['ID']
                ];
                $types = 'issiissi';

                if ($Skill === null) {
                    array_splice($args, 6, 1);
                    $command = str_replace('`Skill` = ?,', '`Skill` = NULL,', $command);
                    $types = 'issiisi';
                }

                $r = $db->QueryPrepare('Quests', $command, $types, $args);
                if ($r === false) ExitWithStatus('Error: saving quests failed (update)');
            }

            // Add quest
            else if ($Action === 'add' && !$exists) {
                $command = 'INSERT INTO TABLE (
                    `AccountID`,
                    `Checked`,
                    `Title`,
                    `Description`,
                    `Deadline`,
                    `Schedule`,
                    `Skill`
                ) VALUES ({?})';
                $args = [
                    $account->ID,
                    $Checked,
                    $Title,
                    $Description,
                    $Deadline,
                    $Schedule,
                    $Skill
                ];
                $types = 'iississ';

                if ($Skill === null) {
                    array_splice($args, 6, 1);
                    $command = str_replace('`Skill`,', '', $command);
                    $types = 'iissis';
                }

                // Replace {?} with ?, ?, ?, ... with the correct number of arguments
                $commandArgs = implode(', ', array_fill(0, count($args), '?'));
                $command = str_replace('{?}', $commandArgs, $command);

                $r = $db->QueryPrepare('Quests', $command, $types, $args);
                if ($r === false) ExitWithStatus('Error: saving quests failed (add)');
            }

            // Remove quest
            else if ($Action === 'rem' && $exists) {
                $command = 'DELETE FROM TABLE WHERE `AccountID` = ? AND `Title` = ?';
                $r = $db->QueryPrepare('Quests', $command, 'is', [ $account->ID, $Title ]);
                if ($r === false) ExitWithStatus('Error: saving quests failed (remove)');
            }
        }
    }
}

?>
