<?php

    require('./src/sql.php');
    require('./src/add.php');

    $dir = './backups';
    $db = new DataBase();

    function TableToFormatJson($table) {
        global $db;

        $format = "[\n";
        $array = $db->QueryArray("SELECT * FROM `$table`");
        $nb_length = count($array);
        for ($i = 0; $i < $nb_length; $i++) {
            $line = json_encode($array[$i]);
            $separator = ($i == $nb_length - 1) ? '' : ',';
            $format .= "{$line}{$separator}\n";
        }
        $format .= "]";
        return $format;
    }

    function TextToFile($table, $text) {
        global $dir;
        $date = date("y-m-d");
        $name = "{$date}_{$table}.json";
        $fp = fopen("$dir/$name", 'w');
        fwrite($fp, $text);
        fclose($fp);
    }

    function BackupTable($table) {
        $content = TableToFormatJson($table);
        TextToFile($table, $content);
    }

    BackupTable('Accounts');
    BackupTable('Devices');

?>