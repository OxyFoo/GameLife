<?php

    require('./sql.php');

    $db = new DataBase();

    $action = $_GET["action"];
    if (!isset($action)) {
        $skills = GetSkills($db);
        for ($s = 0; $s < count($skills); $s++) {
            $ID = $skills[$s]["ID"];
            $Name = $skills[$s]["Name"];
            echo("$Name<br />");
        }
    } else if ($action == "test") {
        $lang = 'en';
        $quotes = GetQuotes($db, $lang);
        for ($q = 0; $q < count($quotes); $q++) {
            print_r($quotes[$q]);
            echo("<br /><br />");
        }
        //print_r($quotes);
    } else if ($action == "totaux") {
        $skills = GetSkills($db);
        $ref = isset($_GET["not"]) ? intval($_GET["not"]) : -1;
        for ($s = 0; $s < count($skills); $s++) {
            $Name = $skills[$s]["Name"];
            $total = 0;
            foreach ($skills[$s]["Stats"] as $key => $value) {
                $total += intval($value);
            }
            if ($total != $ref)
            echo("$Name : $total<br />");
        }
    } else if ($action == "compWithoutCreator") {
        $skills = GetSkills($db);
        for ($s = 0; $s < count($skills); $s++) {
            $Name = $skills[$s]["Name"];
            $Creator = $skills[$s]["Creator"];
            if (empty($Creator)) {
                echo("$Name<br />");
            }
        }
    } else if ($action == "compWithCreator") {
        $skills = GetSkills($db);
        for ($s = 0; $s < count($skills); $s++) {
            $Name = $skills[$s]["Name"];
            $Creator = $skills[$s]["Creator"];
            if (!empty($Creator)) {
                echo("$Name<br />");
            }
        }
    } else if ($action == "quickAddHelper") {
        $pwd = $_POST["Password"];
        $type = $_POST["Type"];
        $name = $_POST["Name"];
        $trad = $_POST["Trad"];
        if ($pwd !== "blablajaivraiment0imag!nati0npourlesmotsdepasseuntrucdefou") {
            return;
        }
        if (isset($type, $name)) {
            $db->AddHelper($type, $name, $trad);
        }
    } else if ($action == "quickAddSkill") {
        $pwd = $_POST["Password"];
        $Name = $_POST["Name"];
        $Translations = $_POST["Translations"];
        $CategoryID = $_POST["CategoryID"];
        $Wisdom = $_POST["Wisdom"];
        $Intelligence = $_POST["Intelligence"];
        $Confidence = $_POST["Confidence"];
        $Strength = $_POST["Strength"];
        $Stamina = $_POST["Stamina"];
        $Dexterity = $_POST["Dexterity"];
        $Agility = $_POST["Agility"];
        if ($pwd !== "blablajaivraiment0imag!nati0npourlesmotsdepasseuntrucdefou") {
            return;
        }
        if (isset($Name, $Translations, $CategoryID, $Wisdom, $Intelligence, $Confidence, $Strength, $Stamina, $Dexterity, $Agility)) {
            $db->AddSkill($Name, $Translations, $CategoryID, $Wisdom, $Intelligence, $Confidence, $Strength, $Stamina, $Dexterity, $Agility);
        }
    }

?>