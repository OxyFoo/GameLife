<?php

    function GetAllInternalData($db, $lang = 'fr') {
        $db_all = array();
        $db_all['achievements'] = GetAchievements($db, $lang);
        $db_all['contributors'] = GetContributors($db, $lang);
        $db_all['quotes'] = GetQuotes($db, $lang);
        $db_all['skills'] = GetSkills($db, $lang);
        $db_all['skillsIcon'] = GetSkillsIcon($db);
        $db_all['skillsCategory'] = GetSkillsCategory($db, $lang);
        $db_all['titles'] = GetTitles($db, $lang);
        return $db_all;
    }

    function GetAchievements($db, $lang = 'fr') {
        $achievements = $db->QueryArray("SELECT * FROM `Achievements`");
        if ($achievements === FALSE) return array();
        for ($i = 0; $i < count($achievements); $i++) {
            $achievements[$i]['ID'] = intval($achievements[$i]['ID']);
            $achievements[$i]['Type'] = intval($achievements[$i]['Type']);
        }
        return $achievements;
    }

    function GetContributors($db, $lang) {
        $helpers = $db->QueryArray("SELECT * FROM `Contributors`");
        if ($helpers === FALSE) return array();

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
            $helpers_sorted[$i]['ID'] = intval($helpers_sorted[$i]['ID']);
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

    function GetQuotes($db, $lang = 'fr') {
        $quotes = $db->QueryArray("SELECT * FROM `Quotes`");
        $validQuotes = array();
        if ($quotes !== FALSE) {
            for ($i = 0; $i < count($quotes); $i++) {
                $quotes[$i]['ID'] = intval($quotes[$i]['ID']);
                $Lang = $quotes[$i]["Lang"];
                $Quote = $quotes[$i]["Quote"];
                $Author = $quotes[$i]["Author"];
                if (areSet([$Lang, $Quote, $Author])) {
                    if ($Lang == $lang) {
                        array_push($validQuotes, $quotes[$i]);
                    } else if ($lang === 'fr' && $Lang === 'en') {
                        $add = rand(0, 20) === 0;
                        if ($add) {
                            array_push($validQuotes, $quotes[$i]);
                        }
                    }
                }
            }
        }
        return $validQuotes;
    }

    function GetSkills($db, $lang = 'fr') {
        $skills = $db->QueryArray("SELECT * FROM `Skills`");
        $categories = $db->QueryArray("SELECT * FROM `SkillsCategory`");
        $skills_safe = array();

        if ($skills !== FALSE && $categories !== FALSE) {
            for ($i = 0; $i < count($skills); $i++) {
                $skills[$i]["ID"] = intval($skills[$i]["ID"]);
                $skills[$i]["XP"] = intval($skills[$i]["XP"]);

                // Get old stats
                $Intelligence = $skills[$i]["Intelligence"];
                $Social = $skills[$i]["Social"];
                $Strength = $skills[$i]["Strength"];
                $Stamina = $skills[$i]["Stamina"];
                $Dexterity = $skills[$i]["Dexterity"];
                $Agility = $skills[$i]["Agility"];

                // Remove old stats
                unset($skills[$i]["Intelligence"]);
                unset($skills[$i]["Social"]);
                unset($skills[$i]["Strength"]);
                unset($skills[$i]["Stamina"]);
                unset($skills[$i]["Dexterity"]);
                unset($skills[$i]["Agility"]);

                // Add new stats
                $Stats = array(
                    "int" => intval($Intelligence),
                    "soc" => intval($Social),
                    "for" => intval($Strength),
                    "end" => intval($Stamina),
                    "agi" => intval($Agility),
                    "dex" => intval($Dexterity)
                );
                $skills[$i]["Stats"] = $Stats;

                // Verifications
                $Name = $skills[$i]["Name"];
                $CategoryID = $skills[$i]["CategoryID"];
                if (empty($Name) || $CategoryID === 0) {
                    continue;
                }
                $skills[$i]["CategoryID"] = intval($CategoryID);

                // Logo
                $LogoID = $skills[$i]["LogoID"];
                $skills[$i]["LogoID"] = intval($LogoID);
                if ($LogoID == 0) {
                    for ($c = 0; $c < count($categories); $c++) {
                        if ($categories[$c]["ID"] == $CategoryID) {
                            $categoryLogoID = $categories[$c]["LogoID"];
                            if ($categoryLogoID != 0) {
                                $skills[$i]["LogoID"] = intval($categoryLogoID);
                            }
                            break;
                        }
                    }
                }

                array_push($skills_safe, $skills[$i]);
            }
        }

        $skills_sorted = SortDictBy($skills_safe, "Name");

        return $skills_sorted;
    }

    function GetSkillsIcon($db) {
        $skillsIcon = $db->QueryArray("SELECT * FROM `SkillsIcon`");
        if ($skillsIcon === FALSE) return array();
        for ($i = 0; $i < count($skillsIcon); $i++) {
            $skillsIcon[$i]["ID"] = intval($skillsIcon[$i]["ID"]);
        }
        return $skillsIcon;
    }

    function GetSkillsCategory($db, $lang = 'fr') {
        $categories = $db->QueryArray("SELECT * FROM `SkillsCategory`");
        if ($categories === FALSE) return array();
        for ($i = 0; $i < count($categories); $i++) {
            $categories[$i]["ID"] = intval($categories[$i]["ID"]);
        }
        return $categories;
    }

    function GetTitles($db, $lang = 'fr') {
        $titles = $db->QueryArray("SELECT * FROM `Titles`");
        if ($titles === FALSE) return array();
        for ($i = 0; $i < count($titles); $i++) {
            $titles[$i]["ID"] = intval($titles[$i]["ID"]);
        }
        return $titles;
    }

    /*function GetSelfPosition($db, $account, $time) {
        $position = 0;
        $accountID = $account['ID'];
        $users = $db->QueryArray("SELECT * FROM `Users`");

        if ($users !== FALSE) {
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
        }

        return $position;
    }
    function GetLeaderboard($db, $time) {
        $topUsers = array();
        $users = $db->QueryArray("SELECT * FROM `Users`");

        // Sort users by XP
        if ($users !== FALSE) {
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
        }

        return $topUsers;
    }*/

?>