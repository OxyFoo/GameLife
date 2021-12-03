<?php

    require('./src/add.php');
    require('./src/config.php');

    require('./src/functions/mail.php');
    require('./src/functions/functions.php');

    require('./src/sql/account.php');
    require('./src/sql/device.php');
    require('./src/sql/user.php');
    require('./src/sql/internalData.php');
    require('./src/sql/sql.php');

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
        if ($quotes !== FALSE) {
            foreach ($quotes as $quote) {
                $q = $quote['Quote'];
                $a = $quote['Author'];
                echo("$q-$a<br/>");
            }
        }
    } else if ($action === "getData") {
        $app = $db->QueryArray("SELECT * FROM `App`");
        if ($app !== FALSE) {
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
        }
    } else if ($action === "setHashTest") {
        $hashTest = "Blabla";
        $db->Query("UPDATE `App` SET `Date` = current_timestamp(), `Data` = '$hashTest' WHERE `ID` = 'DBHash'");
    } else if ($action === "getAccount") {
        $ID = 1;
        $command = "SELECT * FROM `Users` WHERE `ID` = '$ID'";
        $account = $db->Query($command);
        $accountData = $account->fetch_assoc();
        $activities = $db->Decrypt($accountData['Activities']);
        //print_r($account);
        //echo("<br />");
        //print_r($accountData);
        print_r($activities);
    } else if ($action === "error") {
        print_r("AH");
        //trigger_error("Error", 512);
        //$err = trigger_error("ErrorHandler", 512);
        $err = http_response_code(500);
        print_r($err);
    } else if ($action === "queryEdit") {
        $ID = '140';
        $edit = array(
            'Name' => 'A',
            'OSName' => 'B',
            'OSVersion'  => 'C',
            'Updated' => 'CURRENT_TIMESTAMP()'
        );
        $cond = array('ID' => $ID);
        //$update_command = "UPDATE `Devices` SET `OSName` = '$osName', `OSVersion` = '$osVersion', `Updated` = CURRENT_TIMESTAMP() WHERE `Devices`.`ID` = $ID";
        //$result = $db->Query($update_command);
        $result = $db->QueryEdit('Devices', $edit, $cond);
        print_r($result);
    } else if ($action === 'date') {
        $account = Account::GetByID($db, '1');
        //print_r($account);
        $date = $account['LastChangeUsername'];
        if ($date === NULL) {
            print_r("AH");
        }
        print_r($date);
        $int = strtotime($date);
        echo("<br />");
        print_r($int);
        echo("<br />");
        print_r(strtotime('0000-00-00 00:00:00'));
    }

?>