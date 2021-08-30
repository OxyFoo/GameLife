<?php

    function GetQuotes($db, $lang = 'fr') {
        $quotes = $db->QueryArray("SELECT * FROM `Quotes`");
        $validQuotes = array();
        for ($q = 0; $q < count($quotes); $q++) {
            $Lang = $quotes[$q]["Lang"];
            $Quote = $quotes[$q]["Quote"];
            $Author = $quotes[$q]["Author"];
            if (areSet([$Lang, $Quote, $Author])) {
                if ($Lang == $lang || $Lang == 'en') {
                    array_push($validQuotes, $quotes[$q]);
                }
            }
        }
        return $validQuotes;
    }

    function GetTitles($db, $lang = 'fr') {
        // TODO - Multilangue !
        return $db->QueryArray("SELECT * FROM `Titles`");
    }

    function GetSkills($db, $lang = 'fr') {
        $skills = $db->QueryArray("SELECT * FROM `Skills`");
        $categories = $db->QueryArray("SELECT * FROM `Categories`");
        $safeSkills = array();

        for ($i = 0; $i < count($skills); $i++) {
            // Get old stats
            $Wisdom = $skills[$i]["Wisdom"];
            $Intelligence = $skills[$i]["Intelligence"];
            $Confidence = $skills[$i]["Confidence"];
            $Strength = $skills[$i]["Strength"];
            $Stamina = $skills[$i]["Stamina"];
            $Dexterity = $skills[$i]["Dexterity"];
            $Agility = $skills[$i]["Agility"];

            // Remove old stats
            unset($skills[$i]["Wisdom"]);
            unset($skills[$i]["Intelligence"]);
            unset($skills[$i]["Confidence"]);
            unset($skills[$i]["Strength"]);
            unset($skills[$i]["Stamina"]);
            unset($skills[$i]["Dexterity"]);
            unset($skills[$i]["Agility"]);

            // Add new stats
            $Stats = array(
                "sag" => $Wisdom,
                "int" => $Intelligence,
                "con" => $Confidence,
                "for" => $Strength,
                "end" => $Stamina,
                "agi" => $Agility,
                "dex" => $Dexterity
            );
            $skills[$i]["Stats"] = $Stats;

            // Verifications
            $Name = $skills[$i]["Name"];
            $CategoryID = $skills[$i]["CategoryID"];
            if (empty($Name) || $CategoryID === 0) {
                continue;
            }

            // Set category & translations
            unset($skills[$i]["CategoryID"]);
            for ($c = 0; $c < count($categories); $c++) {
                if ($categories[$c]["ID"] == $CategoryID) {
                    $categoryName = $categories[$c]["Name"];
                    $categoryTrans = $categories[$c]["Translations"];
                    if (isJson($categoryTrans)) {
                        $trans = json_decode($categoryTrans);
                        if (!empty($trans->$lang)) {
                            $categoryName = $trans->$lang;
                        }
                    }
                    $skills[$i]["Category"] = $categoryName;
                    break;
                }
            }

            // Verification (2)
            if (empty($skills[$i]["Category"])) {
                continue;
            }

            // Name translations
            $Translations = $skills[$i]["Translations"];
            unset($skills[$i]["Translations"]);
            if (isJson($Translations)) {
                $trans = json_decode($Translations);
                if (!empty($trans->$lang)) {
                    $skills[$i]["Name"] = $trans->$lang;
                }
            }

            array_push($safeSkills, $skills[$i]);
        }

        return $safeSkills;
    }

?>