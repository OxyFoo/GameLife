<?php

    function GetAllInternalData($db, $lang) {
        $db_all = array();
        $db_all['quotes'] = GetQuotes($db, $lang);
        $db_all['titles'] = GetTitles($db, $lang);
        $db_all['skills'] = GetSkills($db, $lang);
        $db_all['skillsIcon'] = GetSkillsIcon($db);
        $db_all['achievements'] = GetAchievements($db, $lang);
        $db_all['helpers'] = GetContributors($db, $lang);
        return $db_all;
    }

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
        $skills_safe = array();

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

            // Logo
            $LogoID = $skills[$i]["LogoID"];
            if ($LogoID == 0) {
                for ($c = 0; $c < count($categories); $c++) {
                    if ($categories[$c]["ID"] == $CategoryID) {
                        $categoryLogoID = $categories[$c]["LogoID"];
                        if ($categoryLogoID != 0) {
                            $skills[$i]["LogoID"] = $categoryLogoID;
                        }
                        break;
                    }
                }
            }

            array_push($skills_safe, $skills[$i]);
        }

        $skills_sorted = SortDictBy($skills_safe, "Name");

        return $skills_sorted;
    }

    function GetContributors($db, $lang) {
        $helpers = $db->QueryArray("SELECT * FROM `Contributors`");
        $helpers_sorted = array();
        $helpers_count = count($helpers);

        // Sort
        $priority = 0;
        while (!!count($helpers)) {
            $founded = 0;
            for ($i = 0; $i < count($helpers); $i++) {
                if ($helpers[$i]["Priority"] == $priority) {
                    array_push($helpers_sorted, $helpers[$i]);
                    array_splice($helpers, $i, 1);
                    $founded = 1;
                    break;
                }
            }
            if (!$founded) {
                $priority++;
            }
        }

        // Translations
        for ($i = 0; $i < $helpers_count; $i++) {
            $Translations = $helpers_sorted[$i]["TypeTrad"];
            unset($helpers_sorted[$i]["TypeTrad"]);
            unset($helpers_sorted[$i]["Priority"]);

            if (isJson($Translations)) {
                $jsonTranslations = json_decode($Translations);
                if (!empty($jsonTranslations->$lang)) {
                    $helpers_sorted[$i]["Type"] = $jsonTranslations->$lang;
                }
            }
        }
        return $helpers_sorted;
    }

    function GetSelfPosition($db, $account, $time) {
        $position = 0;
        $accountID = $account['ID'];
        $users = $db->QueryArray("SELECT * FROM `Users`");

        while (count($users) > 0) {
            $maxID = -1;
            $maxXP = 0;
            for ($u = 0; $u < count($users); $u++) {
                $xp = intval($users[$u]['XP']);
                if ($xp > $maxXP) {
                    $maxID = $u;
                    $maxXP = $xp;
                }
            }
            $position++;
            if ($users[$maxID]['ID'] == $accountID || $maxID === -1) break;
            array_splice($users, $maxID, 1);
        }

        return $position;
    }
    function GetLeaderboard($db, $time) {
        $topUsers = array();
        $users = $db->QueryArray("SELECT * FROM `Users`");

        // Sort users by XP
        $maxTopUsers = 100;
        while (count($topUsers) < $maxTopUsers) {
            $maxID = -1;
            $maxXP = 0;
            for ($u = 0; $u < count($users); $u++) {
                $xp = intval($users[$u]['XP']);
                if ($xp > $maxXP) {
                    $maxID = $u;
                    $maxXP = $xp;
                }
            }
            if ($maxID === -1) {
                break;
            }
            $user = array(
                'Username' => $users[$maxID]['Username'],
                'Title' => $users[$maxID]['Title'],
                'XP' => $users[$maxID]['XP']
            );
            array_push($topUsers, $user);
            array_splice($users, $maxID, 1);
        }

        return $topUsers;
    }

    function GetSkillsIcon($db) {
        $skillsIcon = $db->QueryArray("SELECT * FROM `SkillsIcon`");
        return $skillsIcon;
    }

?>