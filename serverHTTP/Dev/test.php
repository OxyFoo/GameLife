<?php

    /**
     * Only used for tests (with GET params).
     */

    require('./src/commands.php');

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
            $command = "INSERT INTO TABLE (`Type`, `Name`, `TypeTrad`) VALUES (?, ?, ?)";
            $result = $db->QueryPrepare('Helpers', $command, 'sss', [ $type, $name, $trad ]);
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
            $command = "INSERT INTO TABLE (`Name`, `Translations`, `CategoryID`, `Wisdom`, `Intelligence`, `Confidence`, `Strength`, `Stamina`, `Dexterity`, `Agility`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $args = [ $Name, $Translations, $CategoryID, $Wisdom, $Intelligence, $Confidence, $Strength, $Stamina, $Dexterity, $Agility ];
            $result = $db->QueryPrepare('Skills', $command, 'ssiiiiiiii', $args);
        }
    } else if ($action === "quotes") {
        $quotes = $db->QueryPrepare('Quotes', "SELECT * FROM TABLE");
        if ($quotes !== null) {
            foreach ($quotes as $quote) {
                $q = $quote['Quote'];
                $a = $quote['Author'];
                echo("$q-$a<br/>");
            }
        }
    } else if ($action === "getData") {
        $app = $db->QueryPrepare('App', "SELECT * FROM TABLE");
        if ($app !== null) {
            $data = array();
            for ($i = 0; $i < count($app); $i++) {
                $index = $app[$i]['ID'];
                $value = $app[$i]['Data'];
                $date = $app[$i]['Date'];
                if ($index === "Version") {
                    $data['Version'] = $value;
                } else if ($index === "Hashes") {
                    $data["Hashes"] = $value;
                    $data["LastHashRefresh"] = MinutesFromDate($date);
                }
            }
            print_r($data);
        }
    } else if ($action === "setHashTest") {
        $hashTest = "Blabla";
        $db->QueryPrepare('App', "UPDATE TABLE SET `Date` = current_timestamp(), `Data` = ? WHERE `ID` = 'Hashes'", 's', [ $hashTest ]);
    } else if ($action === "getAccount") {
        $ID = 1;
        $command = "SELECT * FROM TABLE WHERE `ID` = ?";
        $account = $db->QueryPrepare('Accounts', $command, 'i', [ $ID ]);
        $activities = $db->Decrypt($account['Activities']);
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
    } else if ($action === 'date') {
        $account = Accounts::GetByID($db, '1');
        //print_r($account);
        $date = $account->LastChangeUsername;
        if ($date === null) {
            print_r("AH");
        }
        print_r($date);
        $int = strtotime($date);
        echo("<br />");
        print_r($int);
        echo("<br />");
        print_r(strtotime('0000-00-00 00:00:00'));
    } else if ($action === 'success') {
        $achievements = $db->QueryPrepare('Achievements', "SELECT * FROM TABLE");
        /*foreach ($achievements as $key => $value) {
            print_r($key);
            print_r("=>");
            print_r($value);
            echo("<br />");
        }*/
        echo(json_encode($achievements));
    } else if ($action === 'removeTranslations') {
        $skills = $db->QueryPrepare('Skills', "SELECT * FROM TABLE");
        $list = array(
            '{"fr":"Corde à sauter","en":"Jumping rope", "es":"Cuerda de saltar"}',
            '{"fr":"Accrobranche","en":"Tree climbing"}',
            '{"fr":"Volleyball","en":"Volleyball"}',
            '{"fr":"Teakwondo","en":"Taekwondo"}',
            '{"fr":"Musculation (poids de corps)","en":"Calisthenics"}',
            '{"fr":"Lecture","en":"Reading"}',
            '{"fr":"Via-Ferrata","en":"Via-Ferrata"}',
            '{"fr":"Natation","en":"Swimming"}',
            '{"fr":"Ecriture (d\'histoire)","en":"Story writing"}',
            '{"fr":"Dessin","en":"Drawing"}',
            '{"fr":"Musculation (salle)","en":"Musculation"}',
            '{"fr":"Danse","en":"Dance"}',
            '{"fr":"Scoutisme","en":"Scouting"}',
            '{"fr":"Marche","en":"Walk"}',
            '{"fr":"Travail Scolaire","en":"School work"}',
            '{"fr":"Piano","en":"Piano"}',
            '{"fr":"Bricolage","en":"Handiwork"}',
            '{"fr":"Modélisation 3D","en":"3D Modeling"}',
            '{"fr":"Violon","en":"Violon"}',
            '{"fr":"Cuisine","en":"Cooking"}',
            '{"fr":"Ménage","en":"Household"}',
            '{"fr":"Puzzle","en":"Jigsaw puzzle"}',
            '{"fr":"Rubiks Cube","en":"Rubiks Cube"}',
            '{"fr":"Peinture","en":"Painting"}',
            '{"fr":"Basketball","en":"Basketball"}',
            '{"fr":"Course","en":"Run"}',
            '{"fr":"Vélo","en":"Bike"}',
            '{"fr":"Ultimate","en":"Ultimate"}',
            '{"fr":"Trail","en":"Trail"}',
            '{"fr":"Combat","en":"Fight"}',
            '{"fr":"Sport freestyle","en":"Freestyle sport"}',
            '{"fr":"Escrime","en":"Fencing"}',
            '{"fr":"Boxe","en":"Boxing"}',
            '{"fr":"Hacking","en":"Hacking"}',
            '{"fr":"Méditation","en":"Meditation"}',
            '{"fr":"Surf","en":"Surfing"}',
            '{"fr":"Skateboad","en":"Skateboarding"}',
            '{"fr":"Apprentissage langue","en":"Language learning"}',
            '{"fr":"Judo","en":"Judo"}',
            '{"fr":"Aïkido","en":"Aikido"}',
            '{"fr":"Tricot / Couture","en":"Knitting \/ Sewing"}',
            '{"fr":"Chant","en":"Singing"}',
            '{"fr":"Escalade","en":"Climbing"}',
            '{"fr":"Lutte","en":"Wrestling"}',
            '{"fr":"Equitation","en":"Horseback riding"}',
            '{"fr":"Shadow Boxing","en":"Shadow Boxing"}',
            '{"fr":"Mécanique","en":"mechanic"}',
            '{"fr":"Yoga","en":"Yoga"}',
            '{"fr":"Football","en":"Soccer"}',
            '{"fr":"Gymnastique","en":"Gymnastics"}',
            '{"fr":"Tennis","en":"Tennis"}',
            '{"fr":"Rugby","en":"Rugby"}',
            '{"fr":"Trampoline","en":"Trampoline"}',
            '{"fr":"Production musicale","en":"Music production"}',
            '{"fr":"Tir (précision)","en":"Precision shooting"}',
            '{"fr":"Jardinage","en":"Gardening"}',
            '{"fr":"Sprint","en":"Sprinting"}',
            '{"fr":"Pen Spinning","en":"Pen spinning"}',
            '{"fr":"Création artistique","en":"Artistic creation"}',
            '{"fr":"Promener animal","en":"Pet walking"}',
            '{"fr":"S\'occuper d\'enfants","en":"Childcare"}',
            '{"fr":"Musée, galerie","en":"Museum, gallery"}',
            '{"fr":"Casse-tête","en":"Puzzle"}',
            '{"fr":"Mixologie","en":"Mixology"}',
            '{"fr":"Roller","en":"Roller"}',
            '{"fr":"VTT free-ride","en":"Free-ride bike"}',
            '{"fr":"Muay thai","en":"Muay thai"}',
            '{"fr":"Football Americain","en":"Football"}',
            '{"fr":"Jeune Sapeur Pompiers","en":"Young firefighter"}',
            '{"fr":"Programmation","en":"Coding"}',
            '{"fr":"Guitare","en":"Guitare"}',
            '{"fr":"Discours","en":"Speech"}',
            '{"fr":"Forgeron","en":"Blacksmith"}',
            '{"fr":"Pétanque","en":"Petanque"}',
            '{"fr":"Plongée sous marine","en":"Scuba Diving"}',
            '{"fr":"Voile","en":"Sailing"}',
            '{"fr":"Randonnee","en":"Hike"}',
            '{"fr":"Ping pong","en":"Table tennis"}',
            '{"fr":"Gainage","en":"Core building"}',
            '{"fr":"Jujitsu","en":"Jujitsu"}',
            '{"fr":"Crossfit","en":"Crossfit"}',
            '{"fr":"Lancer de poids","en":"Weight throw"}',
            '{"fr":"Jogging","en":"Jogging"}',
            '{"fr":"Renforcement musculaire","en":"muscular reinforcement"}',
            '{"fr":"Pôle dance","en":"Dance pole"}',
            '{"fr":"Saut en hauteur","en":"High Jump"}',
            '{"fr":"Kait surf","en":"Kait surfing"}',
            '{"fr":"Apnée","en":"Apnea"}',
            '{"fr":"Parkour","en":"Parkour"}',
            '{"fr":"Kayak","en":"Kayak"}',
            '{"fr":"Handball","en":"Handball"}',
            '{"fr":"Badminton","en":"Badminton"}',
            '{"fr":"Accordeon","en":"Accordion"}',
            '{"fr":"Trombone","en":"Trombone"}',
            '{"fr":"Solfege","en":"Music theory"}',
            '{"fr":"Billard","en":"Pool"}',
            '{"fr":"Echec","en":"Chess"}',
            '{"fr":"Tour de carte","en":"Card trick"}',
            '{"fr":"Theâtre","en":"Theatre"}',
            '{"fr":"Photographie","en":"Photography"}',
            '{"fr":"Montage","en":"Editing"}',
            '{"fr":"Dressage (animal)","en":"Animal training"}',
            '{"fr":"Redaction","en":"Redaction"}',
            '{"fr":"Couteau papillon","en":"Butterfly knife"}',
            '{"fr":"Création cosplay","en":"Cosplay creation"}',
            '{"fr":"Botanique","en":"Botany"}',
            '{"fr":"Photo animalière","en":"Animal photography"}'
        );
        foreach ($skills as $key => $value) {
            //$translations = json_encode($value['Translations']);
            $ID = $value['ID'];
            $name = $list[$ID - 1];
            //$translations['fr'] = $name;
            //$test = str_replace('{', "{$name,", $translations);
            //$translations = str_replace("{", "{\"fr\": \"$name\",", $translations);
            //print_r($translations);

            /*if (json_decode($name) === false) {
                print_r($ID);
                print_r($name);
                echo("<br />");
            }*/

            $db->QueryPrepare('Skills', "UPDATE TABLE SET `Name` = ? WHERE `Skills`.`ID` = ?", 's', [ $name, $ID ]);
        }
    } else if ($action === 'testTIMESTAMP') {
        $account = Accounts::GetByID($db, 1);
        $usernameTime = strtotime($account->LastChangeUsername);
        print_r($usernameTime);
    } else if ($action === 'testQuery') {
        // Average: 0.27ms/query
        $t1 = microtime(true);
        $activities = $db->QueryPrepare('Activities', "SELECT * FROM TABLE WHERE `AccountID` = '14'");
        /*for ($i = 0; $i < 100*1000; $i++) {
            $db->QueryPrepare('Activities', "INSERT INTO TABLE (`AccountID`, `SkillID`, `StartTime`, `Duration`) VALUES ('0', '0', '0', '0')");
            $id = $db->GetLastInsertID();
            $db->QueryPrepare('Activities', "DELETE FROM TABLE WHERE `ID` = ?", 'i', [ $id ]);
        }*/
        $t2 = microtime(true);
        $delta = ($t2 - $t1) * 1000;
        //print_r($activities);
        print_r("<br/>$delta ms");
    } else if ($action === 'readNews') {
        $appData = GetAppData($db);
        $news = $appData['News'];
        //print_r($appData);
        print_r($news[0]);
    } else if ($action === 'addOx') {
        Users::AddOx($db, 1, -14);
    } else if ($action === 'getOx') {
        $ox = Users::GetOx($db, 1);
        print_r($ox);
    } else if ($action === 'query') {
        $giftCodes = $db->QueryPrepare('GiftCodes', "SELECT `Rewards`, `Available` FROM TABLE WHERE `ID` = 'AEIOUY'");
        if ($giftCodes === false || count($giftCodes) === 0) {
            echo('Fail');
        } else {
            $rewards = $giftCodes[0]['Rewards'];
            $available = $giftCodes[0]['Available'];
            echo("$rewards, $available");
        }
    } else if ($action === 'newQuery') {
        $test = $db->QueryPrepare('GiftCodes', "SELECT * FROM TABLE");
        print_r($test);

        echo('<br />');
        $test2 = $db->QueryPrepare('GiftCodes', "SELECT * FROM TABLE");
        print_r($test2);

        echo('<br />');
        $test3 = $db->QueryPrepare('GiftCodes', "UPDATE TABLE SET `Available` = ? WHERE `ID` = ?", 'is', array(2, 'AEIOUY'));
        print_r($test3);

        echo('<br />');
        $test4 = $db->QueryPrepare('GiftCodes', "SELECT * FROM TABLE");
        print_r($test4);

        echo('<br />');
        $test5 = $db->GetTables();
        if ($test5 === false) echo('Fail');
        else print_r($test5);
    }

?>