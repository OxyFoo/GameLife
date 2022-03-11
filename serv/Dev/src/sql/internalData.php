<?php

    /**
     * @param DataBase $db
     * @return object
     */
    function GetAllInternalData($db) {
        $db_all = array();
        $db_all['achievements'] = GetAchievements($db);
        $db_all['contributors'] = GetContributors($db);
        $db_all['quotes'] = GetQuotes($db);
        $db_all['skills'] = GetSkills($db);
        $db_all['skillsIcon'] = GetSkillsIcon($db);
        $db_all['skillsCategory'] = GetSkillsCategory($db);
        $db_all['titles'] = GetTitles($db);
        return $db_all;
    }

    /**
     * Hashes names :
     *     - skills : skills, skillsIcon, skillsCategory
     *     - equips : achievements, titles
     *     - apptxt : contributors, quotes
     * @param DataBase $db
     * @param object $reqHashes 3 hashes to compare
     * @param object $appHashes 3 hashes to compare
     */
    function GetNewInternalData($db, $reqHashes, $appHashes) {
        $newTables = array();

        if ($reqHashes === null || $reqHashes['skills'] !== $appHashes['skills']) {
            $newTables['skills'] = GetSkills($db);
            $newTables['skillsIcon'] = GetSkillsIcon($db);
            $newTables['skillsCategory'] = GetSkillsCategory($db);
        }
        if ($reqHashes === null || $reqHashes['equips'] !== $appHashes['equips']) {
            $newTables['achievements'] = GetAchievements($db);
            $newTables['titles'] = GetTitles($db);
        }
        if ($reqHashes === null || $reqHashes['apptxt'] !== $appHashes['apptxt']) {
            $newTables['contributors'] = GetContributors($db);
            $newTables['quotes'] = GetQuotes($db);
        }

        return $newTables;
    }

    function GetAchievements($db) {
        $achievements = $db->QueryArray("SELECT * FROM `Achievements`");
        if ($achievements === null) return array();
        for ($i = 0; $i < count($achievements); $i++) {
            $achievements[$i]['ID'] = intval($achievements[$i]['ID']);
            $achievements[$i]['Type'] = intval($achievements[$i]['Type']);
            $achievements[$i]['Name'] = json_decode($achievements[$i]['Name']);
            $achievements[$i]['Description'] = json_decode($achievements[$i]['Description']);
        }
        return $achievements;
    }

    function GetContributors($db) {
        $helpers = $db->QueryArray("SELECT * FROM `Contributors`");
        if ($helpers === null) return array();

        for ($i = 0; $i < count($helpers); $i++) {
            $helpers[$i]['ID'] = intval($helpers[$i]['ID']);
        }

        return $helpers;
    }

    function GetQuotes($db) {
        $quotes = $db->QueryArray("SELECT * FROM `Quotes`");
        if ($quotes === null) return array();
        for ($i = 0; $i < count($quotes); $i++) {
            $quotes[$i]['ID'] = intval($quotes[$i]['ID']);
        }
        return $quotes;
    }

    function GetSkills($db) {
        $skills = $db->QueryArray("SELECT * FROM `Skills`");
        $categories = $db->QueryArray("SELECT * FROM `SkillsCategory`");

        $skills_safe = array();
        if ($skills !== null && $categories !== null) {
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
                $skills[$i]['Name'] = json_decode($Name);
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
        if ($skillsIcon === null) return array();
        for ($i = 0; $i < count($skillsIcon); $i++) {
            $skillsIcon[$i]["ID"] = intval($skillsIcon[$i]["ID"]);
        }
        return $skillsIcon;
    }

    function GetSkillsCategory($db) {
        $categories = $db->QueryArray("SELECT * FROM `SkillsCategory`");
        if ($categories === null) return array();
        for ($i = 0; $i < count($categories); $i++) {
            $categories[$i]["ID"] = intval($categories[$i]["ID"]);
            $categories[$i]['Name'] = json_decode($categories[$i]['Name']);
        }
        return $categories;
    }

    function GetTitles($db) {
        $titles = $db->QueryArray("SELECT * FROM `Titles`");
        if ($titles === null) return array();
        for ($i = 0; $i < count($titles); $i++) {
            $titles[$i]["ID"] = intval($titles[$i]["ID"]);
            $titles[$i]["Name"] = json_decode($titles[$i]["Name"]);
        }
        return $titles;
    }

?>