<?php

    require('./src/sql.php');
    require('./src/add.php');

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
            AddHelper($db, $type, $name, $trad);
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
            AddSkill($db, $Name, $Translations, $CategoryID, $Wisdom, $Intelligence, $Confidence, $Strength, $Stamina, $Dexterity, $Agility);
        }
    } else if ($action === "quotes") {
        $quotes = $db->QueryArray("SELECT * FROM `Quotes`");
        foreach ($quotes as $quote) {
            $q = $quote['Quote'];
            $a = $quote['Author'];
            echo("$q-$a<br/>");
        }
    } else if ($action === "getData") {
        $app = $db->QueryArray("SELECT * FROM `App`");
        $data = array();
        for ($i = 0; $i < count($app); $i++) {
            $index = $app[$i]['ID'];
            $value = $app[$i]['Data'];
            $date = $app[$i]['Date'];
            if ($index === "Version") {
                $data['Version'] = $value;
            } else if ($index === "DBHash") {
                $data["DBHash"] = $value;
                $data["LastHashRefresh"] = MinutesFromDate($date);
            }
        }
        print_r($data);
    } else if ($action === "setHashTest") {
        // TODO - Check upate
        $hashTest = "Blabla";
        $db->Query("UPDATE `App` SET `Date` = current_timestamp(), `Data` = '$hashTest' WHERE `ID` = 'DBHash'");
    }

?>