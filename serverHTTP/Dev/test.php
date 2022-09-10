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
    } else if ($action === 'addItems') {
        $lines = array(
            'hair_01|{"fr":"Chauve","en":"Bald"}|{"fr":"Tu es aussi fort que le plus fort des chauves ?","en":"Are you as strong as the strongest bald man?"}|1',
            'hair_02|{"fr":"Bouclé long","en":"Long curly"}|{"fr":"Bonne chance pour les démêler.","en":"Good luck untangling them."}|0',
            'hair_03|{"fr":"Bouclé","en":"Curly"}|{"fr":"Si la couleur est naturelle, c\'est très bizarre...","en":"If the color is natural, it is very strange..."}|2',
            'hair_04|{"fr":"Bouclé court","en":"Short curly"}|{"fr":"Tes cheveux doivent être le plus doux des oreillers.","en":"Your hair must be the softest pillow ever."}|0',
            'hair_05|{"fr":"Raide très long","en":"Really long straigth"}|{"fr":"Tu es le crush du perso principal de l\'animé !","en":"You\'re the crush of the main character in a anime that\'s sure!"}|3',
            'hair_06|{"fr":"Raide long","en":"Long straigth"}|{"fr":"C\'est trop blond pour être vrai, soit vous êtes un espion, soit vous êtes le professeur de la classe 3-E. Peut-être les deux ?","en":"That\'s too blond to be real, either you\'re a spy, either you\'re the teacher of 3-E class. Maybe both?"}|2',
            'hair_07|{"fr":"Raide","en":"Straigth"}|{"fr":"C\'est une coupe sympa.","en":"That\'s a nice haircut."}|0',
            'hair_08|{"fr":"Raide court","en":"Short straigth"}|{"fr":"C\'est la même mèche qu\'un super gardien de foot non ? Il te manque juste le bandeau !","en":"It\'s the same wick as a great soccer goalie, right? All you need is the headband!"}|1',
            'hair_09|{"fr":"Carré court","en":"Short square"}|{"fr":"Vous avez pas une prise jack au bout de chaque oreille ? Super couleur d\'ailleurs !","en":"Don\'t you have a jack plug at the end of each ear? Great color by the way!"}|1',
            'hair_10|{"fr":"Couettes tressées","en":"Braid brunches"}|{"fr":"Ne grandis pas trop vite.","en":"Don\'t grow up too fast."}|0',
            'hair_11|{"fr":"Iroquoise","en":"Iroquois"}|{"fr":"Tu peux casser des buildings comme ils le faisaient dans la pub à l\'époque ?","en":"Can you break buildings like they did in the commercials back in the day?"}|3',
            'hair_12|{"fr":"Hérisson","en":"Hedgehog"}|{"fr":"Ce n\'est pas le même bleu que cet hérisson célèbre ?","en":"This is not the same blue as this famous hedgehog no."}|3',
            'hair_13|{"fr":"Très carré","en":"Really squared"}|{"fr":"C\'est très carré, heureusement t\'as mis un radius > 1.","en":"It\'s very square, fortunately you put a radius > 1."}|2',
            'hair_14|{"fr":"Vibes de pirates","en":"Pirates vibes"}|{"fr":"Des souvenirs d\'un film avec des requins ?","en":"Any souvenirs from a movie with sharks?"}|3',
            'hair_15|{"fr":"Escargot","en":"Snail"}|{"fr":"Tu te bats contre la gravité tous les jours, mon pote, et je trouve ca incroyable !","en":"You fight gravity every day, buddy, and I think it\'s amazing!"}|1',
            'hair_16|{"fr":"Bouclé bizarre","en":"Weird curly"}|{"fr":"Je sais pas, je ne peux pas avoir quelque chose à dire pour chaque coupe frero.","en":"I don\'t know, I don\'t have something to say for each cuts bro."}|0',
            'hair_17|{"fr":"Frange rideau","en":"Curtain fringe"}|{"fr":"Je pari que si tu bats assez fort avec tes deux mèches, tu peux t\'envoler !","en":"I bet if you flap hard enough with your two strands, you can fly away!"}|0',
            'hair_18|{"fr":"Frange araignée","en":"Spider fringe"}|{"fr":"Vous êtes certainement le personnage principal d\'un animé.","en":"You\'re definitely the main character in a anime."}|3',
            'hair_19|{"fr":"Coupe courante","en":"Common cut"}|{"fr":"C\'est une coupe courante.","en":"It\'s a common cut."}|0',
            'hair_20|{"fr":"Coupe banale","en":"Banal cut"}|{"fr":"C\'est une coupe banale.","en":"It\'s a banal cut."}|0',
            'hair_21|{"fr":"Coupe ordinaire","en":"Ordinary cut"}|{"fr":"C\'est une coupe ordinaire.","en":"It\'s an ordinary cut."}|1',
            'hair_22|{"fr":"Afro","en":"Afro"}|{"fr":"Le site .... 5 ? C\'était qui déjà ?","en":"The .... 5 ? Who were they ?"}|1',
            'top_01|{"fr":"TeeShirt","en":"TeeShirt"}|{"fr":"Parce qu\'il faut des items normaux des fois.","en":"Because sometimes you need normal items."}|0',
            'top_02|{"fr":"Manches courte","en":"Short sleeve"}|{"fr":"Il y a trop de boutons. Vous craquerez avant de tous les avoir attaché.","en":"There are too many buttons. You\'ll crack before you get them all fastened."}|0',
            'top_03|{"fr":"Mange longue","en":"Long sleeve"}|{"fr":"Les boutons sont inutiles sur celui-là.","en":"The buttons are useless on this one."}|2',
            'top_04|{"fr":"Débardeur","en":"Tank top"}|{"fr":"Soit l\'été arrive, soit t\'es la personne qui est toujours en teeshirt peu importe la température.","en":"It\'s either summer coming, either you\'re the type of person that is NEVER cold."}|0',
            'top_05|{"fr":"Polo","en":"Polo shirt"}|{"fr":"C\'est classe et vieux jeu, on ne peut pas se tromper avec ça.","en":"That\'s classy and old money, can\'t go wrong with that."}|2',
            'top_06|{"fr":"Pull","en":"Pullover"}|{"fr":"Y\'a quoi de mieux qu\'un pull un peu trop grand et hyper confortable ?","en":"What\'s better than a sweater that\'s a little too big and super comfortable?"}|1',
            'top_07|{"fr":"Couleurs bizarre","en":"Weird colors"}|{"fr":"Qui sait à quoi le designer pensait quand il a fait ça ?","en":"Who knows what the designer was thinking when he made this?"}|0',
            'top_08|{"fr":"Super-héros","en":"Superhero"}|{"fr":"Appartenait autrefois à un héros nul qui n\'a jamais eu l\'occasion d\'honorer son costume, peut-être vous était il destiné ?","en":"Once belonged to a lame hero who never had the opportunity to honor his costume, maybe it was meant for you?"}|3',
            'top_09|{"fr":"Shirt froissé","en":"Crumple shirt"}|{"fr":"Des fois, le fer à repasser ne marche pas bien...","en":"Sometimes the iron doesn\'t work well..."}|1',
            'top_10|{"fr":"Shirt bleuâtre","en":"Bluish shirt"}|{"fr":"Les couleurs de ce teeshirt ressemble étrangement à une créature de mer d\'un univers fantastique...","en":"The colors of this teeshirt looks strangely like a sea creature from a fantasy universe..."}|1',
            'top_11|{"fr":"Tenue de cirque","en":"Circus shirt"}|{"fr":"Allons faire quelques trucs impressionnant !","en":"Let\'s go do some awesome stuff!"}|2',
            'top_12|{"fr":"J\'ai froid","en":"I\'m freezing"}|{"fr":"Il fait vraiment froid dehors.","en":"It\'s really cold out there."}|0',
            'top_13|{"fr":"Shirt verdâtre","en":"Greenish shirt"}|{"fr":"Plutôt chasse ou pêche ?","en":"Hunting or fishing?"}|0',
            'bottom_01|{"fr":"Jean","en":"Jean"}|{"fr":"Un jean.","en":"Jeans."}|0',
            'bottom_02|{"fr":"Jean troué","en":"Jean with hole"}|{"fr":"Un jean; Mais avec des trous.","en":"A pair of jeans; but with holes."}|1',
            'bottom_03|{"fr":"Pantalon de campagne","en":"Country pants"}|{"fr":"Un petit pantalon pantalon de campagne bien sympathique.","en":"A nice little country pants."}|0',
            'bottom_04|{"fr":"Short","en":"Sport shorts"}|{"fr":"Peut être utilisé pour du sport tout comme pour des activités aquatique. Le beach volley est fortement conseillé !","en":"Can be used for sports as well as water activities. Beach volleyball is highly recommended!"}|0',
            'bottom_05|{"fr":"Pantalon cargo","en":"Cargo pants"}|{"fr":"Vous vouliez des poches ? vous allez être servi !","en":"You wanted pockets? You will be served!"}|3',
            'bottom_06|{"fr":"Pantalon armure","en":"Pants armor"}|{"fr":"Ce pantalon est très beau mais difficile à porter. Il est lourd et compliqué à utiliser quand vous voulez vous soulager..","en":"These pants are very beautiful but difficult to wear. It is heavy and complicated to use when you want to relieve yourself."}|3',
            'bottom_07|{"fr":"Short futuriste","en":"Futuristic shorts"}|{"fr":"Les légendes disent que vous pouvez atteindre Mach20 avec ce short.","en":"The legends say that you can reach Mach20 with these shorts."}|3',
            'bottom_08|{"fr":"Short à l\'ancienne","en":"Old fashion shorts"}|{"fr":"Comme au bon vieux temps, non ?","en":"Like in the good old days, right?"}|2',
            'bottom_09|{"fr":"Sarouel","en":"Sirwal pants"}|{"fr":"La partie haute me rappelle quelque chose mais je ne sais plus quoi...","en":"The top part reminds me of something but I can\'t remember what..."}|1',
            'bottom_10|{"fr":"Juste un pantalon","en":"Just pants"}|{"fr":"Des fois, il faut des items normaux.","en":"Sometimes you need normal items."}|0',
            'bottom_11|{"fr":"Un autre pantalon","en":"Another pants"}|{"fr":"Le pli au milieu de chaque jambe parait trop parfait pour être vrai, huuum.","en":"The fold in the middle of each leg looks too perfect to be true, huuum."}|0',
            'bottom_12|{"fr":"Bas cliché","en":"Bottoms cliché"}|{"fr":"Ne vous donnera pas de pouvoir vous permettant de faire tomber la pluie en dansant.","en":"Will not give you the power to make it rain while dancing."}|1',
            'shoes_01|{"fr":"Sneakers","en":"Sneakers"}|{"fr":"Ca me fait penser à un avocat avec le noyau.","en":"It reminds me of an avocado with the pit."}|0',
            'shoes_02|{"fr":"Chaussures banales","en":"Common shoes"}|{"fr":"Le rouge c\'est vraiment une couleur sympa.","en":"Red is a really nice color."}|0',
            'shoes_03|{"fr":"Chaussures de sport","en":"Sport shoes"}|{"fr":"Avec ça, vous pourrez sauter aussi haut qu\'un petit rouquin.","en":"With this, you will be able to jump as high as a little redhead."}|2',
            'shoes_04|{"fr":"Chaussures classes","en":"Classy shoes"}|{"fr":"Maintenant tu dois trouver le reste du costume !","en":"Now you have to find the rest of the suit!"}|1',
            'shoes_05|{"fr":"Bottes","en":"Boots"}|{"fr":"Ces bottes ont gagnés le prix des bottes les plus confortables au monde.","en":"These boots have won the award for the most comfortable boots in the world."}|0',
            'shoes_06|{"fr":"Bottes classes","en":"Classy boots"}|{"fr":"Ca ressemble à des bottes d\'archers d\'autre fois, non ?","en":"It looks like archer\'s boots from old times, right?"}|2',
            'shoes_07|{"fr":"Bottes à l\'ancienne","en":"Old fashion boots"}|{"fr":"Comme au bon vieux temps, non ?","en":"Like in the good old days, right?"}|1',
            'shoes_08|{"fr":"Bottes romaines","en":"Roman boots"}|{"fr":"Appartenaient à un romain ayant pris une droite par un gaulois (qui n\'était pas gros) avec un petit chien.","en":"Belonged to a Roman who was knocked out by a Gallic (who was not fat) with a small dog."}|1',
            'shoes_09|{"fr":"Chaussures autonome","en":"Self lace shoes"}|{"fr":"Le seul problème de ces chaussures c\'est qu\'il faut les mettre à charger.","en":"The only problem with these shoes is that you have to load them."}|2',
            'shoes_10|{"fr":"Chaussures verdâtre","en":"Greenish shoes"}|{"fr":"Ambiance irlandaise ici (c\'est cliché, je sais).","en":"Irish vibes here (that\'s cliché, I know)."}|0',
            'shoes_11|{"fr":"Bottes bleuâtre","en":"Bluish boots"}|{"fr":"La combinaison parfaite entre oeuvre d\'art et objet que l\'on peut salir.","en":"The perfect combination between work of art and object that can be soiled."}|2',
            'shoes_12|{"fr":"Chaussures de momies","en":"Mummy shoes"}|{"fr":"Attention, ces chaussures ont plus de 2000 ans, et l\'odeur aussi.","en":"Beware, these shoes are over 2000 years old, and the smell too."}|2',
            'shoes_13|{"fr":"Juste des chaussettes","en":"Just socks"}|{"fr":"C\'est cool les chaussettes.","en":"Socks are cool."}|1',
            'shoes_14|{"fr":"Chaussures pilotes de F1","en":"F1 driver shoes"}|{"fr":"Elles ont autrefois appartenus à un ancien pilote. Trouverez-vous lequel ?","en":"They once belonged to a former pilot. Can you find out which one?"}|3',
            'shoes_15|{"fr":"Chaussures à 4 orteils","en":"4 toes shoes"}|{"fr":"Pourquoi pas ?","en":"Why not ?"}|1',
            'shoes_16|{"fr":"Sandales bizarre","en":"Weird sandal"}|{"fr":"****, la chaussure qui respire !","en":"****, the shoe that breathes!"}|0'
        );
        $command = 'INSERT INTO TABLE (`ID`, `Slot`, `Name`, `Description`, `Rarity`) VALUES (?, ?, ?, ?, ?)';

        foreach ($lines as $line) {
            $cells = explode('|', $line);
            array_splice($cells, 1, 0, explode('_', $cells[0])[0]);
            $cells[4] = intval($cells[4]);
            $result = $db->QueryPrepare('Items', $command, 'ssssi', $cells);
            if ($result === false) {
                var_dump($cells);
                echo("AIE<br>");
            }
        }
    }

?>