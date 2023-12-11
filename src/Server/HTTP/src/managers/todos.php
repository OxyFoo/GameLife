<?php

class Todo {
    public $checked = 0;
    public $title = '';
    public $description = '';
    public $created = 0;
    public $deadline = 0;
    public $tasks = '[]';
}
class TodoUnsaved extends Todo {
    /** @var 'add'|'rem' $type */
    public $action = '';
}

class Todos
{
    /**
     * @param DataBase $db
     * @param Account $account
     * @return Todo[]
     */
    public static function GetTodos($db, $account) {
        $command = 'SELECT `Checked`, `Title`, `Description`, `Created`, `Deadline`, `Tasks` FROM TABLE WHERE `AccountID` = ?';
        $rows = $db->QueryPrepare('Todos', $command, 'i', [ $account->ID ]);
        if ($rows === false) ExitWithStatus('Error: getting todos failed');

        /** @var Todo[] $newActivity */
        $todos = array();
        for ($i = 0; $i < count($rows); $i++) {
            $tasks = $rows[$i]['Tasks'];
            if ($tasks !== '[]') {
                $tasks = $db->Decrypt($tasks);
            }

            /** @var Todo $newActivity */
            $newTodo = array(
                'checked' => intval($rows[$i]['Checked']),
                'title' => $rows[$i]['Title'],
                'description' => $db->Decrypt($rows[$i]['Description']),
                'created' => intval($rows[$i]['Created']),
                'deadline' => intval($rows[$i]['Deadline']),
                'tasks' => json_decode($tasks, true)
            );

            array_push($todos, $newTodo);
        }

        return $todos;
    }

    /**
     * @param DataBase $db
     * @param Account $account
     * @param TodoUnsaved[] $todos
     */
    public static function AddTodos($db, $account, $todos) {
        for ($i = 0; $i < count($todos); $i++) {
            $todo = $todos[$i];

            // Check if todo is valid
            $keysTodo = array_keys(get_object_vars(new TodoUnsaved()));
            $wrongKeys = array_diff($keysTodo, array_keys((array)$todo));
            if (count($wrongKeys) > 0) {
                continue;
            }

            $action = $todo['action'];                          // 'add' or 'rem'
            $checked = $todo['checked'];                        // int
            $title = $todo['title'];                            // string
            $description = $db->Encrypt($todo['description']);  // string
            $created = $todo['created'];                        // int
            $deadline = $todo['deadline'];                      // int
            $tasks = json_encode($todo['tasks']);               // string
            if ($tasks !== '[]') $tasks = $db->Encrypt($tasks);

            // Check if todo exists
            $command = 'SELECT `ID` FROM TABLE WHERE `AccountID` = ? AND `Title` = ?';
            $reqTodo = $db->QueryPrepare('Todos', $command, 'is', [ $account->ID, $title ]);
            if ($reqTodo === false) ExitWithStatus('Error: adding todo failed');
            $exists = count($reqTodo) > 0;

            // Update todo
            if ($action === 'add' && $exists) {
                $command = 'UPDATE TABLE SET
                    `Checked` = ?,
                    `Title` = ?,
                    `Description` = ?,
                    `Created` = ?,
                    `Deadline` = ?,
                    `Tasks` = ?
                    WHERE `ID` = ?';
                $args = [
                    $checked,
                    $title,
                    $description,
                    $created,
                    $deadline,
                    $tasks,
                    $reqTodo[0]['ID']
                ];
                $types = 'issiisi';

                $r = $db->QueryPrepare('Todos', $command, $types, $args);
                if ($r === false) ExitWithStatus('Error: saving todos failed (update)');
            }

            // Add todo
            else if ($action === 'add' && !$exists) {
                $command = 'INSERT INTO TABLE (
                    `AccountID`,
                    `Checked`,
                    `Title`,
                    `Description`,
                    `Created`,
                    `Deadline`,
                    `Tasks`
                ) VALUES ({?})';
                $args = [
                    $account->ID,
                    $checked,
                    $title,
                    $description,
                    $created,
                    $deadline,
                    $tasks
                ];
                $types = 'iissiis';

                // Replace {?} with ?, ?, ?, ... with the correct number of arguments
                $commandArgs = implode(', ', array_fill(0, count($args), '?'));
                $command = str_replace('{?}', $commandArgs, $command);

                $r = $db->QueryPrepare('Todos', $command, $types, $args);
                if ($r === false) ExitWithStatus('Error: saving todos failed (add)');
            }

            // Remove todo
            else if ($action === 'rem' && $exists) {
                $command = 'DELETE FROM TABLE WHERE `AccountID` = ? AND `ID` = ?';
                $args = [ $account->ID, $reqTodo[0]['ID'] ];
                $r = $db->QueryPrepare('Todos', $command, 'ii', $args);
                if ($r === false) ExitWithStatus('Error: saving todos failed (remove)');
            }
        }
    }
}

?>
