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
        $titles = $db->QueryArray("SELECT * FROM `Titles`");

        // Translations
        for ($i = 0; $i < count($titles); $i++) {
            $Translations = $titles[$i]["Translations"];
            unset($titles[$i]["Translations"]);

            if (isJson($Translations)) {
                $jsonTranslations = json_decode($Translations);
                if (!empty($jsonTranslations->$lang)) {
                    $titles[$i]["Title"] = $jsonTranslations->$lang;
                }
            }
        }

        return $titles;
    }

    function GetAchievements($db, $lang = 'fr') {
        $achievements = $db->QueryArray("SELECT * FROM `Achievements`");

        // Translations
        for ($i = 0; $i < count($achievements); $i++) {
            $NameTranslations = $achievements[$i]["NameTranslations"];
            $DescriptionTranslations = $achievements[$i]["DescriptionTranslations"];
            unset($achievements[$i]["NameTranslations"]);
            unset($achievements[$i]["DescriptionTranslations"]);

            if (isJson($NameTranslations)) {
                $jsonTranslations = json_decode($NameTranslations);
                if (!empty($jsonTranslations->$lang)) {
                    $achievements[$i]["Name"] = $jsonTranslations->$lang;
                }
            }
            if (isJson($DescriptionTranslations)) {
                $jsonTranslations = json_decode($DescriptionTranslations);
                if (!empty($jsonTranslations->$lang)) {
                    $achievements[$i]["Description"] = $jsonTranslations->$lang;
                }
            }
        }

        return $achievements;
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

    function GetHelpers($db) {
        $helpers = $db->QueryArray("SELECT * FROM `Helpers`");
        return $helpers;
    }

    function GetSelfPosition($db, $account) {
        $position = 0;
        $accountID = $account['ID'];
        $users = $db->QueryArray("SELECT * FROM `Users`");

        // Count > 0
        $length = 0;
        for ($i = 0; $i < count($users); $i++) {
            if (intval($users[$i]['XP']) > 0) $length++;
        }

        // Get sorted users
        for ($l = 0; $l < $length; $l++) {
            $maxID = 0;
            $maxXP = 0;
            for ($i = 0; $i < count($users); $i++) {
                if (intval($users[$i]['XP']) > $maxXP) {
                    $maxID = $i;
                    $maxXP = intval($users[$i]['XP']);
                }
            }
            if ($maxID == $accountID) {
                break;
            }
            $position++;
            unset($users[$maxID]);
        }

        return $position;
    }
    function GetLeaderboard($db) {
        $topUsers = array();
        $users = $db->QueryArray("SELECT * FROM `Users`");

        // Count > 0
        $length = 0;
        for ($i = 0; $i < count($users); $i++) {
            if (intval($users[$i]['XP']) > 0) $length++;
        }
        if ($length > 50) {
            $length = 50;
        }

        // Get sorted users
        for ($l = 0; $l < $length; $l++) {
            $maxID = 0;
            $maxXP = 0;
            for ($i = 0; $i < count($users); $i++) {
                if (intval($users[$i]['XP']) > $maxXP) {
                    $maxID = $i;
                    $maxXP = intval($users[$i]['XP']);
                }
            }
            $user = array(
                'Username' => $users[$maxID]['Username'],
                'Title' => $users[$maxID]['Title'],
                'XP' => $users[$maxID]['XP']
            );
            array_push($topUsers, $user);
            unset($users[$maxID]);
        }

        return $topUsers;
    }

?>