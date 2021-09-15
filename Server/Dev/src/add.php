<?php

    function AddHelper($db, $type, $name, $trad) {
        $command = "INSERT INTO `Helpers` (`Type`, `Name`, `TypeTrad`) VALUES ('$type', '$name', '$trad')";
        $result = $db->Query($command);
        return $result;
    }

    function AddSkill($db, $Name, $Translations, $CategoryID, $Wisdom, $Intelligence, $Confidence, $Strength, $Stamina, $Dexterity, $Agility) {
        $command = "INSERT INTO `Skills` (`Name`, `Translations`, `CategoryID`, `Wisdom`, `Intelligence`, `Confidence`, `Strength`, `Stamina`, `Dexterity`, `Agility`) VALUES ('$Name', '$Translations', '$CategoryID', '$Wisdom', '$Intelligence', '$Confidence', '$Strength', '$Stamina', '$Dexterity', '$Agility')";
        $result = $db->Query($command);
        return $result;
    }

?>