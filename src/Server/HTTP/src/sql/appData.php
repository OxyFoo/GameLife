<?php

/**
 * @param DataBase $db
 * @return object
 */
function GetAllAppData($db) {
    $db_all = array();
    $db_all['achievements']   = GetAchievements($db);
    $db_all['contributors']   = GetContributors($db);
    $db_all['items']          = GetItems($db);
    $db_all['quotes']         = GetQuotes($db);
    $db_all['skills']         = GetSkills($db);
    $db_all['skillIcons']     = GetSkillIcons($db);
    $db_all['skillCategories'] = GetSkillCategories($db);
    $db_all['titles']         = GetTitles($db);
    return $db_all;
}

/**
 * Hashes names :
 *     - skills : skills, skillIcons, skillCategories
 *     - equips : achievements, titles, items
 *     - apptxt : contributors, quotes
 * @param DataBase $db
 * @param object $reqHashes 3 hashes to compare
 * @param object $appHashes 3 hashes to compare
 */
function GetNewAppData($db, $reqHashes, $appHashes) {
    $newTables = array();

    if ($reqHashes === null || $reqHashes['skills'] !== $appHashes['skills']) {
        $newTables['skills']         = GetSkills($db);
        $newTables['skillIcons']     = GetSkillIcons($db);
        $newTables['skillCategories'] = GetSkillCategories($db);
    }
    if ($reqHashes === null || $reqHashes['equips'] !== $appHashes['equips']) {
        $newTables['achievements'] = GetAchievements($db);
        $newTables['titles']       = GetTitles($db);
        $newTables['items']        = GetItems($db);
    }
    if ($reqHashes === null || $reqHashes['apptxt'] !== $appHashes['apptxt']) {
        $newTables['contributors'] = GetContributors($db);
        $newTables['quotes']       = GetQuotes($db);
    }

    return $newTables;
}

/**
 * @param DataBase $db
 */
function GetAchievements($db) {
    $command = <<<SQL
SELECT A.*,
    (
        SELECT COUNT(*)
        FROM InventoriesAchievements
        WHERE AchievementID = A.ID
    )
    /
    (
        SELECT COUNT(*)
        FROM Accounts
    )
    * 100
    AS GlobalPercentage
FROM TABLE A;
SQL;

    $achievements = $db->QueryPrepare('Achievements', $command);
    if ($achievements === null) return array();
    for ($i = 0; $i < count($achievements); $i++) {
        $achievements[$i]['ID']          = intval($achievements[$i]['ID']);
        $achievements[$i]['Type']        = intval($achievements[$i]['Type']);
        $achievements[$i]['Name']        = json_decode($achievements[$i]['Name']);
        $achievements[$i]['Description'] = json_decode($achievements[$i]['Description']);
        $achievements[$i]['GlobalPercentage'] = floatval($achievements[$i]['GlobalPercentage']);
    }
    return $achievements;
}

/**
 * @param DataBase $db
 */
function GetContributors($db) {
    $helpers = $db->QueryPrepare('Contributors', 'SELECT `ID`, `Name` FROM TABLE WHERE `Name` != ""');
    if ($helpers === null) return array();

    for ($i = 0; $i < count($helpers); $i++) {
        $helpers[$i]['ID'] = intval($helpers[$i]['ID']);
    }

    return $helpers;
}

/**
 * @param DataBase $db
 */
function GetItems($db) {
    $items = $db->QueryPrepare('Items', 'SELECT * FROM TABLE');
    if ($items === null) return array();

    for ($i = 0; $i < count($items); $i++) {
        $items[$i]['Name']        = json_decode($items[$i]['Name']);
        $items[$i]['Description'] = json_decode($items[$i]['Description']);
        $items[$i]['Buffs']       = json_decode($items[$i]['Buffs']);
        $items[$i]['Value']       = intval($items[$i]['Value']);
        $items[$i]['Rarity']      = intval($items[$i]['Rarity']);
    }

    return $items;
}

/**
 * @param DataBase $db
 */
function GetQuotes($db) {
    $quotes = $db->QueryPrepare('Quotes', 'SELECT `ID`, `Quote`, `Author` FROM TABLE');
    if ($quotes === null) return array();

    return array_map(function($quote) {
        $quote['ID'] = intval($quote['ID']);
        $quote['Quote'] = json_decode($quote['Quote']);
        $quote['Author'] = $quote['Author'];
        return $quote;
    }, $quotes);
}

/**
 * @param DataBase $db
 */
function GetSkills($db) {
    // Pre-sorte skills for french users
    $skills = $db->QueryPrepare('Skills', 'SELECT * FROM TABLE ORDER BY Name COLLATE utf8mb4_unicode_ci');
    $categories = $db->QueryPrepare('SkillCategories', 'SELECT * FROM TABLE');

    $skills_safe = array();
    if ($skills !== null && $categories !== null) {
        for ($i = 0; $i < count($skills); $i++) {
            $skills[$i]['ID'] = intval($skills[$i]['ID']);
            $skills[$i]['XP'] = intval($skills[$i]['XP']);
            $skills[$i]['Enabled'] = !!$skills[$i]['Enabled'];

            // Get old stats
            $Intelligence = $skills[$i]['Intelligence'];
            $Social       = $skills[$i]['Social'];
            $Strength     = $skills[$i]['Strength'];
            $Stamina      = $skills[$i]['Stamina'];
            $Dexterity    = $skills[$i]['Dexterity'];
            $Agility      = $skills[$i]['Agility'];

            // Remove old stats
            unset($skills[$i]['Intelligence']);
            unset($skills[$i]['Social']);
            unset($skills[$i]['Strength']);
            unset($skills[$i]['Stamina']);
            unset($skills[$i]['Dexterity']);
            unset($skills[$i]['Agility']);

            // Add new stats
            $Stats = array(
                'int' => intval($Intelligence),
                'soc' => intval($Social),
                'for' => intval($Strength),
                'sta' => intval($Stamina),
                'agi' => intval($Agility),
                'dex' => intval($Dexterity)
            );
            $skills[$i]['Stats'] = $Stats;

            // Verifications
            $Name = $skills[$i]['Name'];
            $CategoryID = $skills[$i]['CategoryID'];
            if (empty($Name) || $CategoryID === 0) {
                continue;
            }
            $skills[$i]['Name'] = json_decode($Name);
            $skills[$i]['CategoryID'] = intval($CategoryID);

            // Logo
            $LogoID = intval($skills[$i]['LogoID']);
            $skills[$i]['LogoID'] = $LogoID;
            if ($LogoID === 0) {
                for ($c = 0; $c < count($categories); $c++) {
                    if ($categories[$c]['ID'] == $CategoryID) {
                        $categoryLogoID = $categories[$c]['LogoID'];
                        if ($categoryLogoID != 0) {
                            $skills[$i]['LogoID'] = intval($categoryLogoID);
                        }
                        break;
                    }
                }
            }

            array_push($skills_safe, $skills[$i]);
        }
    }

    return $skills_safe;
}

/**
 * @param DataBase $db
 */
function GetSkillIcons($db) {
    $skillIcons = $db->QueryPrepare('SkillIcons', 'SELECT * FROM TABLE');
    if ($skillIcons === null) return array();
    for ($i = 0; $i < count($skillIcons); $i++) {
        $skillIcons[$i]['ID'] = intval($skillIcons[$i]['ID']);
    }
    return $skillIcons;
}

/**
 * @param DataBase $db
 */
function GetSkillCategories($db) {
    $categories = $db->QueryPrepare('SkillCategories', 'SELECT * FROM TABLE');
    if ($categories === null) return array();
    for ($i = 0; $i < count($categories); $i++) {
        $categories[$i]['ID'] = intval($categories[$i]['ID']);
        $categories[$i]['Name'] = json_decode($categories[$i]['Name']);
    }
    return $categories;
}

/**
 * @param DataBase $db
 */
function GetTitles($db) {
    $titles = $db->QueryPrepare('Titles', 'SELECT * FROM TABLE');
    if ($titles === null) return array();
    for ($i = 0; $i < count($titles); $i++) {
        $titles[$i]['ID']      = intval($titles[$i]['ID']);
        $titles[$i]['Name']    = json_decode($titles[$i]['Name']);
        $titles[$i]['Value']   = intval($titles[$i]['Value']);
        $titles[$i]['Buyable'] = intval($titles[$i]['Buyable']);
    }
    return $titles;
}

?>
