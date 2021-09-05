-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : Dim 05 sep. 2021 à 12:33
-- Version du serveur :  10.4.19-MariaDB-cll-lve
-- Version de PHP : 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `u444572210_GameLife`
--

-- --------------------------------------------------------

--
-- Structure de la table `Achievements`
--

CREATE TABLE `Achievements` (
  `ID` int(11) NOT NULL,
  `Type` tinyint(4) NOT NULL DEFAULT 1,
  `Name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Description` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
  `NameTranslations` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DescriptionTranslations` varchar(4096) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Conditions` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Reward` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `Achievements`
--

INSERT INTO `Achievements` (`ID`, `Type`, `Name`, `Description`, `NameTranslations`, `DescriptionTranslations`, `Conditions`, `Reward`) VALUES
(1, 0, 'Est-ce que t\'as déjà léché les deux boules d\'un mec ? ', 'Vous, êtes un pro de la pétanque ! ', '{\"en\":\"Have you ever licked both of a guy\'s balls?\"}', '{\"en\":\"You are a pro at pétanque! \"}', 'Sk78 GT 50', ''),
(2, 1, 'Concentration absolue', 'Vous êtes devenu un maitre de la méditation ! ', '{\"en\": \"total focus\"}', '{\"en\": \"You have become a master of meditation \"}', 'Sk36 GT 50', 'un titre genre MasterMind + 100 sagesse'),
(4, 0, 'Intrépide', 'Etre dans l\'application avec moins de 5% de batterie', '{\"en\": \"Fearless\" }', '{\"en\": \"Be in the application with less than 5% of battery\" }', 'B LT 0.05', ''),
(5, -1, '', 'Etre les créateurs', '', '', '', ''),
(6, -1, '', '1000 heures de musculation (en salle) ', '', '', 'SkT11 GT 1000', ''),
(7, 1, 'Chasseur de rang D', 'Avoir une compétence de niveau 5 dans une catégorie', '{\"en\": \"D rank hunter\"}', '{\"en\": \"Have a level 5 skill in one category \"}', '1Ca GT 5', ''),
(8, 1, 'Chasseur de rang C', 'Avoir une compétence de niveau 10 dans deux catégories ', '{\"en\": \"C rank hunter\"}', '{\"en\": \"Have a level 10 skill in two categories \"}', '2Ca GT 10', ''),
(9, 1, 'Chasseur de rang B', 'Avoir une compétence de niveau 15 dans trois catégories ', '{\"en\": \"B rank hunter\"}', '{\"en\": \"Have a level 15 skill in three categories \"}', '3Ca GT 15', ''),
(10, 1, 'Chasseur de rang A', 'Avoir une compétence de niveau 20 dans quatre catégories ', '{\"en\": \"A rank hunter\"}', '{\"en\": \"Have a level 20 skill in four categories \"}', '4Ca GT 20', ''),
(11, 1, 'Chasseur de rang S', 'Avoir une compétence de niveau 30 dans cinq catégories ', '{\"en\": \"S rank hunter\"}', '{\"en\": \"Have a level 30 skill in five categories \"}', '5Ca GT 30', ''),
(12, 1, 'Chasseur de rang nation', 'Avoir une compétence de niveau 50 dans dix catégories', '{\"en\": \"National level hunter\"}', '{\"en\": \"Have a level 50 skill in ten categories \"}', '10Ca GT 50', ''),
(13, -1, '', 'Assurance&gt;500', '', '', 'Stsag GT 500', ''),
(14, 1, 'Beta testeur', 'Être beta testeur', '{\"en\": \"Beta tester\"}', '{\"en\": \"Being a beta tester \"}', '', ''),
(15, 1, 'Beater', 'Avoir donné 100€', '{\"en\": \"Beater\"}', '{\"en\": \"Donated 100€\"}', '', ''),
(16, 0, 'Chargé à bloc', 'Être dans l\'application avec 100% de batterie', '', '{\"en\": \"Be in the application with 100% battery\" }', 'B GT 1', '');

-- --------------------------------------------------------

--
-- Structure de la table `Beta`
--

CREATE TABLE `Beta` (
  `ID` int(11) NOT NULL,
  `Mail` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Enabled` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `Beta`
--

INSERT INTO `Beta` (`ID`, `Mail`, `Enabled`) VALUES
(1, '974.34.discord@gmail.com', 0),
(2, 'achillefuku@gmail.com', 0),
(3, 'Adoumaetry@icloud.com', 0),
(4, 'alixallaume@gmail.com', 0),
(5, 'amielt31@gmail.com', 0),
(6, 'amoryflorian@gmail.com', 0),
(7, 'Anna.thibao@gmail.com', 0),
(8, 'antoine.45.jeux@gmail.com', 0),
(9, 'Antoine.picci@gmail.com', 0),
(10, 'arthur.lefevre2004@gmail.com', 0),
(11, 'baba.verdon@gmail.com', 0),
(12, 'baptise.marsaa@icloud.com', 0),
(13, 'bastienfournier1412@gmail.com', 0),
(14, 'bechir64110@gmail.com', 0),
(15, 'betroymail@gmail.com', 0),
(16, 'byte.tech.comp@gmail.com', 0),
(17, 'cheik.barro576@gmail.com', 0),
(18, 'Cheikbouboule@gmail.com', 0),
(19, 'choquetlou4@gmail.com', 0),
(20, 'clement.chevalier67@gmail.com', 0),
(21, 'cloecristol@gmail.com', 0),
(22, 'corentinjoseph69@gmail.com', 0),
(23, 'cyrigamingpro@gmail.com', 0),
(24, 'dalmolinmat@gmail.com', 0),
(25, 'davidecharlene@gmail.com', 0),
(26, 'degraaf.matthew@gmail.com', 0),
(27, 'delamauryandre@gmail.com', 0),
(28, 'dimpotter56@gmail.com', 0),
(29, 'drace940@gmail.com', 0),
(30, 'egld@free.fr', 0),
(31, 'elliott.moiroud@gmail.com', 0),
(32, 'enzafouli@hotmail.fr', 0),
(33, 'ercetintibet@gmail.com', 0),
(34, 'ethan29.scelles@gmail.com', 0),
(35, 'fabricegeltz@outlook.fr', 0),
(36, 'fioninademorais@gmail.com', 0),
(37, 'first31773@gmail.com', 0),
(38, 'francoisdumon5@gmail.com', 0),
(39, 'gamingazora@gmail.com', 0),
(40, 'giulio.campina@gmail.com', 0),
(41, 'Guillaumepigeard55@gmail.com', 0),
(42, 'hugo31220@gmail.com', 0),
(43, 'hugobossuet09@gmail.com', 0),
(44, 'hypporun273@gmail.com', 0),
(45, 'isseyfr@gmail.com', 0),
(46, 'jonathancalvino10@gmail.com', 0),
(47, 'jorisf974@gmail.com', 0),
(48, 'Julien.machado2001@gmail.com', 0),
(49, 'julien.vetel@gmail.com', 0),
(50, 'juliennox57@gmail.com', 0),
(51, 'kcadignan@gmail.com', 0),
(52, 'kenjinou0@gmail.com', 0),
(53, 'kevinschreck68@outlook.fr', 0),
(54, 'khizriars@gmail.com', 0),
(55, 'killian.portier@yahoo.fr', 0),
(56, 'kylian.c45@gmail.com', 0),
(57, 'kyliancorbieres@gmail.com', 0),
(58, 'Lilou6047@gmail.com', 0),
(59, 'Loudwig28@gmail.com', 0),
(60, 'louis.v.092006@gmail.com', 0),
(61, 'louischal8@gmail.com', 0),
(62, 'lulutintindu771@gmail.com', 0),
(63, 'lulutontindu771@gmail.com', 0),
(64, 'luttringer.loic@gmail.com', 0),
(65, 'maev235@gmail.com', 0),
(66, 'manah@gmx.com', 0),
(67, 'matavenel@gmail.com', 0),
(68, 'mateo.enjalbert@gmail.com', 0),
(69, 'maxime.vanhee15@gmail.com', 0),
(70, 'melinahaddadh@gmail.com', 0),
(71, 'melvinpes37@gmail.com', 0),
(72, 'micht77.tl@gmail.com', 0),
(73, 'mika.elouazzani@gmail.com', 0),
(74, 'mikael.pecyna@icloud.com', 0),
(75, 'Mirko.25.games@gmail.com', 0),
(76, 'mordem.escrig@gmail.com', 0),
(77, 'nadran.mysterieux@gmail.com', 0),
(78, 'naoga6@gmail.com', 0),
(79, 'nathanael.moncopain@gmail.com', 0),
(80, 'nicoalsgoncalvesng1@gmail.com', 0),
(81, 'nicomonv@gmail.com', 0),
(82, 'night73gaming@gmail.com', 0),
(83, 'nikolakitanovv@gmail.com', 0),
(84, 'niplixgame@gmail.com', 0),
(85, 'noahvallois1805@gmail.com', 0),
(86, 'noham.lecomte@hotmail.com', 0),
(87, 'noolhaand@gmail.com', 0),
(88, 'picarotgame@gmail.com', 0),
(89, 'Pierrick.Boutte42650@icloud.com', 0),
(90, 'pourmaximenoel@gmail.com', 0),
(91, 'quentin.lyonnet@gmail.com', 0),
(92, 'quentin.vandehel@laposte.net', 0),
(93, 'reant.pascal@hotmail.fr', 0),
(94, 'ricyl74@gmail.com', 0),
(95, 'samuelcarpentier2115@outlook.fr', 0),
(96, 'speedleonyt@gmail.com', 0),
(97, 'Styvenbaduel@gmail.com', 0),
(98, 'Tanguyfrancoisditcharlemagne@gmail.com', 0),
(99, 'Tessierjeremy23@sfr.fr', 0),
(100, 'thib.fosse@gmail.com', 0),
(101, 'tiagoribeirax.2007@gmail.com', 0),
(102, 'traskoc@gmail.com', 0),
(103, 'Villarmecelicia@gmail.com', 0),
(104, 'vixpocalyps@gmail.com', 0),
(105, 'Ynotbdn@gmail.com', 0),
(106, 'JonathanCalvino10@gmail.com', 0),
(107, 'julien.machado2001@gmail.com', 0),
(108, 'tanguyfrancoisditcharlemagne@gmail.com', 0),
(109, 'thomasxyoutub@gmail.com', 0),
(110, 'Reant.pascal@hotmail.fr', 0),
(111, 'mordemparadox@gmail.com', 0),
(112, 'leo.crafteam@gmail.com', 0),
(113, 'trvrsbenjamin@gmail.com', 0),
(114, 'Geremy.lecaplain66@gmail.com', 1),
(115, 'Pierre.marsaa@icloud.com', 1),
(116, 'Katanarise@hotmail.com', 1),
(117, 'irnaivip@gmail.com', 0),
(118, 'Laura.lecaplain66@hotmail.fr', 0);

-- --------------------------------------------------------

--
-- Structure de la table `Categories`
--

CREATE TABLE `Categories` (
  `ID` int(11) NOT NULL,
  `Name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Translations` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL,
  `LogoID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `Categories`
--

INSERT INTO `Categories` (`ID`, `Name`, `Translations`, `LogoID`) VALUES
(1, 'Sport', '{\"en\": \"Sport\", \"es\": \"Deporte\"}', 1),
(2, 'Musique', '{\"en\": \"Music\"}', 2),
(3, 'Informatique', '{\"en\": \"Computer work\"}', 3),
(4, 'Travaux manuels', '{\"en\": \"Crafts\"}', 4),
(5, 'Savoir', '{\"en\": \"Knowledge\"}', 5),
(6, 'Tâches maison', '{\"en\": \"Household chores\"}', 6),
(7, 'Jeu de réflexion', '{\"en\": \"Puzzle games\"}', 7),
(8, 'Art', '{\"en\": \"Art\"}', 8),
(9, 'Métier (Physique)', '{\"en\": \"Physical job\"}', 9),
(10, 'Développement personnel', '{\"en\": \"Personal development\"}', 10),
(11, 'Animaux', '{\"en\": \"Pet\"}', 0);

-- --------------------------------------------------------

--
-- Structure de la table `Devices`
--

CREATE TABLE `Devices` (
  `ID` int(11) NOT NULL,
  `Identifier` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Name` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Token` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Created` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `Devices`
--

INSERT INTO `Devices` (`ID`, `Identifier`, `Name`, `Token`, `Created`, `Updated`) VALUES
(35, '$2y$10$BZByXImpVikRF51VH4yIHuhyZTHKBOwTXki724CBA68zOErKaniKK', 'HUAWEI P20 lite', '', '2021-08-17 14:58:30', '0000-00-00 00:00:00'),
(36, '$2y$10$d21D4eDgBbCCjVZHyg8sIOn9OHd/Oz/zTVxtCcv/YHv.Vktw2slQm', 'iPhone 12', '', '2021-08-24 15:34:45', '0000-00-00 00:00:00'),
(37, '$2y$10$fTYbrI0JHgyikcg8rt6cWOp90BcirpTwnmSXl3L3tNubbamdp1omK', 'QCOM-BTD', '', '2021-08-31 15:08:49', '0000-00-00 00:00:00'),
(38, '$2y$10$znJE4hh5qQANEDOVERXN9uUizSejOPLQVCoevnMps8SRHWQe5i5dK', 'iPhone de Pierre', '', '2021-09-04 17:25:03', '0000-00-00 00:00:00'),
(39, '$2y$10$a0hj76YkvbQQj7Y8L55ocugWH7WMDVCsOGxJ73F7ZbxghcevVoiCG', 'iPhone de Yael', 'F+RQ8e/FH2?f)PZqKkp2aO[(34t(V(IF', '2021-09-05 10:15:09', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Structure de la table `Helpers`
--

CREATE TABLE `Helpers` (
  `ID` int(11) NOT NULL,
  `Type` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TypeTrad` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Name` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `Helpers`
--

INSERT INTO `Helpers` (`ID`, `Type`, `TypeTrad`, `Name`) VALUES
(1, 'Tipeee', '{\"en\": \"Tipeee\"}', 'lucas-614'),
(2, 'Tipeee', '{\"en\": \"Tipeee\"}', 'samuel-344'),
(3, 'Tipeee', '{\"en\": \"Tipeee\"}', 'oxymerion'),
(4, 'Tipeee', '{\"en\": \"Tipeee\"}', 'meyro'),
(5, 'Tipeee', '{\"en\": \"Tipeee\"}', 'ghislain-42'),
(6, 'Tipeee', '{\"en\": \"Tipeee\"}', 'kevin-694'),
(7, 'Tipeee', '{\"en\": \"Tipeee\"}', 'nicolas-1622'),
(8, 'Tipeee', '{\"en\": \"Tipeee\"}', 'fishchips'),
(9, 'Tipeee', '{\"en\": \"Tipeee\"}', 'elvanord'),
(10, 'Tipeee', '{\"en\": \"Tipeee\"}', 'kyllian-27'),
(11, 'Tipeee', '{\"en\": \"Tipeee\"}', 'tanguy-104'),
(12, 'Tipeee', '{\"en\": \"Tipeee\"}', 'amaury-83'),
(13, 'Tipeee', '{\"en\": \"Tipeee\"}', 'wykissi'),
(14, 'Tipeee', '{\"en\": \"Tipeee\"}', 'adr-4'),
(15, 'Tipeee', '{\"en\": \"Tipeee\"}', 'starfirexy'),
(16, 'Tipeee', '{\"en\": \"Tipeee\"}', 'arkennisse'),
(17, 'Tipeee', '{\"en\": \"Tipeee\"}', 'florian-616'),
(18, 'Tipeee', '{\"en\": \"Tipeee\"}', 'romain-866'),
(19, 'Tipeee', '{\"en\": \"Tipeee\"}', 'kayfeer'),
(20, 'Tipeee', '{\"en\": \"Tipeee\"}', 'clafoutis-1'),
(21, 'Tipeee', '{\"en\": \"Tipeee\"}', 'piro-1'),
(22, 'Tipeee', '{\"en\": \"Tipeee\"}', 'valnhard'),
(23, 'Tipeee', '{\"en\": \"Tipeee\"}', 'leo-5d12'),
(24, 'Tipeee', '{\"en\": \"Tipeee\"}', 'mordem'),
(25, 'Tipeee', '{\"en\": \"Tipeee\"}', 'thyz'),
(26, 'Tipeee', '{\"en\": \"Tipeee\"}', 'luzgara'),
(27, 'Tipeee', '{\"en\": \"Tipeee\"}', 'riowze'),
(28, 'Tipeee', '{\"en\": \"Tipeee\"}', 'thomas-1529'),
(29, 'Tipeee', '{\"en\": \"Tipeee\"}', 'foiryon'),
(30, 'Tipeee', '{\"en\": \"Tipeee\"}', 'sajira'),
(31, 'Tipeee', '{\"en\": \"Tipeee\"}', 'noach'),
(32, 'Tipeee', '{\"en\": \"Tipeee\"}', 'thomas-1531'),
(33, 'Tipeee', '{\"en\": \"Tipeee\"}', 'folixion'),
(34, 'Tipeee', '{\"en\": \"Tipeee\"}', 'lucas-614'),
(35, 'Tipeee', '{\"en\": \"Tipeee\"}', 'meyro'),
(36, 'Tipeee', '{\"en\": \"Tipeee\"}', 'kayfeer'),
(37, 'Tipeee', '{\"en\": \"Tipeee\"}', 'xenor04'),
(38, 'Tipeee', '{\"en\": \"Tipeee\"}', 'fishchips'),
(39, 'Tipeee', '{\"en\": \"Tipeee\"}', 'mathias-148'),
(40, 'Tipeee', '{\"en\": \"Tipeee\"}', 'bendu22'),
(41, 'Tipeee', '{\"en\": \"Tipeee\"}', 'evan-83'),
(42, 'Traducteur', '{\"en\": \"Translator\"}', 'Minou74'),
(43, 'Animateur', '{\"en\": \"Animator\"}', 'Boltaax'),
(44, 'Traducteur', '{\"en\": \"Translator\"}', 'Athéna'),
(45, 'Traducteur', '{\"en\": \"Translator\"}', 'Silica'),
(46, 'Graphiste', '{\"en\": \"Designer\"}', 'Nico / Oxy'),
(47, 'Animateur', '{\"en\": \"Animator\"}', 'Alta'),
(48, 'Moderateur', '{\"en\": \"Moderator\"}', 'Issey'),
(49, 'Graphiste', '{\"en\": \"Designer\"}', 'Sloth'),
(50, 'Administrateur', '{\"en\": \"Admin\"}', 'Max'),
(51, 'Moderateur', '{\"en\": \"Moderator\"}', 'Aily'),
(52, 'Administrateur', '{\"en\": \"Admin\"}', 'Mashi'),
(53, 'Graphiste', '{\"en\": \"Designer\"}', 'Charlulu'),
(54, 'Graphiste', '{\"en\": \"Designer\"}', 'Hubble'),
(55, 'Traducteur', '{\"en\": \"Translator\"}', 'Tidoe0406'),
(56, 'Equipe communication', '{\"en\": \"Communication\"}', 'Orange'),
(57, 'Graphiste', '{\"en\": \"Designer\"}', 'Ayadori');

-- --------------------------------------------------------

--
-- Structure de la table `Quotes`
--

CREATE TABLE `Quotes` (
  `ID` int(11) NOT NULL,
  `Lang` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Quote` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Author` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `Quotes`
--

INSERT INTO `Quotes` (`ID`, `Lang`, `Quote`, `Author`) VALUES
(0, 'fr', 'Ce n\'est pas en suivant le rythme que je serais le meilleur. ', 'Izuku Midoriya'),
(1, 'en', 'It’s hard to beat someone who never give up.', 'Babe Ruth'),
(2, 'en', 'Dear me, one day I’ll make you proud.', 'Charlotte Eriksson'),
(3, 'en', 'Everyday you have one job, be better than yesterday.', 'Ada Ehi'),
(4, 'fr', 'Concentrez vos pensées sur la chose en particulier qui vous intéresse le plus et les idées viendront en abondance et ouvriront la porte à une douzaine de façons d’atteindre votre objectif.', 'Robert Collier'),
(5, 'en', 'Never tell anyone what you’re doing until it’s done.', 'Unknown'),
(6, 'fr', 'Peu importe ce que tu veux faire, fais le maintenant. On repousse trop souvent aux lendemains.', 'Inconnu'),
(7, 'fr', 'Le moment ne sera jamais le bon. Commencez de là où vous êtes et travaillez avec les outils qui se trouvent sous votre main. Vous trouverez de meilleurs outils au fur et à mesure.', 'Inconnu'),
(8, 'en', 'Your lack of dedication is an insult to those who believe in you.', 'Unknown'),
(9, 'fr', 'Je ne te souhaite pas bonne chance, je te souhaite de travailler à la hauteur de tes objectifs.', 'Inconnu'),
(10, 'en', 'Life is not a game because in a game you’re playing against someone else, if you lose they win, if you win they lose. In life, you’re not playing against anyone and someone else winning or losing has no effect on you.', 'Unknown'),
(11, 'en', 'You can. End of story.', 'Unknown'),
(12, 'en', 'Be addicted to your passion instead of distraction.', 'Unknown'),
(13, 'en', 'You have to make it fun and enjoyable in your own mind to get up and do the hard things.', 'Unknown'),
(14, 'en', 'The problem is not the problem. The problem is your attitude about the problem', 'Captain Jack Sparrow'),
(15, 'fr', 'Le talent ca s\'épanouit, l\'instint ca se perfectionne.', 'Oikawa Tooru'),
(16, 'fr', 'On ne peut pas gagner sans motivation.', 'Daichi Sawamura'),
(17, 'fr', 'Les gens ne cesseront jamais d\'avoir des rêves !', 'Marshall D Teach '),
(18, 'fr', 'Le talent touche une cible que personne d’autre ne peut frapper ; le génie touche une cible que personne d’autre ne peut voir.', 'Arthur Schopenhauer'),
(19, 'fr', 'Le destin ? Je l\'éclate et j\'en fait ce que je veux ! ', 'Yami Sukehiro'),
(20, 'fr', 'Ce qui compte c\'est pas d\'avoir beaucoup de temps , c\'est de savoir s\'en servir.', 'Ekko'),
(21, 'fr', 'Les limites existent uniquement si tu le permets.', 'Vegeta'),
(22, 'fr', 'Je ne crains pas l’homme qui a pratiqué 10.000 coups une fois, mais je crains l’homme qui a pratiqué un coup 10.000 fois.', 'Bruce Lee'),
(23, 'fr', 'Tous les hommes finissent par mourir un jour... Mais leur savoir reste.', 'Senku Ishigami'),
(24, 'fr', 'Ne pas avoir peur est la chose la plus terrifiante qui sois.', 'Karma Akabane'),
(25, 'fr', 'En ce bas monde, la seule chose qui nous appartient vraiment... c’est le corps qu’on se forge chaque jour.', 'Ken Kitano'),
(26, 'fr', 'Le fait d\'être visé par tout le monde montre votre puissance.', 'Professeur Koro'),
(27, 'fr', 'Vous riez de moi car je suis différent mais moi je ris de vous car vous êtes tous les mêmes. Kaneki Ken', 'Kaneki Ken'),
(28, 'fr', 'L\'homme qui n\'a rien à perdre est le plus dangereux de tous les adversaires. ', 'Chris Carter'),
(29, 'fr', 'Ne pleure pas pour ta défaite, garde tes larmes pour la victoire', 'Natsu Dragnir'),
(30, 'fr', 'La chute n\'est pas un échec. L\'échec c\'est de rester là ou on est tombé ', 'Socrate'),
(31, 'fr', 'Peu importe combien de points vous avez à la fin du jeu, si vous n\'êtes pas heureux, ce n\'est pas une victoire.', 'Kuroko Tetsuya'),
(32, 'en', 'This is the real secret of life to be completely engaged with what you are doing in the here and now. And instead of calling it work, realize it is play. ', 'Alan Watts'),
(33, 'fr', 'S\'il y\'a la moindre possibilité, il est de ton devoir d\'avancer. ', 'Mustang'),
(34, 'fr', 'La force s\'acquiert par la répétition de l\'effort. Subir la défaire et savourer la victoire, c\'est comme ça que nous grandirons ! ', 'Aoi Todo'),
(35, 'fr', 'Rester debout c\'est une sacrée preuve de force ! ', 'Katsuki Bakugo'),
(36, 'fr', 'Un raté peut dépasser un génie par en entraînement acharné. ', 'Rock Lee'),
(37, 'fr', 'Ne jamais remettre à demain ce que tu peux faire aujourd\'hui. ', '2pac'),
(38, 'fr', 'Je n\'ai pas ce qu\'il faut pour être le héros principal mais dans chaque bonne histoire il y a un second rôle qui éclipse le héros. ', 'Neito Monoma'),
(39, 'fr', 'Pour avoir quelque chose que tu n\'as jamais eu, il faut faire quelque chose que tu n\'as jamais fait. ', 'Robert McCall'),
(40, 'fr', 'Quelque soit la vérité, ce sont les vainqueurs qui écriront l\'histoire. ', 'Livaï Ackerman'),
(42, 'fr', 'Si vous ne faites pas les choses pour lesquelles vous n\'êtes pas doué vous ne ferez jamais de progrès.', 'Rachel Zane'),
(43, 'en', 'To be successful at anything, you don\'t have to be different. You simply have to be what most people aren\'t : consistent. ', 'Unknown'),
(44, 'fr', 'Quand je dis que ça ne fait pas mal. Cela signifie que je peux le supporter.', 'Kirua zoldik'),
(45, 'fr', 'Dans la vie il n\'est pas interdit de pleurer, mais cela ne doit en aucun cas t\'empêcher d\'avancer. ', 'Shanks Le Roux'),
(46, 'fr', 'La justice vaincra t-elle ? Bien sûr que oui ! Parce que la justice n\'appartient qu\'aux vainqueurs ! ', 'Donquixote Doflamingo'),
(47, 'fr', 'Celui qui n\'a pas d\'objectifs ne risque pas de les atteindre', 'Sun Tzu'),
(48, 'fr', 'Je ne reviens jamais sur ma parole, c’est ça pour moi être un ninja !', 'Naruto Uzumaki'),
(49, 'fr', 'Être faible n\'est pas une honte, mais le rester, si !', 'Fuegoleon Vermillion'),
(50, 'fr', 'Il n\'est de plus grand amour que celui de l\'homme qui se sacrifie pour ses compagnons.', 'AinzOoalGown'),
(51, 'fr', 'Je suis peut-être un caillou, mais je suis un caillou capable de briser un diamant. ', 'Asta'),
(52, 'fr', 'L\'espoir n\'existe que pour ceux qui ne peuvent pas vivre sans s\'accrocher.', 'Sosuke Aizen'),
(53, 'fr', 'j\'ai appris que le courage n\'est pas l\'absence de peur mais la capacité de la vaincre', 'Kirito '),
(54, 'fr', 'Tant qu\'il existera des vainqueurs il y aura des vaincus.', 'Madara Uchiwa'),
(55, 'fr', 'Vous êtes bien dans un jeu vidéo, mais vous n\'êtes plus là pour jouer.', 'Sword Art Online'),
(56, 'en', 'Someone said « Don’t be afraid to start over again. This time you’re not starting from scratch, you’re starting from experience ».', 'Unknown'),
(57, 'fr', 'Une fois lancé on se dit toujours « J’aurais du commencer plus tôt » alors fais-le maintenant pour ne pas avoir de regrets plus tard.', 'Inconnu'),
(58, 'en', 'It’s you vs you. Everyday. Always has been.', 'Unknown'),
(59, 'fr', 'La réussite ce n’est pas juste faire de l’argent, c’est de vivre ta propre vie comme tu l’entends.', 'Inconnu'),
(60, 'en', 'I have one power, I never give up.', 'Batman'),
(61, 'en', 'The most effective way to do it is to do it.', 'Amelia Earhart'),
(62, 'en', 'It’s the will, not the skill.', 'Jim Tunney'),
(63, 'en', 'Just focus and do it.', 'Unknown'),
(64, 'en', 'Be one of the few who do what they say.', 'Unknown'),
(65, 'en', 'Focus on what you really want. Everything else is a distraction.', 'Unknown'),
(66, 'en', 'Set your goals so high so people think you\'re insane.', 'Unknown'),
(67, 'en', 'The only way to do great work is to love what you do. If you haven’t found it yet, keep lookin, don’t settle.', 'Steve Jobs'),
(68, 'fr', 'Dans le domaine des idées, tout dépend de l’enthousiasme. Dans le monde réel, tout repose sur la persévérance.', 'Johann Wolfgang von Goethe'),
(69, 'fr', 'C’est clairement plus dur pour nous. Et alors ? La victoire aura deux fois plus de goût.', 'Inconnu'),
(70, 'en', 'Just because I give you advice doesn’t mean I know more than you. It just means I’ve done more stupid shit than you.', 'Unknown'),
(71, 'en', 'If you are in the way of my dreams and goals, I suggest you move.', 'Unknown'),
(72, 'fr', 'Ça sera facile ? Pas du tout. Ça en vaudra la peine ? Absolument !', 'Inconnu'),
(73, 'en', 'Listen, smile, agree and then do whatever the fuck you were gonna do anyway.', 'Robert Downey Jr '),
(74, 'en', 'If you don’t play to win, don’t play at all.', 'Tom Brady'),
(75, 'en', 'Just because I carry it well does not mean it is not heavy.', 'Unknown'),
(76, 'en', 'Every next level of you life will demand a different you.', 'Leonardo Di Caprio'),
(77, 'en', 'And now go, make interesting mistakes, make amazing mistakes, make glorious and fantastic mistakes.', 'Neil Gaiman'),
(78, 'en', 'If you quit once it becomes a habit. Never quit.', 'Michael Jordan'),
(79, 'en', 'Don’t think about what can happen in a month. Don’t think about what can happen in a year. Just focus on the 24 hours in front of you and do what you can to get closer to where you want to be.', 'Eric Thomas'),
(80, 'fr', 'Laisse les te haïr, assure-toi qu\'ils épellent bien ton nom. ', 'Harvey Specter'),
(81, 'fr', 'Si vous n\'y allez pas à fond, à quoi bon y aller ?', 'Inconnu'),
(82, 'fr', 'Arrête de vouloir te motiver. Soit tu te mets au boulot, soit tu te plais. Mais arrête de te trouver des excuses. ', 'Inconnu'),
(83, 'en', 'Observe and reflect; and become a little wiser every day. ', 'Doe Zantamata'),
(84, 'en', 'You may see me struggle but you will never see me quit. ', 'Unknown'),
(85, 'fr', 'Si vous ne pouvez exceller par le talent, triomphez par l\'effort. ', 'Dave Weinbaum'),
(86, 'en', 'Destroy the idea that you have to be constantly working or grinding in order to be successful. Embrace the concept that rest, recovery, and reflection are essential parts of the progress towards a successful and ultimately happy life', 'Damson Idris'),
(87, 'en', 'If you start now you\'ll begin seeing results one day earlier than if you start tomorrow', 'Jairek Robbins'),
(88, 'en', 'Life is not about being better than someone else, it\'s about being better than you used to be and becoming who you are. ', 'Will Smith'),
(89, 'fr', 'Il y a un an, c\'était impossible. Aujourd\'hui, tout m\'est possible. ', 'Unknown'),
(90, 'en', 'If you want to win the game of life. You first have to define what winning is. ', 'Joe Duncan'),
(91, 'fr', 'Si tu as le temps de t\'apitoyer, tu as le temps de t\'améliorer. ', 'Saitama'),
(92, 'en', 'The most attractive thing a man can do is exactly what he said he\'s going to do. ', 'Unknown'),
(93, 'en', 'Make your life a masterpiece. Imagine no limitations on what you can be, have or do. ', 'Brian Tracy'),
(94, 'en', 'Sometimes all you need is 20 seconds of insane courage, just literally 20 seconds of embarrassing bravery. I promise you something great will come out of it. ', 'Benjamin Mee'),
(95, 'fr', 'L\'argent est juste un outil, pas le but.. Le but, c\'est la liberté ! ', 'Inconnu'),
(96, 'en', 'You only look crazy until it works, then you\'re a genius. ', 'Unknown'),
(97, 'en', 'Always remember, beginning is the hardest part.', 'Unknown'),
(98, 'en', 'Oh you\'re tired ? Leave the hard work for the big boys. ', 'Unknown'),
(99, 'en', 'Ideas are cheap, ideas are easy, ideas are common. Everybody has ideas, ideas are higly, higly overvalued. Execution is all that matters. ', 'Casey Neistat'),
(100, 'en', 'Do it with passion or not at all. ', 'Rosa Nochette Carey'),
(101, 'fr', 'Seuls ceux qui prennent le risque d\'échouer spectaculairement réussiront brillamment. ', 'Robert Francis Kennedy'),
(102, 'fr', 'C\'est lorsqu\'ils dont dos au mur que les grands joueurs se révèlent. ', 'Inconnu'),
(103, 'en', 'I want to see what happens if I don\'t give up. ', 'Neila Rey'),
(104, 'fr', 'Nous sommes ce que nous faisons à plusieurs reprises. L\'excellence n\'est donc pas un acte mais une habitude. ', 'Aristote'),
(105, 'en', 'Yesterday you said tomorrow. ', 'Nike'),
(106, 'en', 'The size of your audience doesn\'t matter. Keep up the good work. ', 'Unknown'),
(107, 'en', 'When they say you can\'t do it, do it twice, and take pics. ', 'Tami Xiang'),
(108, 'en', 'The funny thing is when you start feeling happy alone, that\'s when everyone decides to be with you. ', 'Jim Carrey'),
(109, 'en', 'The quality of a person\'s life is in direct proportion to their commitment to excellence. ', 'Vince Lombardi'),
(110, 'en', 'Live as if you were living already for the second time and as if you had acted the first time as wrongly as you are about to act now. ', 'Viktor E. Frankl'),
(111, 'en', 'Perfection is not attainable. But if we chase perfection we can catch excellence. ', 'Vince Lombardi'),
(112, 'en', 'We are here to laugh at the odds and live our lives so well that death will tremble to take us. ', 'Charles Bukowski'),
(113, 'en', 'If you want to look good in front of thousands, you have to outwork thousands in front of nobody. ', 'Damian Lillard'),
(114, 'en', 'Doing more than what\'s expected. That\'s greatness. ', 'Unknown'),
(115, 'en', 'Act today as if this the day you will be remembered. ', 'Dr. Seuss'),
(116, 'en', 'The one who wins is the one who does whatever it takes. ', 'Unknown'),
(117, 'en', 'Go all out or don\'t go at all. ', 'Unknown'),
(118, 'en', 'Be somebody nobody thought you could be. ', 'Unknown'),
(119, 'en', 'Anyone can dream it. Show the world you can do it. ', 'Walt Disney '),
(120, 'en', 'Consistency is what transforms average into excellence. ', 'Tony Robins'),
(121, 'en', 'Be one of the few who do what they say.', 'Unknown'),
(122, 'en', 'Everything is possible. The impossible just takes longer. ', 'Dan Brown'),
(123, 'en', 'The biggest moutains are always climbed the same way every time; one step at a time. ', 'Unknown'),
(124, 'en', 'If you can\'t outplay them. Outwork them. ', 'Ben Hogan'),
(125, 'en', 'Greatness is demanding more of yourself than anyone else could ever demand of you. When others say : \"done\" you say \"next\". ', 'Unknown'),
(126, 'en', 'The most certain way to succeed is to try one more time. ', 'Thomas Edison'),
(127, 'en', 'Anything worth doing is worth doing badly. Until you do it right. ', 'Zig Ziglar'),
(128, 'en', 'You can\'t do epic shit with basic people. ', 'Unknown'),
(129, 'en', 'You are your own best friend. Never, ever put yourself down. ', 'Paulo Coelho'),
(130, 'en', 'They said \"it\'s difficult\", I said \"bring it on\". ', 'Unknown'),
(131, 'fr', 'Personne ne peut changer le monde sans avoir d\'obsession. ', 'Inconnu'),
(132, 'en', 'Find people who are better than you and play with them. ', 'Unknown'),
(133, 'en', 'Have you ever stopped and thought : \"Wow, I prayed for this, it\'s here, it\'s happening.\" ', 'Unknown'),
(134, 'en', 'It\'s not about the cards you\'ve been dealt. It\'s how you play your hand. ', 'Randy Pausch'),
(135, 'fr', 'De la chance, pour en avoir, il faut la provoquer. ', 'Yoichi Hiruma'),
(136, 'en', '20 minutes of doing something is more valuable than 20 hours of thinking about doing something. ', 'Unknown'),
(150, 'fr', 'On ne peut pas rattraper le temps perdu, mais on peut arrêter de perdre son temps.', 'Jennifer Lawrence');

-- --------------------------------------------------------

--
-- Structure de la table `Skills`
--

CREATE TABLE `Skills` (
  `ID` int(11) NOT NULL,
  `Name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Translations` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL,
  `CategoryID` smallint(6) NOT NULL,
  `Wisdom` tinyint(4) NOT NULL,
  `Intelligence` tinyint(4) NOT NULL,
  `Confidence` tinyint(4) NOT NULL DEFAULT 1,
  `Strength` tinyint(4) NOT NULL,
  `Stamina` tinyint(4) NOT NULL,
  `Dexterity` tinyint(4) NOT NULL,
  `Agility` tinyint(4) NOT NULL,
  `LogoID` int(11) NOT NULL,
  `Creator` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `Skills`
--

INSERT INTO `Skills` (`ID`, `Name`, `Translations`, `CategoryID`, `Wisdom`, `Intelligence`, `Confidence`, `Strength`, `Stamina`, `Dexterity`, `Agility`, `LogoID`, `Creator`) VALUES
(1, 'Corde à sauter', '{\"en\": \"Jumping rope\", \"es\": \"Cuerda de saltar\"}', 1, 0, 0, 1, 0, 4, 1, 1, 0, 'Lucas Pouchele'),
(2, 'Accrobranche', '{\"en\": \"Tree climbing\"}', 1, 0, 0, 1, 2, 1, 1, 2, 0, 'Ubavy'),
(3, 'Volleyball', '{\"en\": \"Volleyball\"}', 1, 0, 0, 1, 1, 2, 3, 0, 0, 'Hinata Shoyo'),
(4, 'Teakwondo', '{\"en\": \"Taekwondo\"}', 1, 0, 0, 1, 3, 1, 0, 2, 0, ''),
(5, 'Musculation (poids de corps)', '{\"en\": \"Calisthenics\"}', 1, 0, 0, 1, 3, 3, 0, 0, 0, 'Mirko'),
(6, 'Lecture', '{\"en\": \"Reading\"}', 5, 2, 4, 1, 0, 0, 0, 0, 0, ''),
(7, 'Via-Ferrata', '{\"en\": \"Via-Ferrata\"}', 1, 0, 0, 1, 3, 2, 0, 1, 0, ''),
(8, 'Natation', '{\"en\": \"Swimming\"}', 1, 0, 0, 1, 3, 3, 0, 0, 0, ''),
(9, 'Ecriture (d\'histoire)', '{\"en\": \"Story writing\"}', 8, 2, 3, 1, 0, 0, 1, 0, 0, ''),
(10, 'Dessin', '{\"en\": \"Drawing\"}', 8, 0, 1, 1, 0, 0, 5, 0, 0, ''),
(11, 'Musculation (salle)', '{\"en\": \"Musculation\"}', 1, 0, 0, 1, 4, 2, 0, 0, 0, 'StarFireXY'),
(12, 'Danse', '{\"en\": \"Dance\"}', 1, 0, 0, 1, 0, 3, 0, 3, 0, ''),
(13, 'Scoutisme', '{\"en\": \"Scouting\"}', 10, 3, 3, 1, 0, 0, 0, 0, 0, ''),
(14, 'Marche', '{\"en\": \"Walk\"}', 1, 0, 0, 1, 0, 6, 0, 0, 0, ''),
(15, 'Travail Scolaire', '{\"en\": \"School work\"}', 5, 0, 6, 1, 0, 0, 0, 0, 0, ''),
(16, 'Piano', '{\"en\": \"Piano\"}', 2, 0, 1, 1, 0, 0, 5, 0, 0, ''),
(17, 'Bricolage', '{\"en\": \"Handiwork\"}', 4, 0, 3, 1, 2, 0, 1, 0, 0, ''),
(18, 'Modélisation 3D', '{\"en\": \"3D Modeling\"}', 3, 0, 6, 1, 0, 0, 0, 0, 0, ''),
(19, 'Violon', '{\"en\": \"Violon\"}', 2, 0, 2, 1, 0, 0, 4, 0, 0, ''),
(20, 'Cuisine', '{\"en\": \"Cooking\"}', 6, 0, 2, 1, 0, 0, 4, 0, 0, 'Evounn'),
(21, 'Ménage', '{\"en\": \"Household\"}', 6, 0, 0, 1, 0, 4, 0, 2, 0, ''),
(22, 'Puzzle', '{\"en\": \"Jigsaw puzzle\"}', 7, 1, 5, 1, 0, 0, 0, 0, 0, ''),
(23, 'Rubiks Cube', '{\"en\": \"Rubiks Cube\"}', 7, 1, 5, 1, 0, 0, 0, 0, 0, 'Gerem'),
(25, 'Peinture', '{\"en\": \"Painting\"}', 8, 1, 3, 1, 0, 0, 2, 0, 0, ''),
(26, 'Basketball', '{\"en\": \"Basketball\"}', 1, 0, 1, 1, 1, 2, 1, 1, 0, 'Noach'),
(27, 'Course', '{\"en\": \"Run\"}', 1, 0, 0, 1, 0, 6, 0, 0, 0, ''),
(28, 'Vélo', '{\"en\": \"Bike\"}', 1, 0, 0, 1, 0, 6, 0, 0, 0, ''),
(29, 'Ultimate', '{\"en\": \"Ultimate\"}', 1, 0, 0, 1, 0, 3, 1, 2, 0, ''),
(30, 'Trail', '{\"en\": \"Trail\"}', 1, 0, 1, 1, 0, 4, 0, 1, 0, ''),
(31, 'Combat', '{\"en\": \"Fight\"}', 1, 0, 1, 1, 2, 2, 0, 1, 0, ''),
(32, 'Sport freestyle', '{\"en\": \"Freestyle sport\"}', 1, 0, 0, 1, 0, 3, 0, 3, 0, ''),
(33, 'Escrime', '{\"en\": \"Fencing\"}', 1, 0, 1, 1, 0, 2, 1, 2, 0, ''),
(34, 'Boxe', '{\"en\": \"Boxing\"}', 1, 0, 0, 1, 2, 2, 0, 2, 0, ''),
(35, 'Hacking', '{\"en\": \"Hacking\"}', 3, 0, 4, 1, 0, 0, 2, 0, 0, ''),
(36, 'Méditation', '{\"en\": \"Meditation\"}', 10, 6, 0, 1, 0, 0, 0, 0, 0, 'Komorashu'),
(37, 'Surf', '{\"en\": \"Surfing\"}', 1, 0, 1, 1, 1, 2, 0, 2, 0, ''),
(38, 'Skateboad', '{\"en\": \"Skateboarding\"}', 1, 0, 1, 1, 1, 2, 0, 2, 0, ''),
(39, 'Apprentissage langue', '{\"en\": \"Language learning\"}', 5, 0, 6, 1, 0, 0, 0, 0, 0, ''),
(40, 'Judo', '{\"en\": \"Judo\"}', 1, 0, 0, 1, 2, 2, 0, 2, 0, 'Marion'),
(41, 'Aïkido', '{\"en\": \"Aikido\"}', 1, 0, 1, 1, 0, 2, 2, 1, 0, ''),
(42, 'Tricot / Couture', '{\"en\": \"Knitting / Sewing\"}', 4, 0, 0, 1, 0, 0, 6, 0, 0, ''),
(43, 'Chant', '{\"en\": \"Singing\"}', 2, 0, 6, 1, 0, 0, 0, 0, 0, ''),
(44, 'Escalade', '{\"en\": \"Climbing\"}', 1, 0, 0, 1, 2, 2, 0, 2, 0, ''),
(45, 'Lutte', '{\"en\": \"Wrestling\"}', 1, 0, 0, 1, 2, 2, 0, 2, 0, ''),
(46, 'Equitation', '{\"en\": \"Horseback riding\"}', 1, 0, 1, 1, 0, 3, 2, 0, 0, ''),
(47, 'Shadow Boxing', '{\"en\": \"Shadow Boxing\"}', 1, 0, 0, 1, 2, 4, 0, 0, 0, 'Vulcain'),
(48, 'Mécanique', '{\"en\": \"mechanic\"}', 4, 0, 2, 1, 1, 0, 3, 0, 0, ''),
(49, 'Yoga', '{\"en\": \"Yoga\"}', 10, 2, 0, 1, 0, 0, 0, 4, 0, ''),
(50, 'Football', '{\"en\": \"Soccer\"}', 1, 0, 1, 1, 1, 2, 0, 2, 0, ''),
(51, 'Gymnastique', '{\"en\": \"Gymnastics\"}', 1, 0, 0, 1, 1, 1, 2, 2, 0, ''),
(52, 'Tennis', '{\"en\": \"Tennis\"}', 1, 0, 1, 1, 1, 2, 1, 1, 0, ''),
(53, 'Rugby', '{\"en\": \"Rugby\"}', 1, 0, 1, 1, 2, 2, 1, 0, 0, ''),
(54, 'Trampoline', '{\"en\": \"Trampoline\"}', 1, 0, 0, 1, 0, 2, 0, 4, 0, ''),
(55, 'Production musicale', '{\"en\": \"Music production\"}', 2, 0, 6, 1, 0, 0, 0, 0, 0, ''),
(56, 'Tir (précision)', '{\"en\": \"Precision shooting\"}', 1, 0, 1, 1, 0, 0, 5, 0, 0, 'Mordem'),
(57, 'Jardinage', '{\"en\": \"Gardening\"}', 6, 0, 1, 1, 2, 2, 1, 0, 0, ''),
(58, 'Sprint', '{\"en\": \"Sprinting\"}', 1, 0, 0, 1, 5, 1, 0, 0, 0, 'Frenchaxe'),
(59, 'Maitrise arme (baton, lance, épé', 'Weapon control (stick, lance, sword)', 1, 0, 0, 1, 0, 0, 3, 3, 0, ''),
(60, 'Pen Spinning', '{\"en\": \"Pen spinning\"}', 8, 0, 0, 1, 0, 0, 6, 0, 0, ''),
(61, 'Création artistique', '{\"en\": \"Artistic creation\"}', 8, 2, 4, 1, 0, 0, 0, 0, 0, ''),
(62, 'Promener animal', '{\"en\": \"Pet walking\"}', 11, 0, 0, 1, 0, 0, 6, 0, 0, ''),
(63, 'S\'occuper d\'enfants', '{\"en\": \"Childcare\"}', 6, 1, 3, 1, 0, 2, 0, 0, 0, ''),
(64, 'Musée, galerie', '{\"en\": \"Museum, gallery\"}', 8, 0, 6, 1, 0, 0, 0, 0, 0, ''),
(65, 'Casse-tête', '{\"en\": \"Puzzle\"}', 7, 1, 5, 1, 0, 0, 0, 0, 0, ''),
(66, 'Mixologie', '{\"en\": \"Mixology\"}', 4, 0, 3, 1, 0, 0, 3, 0, 0, 'FishChips'),
(67, 'Roller', '{\"en\": \"Roller\"}', 1, 0, 0, 1, 2, 3, 0, 1, 0, 'Mr.Niihaal'),
(68, 'VTT free-ride', '{\"en\": \"Free-ride bike\"}', 1, 0, 0, 1, 0, 5, 1, 0, 0, 'Valamo'),
(69, 'Muay thai', '{\"en\": \"Muay thai\"}', 1, 0, 0, 1, 3, 2, 0, 1, 0, 'Kuro'),
(70, 'Football Americain', '{\"en\": \"Football\"}', 1, 0, 0, 1, 2, 3, 0, 1, 0, 'Eyeshield 21'),
(71, 'Jeune Sapeur Pompiers', '{\"en\": \"Young firefighter\"}', 9, 0, 1, 1, 1, 2, 0, 2, 0, 'alixloulou68@gmail.com'),
(72, 'Programmation', '{\"en\": \"Coding\"}', 3, 0, 4, 1, 0, 0, 2, 0, 0, 'Calhan'),
(73, 'Guitare', '{\"en\": \"Guitare\"}', 2, 0, 1, 1, 0, 0, 5, 0, 0, ''),
(74, 'Discours', '{\"en\": \"Speech\"}', 5, 0, 6, 1, 0, 0, 0, 0, 0, 'Félix Asderell'),
(77, 'Forgeron', '{\"en\": \"Blacksmith\"}', 9, 0, 1, 1, 3, 2, 0, 0, 0, 'Piro'),
(78, 'Pétanque', '{\"en\": \"Petanque\"}', 1, 0, 2, 1, 1, 0, 3, 0, 0, ''),
(79, 'Plongée sous marine', '{\"en\": \"Scuba Diving\"}', 1, 0, 0, 1, 0, 4, 0, 2, 0, ''),
(80, 'Voile', '{\"en\": \"Sailing\"}', 1, 0, 2, 1, 2, 2, 0, 0, 0, ''),
(81, 'Randonnee', '{\"en\": \"Hike\"}', 1, 0, 0, 1, 0, 5, 0, 1, 0, ''),
(82, 'Ping pong', '{\"en\": \"Table tennis\"}', 1, 0, 2, 1, 0, 1, 2, 1, 0, ''),
(83, 'Gainage', '{\"en\": \"Core building\"}', 1, 0, 0, 1, 0, 6, 0, 0, 0, ''),
(84, 'Jujitsu', '{\"en\": \"Jujitsu\"}', 1, 0, 0, 1, 2, 2, 0, 2, 0, ''),
(85, 'Crossfit', '{\"en\": \"Crossfit\"}', 1, 0, 0, 1, 2, 3, 0, 1, 0, ''),
(86, 'Lancer de poids', '{\"en\": \"Weight throw\"}', 1, 0, 0, 1, 4, 1, 0, 1, 0, ''),
(87, 'Jogging', '{\"en\": \"Jogging\"}', 1, 0, 0, 1, 0, 6, 0, 0, 0, ''),
(88, 'Renforcement musculaire', '{\"en\": \"muscular reinforcement\"}', 1, 0, 0, 1, 2, 3, 0, 1, 0, ''),
(89, 'Pôle dance', '{\"en\": \"Dance pole\"}', 1, 0, 0, 1, 0, 2, 2, 2, 0, ''),
(90, 'Saut en hauteur', '{\"en\": \"High Jump\"}', 1, 0, 0, 1, 0, 4, 0, 2, 0, ''),
(91, 'Kait surf', '{\"en\": \"Kait surfing\"}', 1, 0, 0, 1, 0, 3, 1, 2, 0, ''),
(92, 'Apnée', '{\"en\": \"Apnea\"}', 1, 0, 0, 1, 0, 6, 0, 0, 0, ''),
(93, 'Parkour', '{\"en\": \"Parkour\"}', 1, 0, 0, 1, 2, 2, 1, 1, 0, ''),
(94, 'Kayak', '{\"en\": \"Kayak\"}', 1, 0, 0, 1, 3, 2, 0, 1, 0, ''),
(95, 'Handball', '{\"en\": \"Handball\"}', 1, 0, 0, 1, 2, 2, 1, 1, 0, ''),
(96, 'Badminton', '{\"en\": \"Badminton\"}', 1, 0, 1, 1, 0, 2, 2, 1, 0, ''),
(97, 'Accordeon', '{\"en\": \"Accordion\"}', 2, 0, 1, 1, 0, 0, 4, 0, 0, ''),
(98, 'Trombone', '{\"en\": \"Trombone\"}', 2, 0, 1, 1, 1, 1, 2, 0, 0, ''),
(99, 'Solfege', '{\"en\": \"Music theory\"}', 2, 0, 6, 1, 0, 0, 0, 0, 0, ''),
(100, 'Billard', '{\"en\": \"Pool\"}', 1, 0, 3, 1, 0, 0, 3, 0, 0, ''),
(101, 'Echec', '{\"en\": \"Chess\"}', 7, 0, 6, 1, 0, 0, 0, 0, 0, ''),
(102, 'Tour de carte', '{\"en\": \"Card trick\"}', 7, 0, 2, 1, 0, 0, 4, 0, 0, ''),
(103, 'Theâtre', '{\"en\": \"Théâtre\"}', 8, 0, 4, 1, 0, 2, 0, 0, 0, ''),
(104, 'Photographie', '{\"en\": \"Photography\"}', 8, 0, 5, 1, 0, 0, 1, 0, 0, ''),
(105, 'Montage', '{\"en\": \"Editing\"}', 3, 0, 4, 1, 0, 1, 1, 0, 0, ''),
(106, 'Dressage (animal)', '{\"en\": \"Animal training\"}', 11, 0, 2, 1, 0, 3, 0, 1, 0, ''),
(107, 'Redaction', '{\"en\": \"Redaction\"}', 5, 0, 4, 1, 0, 0, 2, 0, 0, ''),
(108, 'Couteau papillon', '{\"en\": \"Butterfly knife\"}', 1, 0, 0, 1, 0, 0, 6, 0, 0, ''),
(109, 'Création cosplay', '{\"en\": \"Cosplay creation\"}', 8, 0, 3, 1, 0, 0, 3, 0, 0, ''),
(110, 'Botanique', '{\"en\": \"Botany\"}', 6, 0, 5, 1, 0, 0, 1, 0, 0, ''),
(111, 'Photo animalière', '{\"en\": \"Animal photography\"}', 8, 0, 2, 1, 0, 0, 4, 0, 0, 'FishChips');

-- --------------------------------------------------------

--
-- Structure de la table `SkillsIcon`
--

CREATE TABLE `SkillsIcon` (
  `ID` int(11) NOT NULL,
  `Name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Content` text COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `SkillsIcon`
--

INSERT INTO `SkillsIcon` (`ID`, `Name`, `Content`) VALUES
(1, 'Sport', 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIHZpZXdCb3g9IjAgMCAzMDAgMzAwIiB2ZXJzaW9uPSIxLjEiPgogIDxwYXRoCiAgICAgc3R5bGU9Im9wYWNpdHk6MDttaXgtYmxlbmQtbW9kZTpjb2xvcjtmaWxsOiNmZWZlZmU7ZmlsbC1vcGFjaXR5OjAuOTk1OTM1O3N0cm9rZTpub25lIgogICAgIGQ9Ik0gMCwwIFYgMzAwIEggMzAwIFYgMCBaIgogICAgIGlkPSJwYXRoMiIgLz4KICA8cGF0aAogICAgIHN0eWxlPSJmaWxsOiMwYjBlMWI7c3Ryb2tlOm5vbmU7b3BhY2l0eToxIgogICAgIGQ9Ik0xNDUgNDAuNDI0NEMxMTcuNzA2IDQ0LjAwODEgOTMuMjUwNiA1Mi4yMDQ5IDczLjAxNDcgNzIuMDM5NEM2My45NDY1IDgwLjkyNzYgNTYuODcwMyA5MS42ODIgNTEuMjQ3NyAxMDNDNDUuMzE3OCAxMTQuOTM3IDQxLjg4MzEgMTI3Ljc0MyA0MC45MTEzIDE0MUMzOS41NDY0IDE1OS42MiA0MS4zNjM2IDE3Ny41IDQ4LjQ1MjkgMTk1QzY3LjM0NjQgMjQxLjY0IDExNy41ODQgMjY5LjEzMiAxNjcgMjYyLjcxMUMxODAuOTMgMjYwLjkgMTk0Ljk4NyAyNTUuNTU3IDIwNyAyNDguMzk2QzI1OC4xODQgMjE3Ljg4MyAyNzguNjgyIDE1Mi4yMzkgMjUwLjY4IDk5QzI0NC4wNDkgODYuMzk0MSAyMzQuNzA4IDc1LjQ1NzggMjI0IDY2LjE1OUMyMTMuNjAyIDU3LjEyOTcgMjAxLjAxOSA1MC4zNDI5IDE4OCA0NkMxNzQuNjYyIDQxLjU1MDQgMTU5LjA4NiAzOC41NzQ4IDE0NSA0MC40MjQ0eiIKICAgICBpZD0icGF0aDQiIC8+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDojZmVmZWZlOyBzdHJva2U6bm9uZTsiCiAgICAgZD0iTTkwIDY1QzkxLjgxMTcgNzQuNjE1NiA5My45NzAyIDgzLjY4ODcgOTcgOTNDMTA2LjgyMSA4OC42Mjk1IDExNS4wNjkgODAuODU5MSAxMjUgNzYuMzA4NkMxNTAuOTcyIDY0LjQwODEgMTgxLjcyMSA1OC43NDk5IDIxMCA2NEMyMDMuNjE1IDU3LjA4OTEgMTkyLjc3IDUzLjUyODMgMTg0IDUwLjY2OThDMTUyLjAyMSA0MC4yNDY2IDExNy43MjcgNDYuNjUyOSA5MCA2NU0xMTYgMTI1QzEyMS4zODEgMTIzLjcyNCAxMjUuNCAxMTkuOTgzIDEzMCAxMTcuMDU0QzEzNy42OTEgMTEyLjE1OCAxNDUuNjUzIDEwNy41NTIgMTU0IDEwMy44NjJDMTcyLjc4OCA5NS41NTUzIDE5My4zOTkgODkuODQyOCAyMTQgODkuMDQwMUMyMjEuOTM2IDg4LjczMDkgMjMwLjA5NiA5MC4zNzYzIDIzOCA5MUMyMzQuMzQ5IDgzLjg0ODUgMjI3LjIxNCA3NC45NDgyIDIyMCA3MS4xNjQ0QzIxMi44ODEgNjcuNDMwMiAyMDEuODM5IDY4IDE5NCA2OEMxNzIuNzgzIDY4IDE1Mi44NTQgNjkuNzczNyAxMzMgNzguMDExNkMxMjQuMzY0IDgxLjU5NDcgMTE1LjY0MiA4Ni4wMzU2IDEwOCA5MS40MzlDMTA1LjQyMyA5My4yNjEzIDEwMS41MjcgOTUuNjAyNyAxMDAuOTk0IDk5LjAxNDdDMTAwLjU2NyAxMDEuNzQ3IDEwMi42MDIgMTA0LjczNCAxMDMuODYyIDEwN0MxMDcuNDE1IDExMy4zOTMgMTExLjk5MSAxMTguOTM0IDExNiAxMjVNMTQ0IDE4M0MxNDUuMjI1IDE3Ni42ODIgMTQ2LjUyMSAxNzAuNDIgMTQ3LjA3NCAxNjRDMTQ3LjI2MiAxNjEuODIgMTQ3LjkyMSAxNTkuMjcgMTQ2Ljg4MyAxNTcuMjFDMTQ1LjQzIDE1NC4zMjggMTQxLjU0NiAxNTIuNzEyIDEzOSAxNTAuOTcxQzEzMy43MSAxNDcuMzU0IDEyOC41OTEgMTQzLjQ2MiAxMjQgMTM4Ljk4NUMxMDUuNDMgMTIwLjg3NyA4Ny4xODE0IDk2LjA5NzUgODYgNjlDNzguNzEzMSA3Mi4zOTgxIDY2LjU1MjcgODMuNjA3OCA2NS4yNDMxIDkyQzYzLjg4OTggMTAwLjY3MiA2OS4wNDk4IDExMi4wNTMgNzIuMDY0IDEyMEM4My45MDgxIDE1MS4yMjUgMTEwLjk5NyAxNzYuMTcgMTQ0IDE4M00xMjEgMTI5QzEyNi4xMSAxMzYuMjQ5IDEzMy43MTYgMTQxLjcwOSAxNDEgMTQ2LjY1NkMxNDMuNDgyIDE0OC4zNDEgMTQ2Ljc4IDE1MS4zMDMgMTUwIDE1MC45OTJDMTUzLjM0MSAxNTAuNjcgMTU2LjM4NCAxNDcuMjc5IDE1OSAxNDUuNDM5QzE2NC42IDE0MS40OTkgMTcwLjc3OCAxMzcuODg4IDE3NyAxMzUuMDI4QzIwMS4wMzcgMTIzLjk3OCAyMjguMDQzIDExOS4yODQgMjU0IDEyNkMyNTIuODM4IDExOC4xMzIgMjQ4Ljc1MSAxMDIuNjEgMjQxLjc4NyA5Ny45MzgzQzIzOS4yMjUgOTYuMjE5NiAyMzUuOTQ5IDk2LjE5OTEgMjMzIDk1Ljg0NDlDMjI1LjMxOSA5NC45MjIzIDIxNy43MzUgOTQuOTg3NiAyMTAgOTVDMTc3LjgwNSA5NS4wNTE3IDE0Ni41NTYgMTEwLjY5NiAxMjEgMTI5TTU5IDk5QzU0LjQ3MzMgMTA5Ljg3MyA0Ny4zMDEzIDEyMS44MyA0Ny4yNzU1IDEzNEM0Ny4yNjQgMTM5LjM4OSA1MC45MDc1IDE0NS4yODkgNTMuMjQ3NyAxNTBDNTkuNzQ1MiAxNjMuMDc5IDY3LjkyMTIgMTc1LjQyMiA3OC4wMzk0IDE4NkM4OC4zMzc4IDE5Ni43NjcgMTAwLjY1OCAyMDYuMDggMTE0IDIxMi43NTJDMTE3LjQyOSAyMTQuNDY2IDEyMy42NzUgMjE4LjYyIDEyNy42NzEgMjE3LjI5MkMxMzAuNTYzIDIxNi4zMzEgMTMxLjk4NyAyMTIuNDY2IDEzMy4yNDQgMjEwQzEzNi44MDEgMjAzLjAyMiAxNDAuNjYxIDE5NS43ODMgMTQyIDE4OEMxMDEuNTAyIDE3Ni41MDggNjYuODA0IDE0Mi4wNjcgNjEgOTlMNTkgOTlNMTg3IDEzNkMxOTIuNzMzIDE2Ni44OCAxODYuNjM2IDIwMi45ODcgMTcyLjYzIDIzMUMxNjcuOTggMjQwLjI5OSAxNjEuNDU2IDI0OC4yMzkgMTU2IDI1N0MxNjUuMzU4IDI1Ni45NzQgMTc4Ljc0NiAyNTYuMTI4IDE4Ni44MjkgMjUwLjkxNEMxOTQuNzg0IDI0NS43ODQgMjAwLjY1OCAyMzMuOTY0IDIwNS4zOTYgMjI2QzIyMy41MzMgMTk1LjUxMyAyMjcuNzQgMTYyLjcxOSAyMjUgMTI4QzIxMi4yMjMgMTI4LjEwNiAxOTguNyAxMzAuODE0IDE4NyAxMzZNMjMwIDEyOEMyMzUuMTE2IDE1NS40NTkgMjMwLjI5MSAxODUuNjY3IDIxOC42OTEgMjExQzIxMy4xMjggMjIzLjE0OSAyMDQuMDk5IDIzMy44NzcgMTk5IDI0NkMyMjguMjUgMjMzLjM5NiAyNDkuNzc5IDIwMi44ODggMjU1LjM4NiAxNzJDMjU3LjEyOSAxNjIuMzk1IDI1Ny4yMjQgMTUyLjczOCAyNTYuOTg1IDE0M0MyNTYuOTA3IDEzOS44MDggMjU3LjAwNyAxMzQuMjQ5IDI1NC40IDEzMS45MzhDMjQ5LjQ1NiAxMjcuNTU2IDIzNi4yNjQgMTI4LjAxNyAyMzAgMTI4TTE4MSAxMzhDMTcyLjY2NCAxNDIuODY2IDE2MC40MTkgMTQ3LjA5OSAxNTQuNiAxNTUuMTc0QzE1MC45NzIgMTYwLjIwNyAxNTEuNzA5IDE2OS4wNiAxNTAuNzE1IDE3NUMxNDkuMDYgMTg0Ljg4MyAxNDUuODU4IDE5NC45IDE0MS42OTEgMjA0QzEzMy41NCAyMjEuODAxIDEyMS4wNDggMjMzLjg4NyAxMDggMjQ4QzExNi45MTUgMjUyLjE2OSAxMjYuMzI5IDI1NC42ODggMTM2IDI1Ni4zODVDMTM5LjkzMiAyNTcuMDc1IDE0NS4yOCAyNTcuODcyIDE0OC45ODUgMjU1Ljk3MkMxNTUuMjQ1IDI1Mi43NjMgMTU5LjY1NyAyNDMuNzQxIDE2My4zMDUgMjM4QzE3Ni43MzIgMjE2Ljg2OSAxODMgMTg5LjgyNyAxODMgMTY1QzE4MyAxNTcuMzEyIDE4NS40NDkgMTQ0LjUxMiAxODEgMTM4TTQ2IDE0N0M0NiAxNzQuOCA1My4xNDEyIDIwMC44NTUgNzIuMTcwNSAyMjJDNzguMzIzOSAyMjguODM3IDg1LjMwOTUgMjM0Ljg3MSA5MyAyMzkuOTIxQzk1LjcxNTQgMjQxLjcwNSA5OS41Mjg1IDI0NC43OTYgMTAzIDI0NC4xODdDMTA2LjAzNiAyNDMuNjU0IDEwOC44MDQgMjQwLjgwMSAxMTEgMjM4LjgyOUMxMTYuMjUzIDIzNC4xMTMgMTIxLjEwNCAyMjguODg5IDEyNSAyMjNDMTAwLjgzMiAyMTEuNTYyIDgwLjExOTkgMTk3LjU2OCA2My42NTQzIDE3NkM1Ni42ODYxIDE2Ni44NzMgNTIuMzI2IDE1Ni40MDQgNDYgMTQ3eiIKICAgICBpZD0icGF0aDYiIC8+Cjwvc3ZnPg=='),
(2, 'Musique', 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIHZpZXdCb3g9IjAgMCAzMDAgMzAwIiB2ZXJzaW9uPSIxLjEiPgogIDxwYXRoCiAgICAgc3R5bGU9Im9wYWNpdHk6MDtmaWxsOiNmZmZmZmY7c3Ryb2tlOm5vbmUiCiAgICAgZD0iTSAwLDAgViAzMDAgSCAzMDAgViAwIFoiCiAgICAgaWQ9InBhdGgyIiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6IzAyMDIwMjsgc3Ryb2tlOm5vbmU7IgogICAgIGQ9Ik05OSAxNzVMMTA0IDE3NkMxMDUuOTEgMTY3Ljk3NiAxMDUgMTU5LjIwOSAxMDUgMTUxTDEwNSAxMDZDMTA1IDk4LjA4NzEgMTAzLjE3NyA4Ny40NjQ2IDEwNi4xNDggODAuMDA0NkMxMDguNzIzIDczLjU0MDMgMTE1Ljg1NyA3MS45OTQzIDEyMiA3MC42NjJDMTM2LjYyNyA2Ny40ODk3IDE1MS4zMjUgNjQuNDkxMiAxNjYgNjEuNTUwOUMxODIuMDEyIDU4LjM0MjggMTk4LjA4OCA1NC45OTQyIDIxNCA1MS4zNDg4QzIyMC45NzcgNDkuNzUwMyAyMjguNzgyIDQ2LjgxMTQgMjM0LjgxMiA1Mi4zNDQxQzI0MC4wNTMgNTcuMTUzNyAyNDAgNjMuNDM0OCAyNDAgNzBMMjQwIDEwM0wyNDAgMTYwQzI0MCAxNzEuMjU3IDI0MS4yODQgMTgzLjI0NCAyMzcuMjg5IDE5NEMyMzEuNDcxIDIwOS42NyAyMTUuODQ4IDIxOS4wODYgMjAwIDIyMS41NjFDMTgyLjQwNiAyMjQuMzA5IDE2My4yNTggMjE1LjkxMyAxNTYuMzEzIDE5OUMxNTIuMDA5IDE4OC41MTYgMTU1LjMxNyAxNzcuNTY3IDE2MS41NTQgMTY4LjUzNkMxNjQuMTY3IDE2NC43NTMgMTY3LjM0NiAxNjAuOTEyIDE3MiAxNjBDMTc3LjkzIDE1My4yNTYgMTkwLjM0NiAxNTEuMTAzIDE5OSAxNTEuMDA0QzIwMi4zMjIgMTUwLjk2NiAyMDkuNjcxIDE1Mi45MDIgMjEyLjM5NyAxNTAuOTMzQzIxNi4wNDEgMTQ4LjI5OSAyMTQgMTM2LjA0OSAyMTQgMTMyTDIxNCA3N0MxODYuNjA1IDg0LjcxNjcgMTU3Ljg3MyA4OS4yNSAxMzAgOTVMMTMwIDE3NkMxMzAgMTg4LjU3MyAxMzIuMzYyIDIwMy45MjcgMTI4LjQwMiAyMTZDMTIxLjEyIDIzOC4yMDEgOTIuNTQ2NCAyNTAuMTYgNzEgMjQzLjI1NEM1Mi4xMzE2IDIzNy4yMDYgMzkuMDc4OCAyMTguMTc2IDQ4LjI2MzEgMTk5LjAwMUM1MC4yNzk4IDE5NC43OSA1My4zNjA2IDE4OC40OTggNTggMTg3QzY1LjgyMzQgMTc2LjQxIDgxLjY5MTYgMTc0IDk0IDE3NEM4Ny44MTMzIDE3MS40MDQgNzguMzY4IDE3Mi43OTMgNzIgMTc0LjM3NUM2NC4wNTY4IDE3Ni4zNDkgNTYuMjYxNCAxNzguNzQ2IDUwLjAzOTQgMTg0LjMwMUMzNy4yNDczIDE5NS43MjIgMzMuODcyNiAyMTYuNjg5IDQzLjU5NDkgMjMxQzQ3Ljg1NzMgMjM3LjI3NCA1NC4xNzM4IDI0NC41MDIgNjEgMjQ4LjAwNEM4NC43NTk1IDI2MC4xOTMgMTE4LjkzOSAyNTEuNTk1IDEyOS42NTEgMjI2QzEzNC42NjcgMjE0LjAxNSAxMzIgMTk3Ljc0NyAxMzIgMTg1TDEzMiA5OEMxNDQuODAyIDk2LjM0NjcgMTU3LjM1OCA5Mi45NzggMTcwIDkwLjQ0OTFDMTgzLjk1MyA4Ny42NTggMTk4LjE5MyA4NS40MDE0IDIxMiA4MkwyMTIgMTMxQzIxMiAxMzUuMDc3IDIxMy44MyAxNDUuMzExIDIxMC4zOTcgMTQ4LjIyN0MyMDguNTMxIDE0OS44MTEgMjA1LjIyNyAxNDkuMDUzIDIwMyAxNDkuMDE0QzE5Ny45OTggMTQ4LjkyNiAxOTIuOTUxIDE0OC44MTEgMTg4IDE0OS41OUMxNjYuNTkxIDE1Mi45NiAxNDYuODExIDE2OS4zMDcgMTUwLjMwMSAxOTNDMTU2LjYxIDIzNS44MyAyMTcuODcyIDIzOS4yNzYgMjM5LjU1NyAyMDhDMjQ3LjY5MiAxOTYuMjY3IDI0NiAxODEuNTI4IDI0NiAxNjhMMjQ2IDk0QzI0NiA4My4zMzEgMjQ4LjQxNiA2OS4yMjM5IDI0NS4xOTYgNTkuMDAwOEMyNDIuMTM3IDQ5LjI4ODcgMjMxLjY0NyA0My4zODc1IDIyMiA0NC4wOTAzQzIwOC4zOTkgNDUuMDgxMSAxOTQuMzg0IDQ5Ljg2OTMgMTgxIDUyLjU1MDlDMTY0LjggNTUuNzk2OCAxNDcuMjQ2IDU3LjcxNTcgMTMxLjcxNSA2My4zMTQ4QzEyMy40MDUgNjYuMzEwNiAxMDguNjM0IDY0Ljc4ODggMTAyLjcwMyA3Mi4yMjQ1Qzk3LjM0ODEgNzguOTM4NCAxMDAgOTIuOTM2NCAxMDAgMTAxTDEwMCAxNDdDMTAwIDE1Ni4yOTUgMTAwLjcwMiAxNjUuODMyIDk5IDE3NXoiCiAgICAgaWQ9InBhdGg0IiAvPgogIDxwYXRoCiAgICAgc3R5bGU9Im9wYWNpdHk6MDtmaWxsOiNmZmZmZmYiCiAgICAgaWQ9InBhdGg4NTUiCiAgICAgZD0ibSA4Ny40NjgyNTQsMTc4LjQ4MDg4IGMgMS4yMzAwNDksLTAuMTE1NzEgMi40NTIzODksLTAuMDUxNiAzLjY2ODQ3OCwwLjE0ODA1IDAuNjI5NjI1LDAuMDcxIDEuMjI0Njg1LDAuMjg2NzIgMS44MjAyNDIsMC40ODg5OSAwLDAgMTIuMjYwNzc2LC04LjI1NTkyIDEyLjI2MDc3NiwtOC4yNTU5MiB2IDAgYyAtMC42NDkxMiwtMC4yNjE1NSAtMS4zMDk4NSwtMC40NzYyMyAtMS45Njc0OCwtMC43MTU0MiAtMS4yMTU3NCwtMC4yMjgwOSAtMi40MzI3NCwtMC40NDM5MiAtMy42NzQ0OTgsLTAuNDYyMzMgMCwwIC0xMi4xMDc1MTgsOC43OTY2MyAtMTIuMTA3NTE4LDguNzk2NjMgeiIgLz4KICA8cGF0aAogICAgIHN0eWxlPSJvcGFjaXR5OjA7ZmlsbDojZmZmZmZmIgogICAgIGlkPSJwYXRoODU3IgogICAgIGQ9Im0gMTA4Ljk3NjcsMTY5LjM0MDIyIGMgLTIuMTU4ODgsMC4xNjM3IC00LjMyNTA3LDAuMTUxMDUgLTYuNDg3NjcsMC4wOTUyIC0xLjg3MzA3LC0wLjA0NDYgLTMuNzQwOTk2LC0wLjIxMDc5IC01LjU4Nzg4NCwtMC41MjM3IDAsMCAtMTEuOTc3NDQzLDguNDMyNTEgLTExLjk3NzQ0Myw4LjQzMjUxIHYgMCBjIDEuOTU0NDk0LDAuMjU4OCAzLjkxNTQyLDAuNDU3NzQgNS44ODg1NjIsMC41MDE0NCAyLjAxOTEwMiwwLjExNTQ3IDQuMDM4OTk5LDAuMTY4NjcgNi4wNTY5MTUsMC4yOTExNCAwLDAgMTIuMTA3NTIsLTguNzk2NjIgMTIuMTA3NTIsLTguNzk2NjIgeiIgLz4KICA8cGF0aAogICAgIHN0eWxlPSJvcGFjaXR5OjA7ZmlsbDojMDAwMDAwIgogICAgIGlkPSJwYXRoODU5IgogICAgIGQ9Im0gMTEyLjYxMTI0LDE2Ny45ODMyNSBjIC0wLjQ2MjIzLDAuMDM1MSAtMC45MjM0NywwLjA4NzYgLTEuMzg2NywwLjEwNTIzIC0zLjgxNTk3LDAuMTQ1MzMgLTcuNjU5MjksLTAuMDI5NyAtMTEuNDczNjg3LC0wLjEwMjExIC02LjkwNDU5NSwtMC4xMzExNSAtNS4yODg5MTksLTAuMTAxNDYgLTEyLjM0ODA5MywtMC4yNzQ1OCAtNy43NDM5MjMsLTAuMjY1NTEgLTQuMDA1OTYsLTAuMTI4NDcgLTExLjIxNDAxOSwtMC40MDc1OCAwLDAgLTkuOTUzNzE3LDcuMjA3MDIgLTkuOTUzNzE3LDcuMjA3MDIgdiAwIGMgNy41MjYwNzEsLTAuMDM2OSAzLjY2NDY2MiwtMC4wNjg4IDExLjU4NDA3OSwwLjExMjE4IDcuNjA1MTUsMC4zNTA2OSAxNS4yMzU5MjUsMC43MjY2NiAyMi43Mzc0MjcsMi4xMTgxMSAwLDAgMTIuMDU0NzEsLTguNzU4MjcgMTIuMDU0NzEsLTguNzU4MjcgeiIgLz4KICA8cGF0aAogICAgIHN0eWxlPSJvcGFjaXR5OjE7ZmlsbDojMDAwMDAwIgogICAgIGlkPSJwYXRoOTY2IgogICAgIGQ9Im0gMTAzLjA0Mjc4LDE3Mi45NCBjIC0zLjU2NjY2NywtMC43NTU2NCAtNy4xODcxMTMsLTEuMzA0NTQgLTEwLjgyNTQ3NywtMS41NjU3IC0xLjA0MTQ3MSwtMC4wNzQ4IC0yLjA4NTk5OSwtMC4wOTggLTMuMTI4OTk4LC0wLjE0NzA0IC0zLjI3ODgzOCwtMC4wMzM4IC02LjU4MDQzMywwLjExNzk2IC05LjgyMzM2NCwwLjYzNTQzIC0yLjQ1MDYxNiwwLjM5MTA0IC0zLjM3MDc3MiwwLjcwNzUgLTUuNzA5NzkxLDEuMzQ3NjQgMCwwIC0yLjcwMjc3NywyLjA3ODk3IC0yLjcwMjc3NywyLjA3ODk3IHYgMCBjIDIuMzIwMTcsLTAuNjY2OTcgMy4yOTQwMjMsLTEuMDE0MjggNS43MjQ3MjQsLTEuNDIzNDEgMy4yMjQxNiwtMC41NDI2OCA2LjUxMzY4MiwtMC43MDYxNyA5Ljc3NzY0LC0wLjY3MjExIDEuMDMzNDg4LDAuMDQ4NSAyLjA2ODY0LDAuMDY5NCAzLjEwMDQ2NCwwLjE0NTQ5IDMuNTM5NzMyLDAuMjYxIDcuMDg5MjE0LDAuNzc3NTkgMTAuNTEzMjk2LDEuNzIxMjUgMCwwIDMuMDc0MjgzLC0yLjEyMDUyIDMuMDc0MjgzLC0yLjEyMDUyIHoiIC8+CiAgPHBhdGgKICAgICBzdHlsZT0ib3BhY2l0eToxO2ZpbGw6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4zNDQwMzciCiAgICAgZD0iTSA3Ni42OTMyNTUsMjQ0LjQ0Mjg0IEMgNjguMjkyMDY2LDI0Mi44NDg3MSA2MC44MjI2MSwyMzkuMDI2MTkgNTUuMTg2OTU0LDIzMy40MzY5MiA0Ny4wODQzNDMsMjI1LjQwMSA0My43NjYzNDEsMjE0LjgwMDA1IDQ2LjMwMDgwOSwyMDUuMDQ1ODcgYyAxLjgxOTYsLTcuMDAyOTMgNi45MDgyODgsLTE1LjM3NTAxIDEwLjQ1Njc3NywtMTcuMjAzODQgMC42NjY5MjgsLTAuMzQzNzMgMi4wMTg0NiwtMS40Nzk5NiAzLjAwMzQwNSwtMi41MjQ5NiA2LjE4NDE1NSwtNi41NjEyMSAxNS4yNTk3MiwtOS45Nzg5MyAyOS4wMDA0NzYsLTEwLjkyMTE0IDQuODYzNjE2LC0wLjMzMzUgNS45OTY4NzYsLTAuMzEzNDMgNy45MTI4NDQsMC4xNDAxOCA1LjQ0MzA4OSwxLjI4ODY2IDcuMjkxMzQ5LDEuNjU4NzggNy40NTY4NTksMS40OTMyNyAwLjA5NzUsLTAuMDk3NSAwLjQwNTI5LC0xLjY5Nzg0IDAuNjgzOTcsLTMuNTU2MzEgMC40MzMyNiwtMi44ODkyNyAwLjQ3MzcxLC04LjYzOTgyIDAuMjc5MTEsLTM5LjY3NDkxIC0wLjEyNTE3LC0xOS45NjI3MyAtMC4yMzc1NywtMzguNzcyOTMyIC0wLjI0OTc4LC00MS44MDA0NTUgLTAuMDQ2NywtMTEuNTgwNTI0IDIuNjY4NDMsLTE1Ljk2ODM2IDExLjU4MTYyLC0xOC43MTY4MjYgMy4wODE3OSwtMC45NTAyOTcgMTcuODM0MjIsLTQuMTAzODQxIDQ0LjM4ODIxLC05LjQ4ODYxNSAyNS42NzI1MywtNS4yMDYwMjUgNDEuMDM5MDUsLTguNDY5MTg4IDUzLjAwNDUsLTExLjI1NTc5MSAxMC40NTA4NSwtMi40MzM4NjggMTMuNjQyMzIsLTIuNjg2MjU3IDE3LjA4MDQzLC0xLjM1MDc2MSA0LjU2MDQzLDEuNzcxNDUxIDcuNzI4MTIsNi4yNDgxNjUgOC41NDU2OSwxMi4wNzcxMzcgMC40ODA5MywzLjQyODc3NyAwLjUwODksMTE3LjgwMDYxMSAwLjAyOTcsMTIxLjUyNzA1MSAtMC45MzI0Miw3LjI1MTIxIC0zLjc2MTYxLDE0LjU2NTI5IC03LjU3NDcxLDE5LjU4MjI0IC02LjU5ODY4LDguNjgxOTkgLTE3LjQ5MDg1LDE1LjA1OTc5IC0zMC4yOTQ0MywxNy43Mzg1OCAtNC4wNjA1NSwwLjg0OTU2IC0xMi40OTUyNywwLjg0NDQ4IC0xNi41MTM3NywtMC4wMSAtMTYuNjY1ODksLTMuNTQzNTQgLTI4LjUzNDA4LC0xNS4wMTg4OSAtMzAuMzQ5OTYsLTI5LjM0NTM4IC0wLjgzNzU0LC02LjYwNzgzIDEuNDI3NTgsLTE0LjUyOTMzIDYuMjc4OTIsLTIxLjk1ODM2IDMuMzMzMjMsLTUuMTA0MjkgNi41MjgwNSwtOC4xNjc3NCA5LjU2MjM2LC05LjE2OTE2IDAuNjg2MTEsLTAuMjI2NDMgMi4xNTU2NSwtMS4xNjc1IDMuMjY1NjUsLTIuMDkxMjUgNi40NzA2OSwtNS4zODQ5NiAxOC4wNjc3NywtOC4wODY1MyAyOS42NDksLTYuOTA2OCA3LjIwNzk3LDAuNzM0MjUgOS4yMjY0MywwLjI2NzM1IDEwLjMzNTE4LC0yLjM5MDcgMC41Nzk1NSwtMS4zODkzNyAwLjYxMDQ4LC0zLjUzMDkxIDAuNTMwNjQsLTM2LjczOTEzIC0wLjA0NjYsLTE5LjM5NTA3IC0wLjE4ODI4LC0zNS4zNTU5NDEgLTAuMzE0NzYsLTM1LjQ2ODYwNCAtMC4xMjY0OCwtMC4xMTI2NjMgLTMuMDE2NjYsMC41NDcwNCAtNi40MjI2MywxLjQ2NjAwNiAtMTIuMzI0NjcsMy4zMjUzMyAtMjUuNzY2MTMsNi4xODMzNDIgLTY0Ljg1MDkxLDEzLjc4OTAzIGwgLTEyLjkwMTM4LDIuNTEwNTM5IFYgMTM2LjU5IGMgMCwyMi45ODYxNiAwLjEzODQ5LDQ3LjM2NjQyIDAuMzA3NzYsNTQuMTc4MzUgMC4zMzcxOSwxMy41NzAyIDAuMTM3MzMsMTYuOTExODMgLTEuMzY2OTMsMjIuODUzNzMgLTIuNjg3NTMsMTAuNjE1OTEgLTEwLjU3MDIsMTkuOTA0MDggLTIxLjcwMTMzLDI1LjU3MDc2IC03Ljc4NjMwMywzLjk2Mzg4IC0xMy40MzA2ODIsNS40MDQ2MSAtMjEuOTY0MjY4LDUuNjA2NDEgLTQuMTY1NDI1LDAuMDk4NSAtNi41OTg5NjIsLTAuMDA0IC04LjQ1NTgyNywtMC4zNTY0MSB6IgogICAgIGlkPSJwYXRoMTExNiIgLz4KPC9zdmc+'),
(3, 'Informatique', 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiIHZpZXdCb3g9IjAgMCA1MDAgNTAwIiB2ZXJzaW9uPSIxLjEiPgogIDxnCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNTUyLjM2KSIKICAgICBpZD0iZzQiCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZiI+CiAgICA8cGF0aAogICAgICAgZD0ibTg4LjAzMyA2NjEuNjZjLTcuMDY1MyAwLTEyLjc1MiA1LjY4ODYtMTIuNzUyIDEyLjc1NHYyMDcuNDVjMCA3LjA2NTMgNS42ODY3IDEyLjc1MiAxMi43NTIgMTIuNzUyaDEyMi40M3YzOS4xN2gtMTMuODg5Yy0yLjU2ODQgMC00LjYzNjcgMi4wNjg0LTQuNjM2NyA0LjYzNjcgMCAyLjU2ODQgMi4wNjg0IDQuNjM2NyA0LjYzNjcgNC42MzY3aDEwNi44NWMyLjU2ODQgMCA0LjYzNjctMi4wNjg0IDQuNjM2Ny00LjYzNjcgMC0yLjU2ODQtMi4wNjg0LTQuNjM2Ny00LjYzNjctNC42MzY3aC0xMy44ODl2LTM5LjE3aDEyMi40M2M3LjA2NTMtMWUtNSAxMi43NTItNS42ODY3IDEyLjc1Mi0xMi43NTJ2LTIwNy40NWMwLTcuMDY1My01LjY4NjYtMTIuNzU0LTEyLjc1Mi0xMi43NTR6bTMuNDg2MyAxNS43ODloMzE2Ljk2djIwMC4wNWgtMzE2Ljk2eiIKICAgICAgIGZpbGw9IiNmZmZmZmYiCiAgICAgICBpZD0icGF0aDIiCiAgICAgICBzdHlsZT0iZmlsbDojZmZmZmZmIiAvPgogIDwvZz4KPC9zdmc+'),
(4, 'Manuel', 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIHZpZXdCb3g9IjAgMCAzMDAgMzAwIiB2ZXJzaW9uPSIxLjEiPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZlZmVmZTtzdHJva2U6bm9uZTtvcGFjaXR5OjAiCiAgICAgZD0iTTAgMEwwIDMwMEwzMDAgMzAwTDMwMCAwTDAgMHoiCiAgICAgaWQ9InBhdGgyIiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6IzAwMDAwMDtzdHJva2U6bm9uZSIKICAgICBkPSJNMTQ4IDE3NEMxNTcuNDYzIDE3OC4wMTQgMTY0LjMyNCAxODguMzc2IDE3MS41NzkgMTk1LjQ0NkMxNzQuNDQxIDE5OC4yMzUgMTc4LjI2NyAyMDEuMTUxIDE3OS41OTEgMjA1LjA5QzE4MC44MjIgMjA4Ljc1MiAxNzkuNzkyIDIxMy4xNzkgMTgwLjI4OSAyMTdDMTgxLjQ3MSAyMjYuMDcyIDE4NS44MjkgMjMzLjgxMyAxOTMuMTY2IDIzOS40MDVDMjAwLjQxNSAyNDQuOTMxIDIwOC4xMDEgMjQ2LjIyMiAyMTcgMjQ1Ljk4NUMyMjAuNzYxIDI0NS44ODUgMjI1Ljg3MyAyNDUuMjI3IDIyNy45MjggMjQxLjUyMkMyMjkuMzg3IDIzOC44OTIgMjI3LjUwOCAyMzYuNDkzIDIyNS44MTUgMjM0LjU3NkMyMjEuNjI4IDIyOS44MzUgMjE2Ljg1OCAyMjMuNTUyIDIxMSAyMjFDMjEzLjc4OSAyMTYuNjA1IDIxOC4wNTUgMjEyLjM4OCAyMjIgMjA5QzIyNS4zMTQgMjE2LjMxNyAyMzMuNjMyIDIxOS43NDcgMjM3IDIyN0MyMzkuMjk2IDIyNi45OTIgMjQyLjQ2OSAyMjcuNDM0IDI0NC40MzYgMjI1Ljk3MkMyNDYuOTU2IDIyNC4wOTggMjQ2Ljg3NSAyMTkuNzk4IDI0Ny4yNzEgMjE3QzI0OC41OTIgMjA3LjY1MiAyNDUuOTM1IDE5OC45NTQgMjQwLjk2IDE5MS4wNUMyMzcuMDU4IDE4NC44NTIgMjI4LjIwNSAxNzkuOTQ5IDIyMSAxNzkuMTc0QzIxNi41MzUgMTc4LjY5MyAyMTEuMzE2IDE3OS45NTEgMjA3LjAzOSAxNzguNDExQzIwMC4xNzYgMTc1Ljk0MSAxOTMuOTYxIDE2Ni43NjcgMTg4Ljg3IDE2MS43M0MxODUuODA1IDE1OC42OTggMTc1LjkyNCAxNTIuMDYyIDE3Ny4zMTYgMTQ3QzE3OC4xMzcgMTQ0LjAxNiAxODEuNyAxNDEuNDk4IDE4My44IDEzOS40QzE4OS43OTcgMTMzLjQwOSAxOTUuNDUzIDEyNi42NTggMjAyLjcyOSAxMjIuMTlDMjA1LjgwNSAxMjAuMzAxIDIxMC4yNDkgMTE4LjA0OSAyMTMuNTY2IDEyMC43NTdDMjE2LjYxMiAxMjMuMjQzIDIxNS42NTUgMTI3LjU2NCAyMTYuMzQgMTMwLjk2MUMyMTcuODUgMTM4LjQ0OSAyMjUuMzI2IDE0OC43MzggMjMzLjk2MSAxNDUuMTQzQzIzNy4zMjkgMTQzLjc0MSAyMzkuODgzIDE0MC41MjUgMjQyLjQgMTM3Ljk5OUMyNDguMzE0IDEzMi4wNjQgMjYyLjMxMyAxMjMuMDE2IDI1OC4yNjIgMTEzLjE3MUMyNTQuNjM3IDEwNC4zNjIgMjM5LjMwOSAxMDIuMjQ1IDIzMSAxMDJDMjM2LjU5OCA5MS41Mjc3IDIyNy4xODUgNzkuNzcyMiAyMjAuMjY1IDcyLjg0NTdDMjEzLjQwOSA2NS45ODIxIDIwNi4wMDMgNTkuMDEyIDE5Ni43MTUgNTUuNTA2MkMxODMuNjQyIDUwLjU3MiAxNjYuMzI3IDUyLjQxNTUgMTUzIDU1TDE1MyA3MkMxNTYuNjMzIDcyLjIzNjIgMTU5LjU3NCA3My41OTcyIDE2My4wMzkgNzQuNTc1NkMxNjUuNzUzIDc1LjM0MTcgMTY4LjI3NSA3Ni4wOTMyIDE3MC43MTQgNzcuNTU5NEMxODkuNjY2IDg4Ljk1MjQgMTY4LjE4NyAxMDcuNjUzIDE1OC43NSAxMTYuOEMxNTUuOTczIDExOS40OTIgMTUzLjMxNyAxMjIuMDA2IDE1MCAxMjRDMTQzLjgzNiAxMTMuNjA3IDEzMi4yMDggMTA2LjYxMiAxMjQuNTY5IDk3LjI3MDhDMTE5LjYyNSA5MS4yMjUzIDEyMy4xNjUgODIuMTA3NyAxMjAuOTQ1IDc1LjAwMDhDMTE2Ljg2NiA2MS45MzcyIDEwMi4xNzIgNTIuODY3NSA4OSA1My4wMDM5Qzg0LjYxMzQgNTMuMDQ5MyA3Ny43OTAyIDUzLjU4ODQgNzUuMDE3NyA1Ny42ODQ0QzczLjE5MjcgNjAuMzgwOCA3NS4yMDAzIDYzLjA4NTggNzYuOTc4NCA2NS4xMzA0QzgwLjQyNDkgNjkuMDkzNiA5My4yNzY2IDc3LjM1MyA4OS4wMjg1IDgzLjA3OTVDODAuNzEzNCA5NC4yODg0IDczLjA3OTUgNzkuNjI3NyA2Ni4yNzA4IDc0LjIyODRDNjAuMjQ3OSA2OS40NTIyIDU2LjY0NDQgNzUuMzE1OSA1NS43MzMgODEuMDE0N0M1NS40MTYxIDgyLjk5NjYgNTUuMDc4NyA4NC45ODY3IDU1LjA3ODcgODdDNTUuMDc4NyA5MC4xMjk3IDU1LjQ5MTIgOTMuNzk4NiA1Ni4yODQ3IDk2LjgzMDJDNTkuNjg2OCAxMDkuODI5IDcxLjM0NiAxMTguMyA4NCAxMjAuNTM2Qzg4LjMxODMgMTIxLjI5OSA5My43MDQgMTE5Ljc3OCA5Ny43NDA3IDEyMS40NDhDMTAzLjgwMSAxMjMuOTU3IDEwOS41NjggMTMyLjI4MyAxMTQuMTMgMTM2Ljg3QzExNi44NzQgMTM5LjYyOSAxMjMuODkzIDE0NC43NSAxMjQuNTU4IDE0OC43MjVDMTI0Ljk0IDE1MS4wMDcgMTIyLjY3NCAxNTIuMTU5IDEyMS4wNDIgMTUzLjE0OUMxMTYuODczIDE1NS42NzcgMTEyLjU3IDE1OC4wNyAxMDguOTE0IDE2MS4zMjlDOTkuMTgzNSAxNzAuMDA2IDkwLjMxNjEgMTc5LjkyNiA4MS4wMjQ3IDE4OS4wODZDNzguMjI0NiAxOTEuODQ2IDc1Ljc2OTYgMTk1LjIxNCA3Mi41NjEgMTk3LjUyNUM2OC40MTAzIDIwMC41MTYgNTguMjE1NiAxOTkuNTUzIDU3LjQ2MjIgMjA1Ljk4QzU3LjAxMDkgMjA5LjgzIDYxLjYwNjggMjEzLjUyNyA2NC4wMjQ3IDIxNS45MTRDNzEuMTIzNCAyMjIuOTI1IDc4LjA4OTggMjI5LjgyNSA4NC42OTUyIDIzNy4yODlDODcuMTI4NiAyNDAuMDM5IDkwLjYxNDggMjQzLjg2MyA5NC43MzY5IDI0Mi4zNzFDOTkuMTAyNSAyNDAuNzkxIDk5LjE0NjkgMjM0LjY3MiAxMDAuNDgyIDIzMS4wMzlDMTAxLjQ0NiAyMjguNDE5IDEwMy4xNzUgMjI2LjI0OCAxMDUuMDA0IDIyNC4xN0MxMTEuODkyIDIxNi4zNDMgMTE5Ljg5MyAyMDguNDI2IDEyNy41NTkgMjAxLjMzQzEzNS42ODYgMTkzLjgwNyAxNDQuNzE2IDE4NC45MzUgMTQ4IDE3NHoiCiAgICAgaWQ9InBhdGg0IiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZlZmVmZTsgc3Ryb2tlOm5vbmU7IgogICAgIGQ9Ik04OSA2Mkw4OCA2NkM5Mi4xOTEyIDY2LjUxODggMTAyLjM2NyA3NS40MDQ0IDEwMS44MjYgODAuMDQzMkMxMDEuNTU5IDgyLjMzMjYgOTkuNjYyOCA4NC4yMzI1IDk4LjI1OTMgODUuOTEwNUM5NC43MTEzIDkwLjE1MjIgODkuNjYxNiA5OC4wNzczIDgzLjk0NjggOTkuMzg3M0M3Ni41MDk5IDEwMS4wOTIgNzAuNDQ1NCA4OC43NTE4IDY0IDg2QzY0LjI2NTggOTguNDc4NyA3MS43ODQ4IDExMC43MjYgODUuMDAwOCAxMTIuNjk5QzkwLjQ0OTcgMTEzLjUxMyA5Ny4xNTE1IDExMC41NjcgMTAyIDExMy42MDRDMTE0LjEwMiAxMjEuMTg2IDEyMC45MzEgMTM2LjkwNSAxMzQgMTQzQzEzNy4xNjQgMTM4LjU5NyAxNDEuMjczIDEzNC45MzkgMTQ1IDEzMUMxMzcuNjUyIDExOC44MzIgMTIzLjQyNiAxMTEuNjExIDExNS41MTUgOTkuODMwMkMxMTIuNDUxIDk1LjI2ODEgMTE1LjUxMiA4OS4xNzA5IDExNC42NzUgODRDMTEyLjMzIDY5LjUxMTQgMTAyLjAyIDY0LjQyNTggODkgNjJNMTY0IDYyTDE2NCA2NEMxNzQuNjk1IDY2LjYyNDYgMTg4Ljg5MSA3Ni42NTU3IDE4OC44OTIgODlDMTg4Ljg5MiA5NC4wOTM1IDE4NC40NTUgOTguNzI4NyAxODUuNTI3IDEwMy45MUMxODYuMzA3IDEwNy42ODQgMTkwLjM2NCAxMTAuNDk5IDE5MiAxMTRDMjAwLjQyNSAxMTMuNzk3IDIxMS41MjkgMTA1LjkyIDIxOS40NDYgMTEyLjU3NEMyMjQuNjE4IDExNi45MjEgMjI0LjMzNiAxMjMuMDA4IDIyNS44NDQgMTI4LjkxQzIyNi4zNzkgMTMxLjAwMyAyMjcuNTU3IDEzNC43MjkgMjMwLjEzNSAxMzUuMDk0QzIzMi4zNyAxMzUuNDExIDIzNC4zNDggMTMyLjM5NyAyMzUuNjczIDEzMC45OTlDMjM5Ljk1NyAxMjYuNDgxIDI0My45MiAxMjEuNjUgMjQ5IDExOEMyNDIuODI0IDExMC45NjEgMjMxLjkxNSAxMTQuODE2IDIyNS44NTMgMTA3LjUyOUMyMjAuNjY1IDEwMS4yOTIgMjIzLjY2OCA5Mi43NTM5IDIxOS43ODYgODYuMTcwNUMyMTMuMTc1IDc0Ljk1NjMgMTk4LjczMSA2NC45MTExIDE4NiA2Mi40Njg0QzE3OC45NiA2MS4xMTc2IDE3MS4xNDggNjIgMTY0IDYyTTEwMCA3N0wxMDEgNzhMMTAwIDc3TTE3OCA4MkwxNzkgODNMMTc4IDgyTTYxIDEwNEw2MiAxMDVMNjEgMTA0TTEyMiAxNjNDMTIzLjc3OCAxNjkuMjkyIDEzMC4wOCAxNzMuMDA3IDEzNCAxNzhDMTUwLjA0MiAxNjAuNTA3IDE2OC4xMiAxNDQuMjk1IDE4My43NDUgMTI2LjM4NUMxODcuNTg4IDEyMS45NzkgMTg1LjA4OSAxMTIuMjk4IDE3Ny45NSAxMTMuNjQ3QzE3MS42NzQgMTE0LjgzNCAxNjYuMTY3IDEyMy4xOTYgMTYyLjE1NyAxMjcuNTY1QzE1Ni40MDYgMTMzLjgzMyAxNDkuNzY2IDEzOS4zMDIgMTQzLjg1IDE0NS40MTdDMTM3LjI0NCAxNTIuMjQ1IDEzMS40NzYgMTYwLjI2MyAxMjIgMTYzTTE1NiAxNjZDMTYyLjk0NSAxNzkuMDMgMTc4LjU0IDE4Ni42OTQgMTg3LjEwNiAxOTguNTc5QzE5MC42NTQgMjAzLjUwMiAxODcuNjA3IDIwOS40OSAxODguMjk0IDIxNC45OTZDMTg5Ljk1NCAyMjguMzA5IDIwMS45ODYgMjM3LjYxNiAyMTUgMjM4QzIxMi43NDkgMjMwLjkyNCAyMDMuMTQ5IDIyNy43NzEgMjAxLjI5MiAyMjAuODdDMjAwLjU4NCAyMTguMjQxIDIwMy4yMjIgMjE1Ljc2MyAyMDQuNzQ5IDIxMy45NUMyMDcuOTk2IDIxMC4wOTYgMjE3LjAzMSAxOTcuOTY2IDIyMi44MzQgMjAwLjA0N0MyMjkuODE5IDIwMi41NTIgMjMyLjc1NiAyMTEuNjc4IDI0MCAyMTRDMjM4LjMzNiAyMDAuOTI0IDIzMS4xMDMgMTg4LjU3MyAyMTYuOTk5IDE4Ni40NDRDMjEyLjA4MiAxODUuNzAxIDIwNi42NDEgMTg4LjY5NSAyMDIuMDQzIDE4Ni41MDVDMTk4LjE0IDE4NC42NDYgMTk1LjM1OSAxODAuMTYzIDE5Mi4yODUgMTc3LjIyQzE4NC43MjcgMTY5Ljk4NSAxNzcuMDMgMTYyLjc0IDE3MCAxNTVDMTYzLjkzOCAxNTcuMzc5IDE2MS4yMTQgMTYyLjU3OCAxNTYgMTY2TTExMiAxNzFDMTA2Ljg1NSAxNzcuODI1IDk5LjUxNDMgMTgzLjQwNSA5My40NTk5IDE4OS40NkM4Ni40NTE4IDE5Ni40NjggODAuMDU2NiAyMDQuNTI0IDcxIDIwOUM3Ni41OTA3IDIxNi4zNjkgODQuMTUwOCAyMjEuODcxIDkwIDIyOUM5MS44OTM2IDIyNi4zNTcgOTIuODY4OSAyMjMuMTgyIDk0Ljg3MTEgMjIwLjYxNUMxMDAuMTM2IDIxMy44NjYgMTA3LjI5IDIwOC4wMDUgMTEzLjM4OSAyMDJDMTE4LjQ5MyAxOTYuOTc1IDEyMy4xOCAxOTEuMTgzIDEyOSAxODdDMTI0LjUxMSAxODAuNzk5IDExOS4xMDcgMTc2LjQ3IDExNCAxNzFMMTEyIDE3MXoiCiAgICAgaWQ9InBhdGg2IiAvPgo8L3N2Zz4='),
(5, 'Savoir', 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiIHZpZXdCb3g9IjAgMCA1MDAgNTAwIiB2ZXJzaW9uPSIxLjEiPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2U6bm9uZTtvcGFjaXR5OjAiCiAgICAgZD0iTTAgMEwwIDUwMEw1MDAgNTAwTDUwMCAwTDAgMHoiCiAgICAgaWQ9InBhdGgyIiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2U6bm9uZSIKICAgICBkPSJNNzcgNjhMNzcgMzgxQzExNi4wMDggMzgxIDE1NC41MTIgMzg2LjQ3MSAxOTIgMzk3LjQyNEMyMDQuOTE2IDQwMS4xOTggMjE3LjUzOCA0MDUuNzU4IDIzMCA0MTAuNzk5QzIzNS4wNjQgNDEyLjg0OCAyNDEuNDMyIDQxNy40NDcgMjQ3IDQxNy4yOTJDMjUyLjczMSA0MTcuMTMyIDI1OC43OTEgNDEyLjU3MyAyNjQgNDEwLjQ1MkMyNzUuMDg4IDQwNS45MzggMjg2LjQ4MSA0MDEuNzE1IDI5OCAzOTguNDI3QzMzNy4wMiAzODcuMjkgMzc2LjQxMyAzODEgNDE3IDM4MUw0MTcgNjhDMzc4Ljg4OCA2OCAzNDEuOTM5IDcxLjk1MTMgMzA1IDgxLjczNDZDMjkxLjM5NiA4NS4zMzc3IDI3OC4xNTcgOTAuMDExOCAyNjUgOTQuOTQ5OUMyNTkuNTkzIDk2Ljk3OTIgMjUyLjg0NyAxMDEuNzMyIDI0NyAxMDEuNzMyQzI0MC4yNjIgMTAxLjczMiAyMzIuMjAxIDk2LjIxMzEgMjI2IDkzLjgxMDlDMjEyLjk0MSA4OC43NTI1IDE5OS40NTcgODQuOTUwMiAxODYgODEuMTQwNEMxNTAuNDE4IDcxLjA2NjYgMTEzLjc5NCA2OCA3NyA2OHoiCiAgICAgaWQ9InBhdGg0IiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6IzY2NjY2NjtzdHJva2U6bm9uZTtvcGFjaXR5OjEiCiAgICAgZD0iTTk1IDg3TDk1IDM2NEMxMjguODA2IDM2NCAxNjIuNDQyIDM3MC4zMzEgMTk1IDM3OS4xNTFDMjEzLjAxNyAzODQuMDMyIDIzMC4xOTEgMzk0LjAzIDI0OSAzOTRDMjU4LjA0OSAzOTMuOTg1IDI2NS42NTggMzkwLjM2MiAyNzQgMzg3LjE5MkMyODIuMTU2IDM4NC4wOTMgMjkwLjU3NyAzODEuNDMzIDI5OSAzNzkuMTUxQzMzMS41NTggMzcwLjMzMSAzNjUuMTg5IDM2NCAzOTkgMzY0TDM5OSA4N0MzNjUuMzgzIDg3LjA5MjYgMzMxLjIzMyA5My44OTk0IDI5OSAxMDMuMTQxQzI4My4yNjkgMTA3LjY1MiAyNjYuNCAxMTcuOTc0IDI1MCAxMThDMjMwLjE2MiAxMTguMDMyIDIxMi44ODkgMTA4LjI4NiAxOTQgMTAyLjkwOUMxNjIuMTAzIDkzLjgyOTEgMTI4LjI0MiA4Ny4wOTE2IDk1IDg3eiIKICAgICBpZD0icGF0aDYiIC8+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO3N0cm9rZTpub25lIgogICAgIGQ9Ik00MSAxMTNMNDEgNDE3Qzg3LjE0NTcgNDE3IDEzMi45ODYgNDIxLjE5OCAxNzggNDMxLjg4NEMxOTQuMjI4IDQzNS43MzcgMjEwLjE5NiA0NDAuMzQ4IDIyNiA0NDUuNjY3QzIzMi4yNCA0NDcuNzY4IDI0MC40MjcgNDUzLjI0MSAyNDcgNDUzLjIyQzI1MC4xMjIgNDUzLjIxIDI1My4xOSA0NTEuMTc2IDI1NiA0NTAuMDEyQzI2MS4yNDMgNDQ3LjgzOCAyNjYuNjU3IDQ0Ni4xMjEgMjcyIDQ0NC4yMThDMjg2LjY3NCA0MzguOTkxIDMwMS44OTUgNDM1LjIwMiAzMTcgNDMxLjQ3NUMzNjEuMzY2IDQyMC41MjYgNDA3LjQ4OCA0MTcgNDUzIDQxN0w0NTMgMTEzTDQzNCAxMTNMNDM0IDM5OUMzOTMuNjYgMzk5LjExMSAzNTEuMjA3IDQwNC4wODcgMzEyIDQxMy44NzNDMjk3LjkxOCA0MTcuMzg5IDI4My43OSA0MjAuNzU0IDI3MCA0MjUuMzMzQzI2My4xMDUgNDI3LjYyMyAyNTQuMjM0IDQzMi42NDYgMjQ3IDQzMi44NjJDMjQwLjczNiA0MzMuMDQ5IDIzMi45MzIgNDI4LjMwMyAyMjcgNDI2LjMzM0MyMTMuNTQxIDQyMS44NjMgMTk5Ljc5NyA0MTguMTU1IDE4NiA0MTQuODg0QzE0NC43OTEgNDA1LjExNSAxMDEuMzQ1IDM5OS4wMjggNTkgMzk5TDU5IDExM0w0MSAxMTNNMzM1IDI5NUMzNjAuMTYyIDI4Ni41NDMgMzkwLjM0NCAyNjAuNDY3IDM3OS4xODQgMjMxQzM3Ny42NjggMjI2Ljk5NiAzNzUuNjgzIDIyMy40MTYgMzczLjEgMjIwQzM2Ny4xOTUgMjEyLjE4NyAzNTkuMjUyIDIwNS45MSAzNTEgMjAwLjcwOUMzNDYuODA0IDE5OC4wNjQgMzM5LjY1NSAxOTYuMjQ2IDMzNy4wMjggMTkxLjc4N0MzMzMuOTQ1IDE4Ni41NTQgMzM2LjMxNSAxNzYuOTA0IDMzNS45MSAxNzFDMzM0LjYxOCAxNTIuMTI1IDMyNy41MDcgMTI5LjUxNCAzMDcgMTIzLjkyN0MyOTIuMzg3IDExOS45NDYgMjc3LjIzNyAxMjQuNDE2IDI2NCAxMzAuNzg0QzI1OS4wMTcgMTMzLjE4MSAyNTIuNTUxIDEzOS43MjUgMjQ3IDE0MC4wMUMyNDEuMzIgMTQwLjMwMiAyMzMuMTc2IDEzMi4zMjEgMjI4IDEyOS44OUMyMTAuODMgMTIxLjgyNSAxODUuODQ3IDExNy40MjcgMTcxLjMwMSAxMzMuMDkzQzE2My4wMzcgMTQxLjk5NCAxNTguNTY1IDE1Ni4wMSAxNTguMDM5IDE2OEMxNTcuNzU3IDE3NC40MzQgMTYwLjYyMyAxODcuMzYyIDE1Ni4zOTcgMTkyLjYxQzE1Mi41ODcgMTk3LjM0IDE0NC4wNzggMTk5Ljc0IDEzOSAyMDMuMDc5QzEyNC4yNiAyMTIuNzcgMTA5Ljg1MiAyMjkuMDU1IDExMi4yODkgMjQ4QzExNC4zMTUgMjYzLjc0NyAxMjYuMjQ1IDI3Ni4zMDEgMTM5IDI4NC43NjlDMTQzLjk1IDI4OC4wNTQgMTUzLjkyNSAyOTEuMDQ5IDE1Ni45NzIgMjk2LjIxM0MxNjAuMjU3IDMwMS43OCAxNTcuNzYzIDMxMi42OTIgMTU4LjAzOSAzMTlDMTU4LjczNSAzMzQuODgyIDE2NC44MDkgMzUxLjk1NSAxNzkgMzYwLjUyMUMxOTQuMDQzIDM2OS42MDEgMjE0LjMzNiAzNjQuNzMgMjI5IDM1Ny4zOThDMjM0LjExMiAzNTQuODQyIDI0MC4zNjEgMzQ4LjcyIDI0NiAzNDcuOThDMjUwLjM2OCAzNDcuNDA2IDI1NS40MTEgMzUyLjIzOSAyNTkgMzU0LjI3OUMyNjcuMTYxIDM1OC45MTkgMjc2LjU5MyAzNjMuNDc0IDI4NiAzNjQuNzExQzI5Ni4wNzggMzY2LjAzNiAzMDcuMjQyIDM2NS40NTQgMzE2IDM1OS44NjdDMzMxLjg4OSAzNDkuNzMyIDMzNS45OTkgMzI4LjQ5MiAzMzYgMzExQzMzNiAzMDUuNjYxIDMzNi41MjEgMzAwLjE0NiAzMzUgMjk1eiIKICAgICBpZD0icGF0aDgiIC8+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDojODA4MDgwO3N0cm9rZTpub25lIgogICAgIGQ9Ik0xNzUgMTg3QzE4NS4zMDcgMTgzLjcwNCAxOTguNDM1IDE4My40NzQgMjA3Ljk5OSAxNzguNjg2QzIxMi4zMDIgMTc2LjUzMiAyMTUuMTMzIDE3Mi4yNzYgMjE4LjMyNSAxNjguODNDMjIzLjQyOCAxNjMuMzIxIDIyOC44MzUgMTU4LjI5NiAyMzMgMTUyQzIyMy4wOTggMTQ1LjQ0OCAyMTEuMzcxIDEzOC41MTQgMTk5IDEzOS4yMUMxODEuNTI2IDE0MC4xOTMgMTc2LjQ3OSAxNTUuMjQ4IDE3NC43MTUgMTcwQzE3NC4wMzQgMTc1LjY5NCAxNzMuMzU0IDE4MS40MzMgMTc1IDE4N00yNjAgMTUyQzI2NC4xODUgMTU3Ljk0MSAyNjkuOTIxIDE2Mi41NTUgMjc0LjcxNSAxNjhDMjc3LjgxNiAxNzEuNTIzIDI4MC43OTYgMTc2LjQwNyAyODUuMDkgMTc4LjU2N0MyODguODg2IDE4MC40NzcgMjkzLjg2OCAxODAuNzY5IDI5OCAxODEuNkMzMDUuMDk1IDE4My4wMjggMzEyLjEwNyAxODQuNzk2IDMxOSAxODdDMzE5IDE3OC44ODMgMzIwLjAzMSAxNjkuOTY4IDMxOC4zMzEgMTYyQzMxNy41MDggMTU4LjE0MiAzMTYuMDk1IDE1NC40MTcgMzE0LjEyIDE1MS4wMDFDMzAxLjM2NyAxMjguOTQxIDI3Ni4wNDYgMTQzLjEwMiAyNjAgMTUyTTIzNCAxNzdMMjYwIDE3N0MyNTcuNDkyIDE3My40NCAyNTEuODY3IDE2NS4yMDcgMjQ3IDE2NS4yMDdDMjQyLjEzMyAxNjUuMjA3IDIzNi41MDggMTczLjQ0IDIzNCAxNzdNMjQwIDE5NC40MjhDMjMyLjQ4OCAxOTUuNTA3IDIyNS4zOCAxOTcuOTEyIDIxOS4wMDEgMjAyLjEwMUMyMTMuODY1IDIwNS40NzQgMjA5LjI5MiAyMDkuOTY5IDIwNS43NzQgMjE1LjAwNEMxODEuNTc1IDI0OS42NCAyMTAuNjk3IDI5OS4yMDggMjUzIDI5My43MTFDMjYwLjA5OCAyOTIuNzg4IDI2Ni45MDkgMjkwLjU0MiAyNzMgMjg2Ljc2OEMzMDguOTAzIDI2NC41MiAzMDIuNDUxIDIwNi4xNDYgMjYwIDE5NS41MTRDMjUzLjU1OSAxOTMuOTAxIDI0Ni41NzIgMTkzLjQ4NSAyNDAgMTk0LjQyOE0xNzcgMjA0QzE3OC40ODIgMjA5LjI2MSAxODAuMjA1IDIxNC41OTUgMTgxIDIyMEMxODcuNDQ1IDIxNi4zNDUgMTkxLjU2NCAyMDUuNDU2IDE5NSAxOTlDMTg4LjkxOSAxOTkuODk0IDE4Mi42MjQgMjAxLjUxMSAxNzcgMjA0TTI5OSAxOTlDMzAyLjMwOCAyMDYuNjc2IDMwNy40NjMgMjEzLjQyNSAzMTEgMjIxQzMxNC40NjUgMjE2LjE0MyAzMTUuNzQzIDIwOC44OTkgMzE2IDIwM0wyOTkgMTk5TTE2MSAyNzhDMTYzLjYxNyAyNzEuMTYzIDE2NC45NSAyNjMuOTIgMTY3LjM0NCAyNTdDMTY4Ljc2NCAyNTIuODk2IDE3MS4zNDkgMjQ4LjQyOCAxNzEuMzQ5IDI0NEMxNzEuMzQ5IDIzOS44NzMgMTY5LjAxMiAyMzUuODM5IDE2Ny43NDIgMjMyQzE2NS4zMzUgMjI0LjcyNSAxNjMuNzM3IDIxNy4xNDkgMTYxIDIxMEMxNTUuMjcgMjEyLjA4NSAxNDkuODA3IDIxNS4yNjQgMTQ1IDIxOS4wMTVDMTQwLjMgMjIyLjY4MyAxMzUuOTU4IDIyNi43ODUgMTMyLjk1NSAyMzJDMTIxLjIxOSAyNTIuMzggMTQzLjUzMSAyNzEuNjA0IDE2MSAyNzhNMzMyIDIxMEMzMzAuODUzIDIxNy43OTggMzI4LjE2MyAyMjUuNTM4IDMyNS42NjcgMjMzQzMyNC41MTcgMjM2LjQzNyAzMjIuNDIgMjQwLjMyNiAzMjIuNDIgMjQ0QzMyMi40MiAyNDcuNjc0IDMyNC41MTcgMjUxLjU2MyAzMjUuNjY3IDI1NUMzMjguMTYzIDI2Mi40NjIgMzMwLjg1MyAyNzAuMjAyIDMzMiAyNzhDMzQ3LjkxMyAyNzMuNDA3IDM2Ny4xNzMgMjU3LjM0OCAzNjMuNjYgMjM5QzM2MS4wNTcgMjI1LjQwNiAzNDQuNDg3IDIxMy42MDQgMzMyIDIxMHoiCiAgICAgaWQ9InBhdGgxMCIgLz4KICA8cGF0aAogICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7c3Ryb2tlOm5vbmUiCiAgICAgZD0iTTI0MyAyMjcuNTMyQzIyMS41NzYgMjMyLjYwNCAyMjkuNjQ4IDI2NS40NzEgMjUxIDI2MC4zMTZDMjcyLjAwNSAyNTUuMjQ0IDI2NC4xODggMjIyLjUxNyAyNDMgMjI3LjUzMnoiCiAgICAgaWQ9InBhdGgxMiIgLz4KICA8cGF0aAogICAgIHN0eWxlPSJmaWxsOiM4MDgwODA7c3Ryb2tlOm5vbmUiCiAgICAgZD0iTTE4MiAyNjdDMTc5Ljg4NiAyNzIuNTIyIDE3OC42MDIgMjc4LjMxMyAxNzcgMjg0QzE4Mi42NzcgMjg2LjQ0MyAxODguOTgyIDI4Ny42MjQgMTk1IDI4OUMxOTEuMTQ3IDI4MS43NjEgMTg3LjIyMiAyNzMuMjk3IDE4MiAyNjdNMzExIDI2N0MzMDcuMTMxIDI3NC4zNzggMzAyLjIxNCAyODEuMzIxIDI5OSAyODlMMzE2IDI4NUMzMTUuNzQzIDI3OS4xMDEgMzE0LjQ2NSAyNzEuODU3IDMxMSAyNjdNMTc1IDMwMUMxNzAuNjE4IDMxNS44MjQgMTc1LjUzMyAzNDQuOTAzIDE5NCAzNDcuNzg2QzIwOS44OTEgMzUwLjI2NyAyMjAuNDM3IDM0Mi4zNCAyMzQgMzM2QzIyOS42MTEgMzI5Ljc2OSAyMjMuNTkyIDMyNC43OTggMjE4LjQ2NCAzMTkuMTdDMjE1LjU0MiAzMTUuOTYzIDIxMi43MjYgMzExLjQ4OCAyMDguODI5IDMwOS40M0MyMDQuNzI1IDMwNy4yNjIgMTk5LjQ3OCAzMDcuMTAzIDE5NSAzMDYuMTkzQzE4OC4yNzUgMzA0LjgyNiAxODEuNTM1IDMwMy4wOSAxNzUgMzAxTTI2MCAzMzZDMjc2LjA4IDM0NC45MTcgMzAyLjU0MSAzNTguNTkxIDMxNC42MDEgMzM1Ljk5OUMzMTYuMjUxIDMzMi45MDggMzE3LjU0OCAzMjkuNDE4IDMxOC4zMiAzMjZDMzIwLjEwOCAzMTguMDg3IDMxOSAzMDkuMDc4IDMxOSAzMDFDMzEyLjM0OSAzMDIuNzc4IDMwNS43NjMgMzA0LjgxOSAyOTkgMzA2LjE5M0MyOTQuNTM2IDMwNy4xIDI4OS4xNjYgMzA3LjEzMiAyODUuMDkgMzA5LjMxNEMyODAuNjg3IDMxMS42NzEgMjc3LjUxNyAzMTYuNzU4IDI3NC4yNTUgMzIwLjQyNEMyNjkuNTczIDMyNS42ODQgMjY0LjA2IDMzMC4yMzYgMjYwIDMzNk0yMzQgMzExQzIzNi41MDggMzE0LjU2IDI0Mi4xMzMgMzIyLjc5MyAyNDcgMzIyLjc5M0MyNTEuODY3IDMyMi43OTMgMjU3LjQ5MiAzMTQuNTYgMjYwIDMxMUwyMzQgMzExeiIKICAgICBpZD0icGF0aDE0IiAvPgo8L3N2Zz4='),
(6, 'Taches maison', 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiIHZpZXdCb3g9IjAgMCA1MDAgNTAwIiB2ZXJzaW9uPSIxLjEiPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2U6bm9uZTtvcGFjaXR5OjAiCiAgICAgZD0iTTAgMEwwIDUwMEw1MDAgNTAwTDUwMCAwTDAgMHoiCiAgICAgaWQ9InBhdGgyIiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2U6bm9uZSIKICAgICBkPSJNMjM1IDIzNkwyMzMgMjM2QzIzMC4zNzEgMjMxLjEzOSAyMjYuMjU4IDIyNy42MjggMjIyLjQyNCAyMjMuNzE1QzIxMy41NjkgMjE0LjY3OCAyMDMuMjEyIDIwNS43MzYgMTk2LjM4MyAxOTVDMTkxLjk1MiAxODguMDMzIDE4OS45NTkgMTgwLjE1NyAxODkuMTcgMTcyQzE4OC41NyAxNjUuODAzIDE4OS4yODggMTU5LjkyNCAxODYuODAxIDE1NC4wMDFDMTgyLjAxNSAxNDIuNjAxIDE2OS45OTEgMTM2LjY4MiAxNjMgMTI3QzE1OS42MSAxMjUuOTQ4IDE1Ny42MzYgMTIyLjczMyAxNTUuMDc1IDEyMC4zQzE0OS43MDIgMTE1LjE5NyAxNDQuMjAyIDExMC4yMzIgMTM4LjgzIDEwNS4xM0MxMjcuNTEyIDk0LjM4MDIgMTE1LjkwMSA4My4zNzU5IDEwNC4wMTUgNzMuMjU4NUM5Ni41NzA1IDY2LjkyMjQgODguMDU2OSA2MC43MTQyIDgyIDUzQzc1LjUwMjcgNTEuMDgwOSA3MC40NTM4IDQzLjg5MTkgNjQgNDFDNjUuMzA2MSA1MC4wMDA1IDc2Ljg1NDEgNTguNzI0OCA4Mi45NTk5IDY0Ljk4NTRDOTkuNzU3MyA4Mi4yMDg3IDExNS45OTEgOTkuOTkwOCAxMzMgMTE3QzEzOC44NDcgMTIyLjg0NyAxNDQuNDgyIDEyOC44MjMgMTQ5Ljk3NiAxMzVDMTUxLjUxNSAxMzYuNzMgMTU0LjY2NyAxNDAuMDM4IDE1MS43OTQgMTQyLjEzM0MxNDkuMjEgMTQ0LjAxNyAxNDYuMjc2IDE0MC40NzggMTQ0LjcgMTM4Ljg3MUMxMzkuNDk5IDEzMy41NyAxMzMuNzEgMTI4Ljk0NCAxMjguNDI0IDEyMy43MjlDMTEyLjU5IDEwOC4xMDYgOTUuNzc2OCA5My40NzcxIDc5LjcyOTIgNzguMDg0MUM3My45OTMzIDcyLjU4MjMgNjQuODAxMSA2MS4zMzczIDU3IDYwQzU1LjE5MzEgNTYuOTQ4IDUzLjE0NTMgNTUuNjA1NyA1MCA1NEM1Mi4zNTQ2IDYyLjY0MzYgNjAuOTU4NiA2OS40NjI2IDY2LjcxNDUgNzZDODIuODA2NyA5NC4yNzcgMTAwLjUzOSAxMTEuMTkzIDExNy4zNzQgMTI4Ljc4OUMxMjMuMiAxMzQuODc4IDEyOS4xOTMgMTQwLjgwMiAxMzQuOTA5IDE0Ni45OTlDMTM2LjM1NiAxNDguNTY4IDEzOS45MjggMTUxLjY4OCAxMzkuMjU3IDE1NC4xNzdDMTM4LjM1IDE1Ny41NDEgMTMzLjg4OCAxNTQuOTE0IDEzMi40MjggMTUzLjczQzEyNS45MjEgMTQ4LjQ0OSAxMTkuOTI4IDE0MS45MTkgMTE0IDEzNkM5OS45NzgzIDEyMiA4NS4yODc5IDEwOC42OTEgNzEuMjg1NSA5NC43MTQ1QzYxLjI2NjMgODQuNzEzNSA1MC41OTM2IDcyLjczOTkgMzggNjZDNDAuMjc2MyA3NS42MDExIDUwLjEzNiA4My43Nzk0IDU2LjU2MTcgOTAuOTEwNUM3Mi4zOTQ0IDEwOC40ODEgODguNDAzMyAxMjYuMTcyIDEwNS4wMDQgMTQzQzExMC43NjQgMTQ4LjgzOSAxMTYuMzQxIDE1NC44NzQgMTIxLjg0IDE2MC45NjFDMTIzLjYwMyAxNjIuOTEzIDEyNy4xMDMgMTY1Ljg0NyAxMjUuMzQzIDE2OC43ODJDMTIzLjM1NCAxNzIuMDk4IDExOS45NSAxNjguOTY0IDExOC4xMTIgMTY3LjI3NEMxMTIuMTY5IDE2MS44MTEgMTA2Ljc0NiAxNTUuNjgzIDEwMSAxNTAuMDA0Qzg1LjI1NTUgMTM0LjQ0MSA2OS4xNDkxIDExOS4xNDMgNTMuMDAwOCAxMDQuMDI1QzQ0LjMxOTkgOTUuODk3NSAzNi4xODI3IDg1LjY5OTYgMjUgODFDMjkuMzk4NiA5NC4yNjE1IDQzLjc2OTEgMTA2LjAwNCA1Mi44ODUgMTE2LjI4NUM2OS4xMTEyIDEzNC41ODYgODYuMDU1NiAxNTIuMTg2IDEwMi42MTUgMTcwLjE3NEMxMTIuODQyIDE4MS4yODMgMTIzLjQ5NSAxOTUuOTgxIDEzNyAyMDMuMjM1QzE0My45MzIgMjA2Ljk1OSAxNTEuNTM0IDIwNS40NDcgMTU5IDIwNi4xN0MxNjUuODg1IDIwNi44MzcgMTcyLjA2NyAyMDkuMTUzIDE3OCAyMTIuNjdDMTg3Ljc3NCAyMTguNDYzIDE5Ni41ODIgMjI4LjI2IDIwNC41NzYgMjM2LjI4MkMyMDkuMDIxIDI0MC43NDIgMjEzLjI1NSAyNDYuMzAzIDIxOSAyNDlDMjEzLjQyOSAyNTguMjY4IDIwMy43MjkgMjY1LjU1NCAxOTYuMTk3IDI3My4yNUMxNzkuMTk4IDI5MC42MiAxNjEuODQ1IDMwNy42NjcgMTQ0LjYxMSAzMjQuODAzQzEzNy41MSAzMzEuODY0IDEzMC4zOTYgMzM4LjkyNyAxMjMuMzg5IDM0Ni4wODFDMTE5LjM1NCAzNTAuMiAxMTUuMDU4IDM1NS43NzkgMTA5Ljk2MSAzNTguNTU5QzEwNS40MjEgMzYxLjAzNCA5OS45MDUgMzYxLjU5NSA5NSAzNjMuMDM1QzgxLjM1OTIgMzY3LjA0MSA2Ny41NjM0IDM3MC40MTkgNTQgMzc0LjY1M0M0Ni43OTUxIDM3Ni45MDIgMzcuODU3NiAzNzcuNTM5IDM0IDM4NS4wMTVDMjcuODMwOSAzOTYuOTcxIDM2Ljg4NDcgNDA2LjA3MSA0NC44MDMyIDQxNEw5OCA0NjcuMTk3QzEwNi4zODcgNDc1LjU3IDExNi42MTggNDgzLjkxOSAxMjcuOTIxIDQ3NS4wMjJDMTM0LjQ0MyA0NjkuODg3IDEzNS4wOTIgNDYwLjU1OSAxMzYuODg0IDQ1M0MxNDEuMDk1IDQzNS4yNDEgMTQzLjc4MSA0MTYuMzE1IDE0OS41MzMgMzk5QzE1Mi44MjQgMzg5LjA5NSAxNjUuNzczIDM4MC4yMjcgMTczIDM3M0wyMzEgMzE1TDI0OSAyOTcuMDAxQzI1MS4xMDMgMjk0LjkxIDI1My44NDEgMjkxLjIxNiAyNTYuOTk2IDI5MC43ODJDMjYxLjM1NSAyOTAuMTgxIDI2NS40MTcgMjk3LjE5NCAyNjguMDU0IDI5OS44NDVDMjc3LjM2OSAzMDkuMjA4IDI4Ni4zNCAzMTkuMDI4IDI5NS4wMDEgMzI5LjAwNEMzMjcuMzQyIDM2Ni4yNTcgMzU2Ljc1NiA0MDUuOTAyIDM4NS40MjcgNDQ2QzM5MS4zNDUgNDU0LjI3NiAzOTguMzQyIDQ2NS41NCA0MDggNDY5Ljc2OUM0MTYuOTM4IDQ3My42ODEgNDI4LjM4NSA0NjkuOTAyIDQzNS45OTkgNDY0Ljg5OUM0NDkuNjUxIDQ1NS45MjkgNDYxLjg0NCA0MzQuMDA2IDQ0OS42NiA0MTkuMDAxQzQ0NS41NDcgNDEzLjkzNiA0MzkuOTQ5IDQxMC45NjkgNDM0LjkyIDQwNi45ODZDNDIzLjk4MyAzOTguMzI1IDQxMi42NjQgMzkwLjA2NCA0MDEuMzM1IDM4MS45MkMzOTQuNDA2IDM3Ni45MzkgMzg2LjY5OSAzNzIuNDI0IDM4MSAzNjZMMzc5IDM2N0MzNzYuOTEgMzYyLjkyMyAzNzIuNjExIDM2MC42NzMgMzY4Ljk4OSAzNThDMzYyLjYzOSAzNTMuMzE0IDM1Ni4yIDM0OC43MDggMzUwLjE1NSAzNDMuNjI5QzMzMi41MTYgMzI4LjgxIDMxNC44MyAzMTQuMjM3IDI5Ny44MyAyOTguNjc5QzI4OS40NDggMjkxLjAwNyAyODEuNDQyIDI3OS43ODMgMjcxIDI3NUwyOTYgMjUwQzI5OC4yOTYgMjQ3LjcwNSAzMDIuODQyIDI0MS4yNjMgMzA2LjU3NiAyNDEuNzdDMzEwLjU1OCAyNDIuMzExIDMxNS4zMDUgMjQ5LjMwNSAzMTggMjUyQzMyNy45OTUgMjYxLjk5NSAzMzcuODgyIDI3Mi4xMTUgMzQ4IDI4MS45ODVDMzUzLjc2MyAyODcuNjA4IDM2MC4zNyAyOTUuNjY2IDM2Ny45OTkgMjg4Ljk1MkMzODYuNTYyIDI3Mi42MTggNDAzLjUyNyAyNTQuNDczIDQyMSAyMzdDNDM4Ljg0IDIxOS4xNiA0NTYuODU0IDIwMi42NDcgNDY2Ljc2OCAxNzlDNDcxLjUxNCAxNjcuNjggNDcyLjMxMiAxNTYuMDAyIDQ3Mi43NDUgMTQ0QzQ3My41MzggMTIyLjA4IDQ3Mi44MDYgMTAxLjAwNiA0NjUuODMzIDgwQzQ2My4wNzcgNzEuNjk1NSA0NjAuNzQzIDU4LjQ3OTUgNDUzLjY3MSA1Mi42OTkxQzQ0Ny43MTkgNDcuODMzNCA0MzguMTUzIDQ2LjYyMzkgNDMxIDQ0LjM0NDFDNDEwLjUzNyAzNy44MjE4IDM4OC4yMTMgMzYuNDU3OCAzNjcgMzcuOTEwNUMzNjAuNjYyIDM4LjM0NDUgMzU0LjI5MiAzNy41MDMzIDM0OCAzOC42MTVDMzM0LjA3NSA0MS4wNzU0IDMxOC45OTQgNDQuODggMzA3IDUyLjY0ODFDMzAwLjk3MiA1Ni41NTI3IDI5Ni4yNjMgNjIuMDIzIDI5MS4wMDQgNjYuODMwMkMyNzcuMTI3IDc5LjUxNTUgMjYzLjg2MSA5Mi45MzIgMjUwLjg4NCAxMDYuNTM2QzI0MC4zNzEgMTE3LjU1OSAyMjcuNDQ4IDEyNy41NDYgMjE4LjU3MyAxNDBDMjEzLjAyIDE0Ny43OTEgMjIwLjYzNiAxNTQuNDkzIDIyNi4wMzUgMTU5Ljk2MUMyMzUuOTY5IDE3MC4wMTkgMjQ1Ljk5OSAxNzkuOTk5IDI1NiAxOTBDMjU4Ljc1NCAxOTIuNzU0IDI2NS42MDggMTk3LjQzIDI2Ni4yMzEgMjAxLjQ4NkMyNjYuNjk4IDIwNC41MzMgMjYwLjMyOCAyMDkuMDc3IDI1OC4zODkgMjExQzI1MC45NTQgMjE4LjM3NSAyMzkuNTMgMjI2LjUzNSAyMzUgMjM2eiIKICAgICBpZD0icGF0aDQiIC8+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDojOTk5OTk5O3N0cm9rZTpub25lIgogICAgIGQ9Ik0yODEgMTg5QzMwMS41NzIgMTc2LjE0NiAzMTguMzc2IDE1Ny42MjUgMzQxIDE0Ny43ODVDMzUwLjk5OSAxNDMuNDM2IDM2NS44MjcgMTQ1LjczOCAzNjMuMDYyIDE2MEMzNjEuNzQ2IDE2Ni43ODUgMzU3LjY0NyAxNzIuMjY4IDM1NC4wNSAxNzhDMzQ3LjU0MiAxODguMzcxIDM0MC41NDMgMTk4LjI2NiAzMzMuMTE2IDIwOEMzMjkuNzU3IDIxMi40MDMgMzIwLjU2MyAyMjAuMTcxIDMyMC42MzIgMjI2QzMyMC42OSAyMzAuOTEzIDMyNy44NTIgMjM1Ljg1MiAzMzEgMjM5TDM2MiAyNzBDMzcwLjE2NyAyNjQuMjQ3IDM3Ni45NDQgMjU2LjA1NiAzODQgMjQ5QzM5Ni42NjYgMjM2LjMzNCA0MDkuMzYzIDIyMy42OTcgNDIxLjk5OSAyMTFDNDI5Ljc5MSAyMDMuMTcgNDM4Ljc2MSAxOTQuNjU3IDQ0NC4yNTIgMTg1QzQ0OC4wOTIgMTc4LjI0NSA0NTAuMDU5IDE3MC40NjEgNDUyIDE2M0M0NTguMDAxIDEzOS45MzUgNDU2LjM2IDExMS42MjYgNDQ5IDg5QzQ0Ni44NjEgODIuNDI0MSA0NDUuMjE1IDcyLjM1NzEgNDM5LjcyNSA2Ny42NTJDNDM2LjU5MyA2NC45NjY4IDQzMS44MjIgNjQuMjYwNyA0MjggNjIuOTk5MkM0MTcuODY4IDU5LjY1NTIgNDA3LjU4NyA1Ny44ODk1IDM5NyA1Ni44MzFDMzcxLjY1NyA1NC4yOTcgMzM5LjUwMyA1NC4wNDEzIDMxNyA2Ny45ODY5QzMwNS42MTUgNzUuMDQyNiAyOTYuMzk4IDg2LjYwMTYgMjg3IDk2TDI1MSAxMzJDMjQ3LjkwMyAxMzUuMDk3IDIzOS4zNjggMTQxLjAwNiAyMzkuOTE3IDE0NS45NjFDMjQwLjQxNiAxNTAuNDU4IDI0Ny43OTIgMTU1LjY0NCAyNTAuODMxIDE1OC41NzZDMjYxLjAwNSAxNjguMzkgMjcxLjcxNCAxNzguMzUzIDI4MSAxODlNNTMgMzk0QzYyLjQxODcgNDA5LjA4IDc4LjQ1MjYgNDIxLjUwMiA5MC45NzUzIDQzNC4wMjVDOTkuMTQ0NyA0NDIuMTk0IDEwNy4yMDQgNDUyLjg1MiAxMTcgNDU5QzExOC44ODkgNDQ0LjEzIDEyMy41OTMgNDI5LjY3NSAxMjYuNTUxIDQxNUMxMjguMTc5IDQwNi45MjMgMTI5LjAxNCAzOTYuMjg3IDEzMi45ODggMzg5QzEzNi43MTcgMzgyLjE2MyAxNDQuNTMzIDM3Ni40NjcgMTUwIDM3MUwxODQgMzM3QzIxMy4xNzggMzA3LjgyMiAyNDEuODU2IDI3OC4xOTYgMjcxLjAyNSAyNDkuMDI1QzI5NC42ODcgMjI1LjM2MSAzMjEuMDU4IDIwMS45NDYgMzM3IDE3MkMzMjcuNjgxIDE3My4yMzkgMzE4LjMxNCAxODIuMzA3IDMxMSAxODcuODg0QzI4OS4xODEgMjA0LjUyNCAyNzEuMDE1IDIyNS4yNjUgMjUxLjU0NSAyNDQuNDA2QzIyMS42MjkgMjczLjgxNiAxOTEuNjkzIDMwMy4zMDcgMTYyIDMzM0wxMzQgMzYxQzEyOS4wMjEgMzY1Ljk3OSAxMjQuMTI3IDM3Mi4xNzggMTE4IDM3NS43NzJDMTExLjE5MiAzNzkuNzY2IDEwMS41OTcgMzgwLjg3OCA5NCAzODIuODg0QzgwLjMyODEgMzg2LjQ5NiA2Ni43Njk4IDM5MC44MTQgNTMgMzk0TTI3MCAyNzVMMjY5IDI3N0MyNzAuMjYzIDI3Ni4wMjkgMjcwLjM5MiAyNzYuMzA2IDI3MCAyNzVNMjY2IDI3OUwyNjcgMjgwTDI2NiAyNzl6IgogICAgIGlkPSJwYXRoNiIgLz4KICA8cGF0aAogICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7c3Ryb2tlOm5vbmUiCiAgICAgZD0iTTI0OCAzMzEuNDI1QzIzNi41MzYgMzMyLjk4NiAyMjYuNjczIDMzNy4yNyAyMTguMjg1IDM0NS40MjhDMjExLjEzMyAzNTIuMzg2IDIwNi4yNzMgMzYxLjExIDE5OCAzNjYuOTU3QzE4NC4wODkgMzc2Ljc4NyAxNjQuMTQ5IDM4Mi4yNzIgMTU3Ljk2NiA0MDBDMTU1LjQ4MyA0MDcuMTE5IDE1NyA0MTYuNTM3IDE1NyA0MjRDMTU3IDQzNC40NjggMTU1LjE3NiA0NDcuMTI4IDE1OS4zNjMgNDU3QzE2OS40NTUgNDgwLjc5OCAyMDIuMTk4IDQ5MSAyMjYgNDkxQzIzMC45NDIgNDkxIDIzNi4wOTcgNDkxLjQwNyAyNDEgNDkwLjdDMjYxLjEyNyA0ODcuNzk4IDI2Ny41NTkgNDY5LjU4NSAyNzkuMjYgNDU2LjAxOUMyOTAuMTkgNDQzLjM0NSAzMDkuMTI5IDQ0MC4xODYgMzE2LjU1NyA0MjMuOTg1QzMyMS4xMDkgNDE0LjA1OCAzMjAuNTQyIDM5OS42NTMgMzE5LjI4NSAzODlDMzE4LjI3OCAzODAuNDYgMzIwLjcwNSAzNzEuMDcyIDMxNy4wOTUgMzYzQzMwOC41NiAzNDMuOTE2IDI4Mi40NTIgMzM0LjE2NSAyNjMgMzMxLjk1QzI1Ny45MDUgMzMxLjM3IDI1My4xMzEgMzMwLjcyNiAyNDggMzMxLjQyNXoiCiAgICAgaWQ9InBhdGg4IiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2NjY2NjYztzdHJva2U6bm9uZSIKICAgICBkPSJNMjQ3IDM0Mi40MzlDMjI4Ljc5MiAzNDUuMzA2IDIyMS44OTEgMzU5Ljk1MiAyMDkuNzE1IDM3MS41NkMyMDIuNjUxIDM3OC4yOTQgMTkzLjI4NCAzODIuMjM2IDE4NS4wMDEgMzg3LjIwMUMxNzcuNjU3IDM5MS42MDIgMTY5LjM4MSAzOTYuNzEzIDE2OC4xODkgNDA2QzE2Ni43MzcgNDE3LjMxMiAxNzUuMDUxIDQyNi4wODUgMTg0IDQzMS41MzZDMjAwLjgxMiA0NDEuNzc3IDIyMS42MDIgNDQ2LjEyNyAyNDEgNDQyLjg1NEMyNTYuNjg1IDQ0MC4yMDggMjYxLjc3MyA0MjMuNDk2IDI3MS4xNzQgNDEzLjAwMUMyNzYgNDA3LjYxMiAyODEuODI0IDQwMy4xODUgMjg4IDM5OS40NUMyOTUuMDYyIDM5NS4xNzkgMzAzLjQyMyAzOTEuMTI3IDMwNi43MTMgMzgzQzMxMS4yODcgMzcxLjcwMyAzMDUuMjg2IDM2MS42MzEgMjk2IDM1NS4zNkMyODIuNjEgMzQ2LjMxNiAyNjMuMjc4IDMzOS44NzYgMjQ3IDM0Mi40Mzl6IgogICAgIGlkPSJwYXRoMTAiIC8+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO3N0cm9rZTpub25lIgogICAgIGQ9Ik04NSA0MDNDODcuNDUyOSA0MTAuMjE1IDk0LjUyOTYgNDE1Ljg2MyAxMDAgNDIwLjk1NUMxMDEuODU5IDQyMi42ODYgMTA0Ljc4NSA0MjUuODQgMTA3LjU4MSA0MjQuMTY4QzExMC4wOSA0MjIuNjY5IDExMC43MDkgNDE4LjU2OSAxMTEuMzcgNDE2QzExMi45ODggNDA5LjcyIDExNS4yNzcgNDAxLjY0OSAxMDcuOTA3IDM5OC4wMjhDMTAxLjkyNSAzOTUuMDg5IDkwLjcwNTkgNDAwLjgwMiA4NSA0MDN6IgogICAgIGlkPSJwYXRoMTIiIC8+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDojZWNlY2VjO3N0cm9rZTpub25lIgogICAgIGQ9Ik0zMDggMzk5QzI5Ny41MjYgNDA2LjMxMyAyODYuMTEgNDExLjM1IDI3Ny41MzUgNDIxQzI2OC45OTQgNDMwLjYxIDI2My45MzUgNDQ0LjA2MyAyNTEuOTEgNDUwLjMzNEMyMzEuNDk4IDQ2MC45NzkgMjAzLjIyNyA0NTMuMjY3IDE4NCA0NDMuNjNDMTc4LjQxMSA0NDAuODI5IDE3My42NjcgNDM2LjUyMiAxNjggNDM0QzE2OCA0NDEuNTQ2IDE2Ny4xOTggNDQ5LjI3MSAxNzEuMjgzIDQ1NkMxODIuMDY1IDQ3My43NTkgMjEzLjIzMyA0ODMuMDQ0IDIzMyA0ODAuNDI0QzIzOC4yMDQgNDc5LjczNSAyNDMuMjEgNDc5LjYxNyAyNDggNDc3LjE2NEMyNjEuMTY4IDQ3MC40MjQgMjY2LjA1MyA0NTMuMzAxIDI3Ny4wOSA0NDMuODA4QzI5MC4zNTYgNDMyLjM5NiAzMDguNDggNDI4LjU3OSAzMDguOTg1IDQwOEMzMDkuMDYyIDQwNC44ODkgMzA5LjIwMiA0MDEuODY1IDMwOCAzOTlNNTMgNDIxQzUzLjU0NTEgNDIyLjYzNSA1My4zNjQ4IDQyMi40NTUgNTUgNDIzQzU0LjQ1NDkgNDIxLjM2NSA1NC42MzUyIDQyMS41NDUgNTMgNDIxeiIKICAgICBpZD0icGF0aDE0IiAvPgo8L3N2Zz4=');
INSERT INTO `SkillsIcon` (`ID`, `Name`, `Content`) VALUES
(7, 'Réflexion', 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiIHZpZXdCb3g9IjAgMCA1MDAgNTAwIiB2ZXJzaW9uPSIxLjEiPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMxOCI+CiAgICA8ZmlsdGVyCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICBzdHlsZT0iY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzOnNSR0IiCiAgICAgICBpZD0iZmlsdGVyMjI3MCIKICAgICAgIHg9Ii0wLjE2MTAwOTE4IgogICAgICAgeT0iLTAuMTM0MTEwNjUiCiAgICAgICB3aWR0aD0iMS4zMjIwMTg0IgogICAgICAgaGVpZ2h0PSIxLjI2ODIyMTMiPgogICAgICA8ZmVHYXVzc2lhbkJsdXIKICAgICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgICBzdGREZXZpYXRpb249IjEyLjM1NjAxOCIKICAgICAgICAgaWQ9ImZlR2F1c3NpYW5CbHVyMjI3MiIgLz4KICAgIDwvZmlsdGVyPgogICAgPGZpbHRlcgogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgc3R5bGU9ImNvbG9yLWludGVycG9sYXRpb24tZmlsdGVyczpzUkdCIgogICAgICAgaWQ9ImZpbHRlcjIzMTAiCiAgICAgICB4PSItMC4wMTM5NzIwNzUiCiAgICAgICB5PSItMC4wMTM5ODg2MzEiCiAgICAgICB3aWR0aD0iMS4wMjc5NDQxIgogICAgICAgaGVpZ2h0PSIxLjAyNzk3NzMiPgogICAgICA8ZmVHYXVzc2lhbkJsdXIKICAgICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgICBzdGREZXZpYXRpb249IjAuNjk5NDc3NDEiCiAgICAgICAgIGlkPSJmZUdhdXNzaWFuQmx1cjIzMTIiIC8+CiAgICA8L2ZpbHRlcj4KICA8L2RlZnM+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO3N0cm9rZTpub25lO29wYWNpdHk6MCIKICAgICBkPSJNMCAwTDAgNTAwTDUwMCA1MDBMNTAwIDBMMCAweiIKICAgICBpZD0icGF0aDIiIC8+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO3N0cm9rZTpub25lIgogICAgIGQ9Ik0yNTAgMjIuNTM0QzI0NS42MjQgMjMuNTc4IDI0Mi4wNjQgMjYuNDQxMyAyNDEuMjI4IDMxLjAwMDhDMjM5LjI3NCA0MS42Njg1IDI0MSA1NC4xNTQ2IDI0MSA2NUMyNDEgNzAuNTk1NyAyMzkuODg1IDc3LjYwMjcgMjQxLjUxNCA4Mi45OTkyQzI0My40NjMgODkuNDU2NSAyNDkuNzkgOTEuODkwNyAyNTUuOTk5IDkwLjYyMDRDMjYxLjE2IDg5LjU2NDUgMjY0LjY1MyA4Ni4yMDIyIDI2NS42NiA4MUMyNjcuNjYyIDcwLjY1MjQgMjY2IDU4LjUzMTQgMjY2IDQ4QzI2NiA0Mi4zMzM1IDI2Ny4wMzEgMzUuNDQxMyAyNjUuMTQ2IDMwLjAxNDZDMjYyLjk2MSAyMy43MjUyIDI1Ni4yMzUgMjEuMDQ2NSAyNTAgMjIuNTM0TTEwMS4wMDQgODIuNzQyM0M5NC4yMzcyIDg1LjM2MzIgOTEuMDY4OSA5NC42NDk4IDk0LjkzODMgMTAwLjgzQzk4LjU3NzQgMTA2LjY0MyAxMDUuMDMyIDExMS40MjUgMTA5LjkxIDExNi4xN0MxMTYuMTc4IDEyMi4yNjYgMTIxLjg0OSAxMzAuMTUzIDEyOS4wMTUgMTM1LjE5NkMxMzIuODY2IDEzNy45MDYgMTM4LjQ3OSAxMzkuMDA3IDE0Mi45OTYgMTM3LjI1OEMxNTAuODU3IDEzNC4yMTMgMTUxLjQwMSAxMjQuNTA2IDE0Ny43NzIgMTE4LjAwMUMxNDUuNDkyIDExMy45MTUgMTQxLjU2MyAxMTEuMjcgMTM4LjQyNCAxMDcuOTFDMTM1LjE1MyAxMDQuNDA4IDEzMS42MjMgMTAxLjI1MyAxMjguMjg1IDk3LjgzMDJDMTIxLjM4IDkwLjc0ODcgMTEyLjU5MiA3OC4yNTM5IDEwMS4wMDQgODIuNzQyM00zOTQuMDkgODMuMDEzMUMzOTAuNjk0IDg0Ljc0NjMgMzg3LjY5NiA4OC4zODc1IDM4NS4wMTEgOTEuMDM4NkMzNzkuMTY5IDk2LjgwNTQgMzczLjU2MiAxMDIuODE2IDM2Ny43MTUgMTA4LjU3NkMzNjMuODM4IDExMi4zOTMgMzU4LjY2IDExNi4wMzggMzU2LjE3OSAxMjFDMzUwLjY2IDEzMi4wMzkgMzY0LjAxNiAxNDEuNzA2IDM3NCAxMzYuODI1QzM3OC44MzUgMTM0LjQ2MSAzODIuMzA0IDEyOS43NDIgMzg2LjAzOSAxMjYuMDM1QzM5NC4yMjEgMTE3LjkxNCA0MDcuMzU0IDEwOC44NzMgNDExLjg1MSA5OC4wMDA4QzQxNS45OTggODcuOTc1MiA0MDMuMjc1IDc4LjMyNDQgMzk0LjA5IDgzLjAxMzFNMjUwIDEyNC40NjRDMjMwLjk0OSAxMjYuMTMxIDIxMy4yNzMgMTI4LjgwMyAxOTYuMDkgMTM4LjA4N0MxNDguMjM0IDE2My45NDIgMTI1LjAxNiAyMjAuNjQ5IDEzOC40MzkgMjcyLjk2MUMxNDIuMzAxIDI4OC4wMSAxNTAuMDgzIDMwMi44MjggMTU5LjY2OSAzMTVDMTY1LjI2NSAzMjIuMTA1IDE3Mi4zMjkgMzI4LjI0MSAxNzcuMDc0IDMzNi4wMDRDMTgwLjgyNSAzNDIuMTQxIDE4NC44NTUgMzQ5LjExIDE4Ni45NjEgMzU2QzE5MS4yMzcgMzY5Ljk5MyAxOTEuMDQ5IDM4Mi4zNzkgMjA1IDM5MC44ODFDMjEyLjYyMyAzOTUuNTI3IDIyMi40MzcgMzk0IDIzMSAzOTRMMjcxIDM5NEMyNzcuNDgzIDM5NCAyODQuNTQyIDM5NC43OSAyOTAuOTYxIDM5My44NTZDMjk1LjM4NyAzOTMuMjEzIDI5OS42NDMgMzg5LjIyMiAzMDMuMDExIDM4Ni40ODFDMzA3LjY2NiAzODIuNjkzIDMxMi45MDMgMzc2LjU4OSAzMTUuMTI2IDM3MC45MUMzMTcuMjA2IDM2NS41OTYgMzE3LjUzMyAzNTkuNDY5IDMxOS4zNTUgMzU0QzMyMS43ODcgMzQ2LjY5OSAzMjUuMzQ5IDM0MC4yODMgMzI5Ljc3IDMzNEMzNDEuNzk4IDMxNi45MDQgMzU1LjcxOCAzMDAuMzcyIDM2NC4wMTIgMjgwLjkxQzM2Ny45NTIgMjcxLjY2MyAzNjkuODgyIDI1OS45NTMgMzcwLjgzIDI1MEMzNzEuODk3IDIzOC43OTUgMzcwLjM1NiAyMjcuOCAzNjcuNjY1IDIxN0MzNjUuNTUyIDIwOC41MjEgMzYzLjc1IDIwMC4wNDQgMzU5Ljk2MSAxOTIuMDlDMzQ1Ljk5NCAxNjIuNzcxIDMyMS4xMTEgMTQyLjEzNCAyOTEgMTMxLjIwNEMyNzguMjg4IDEyNi41OSAyNjMuNjczIDEyMy4yNjcgMjUwIDEyNC40NjR6IgogICAgIGlkPSJwYXRoNCIgLz4KICA8cGF0aAogICAgIHN0eWxlPSJmaWxsOiMwMDAwMDA7c3Ryb2tlOm5vbmU7b3BhY2l0eToxO2ZpbHRlcjp1cmwoI2ZpbHRlcjIyNzApIgogICAgIGQ9Ik0yNTEgMTQ5LjUxNEMyMjUuMDY4IDE1MS4xNDMgMTk4LjI3MyAxNjIuNTA1IDE4MS43MjUgMTgzLjE3QzE3Mi44MzkgMTk0LjI2NSAxNjcuNTA2IDIwNi40MzkgMTYzLjczMSAyMTkuOTk2QzE2MC40NzEgMjMxLjcwMSAxNTguOTQxIDI0Mi44NjEgMTYxLjI0NSAyNTVDMTY0LjUwNyAyNzIuMTk0IDE3MS40MzcgMjg4LjA0MSAxODIuMTc4IDMwMS44M0MxODcuNTQ2IDMwOC43MjEgMTk0LjMxOSAzMTQuNDU3IDE5OC45MSAzMjIuMDA0QzIwNC45MTIgMzMxLjg3MSAyMDkuNTI2IDM0MS44NTQgMjEyLjU3NSAzNTNDMjEzLjk2MiAzNTguMDcxIDIxMy42NjUgMzY1LjI4MyAyMTguNDgyIDM2OC41NjZDMjIzLjAyIDM3MS42NiAyMzEuNzQ0IDM3MCAyMzcgMzcwQzI1Mi4xMzggMzcwIDI2Ny45MTIgMzcxLjI4OSAyODIuOTg1IDM2OS45NDFDMjkwLjQ2NCAzNjkuMjcyIDI4OS42OTIgMzYxLjc5MSAyOTEuNjg1IDM1Ni4yODVDMjk2LjgwNSAzNDIuMTQxIDMwMS41ODkgMzI5LjQ1NyAzMTAuMzQ3IDMxNy4wMTVDMzE1LjYzMyAzMDkuNTA2IDMyMi44ODQgMzAzLjQ0NiAzMjguMTY1IDI5NS45MUMzMzUuMDgzIDI4Ni4wMzggMzQwLjI3IDI3My44MzEgMzQyLjUzOSAyNjJDMzUxLjg2OSAyMTMuMzU4IDMyMy44MjYgMTY1LjA2NiAyNzUgMTUzLjEzQzI2Ny4wNzggMTUxLjE5MyAyNTkuMjcgMTQ4Ljk5NCAyNTEgMTQ5LjUxNHoiCiAgICAgaWQ9InBhdGg2IiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2U6bm9uZSIKICAgICBkPSJNMjUxIDE3N0MyNDMuNTI2IDE2NC42OTQgMjIzLjMwMiAxNjguNDY2IDIxNS4zNCAxNzguMDE1QzIxMi45MDQgMTgwLjkzNyAyMTEuNzQyIDE4NC45OTQgMjA4Ljc3NiAxODcuNDRDMjAzLjYyOSAxOTEuNjg1IDE5Ny4wOTEgMTkyLjYwNSAxOTIuNTI5IDE5OC4wOUMxODYuMTU4IDIwNS43NTEgMTg3LjA5MiAyMTMuNiAxODQuNzQ4IDIyMi40MjRDMTgzLjA0OSAyMjguODIzIDE3OS43MDIgMjM0LjE0NyAxNzkuMTg1IDI0MUMxNzguNjY2IDI0Ny44NzkgMTgxLjE1NiAyNTYuMTU3IDE4NC43NTcgMjYxLjk2MUMxODYuNDY3IDI2NC43MTcgMTg5LjExMyAyNjcuMDUgMTkwLjQxMSAyNzAuMDM5QzE5MS42MjkgMjcyLjg0MyAxOTAuOTczIDI3Ni4wNDEgMTkxLjQ2OCAyNzlDMTkyLjQzNSAyODQuNzgzIDE5NC43MDggMjkwLjMyMyAxOTguNjggMjk0LjY5OUMyMDMuOTY4IDMwMC41MjUgMjEwLjYzIDMwMC4yMjEgMjE2LjY3NSAzMDQuMDEzQzIxOS4yNzMgMzA1LjY0MyAyMjAuNzU3IDMwOC42NDMgMjIzLjA5MyAzMTAuNjA2QzIyNi42NjkgMzEzLjYxMiAyMzEuMzk3IDMxNC45NzUgMjM2IDMxNS4yMzlDMjQyLjA1MyAzMTUuNTg3IDI0Ni40MjYgMzExLjgwMSAyNTIgMzExLjM0OEMyNTQuODIxIDMxMS4xMTkgMjU3LjQxMiAzMTMuMTY3IDI2MCAzMTQuMDEyQzI2NC4yMTYgMzE1LjM4NyAyNjguNjY1IDMxNS42MDggMjczIDMxNC43MDdDMjgwLjQzOCAzMTMuMTYxIDI4Mi40NDcgMzA3LjUyNiAyODguMzI2IDMwMy45OThDMjkwLjg5MiAzMDIuNDU4IDI5NC4yNCAzMDIuMzAyIDI5NyAzMDEuMTJDMzAzLjg1MiAyOTguMTgzIDMwOC44NTcgMjkyLjk2MiAzMTEuNTMyIDI4NkMzMTMuNDg3IDI4MC45MSAzMTIuMDY4IDI3NC44MTMgMzE0LjQ1NCAyNzAuMDM5QzMxNy42NDUgMjYzLjY1NyAzMjIuNTgzIDI1OS4zMzYgMzI0LjE4MSAyNTJDMzI2Ljc5MyAyNDAuMDAxIDMyMi43ODkgMjMyLjEwNCAzMTkuNjM3IDIyMUMzMTcuMDYyIDIxMS45MjcgMzE4LjMwNiAyMDQuOTkgMzExLjMzMSAxOTcuMjg5QzMwNi43MyAxOTIuMjA5IDMwMC4yMzggMTkxLjQ4MSAyOTUuNDk4IDE4Ny4yNzNDMjkxLjkzNSAxODQuMTA5IDI5MC44MTUgMTc4Ljg3NyAyODcuMTI3IDE3NS41MjlDMjc1LjQ1NyAxNjQuOTM3IDI2Mi43NDggMTcwLjQ2MSAyNTEgMTc3eiIKICAgICBpZD0icGF0aDgiIC8+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDojMDAwMDAwO3N0cm9rZTpub25lO29wYWNpdHk6MTtmaWx0ZXI6dXJsKCNmaWx0ZXIyMzEwKSIKICAgICBkPSJNMjIyIDIwMEMyMTIuNDE2IDIwMC4wMjYgMjAyLjIzNiAyMDIuNTkzIDE5OS4xMDkgMjEzQzE5Ny44ODggMjE3LjA2MSAxOTkuMzA3IDIyMS4wNjUgMTk4LjM1IDIyNUMxOTcuNDg2IDIyOC41NTMgMTk0Ljc4NCAyMzEuNTQgMTkzLjU0OSAyMzVDMTkwLjU4OCAyNDMuMjkgMTkzLjQxOSAyNTAuNDYxIDE5NyAyNThDMjAyLjYwNCAyNTQuMzA5IDIwNy4zNDQgMjUwLjU4MiAyMTQgMjQ5QzIxNC41NTUgMjUzLjEyMiAyMTUuNTMyIDI1Ny4xMSAyMTcgMjYxQzIwNC43OTQgMjY0LjgyNiAxOTguNTM3IDI4MS4yOTQgMjEyLjAxNSAyODguNTU4QzIxNi44MTYgMjkxLjE0NSAyMjIuMDE1IDI5MC41NzMgMjI3IDI4OUMyMjguMDE0IDI5Mi41OTkgMjI4LjU4MSAyOTYuOTQ4IDIzMS4zMDMgMjk5LjcyMUMyMzYuNDM3IDMwNC45NDggMjQ0LjI2OCAzMDEuNzIxIDI0NS42NTYgMjk0Ljk5OUMyNDcuMDgyIDI4OC4wOTMgMjQ2IDI4MC4wMzQgMjQ2IDI3M0wyNDYgMjMxQzI0MC4wODUgMjM0LjA5OSAyMzQuNjU1IDIzNi4xNDEgMjI4IDIzN0wyMjggMjI0QzI0Mi4zNTkgMjIyLjA1NyAyNDYuMDIgMjEyLjE1IDI0NiAxOTlDMjQ1Ljk5MyAxOTQuMjg0IDI0Ni4wNzQgMTg5LjEzOSAyNDIuNDQyIDE4NS41NjlDMjM3LjE1MSAxODAuMzY4IDIyNy44NTMgMTgxLjgyNyAyMjQuMDkgMTg4LjA0NEMyMjEuOSAxOTEuNjYxIDIyMi4wMTEgMTk1LjkyOSAyMjIgMjAwTTI3NyAyMjRMMjc3IDIzN0MyNzAuMzQ1IDIzNi4xNDEgMjY0LjkxNSAyMzQuMDk5IDI1OSAyMzFMMjU5IDI3NUMyNTkgMjgxLjUxMSAyNTcuNjggMjg5LjY5NSAyNTkuNDM0IDI5NS45OTVDMjYxLjIyOSAzMDIuNDQ1IDI2OC45ODYgMzA0LjUzOSAyNzMuNjk3IDI5OS43MjFDMjc2LjI3MiAyOTcuMDg3IDI3Ni43MTMgMjkzLjQ4NSAyNzcgMjkwQzI4MS42NTMgMjkwLjAzOCAyODYuNTQ0IDI5MS4xNjIgMjkwLjk5NiAyODkuMzgzQzI5OC40OTMgMjg2LjM4NiAzMDMuMjUxIDI3Ni43MDggMjk2Ljc3MiAyNzAuMjI4QzI5MS41ODEgMjY1LjAzOSAyODcuODcgMjY5Ljg0NSAyODIuNDY0IDI2OC4zMzlDMjc4Ljk0MyAyNjcuMzU4IDI3Ni4wNTIgMjYxLjc2OSAyNzQgMjU5QzI3OC4zOTUgMjU3LjYzNiAyODIuMzk2IDI1NS4wNDggMjg3IDI1NC4zMjlDMjkzLjgyNiAyNTMuMjY1IDMwMC4xODkgMjU2Ljk1NSAzMDYgMjYwQzMxMC44MDMgMjUyLjAyMSAzMTQuMzM3IDI0NC40NjkgMzExLjM3NyAyMzVDMzEwLjI2NSAyMzEuNDQ2IDMwNy41NTUgMjI4LjU2NyAzMDYuNiAyMjVDMzA1LjYzOCAyMjEuNDEzIDMwNy4wNDIgMjE3LjY5MyAzMDYuMDY4IDIxNEMzMDMuMTU3IDIwMi45NjggMjkzLjE0OCAyMDAuMDI4IDI4MyAyMDBDMjgyLjk2NCAxOTUuNjU2IDI4Mi43OTQgMTkwLjg3NiAyODAuMTU3IDE4Ny4xODhDMjc2LjEzIDE4MS41NTggMjY3LjQ5NSAxODAuNjIxIDI2Mi41NTggMTg1LjU1OEMyNTguNyAxODkuNDE2IDI1OS4wMDIgMTk0Ljk2OCAyNTkgMjAwQzI1OC45OTYgMjEyLjUyNiAyNjMuMDA0IDIyMi43NyAyNzcgMjI0eiIKICAgICBpZD0icGF0aDEwIiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2U6bm9uZSIKICAgICBkPSJNNDEuMDE1NCAyMjkuNzQyQzMyLjYzNzUgMjMzLjA0NiAzMi42OTk0IDI0OC44NzUgNDEuMDQzMiAyNTIuMjU4QzQ0Ljg0OTIgMjUzLjgwMSA0OS45NzU0IDI1MyA1NCAyNTNMODEgMjUzQzg1LjMwODMgMjUzIDkxLjAzNDYgMjUzLjk1OSA5NSAyNTEuOTcyQzEwMy40OTggMjQ3LjcxNCAxMDcuMDUgMjMzLjE3OSA5NS45OTU0IDIyOS42NTNDOTEuNjk0NCAyMjguMjgxIDg2LjQ1ODEgMjI5IDgyIDIyOUw1NyAyMjlDNTIuMTA5OSAyMjkgNDUuNjM5NyAyMjcuOTE5IDQxLjAxNTQgMjI5Ljc0Mk00MDkuMDQzIDIyOS43NDJDNDAwLjcxNiAyMzMuMTE4IDQwMS4wMjQgMjQ4LjQ4MSA0MDkuMDU1IDI1MS45OTFDNDEzLjE4OSAyNTMuNzk3IDQxOC41OTkgMjUzIDQyMyAyNTNMNDUyIDI1M0M0NTYuNjMxIDI1MyA0NjIuNTUyIDI1My44NTUgNDY2LjczNyAyNTEuNDI3QzQ3NC4wMjMgMjQ3LjIgNDc0LjA5NCAyMzMuMDkyIDQ2NS45ODUgMjI5Ljg5NEM0NjEuNzg0IDIyOC4yMzcgNDU2LjQyNCAyMjkgNDUyIDIyOUw0MjQgMjI5QzQxOS40MjQgMjI5IDQxMy4zNjIgMjI3Ljk5MSA0MDkuMDQzIDIyOS43NDJNMTM0IDM0My42NTNDMTI5LjEwMyAzNDUuMTg2IDEyNS41MSAzNDkuNDk1IDEyMiAzNTNMMTA0IDM3MUMxMDAuOTY0IDM3NC4wMzcgOTcuMTMwMiAzNzcuMDk4IDk1LjE3OSAzODFDOTAuNjE5MyAzOTAuMTE5IDk4LjU4NDcgNDAxLjQwMiAxMDguOTEgMzk4LjY4MUMxMTMuMzQgMzk3LjUxNCAxMTYuODk3IDM5Mi4xMDcgMTIwIDM4OUwxMzkgMzcwQzE0Mi4zNDcgMzY2LjY1MSAxNDYuNDkzIDM2My4yNzkgMTQ4LjY4MiAzNTlDMTUzLjU5IDM0OS40MDggMTQzLjE3NiAzNDAuNzc5IDEzNCAzNDMuNjUzTTM2My4wMzkgMzQzLjczOEMzNTYuODk5IDM0Ni4xMiAzNTIuNzU1IDM1NC42NjUgMzU2LjE3OSAzNjAuNzE1QzM1OS4yNjMgMzY2LjE2MyAzNjUuNDgxIDM3MC44NzYgMzY5Ljk2NSAzNzUuMTdDMzc1Ljg5MiAzODAuODQ3IDM4MS4zMjEgMzg3LjA3IDM4Ny4xNyAzOTIuODI2QzM5MS4xNTYgMzk2Ljc0OSAzOTYuMjY1IDQwMC4yOTMgNDAxLjk5OSAzOTcuOTlDNDA4LjUzNiAzOTUuMzY1IDQxMi43MTggMzg3Ljc2NSA0MDkuOTkxIDM4MUM0MDguMDU2IDM3Ni4yMDIgNDAzLjc0MyAzNzMuMTk5IDQwMC4xNyAzNjkuNzE1QzM5My4zNjIgMzYzLjA3NiAzODcuMDk5IDM1NS44NzEgMzgwLjA5IDM0OS40MjhDMzc1LjIwMyAzNDQuOTM3IDM3MC4wOTUgMzQxLjAwMiAzNjMuMDM5IDM0My43MzhNMjg1IDQ1OEMyOTAuMzQyIDQ1Ni4yMTkgMjk2LjEwOCA0NTQuMTkgMzAwIDQ0OUMzMDIuMDA4IDQ0Ni4zMjIgMzAyLjMwNCA0NDIuODI2IDMwNCA0NDBMMzA1IDQ0MUMzMDUgNDM0LjMxNCAzMDYuOTcyIDQyMy44NjUgMzAzLjI1OCA0MTguMDE1QzI5OC42NTYgNDEwLjc2NiAyOTEuNTg0IDQxMSAyODQgNDExTDI0MCA0MTFDMjI4LjU5IDQxMSAyMDIuNzQyIDQwNS45OTcgMjAwLjIxNCA0MjJDMTk4Ljc5OSA0MzAuOTUzIDE5OC41ODcgNDQ0LjY0MyAyMDUuMTc0IDQ1MS41NkMyMDguNzUxIDQ1NS4zMTYgMjE1LjE0MSA0NTYuNjM5IDIxOC4wNjIgNDYwLjQzQzIxOS44NjIgNDYyLjc2NyAyMTkuOTUzIDQ2Ni4yNTMgMjIwLjc0OSA0NjlDMjIyLjYwMSA0NzUuMzg3IDIyNi4zMjkgNDc5LjkyOCAyMzMgNDgxLjQ3MUMyMzguMDkyIDQ4Mi42NDggMjQzLjgwNiA0ODIgMjQ5IDQ4MkMyNjMuODcyIDQ4MiAyNzkuOTg0IDQ4NC45MTcgMjg0LjcyNSA0NjdDMjg1LjU4NSA0NjMuNzUxIDI4NS43MDkgNDYxLjI2OSAyODUgNDU4eiIKICAgICBpZD0icGF0aDEyIiAvPgo8L3N2Zz4='),
(8, 'Art', 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiIHZpZXdCb3g9IjAgMCA1MDAgNTAwIj4KICA8cGF0aAogICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7c3Ryb2tlOm5vbmU7b3BhY2l0eTowIgogICAgIGQ9Ik0wIDBMMCA1MDBMNTAwIDUwMEw1MDAgMEw0OTguNSAwTDQ0OCAwTDM4MyAwTDI1OCAwTDAgMHoiCiAgICAgaWQ9InBhdGgyIiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2U6bm9uZSIKICAgICBkPSJNMzYxIDExMUwzNTkuNSAxMTIuMDU2TDM1OC45NDQgMTEyLjM2MUwzNTcgMTEzLjM4OUwzNTUgMTE0LjEzOUwzNTQgMTE0LjQ0NEwzNTIgMTE1LjI1TDM1MSAxMTUuNzc4TDM0OSAxMTYuNzc4TDM0OCAxMTcuMjIyTDM0NyAxMTcuNzc4TDM0NSAxMTguNzc4TDM0NCAxMTkuMjVMMzQzIDExOS44MzNMMzQyIDEyMC4zNjFMMzQxIDEyMC45NDRMMzM5IDEyMS45NDRMMzM4IDEyMi4zNjFMMzM2IDEyMy4yNUwzMzQgMTI0LjI1TDMzMyAxMjQuODMzTDMzMiAxMjUuMzg5TDMzMCAxMjYuNTgzTDMyOC4wMjggMTI3LjYxMUwzMjcuMDgzIDEyOC4wODNMMzI1LjQxNyAxMjkuMjIyTDMyNCAxMzAuNjM5TDMyMi42NjcgMTMyLjIyMkwzMjEuMzMzIDEzMy45NDRMMzIwIDEzNS42MTFMMzE5LjMzMyAxMzYuMzg5TDMxOCAxMzguMDU2TDMxNy4zMzMgMTM4Ljk0NEwzMTYgMTQwLjYxMUwzMTUuMzA2IDE0MS4zODlMMzEzLjg2MSAxNDMuMDgzTDMxMi4zODkgMTQ1TDMxMS42OTQgMTQ2TDMxMC4zMzMgMTQ3LjkxN0wzMDkuNjk0IDE0OC43NzhMMzA4LjUyOCAxNTAuMzYxTDMwOCAxNTEuMTM5TDMwNi45MTcgMTUyLjYxMUwzMDYuMzA2IDE1My4zMDZMMzA1IDE1NC42OTRMMzA0LjMzMyAxNTUuNDE3TDMwMyAxNTcuMDgzTDMwMS41ODMgMTU5TDMwMC43NzggMTYwTDI5OS4wNTYgMTYyTDI5Ny4zODkgMTY0TDI5Ni42MzkgMTY1TDI5NS44ODkgMTY2TDI5NC41ODMgMTY3Ljk3MkwyOTQuMDI4IDE2OC45MTdMMjkyLjkxNyAxNzAuNTgzTDI5Mi4zMDYgMTcxLjMwNkwyOTEgMTcyLjY5NEwyOTAuMzMzIDE3My40MTdMMjg5IDE3NS4wNTZMMjg3LjU4MyAxNzYuNzc4TDI4Ni43NzggMTc3LjYxMUwyODUuMDU2IDE3OS4yMjJMMjgzLjM4OSAxODEuMDI4TDI4MS44MDYgMTgzTDI4MC4xOTQgMTg1TDI3OS4zODkgMTg2TDI3OC42MTEgMTg3TDI3Ny44MDYgMTg4TDI3Ni4xOTQgMTkwTDI3NS40MTcgMTkxTDI3NC42OTQgMTkyTDI3My4zMDYgMTk0TDI3Mi41ODMgMTk1TDI3MSAxOTdMMjcwLjE5NCAxOTcuOTcyTDI2OS40MTcgMTk4LjkxN0wyNjggMjAwLjYxMUwyNjYuNjY3IDIwMi4yMjJMMjY2IDIwMy4wODNMMjY0LjY2NyAyMDVMMjYzLjMzMyAyMDYuOTE3TDI2MiAyMDguNjExTDI2MC42NjcgMjEwLjIyMkwyNTkuMzA2IDIxMi4wMjhMMjU4LjYxMSAyMTNMMjU3LjEzOSAyMTQuOTcyTDI1Ni4zODkgMjE1LjkxN0wyNTUuNjk0IDIxNi43NzhMMjU1IDIxNy41ODNMMjUzLjY5NCAyMTlMMjUzLjA4MyAyMTkuNjk0TDI1Mi41MjggMjIwLjM4OUwyNTIgMjIxLjEzOUwyNTAuOTE3IDIyMi42MzlMMjUwLjMwNiAyMjMuMzg5TDI0OSAyMjUuMDU2TDI0OC4zMzMgMjI1Ljk0NEwyNDcgMjI3LjYxMUwyNDYuMzMzIDIyOC4zODlMMjQ1IDIzMC4wNTZMMjQ0LjMzMyAyMzAuOTQ0TDI0MyAyMzIuNjExTDI0Mi4zMzMgMjMzLjM4OUwyNDEgMjM1LjA1NkwyNDAuMzMzIDIzNS45NDRMMjM5LjY5NCAyMzYuNzc4TDIzOC41MjggMjM4LjM2MUwyMzggMjM5LjEzOUwyMzYuOTE3IDI0MC42MTFMMjM2LjMwNiAyNDEuMzA2TDIzNS4wODMgMjQyLjY5NEwyMzQuNTI4IDI0My4zODlMMjM0IDI0NC4xMzlMMjMyLjkxNyAyNDUuNjExTDIzMi4zMDYgMjQ2LjMwNkwyMzEuNjY3IDI0N0wyMzAuMzMzIDI0OC40MTdMMjI5LjExMSAyNTAuMDI4TDIyOC4zMzMgMjUxLjVMMjI4IDI1M0wyMjkuNSAyNTMuNzVMMjMwLjA1NiAyNTQuMjIyTDIzMS4wNTYgMjU0Ljg4OUwyMzIgMjU1LjYxMUwyMzMgMjU2LjMwNkwyMzUgMjU3LjYxMUwyMzYgMjU4LjE5NEwyMzggMjU5LjM4OUwyNDAgMjYwLjYxMUwyNDEgMjYxLjE2N0wyNDIgMjYxLjc1TDI0NCAyNjIuNzc4TDI0NSAyNjMuMjIyTDI0NiAyNjMuNzc4TDI0NyAyNjQuMjVMMjQ5IDI2NS4zODlMMjUxIDI2Ni42NjdMMjUyIDI2Ny4zMDZMMjUzIDI2Ny44ODlMMjUzLjk0NCAyNjguMzYxTDI1NS41IDI2OC44ODlMMjU3IDI2OUwyNTcuNjk0IDI2Ny41TDI1OC4wODMgMjY2Ljk3MkwyNTguNjk0IDI2Ni4wMjhMMjYwIDI2NC4zODlMMjYwLjY2NyAyNjMuNjExTDI2MS4zMzMgMjYyLjc3OEwyNjIgMjYxLjk0NEwyNjIuNjY3IDI2MS4wNTZMMjY0IDI1OS4zODlMMjY1LjM4OSAyNTcuODYxTDI2Ni4xMzkgMjU3LjEzOUwyNjYuODYxIDI1Ni4zODlMMjY4LjI3OCAyNTVMMjY5LjQ3MiAyNTMuNjExTDI3MC41MjggMjUyLjEzOUwyNzEuMDgzIDI1MS4zODlMMjcxLjY5NCAyNTAuNjk0TDI3Mi4zMzMgMjUwTDI3My42NjcgMjQ4LjU4M0wyNzUgMjQ2Ljk0NEwyNzUuNjY3IDI0Ni4wNTZMMjc3IDI0NC4zODlMMjc3LjY2NyAyNDMuNjExTDI3OSAyNDEuOTQ0TDI3OS42NjcgMjQxLjA1NkwyODEgMjM5LjQxN0wyODEuNjY3IDIzOC42OTRMMjgyLjkxNyAyMzcuMzA2TDI4My40NzIgMjM2LjYxMUwyODQgMjM1Ljg2MUwyODUuMDgzIDIzNC4zODlMMjg1LjY5NCAyMzMuNjk0TDI4NyAyMzIuMzA2TDI4Ny42OTQgMjMxLjU4M0wyODguNDE3IDIzMC43NzhMMjkwLjA4MyAyMjguOTcyTDI5MiAyMjdMMjkzIDIyNkwyOTUgMjI0TDI5NS45NzIgMjIzTDI5Ni45MTcgMjIyTDI5OC42MTEgMjIwTDMwMC4yMjIgMjE4TDMwMS4wODMgMjE3TDMwMi45MTcgMjE1TDMwMy43NzggMjE0TDMwNS4zODkgMjEyTDMwNyAyMTBMMzA3LjgwNiAyMDkuMDI4TDMwOS4zMDYgMjA3LjIyMkwzMTAuNjY3IDIwNS42OTRMMzEyIDIwNC4zMDZMMzEyLjY2NyAyMDMuNTgzTDMxNCAyMDEuOTQ0TDMxNC42NjcgMjAxLjA1NkwzMTYgMTk5LjM4OUwzMTcuNDE3IDE5Ny43NzhMMzE4LjIyMiAxOTYuOTE3TDMxOS4wODMgMTk1Ljk3MkwzMjAuMDI4IDE5NUwzMjEuOTE3IDE5M0wzMjMuNjExIDE5MUwzMjUuMTk0IDE4OUwzMjYgMTg4TDMyNy41ODMgMTg2TDMyOC4zMDYgMTg1TDMyOS42NjcgMTgzLjA4M0wzMzEgMTgxLjM4OUwzMzEuNjk0IDE4MC42MTFMMzMyLjQxNyAxNzkuNzc4TDMzNC4wODMgMTc3Ljk3MkwzMzUuOTE3IDE3NkwzMzcuNjExIDE3NEwzMzguMzg5IDE3M0wzNDAuMDgzIDE3MUwzNDEuMDI4IDE3MEwzNDIgMTY5TDM0NCAxNjdMMzQ1LjkxNyAxNjVMMzQ3LjYxMSAxNjNMMzQ4LjM2MSAxNjJMMzQ5LjExMSAxNjFMMzUwLjMzMyAxNTlMMzUxLjEzOSAxNTdMMzUxLjQ0NCAxNTZMMzUyLjE5NCAxNTRMMzUyLjYxMSAxNTNMMzUzLjM4OSAxNTFMMzU0LjE5NCAxNDlMMzU0LjYxMSAxNDhMMzU1LjMzMyAxNDZMMzU2IDE0NEwzNTcuNjY3IDEzOUwzNTguMzMzIDEzN0wzNTguNjY3IDEzNkwzNTkuMzA2IDEzNEwzNTkuNTgzIDEzM0wzNTkuOTE3IDEzMUwzNjAuMDgzIDEyOUwzNjAuMzg5IDEyN0wzNjAuODA2IDEyNUwzNjEuMTk0IDEyM0wzNjEuMzg5IDEyMkwzNjEuNjExIDEyMUwzNjEuODA2IDEyMEwzNjIuMTk0IDExOEwzNjIuNjExIDExNkwzNjIuOTE3IDExNC4wNTZMMzYyLjk3MiAxMTMuMDU2TDM2MyAxMTFMMzYxIDExMU0zNjkgMTMyTDM2OC4wMjggMTMzLjVMMzY3LjQ0NCAxMzUuMDU2TDM2Ny4wNTYgMTM3TDM2Ni45NDQgMTM4TDM2Ni42MTEgMTQwTDM2Ni4zODkgMTQxTDM2Ni4xOTQgMTQyTDM2NS44MDYgMTQ0TDM2NS42MTEgMTQ1TDM2NS4yMjIgMTQ3TDM2NS4wODMgMTQ4TDM2NC45MTcgMTUwTDM2NC41ODMgMTUyTDM2NC4zMDYgMTUzTDM2NCAxNTRMMzYzLjMzMyAxNTZMMzYyLjY2NyAxNThMMzYyLjMzMyAxNTlMMzYxLjYxMSAxNjFMMzYxLjE5NCAxNjJMMzYwLjQ0NCAxNjRMMzYwLjEzOSAxNjVMMzU5LjQxNyAxNjdMMzU4Ljk3MiAxNjhMMzU4LjA1NiAxNzBMMzU3LjE5NCAxNzJMMzU2LjgzMyAxNzNMMzU2LjQ0NCAxNzRMMzU2LjE2NyAxNzVMMzU1LjYxMSAxNzYuOTQ0TDM1NSAxNzlMMzU2LjQ0NCAxNzguMjc4TDM1NyAxNzcuNzVMMzU5IDE3NkwzNTkuNDQ0IDE3Ny41TDM1OS42NjcgMTc4LjA1NkwzNjAgMTc5LjA1NkwzNjAuNjY3IDE4MUwzNjEuMzMzIDE4M0wzNjEuNjY3IDE4NEwzNjIuMDI4IDE4NUwzNjIuMzg5IDE4NkwzNjIuODA2IDE4N0wzNjMuNjExIDE4OUwzNjQuMzMzIDE5MC45NDRMMzY0LjU1NiAxOTEuNUwzNjUgMTkzTDM2Ni4xOTQgMTkyLjY5NEwzNjYuNTgzIDE5Mi4zMzNMMzY4IDE5MUwzNjguNTgzIDE5M0wzNjguNzc4IDE5NEwzNjguOTE3IDE5NC41TDM2OSAxOTZMMzcwLjQxNyAxOTUuNDcyTDM3MC43NzggMTk1LjEzOUwzNzEuNTgzIDE5NC41NTZMMzczIDE5M0wzNzMuNDE3IDE5NC40NDRMMzczLjc1IDE5NS41NTZMMzc0IDE5N0wzNzUuMzg5IDE5Ni42MzlMMzc2LjMwNiAxOTUuNjY3TDM3Ni42MTEgMTk0Ljk0NEwzNzYuNjk0IDE5My41TDM3NiAxOTJMMzc1IDE5MkwzNzMgMTkzTDM3MiAxOTFMMzcyIDE5MEwzNzAuNTU2IDE5MC4yNUwzNjkuNDQ0IDE5MC41ODNMMzY4IDE5MUwzNjcuNzUgMTg5LjVMMzY3LjMwNiAxODcuOTQ0TDM2Ni42MTEgMTg2TDM2NS44MDYgMTg0TDM2NS4zODkgMTgzTDM2NS4wMjggMTgyTDM2NC42NjcgMTgxTDM2NC4zMzMgMTgwTDM2My42MTEgMTc4TDM2Mi44MDYgMTc2LjA1NkwzNjIuNSAxNzUuNUwzNjIgMTc0TDM2NCAxNzRMMzY1IDE3M0wzNjUgMTcxTDM2NCAxNzBMMzY2IDE2OUwzNjcgMTY5TDM2Ni45NzIgMTY3LjVMMzY2Ljc1IDE2NS45NDRMMzY2LjUyOCAxNjVMMzY1LjgwNiAxNjMuMDU2TDM2NS41IDE2Mi41TDM2NSAxNjFMMzY2Ljc1IDE2MC43NUwzNjcuMjc4IDE2MC43MjJMMzY4IDE2MEwzNjggMTU4TDM2NyAxNTdMMzY4LjQ0NCAxNTYuNTgzTDM2OS41NTYgMTU2LjI1TDM3MSAxNTZMMzcwLjU1NiAxNTQuNUwzNzAuMzMzIDE1My45NDRMMzY5LjYzOSAxNTIuMDU2TDM2OS4xNjcgMTUxLjA1NkwzNjguOTcyIDE1MC41TDM2OCAxNDlMMzY5LjQ0NCAxNDguNTgzTDM3MC41NTYgMTQ4LjI1TDM3MiAxNDhMMzcxLjUgMTQ2LjVMMzcxLjE5NCAxNDUuOTQ0TDM3MC44MDYgMTQ0Ljk0NEwzNzAgMTQzLjA1NkwzNjkuODA2IDE0Mi41TDM2OSAxNDFMMzcwLjQ0NCAxNDAuNTgzTDM3MS41NTYgMTQwLjI1TDM3MyAxNDBMMzczLjI1IDE0MS41TDM3My42NjcgMTQzTDM3NC4wMjggMTQzLjk0NEwzNzQuMTk0IDE0NC41TDM3NSAxNDZMMzc3IDE0NkwzNzggMTQ1TDM3OC41IDE0Ni41TDM3OC44MDYgMTQ3LjA1NkwzNzkuMTk0IDE0OC4wNTZMMzgwIDE0OS45NDRMMzgwLjE5NCAxNTAuNUwzODEgMTUyTDM4Mi40NzIgMTUxLjY5NEwzODMuNzIyIDE1MS44ODlMMzg0LjYzOSAxNTIuNjM5TDM4NSAxNTRMMzg2LjQ0NCAxNTMuNzVMMzg3LjU1NiAxNTMuNDE3TDM4OSAxNTNMMzg5LjI3OCAxNTQuNUwzODkuNDcyIDE1NS4wNTZMMzkwLjE2NyAxNTYuOTQ0TDM5MC43MjIgMTU4LjVMMzkxIDE2MEwzOTIuNDQ0IDE1OS41ODNMMzkzLjU1NiAxNTkuMjVMMzk1IDE1OUwzOTUgMTYxTDM5NiAxNjJMMzk3LjQ0NCAxNjEuNTgzTDM5OC41NTYgMTYxLjI1TDQwMCAxNjFMNDAwLjA4MyAxNjIuNUw0MDAuNDE3IDE2NC4wNTZMNDAwLjY5NCAxNjVMNDAxLjM4OSAxNjdMNDAxLjgwNiAxNjhMNDAyLjYxMSAxNzBMNDAyLjk3MiAxNzFMNDAzLjY2NyAxNzNMNDA0LjMwNiAxNzQuOTQ0TDQwNC41ODMgMTc1Ljk0NEw0MDQuNzUgMTc2LjVMNDA1IDE3OEw0MDMgMTc4TDQwMiAxNzlMNDAyLjMwNiAxODAuNDcyTDQwMi4xMTEgMTgxLjcyMkw0MDEuMzYxIDE4Mi42MzlMNDAwIDE4M0w0MDAuMjUgMTg0LjQ0NEw0MDAuNTgzIDE4NS41NTZMNDAxIDE4N0wzOTkuNSAxODcuMjc4TDM5OCAxODcuODMzTDM5Ny4wNTYgMTg4LjE5NEwzOTYuNSAxODguNUwzOTUgMTg5TDM5NS4yNSAxOTFMMzk1LjI3OCAxOTEuNTU2TDM5NiAxOTNMMzk0LjUgMTkzLjA4M0wzOTIuOTQ0IDE5My40NzJMMzkyIDE5My44MzNMMzkwIDE5NC42MTFMMzg4LjA1NiAxOTUuMzMzTDM4Ny41IDE5NS41NTZMMzg2IDE5NkwzODYuMjc4IDE5Ny42NjdMMzg2LjM4OSAxOTguMzg5TDM4Ni42MzkgMTk5LjU4M0wzODcgMjAxTDM4OC41IDIwMC43MjJMMzg5LjA1NiAyMDAuNTI4TDM5MSAxOTkuODA2TDM5MiAxOTkuMzg5TDM5NCAxOTguNjY3TDM5NC45NDQgMTk4LjM2MUwzOTUuOTQ0IDE5Ny45NzJMMzk2LjUgMTk3LjgwNkwzOTggMTk3TDM5Ny43NSAxOTVMMzk3LjcyMiAxOTQuNDQ0TDM5NyAxOTNMMzk4LjUgMTkyLjc1TDM5OS4wNTYgMTkyLjU4M0w0MDAuMDU2IDE5Mi4zMDZMNDAxLjk0NCAxOTEuNjY3TDQwMi41IDE5MS40NDRMNDA0IDE5MUw0MDMuNTgzIDE4OS41NTZMNDAzLjI1IDE4OC40NDRMNDAzIDE4N0w0MDQgMTg3TDQwNiAxODZMNDA2IDE4NEw0MDUgMTgzTDQwNiAxODNMNDA4IDE4Mkw0MDcuNTgzIDE4MC41NTZMNDA3LjI1IDE3OS40NDRMNDA3IDE3OEw0MDkgMTc3TDQxMCAxNzdMNDA5LjkxNyAxNzUuNUw0MDkuNTI4IDE3My45NDRMNDA4LjgwNiAxNzJMNDA4LjM4OSAxNzFMNDA3LjY2NyAxNjlMNDA3IDE2N0w0MDYuMzMzIDE2NUw0MDUuOTcyIDE2NEw0MDUuNjExIDE2M0w0MDQuODA2IDE2MS4wNTZMNDA0LjUgMTYwLjVMNDA0IDE1OUw0MDIuNTU2IDE1OS4yNUw0MDEuNDQ0IDE1OS41ODNMNDAwIDE2MEwzOTkgMTU4TDM5OSAxNTdMMzk3LjUyOCAxNTYuNjM5TDM5Ni4xOTQgMTU1LjY2N0wzOTUuNSAxNTQuODg5TDM5NC45NDQgMTU0LjAyOEwzOTQuMjc4IDE1Mi41TDM5NCAxNTFMMzkyLjUgMTUxLjI1TDM5MiAxNTEuMzg5TDM5MC41IDE1MS43NUwzODkgMTUyTDM4OSAxNDlMMzg3IDE0OS4yNUwzODYuNDQ0IDE0OS4yNzhMMzg1IDE1MEwzODQuOTE3IDE0OC41TDM4NC41MjggMTQ2Ljk0NEwzODMuODA2IDE0NS4wNTZMMzgzLjUgMTQ0LjVMMzgzIDE0M0wzODEuNTU2IDE0My40MTdMMzgwLjQ0NCAxNDMuNzVMMzc5IDE0NEwzNzguNzUgMTQyLjVMMzc4LjMzMyAxNDFMMzc3Ljk3MiAxNDAuMDU2TDM3Ny44MDYgMTM5LjVMMzc3IDEzOEwzNzUuNTU2IDEzOC4yNUwzNzQuNDQ0IDEzOC41ODNMMzczIDEzOUwzNzIuNzIyIDEzNy41MjhMMzcyLjExMSAxMzYuMzMzTDM3MS41NTYgMTM1Ljk3MkwzNzEuMjIyIDEzNS42MzlMMzcwIDEzNkwzNzAuMjUgMTM0LjU1NkwzNzAuNTgzIDEzMy40NDRMMzcxIDEzMkwzNjkgMTMyeiIKICAgICBpZD0icGF0aDQiIC8+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDojZmZmZmZmOyBzdHJva2U6bm9uZTsiCiAgICAgZD0iTTM2MiAxNjhMMzYyIDE3MEwzNjMgMTcwTDM2NCAxNjhMMzYyIDE2OE0zNjAgMTcxTDM2MCAxNzVMMzYwLjcyMiAxNzQuMjIyTDM2MC44ODkgMTczTDM2MC43MjIgMTcyLjI3OEwzNjAuNzIyIDE3MS43NzhMMzYwIDE3MU0zMTEgMTczTDMwOS45MTcgMTc0LjQxN0wzMDguNzIyIDE3NS42NjdMMzA3LjkxNyAxNzYuMzg5TDMwNi4wODMgMTc4LjA4M0wzMDQuMzg5IDE4MEwzMDMuNjM5IDE4MUwzMDIuODg5IDE4MkwzMDEuNTgzIDE4NEwzMDAuNDE3IDE4NkwyOTkuNzc4IDE4N0wyOTguMzg5IDE4OC45MTdMMjk3LjY5NCAxODkuNzc4TDI5NyAxOTAuNTgzTDI5NS42MTEgMTkyTDI5NC44NjEgMTkyLjY5NEwyOTMuNDQ0IDE5NC4yMjJMMjkyLjgzMyAxOTUuMDgzTDI5MS42MzkgMTk3TDI5MC42MzkgMTk4Ljk0NEwyOTAuMTExIDIwMC41TDI5MCAyMDJMMjg4LjUgMjAyLjI3OEwyODYuOTQ0IDIwMi45NDRMMjg2LjAyOCAyMDMuNUwyODQuMjIyIDIwNS4wODNMMjgyLjY5NCAyMDdMMjgyIDIwNy45NzJMMjgxLjMwNiAyMDguOTE3TDI3OS44MDYgMjEwLjYxMUwyNzkgMjExLjM4OUwyNzcuNDcyIDIxMy4wODNMMjc2LjgzMyAyMTQuMDI4TDI3NS41MjggMjE2TDI3My45MTcgMjE4TDI3Mi45NzIgMjE5TDI3MiAyMjBMMjcxIDIyMUwyNjkuMDgzIDIyM0wyNjcuNDE3IDIyNUwyNjYuNzIyIDIyNkwyNjYuMTExIDIyN0wyNjUuMzA2IDIyOC45NDRMMjY1LjExMSAyMjkuOTQ0TDI2NSAyMzJMMjY5IDIzMkwyNjkuNjk0IDIzMC41TDI3MC43MjIgMjI4Ljk0NEwyNzEuNDE3IDIyOEwyNzMuMDgzIDIyNkwyNzQuOTE3IDIyNEwyNzUuNzc4IDIyM0wyNzcuMzYxIDIyMUwyNzguMTM5IDIyMEwyNzguODYxIDIxOUwyNzkuNjM5IDIxOEwyODAuMzg5IDIxN0wyODIuMDgzIDIxNUwyODMuOTE3IDIxM0wyODUuNjExIDIxMUwyODYuMzg5IDIxMEwyODguMDU2IDIwOEwyODguOTQ0IDIwN0wyOTAuNjExIDIwNS4wODNMMjkyLjE5NCAyMDMuMzg5TDI5MyAyMDIuNjExTDI5NC41MjggMjAwLjkxN0wyOTUuMTY3IDE5OS45NzJMMjk2LjQ3MiAxOThMMjk3LjI1IDE5N0wyOTguMDgzIDE5NkwyOTkuOTE3IDE5NEwzMDAuNzUgMTkzTDMwMS41IDE5MkwzMDIuNjExIDE5MC4wMjhMMzAzLjA1NiAxODkuMDgzTDMwNC4wODMgMTg3LjM4OUwzMDQuNzIyIDE4Ni42MTFMMzA2LjIyMiAxODQuOTE3TDMwNy4wODMgMTgzLjk3MkwzMDkgMTgyTDMxMCAxODFMMzExLjg4OSAxNzlMMzEzLjI3OCAxNzdMMzEzLjY2NyAxNzYuMDU2TDMxMy45NzIgMTc0LjVMMzE0IDE3M0wzMTEgMTczeiIKICAgICBpZD0icGF0aDYiIC8+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO3N0cm9rZTpub25lIgogICAgIGQ9Ik0zNzggMTk1TDM3OCAyMDBMMzc5LjUgMTk5Ljc1TDM4MS4wNTYgMTk5LjI3OEwzODEuOTcyIDE5OC44ODlMMzgzLjY2NyAxOTcuNjk0TDM4NC42NjcgMTk2LjAyOEwzODQuODg5IDE5NS4wNTZMMzg1IDE5M0wzODMuNSAxOTMuMjVMMzgyLjk0NCAxOTMuNDE3TDM4MS45NDQgMTkzLjY5NEwzODAuMDU2IDE5NC4zMzNMMzc5LjUgMTk0LjU1NkwzNzggMTk1TTIyNSAyNTZMMjIyLjk0NCAyNTguMDU2TDIyMS4wMjggMjYwTDIyMC4wODMgMjYxTDIxOC4zODkgMjYyLjk3MkwyMTcuNjM5IDI2My45MTdMMjE2LjEzOSAyNjUuNjExTDIxNS4zNjEgMjY2LjM4OUwyMTQuNjExIDI2Ny4xOTRMMjEzIDI2OC44MDZMMjEyLjIyMiAyNjkuNjExTDIxMS40NzIgMjcwLjM4OUwyMTAuODMzIDI3MS4xOTRMMjA5LjU1NiAyNzIuODA2TDIwOC4xMzkgMjc0LjM4OUwyMDcuMzYxIDI3NS4xOTRMMjA2LjYxMSAyNzZMMjA1LjgwNiAyNzYuODA2TDIwNC4zMDYgMjc4LjM4OUwyMDMuNzIyIDI3OS4xNjdMMjAzLjExMSAyODAuNTI4TDIwMyAyODJMMjAxLjUyOCAyODIuMzYxTDIwMC4yNzggMjgzLjI3OEwxOTkuNzIyIDI4NC4wNTZMMTk5LjM2MSAyODQuNTI4TDE5OSAyODZMMjAwLjQxNyAyODYuMzMzTDIwMC44MzMgMjg2LjYzOUwyMDEuNjY3IDI4Ny4wODNMMjAyLjM4OSAyODcuNjM5TDIwNC4wODMgMjg4LjgzM0wyMDUuMDI4IDI4OS40NDRMMjA3IDI5MC44NjFMMjA3Ljk3MiAyOTEuNjM5TDIwOC45MTcgMjkyLjM2MUwyMTAuNjExIDI5My44NjFMMjExLjM4OSAyOTQuNjM5TDIxMi4yMjIgMjk1LjM4OUwyMTMuMDgzIDI5Ni4yMjJMMjE0LjAyOCAyOTcuMDgzTDIxNiAyOTlMMjE3IDMwMEwyMTkgMzAyTDIyMSAzMDMuOTE3TDIyMi45NDQgMzA1LjVMMjI0LjUgMzA2LjQ3MkwyMjYgMzA3TDIyNy4wODMgMzA1LjU4M0wyMjguMjUgMzA0LjMzM0wyMjkgMzAzLjYxMUwyMzAuNjExIDMwMS45MTdMMjMyLjE5NCAzMDBMMjMzIDI5OUwyMzQuNjExIDI5N0wyMzYuMTM5IDI5NUwyMzYuODYxIDI5NEwyMzguMzg5IDI5MkwyMzkuMTk0IDI5MUwyNDAuODA2IDI4OUwyNDEuNjExIDI4OEwyNDIuMzYxIDI4N0wyNDMuMTM5IDI4NkwyNDQuNjExIDI4NC4wODNMMjQ1Ljk3MiAyODIuMzg5TDI0Ni42MTEgMjgxLjYxMUwyNDcuMTk0IDI4MC44MDZMMjQ4LjQ0NCAyNzkuMTk0TDI0OS44NjEgMjc3LjYxMUwyNTAuNjM5IDI3Ni43NzhMMjUyLjExMSAyNzUuMDI4TDI1Mi43NzggMjc0LjA1NkwyNTMuMjUgMjczLjVMMjU0IDI3MkwyNTIuNSAyNzEuNjY3TDI1MC45NDQgMjcwLjg4OUwyNDkgMjY5LjYxMUwyNDggMjY4Ljg4OUwyNDYgMjY3LjU4M0wyNDUgMjY3LjAyOEwyNDMgMjY1Ljk0NEwyNDEgMjY0LjgzM0wyNDAgMjY0LjI1TDIzOSAyNjMuNzVMMjM3IDI2Mi42MTFMMjM2IDI2MS45NzJMMjM1IDI2MS4zMzNMMjMzIDI2MC4wODNMMjMyIDI1OS41MjhMMjMwLjA1NiAyNTguNDQ0TDIyOC41IDI1Ny4zODlMMjI3IDI1NkwyMjUgMjU2TTE5NSAyOTBMMTkzLjk0NCAyOTEuNUwxOTMuNjExIDI5Mi4wNTZMMTkyLjk0NCAyOTMuMDU2TDE5Mi4zMzMgMjk0TDE5MS42NjcgMjk1TDE5MC4zMzMgMjk3TDE4Ni4zMzMgMzAzTDE4NC4zMzMgMzA2TDE4MyAzMDhMMTgxLjYxMSAzMTBMMTgwLjE2NyAzMTJMMTc5LjQ0NCAzMTNMMTc4LjgzMyAzMTRMMTc3LjU1NiAzMTZMMTc2LjEzOSAzMThMMTc1LjM2MSAzMTlMMTc0LjYzOSAzMjBMMTczLjg2MSAzMjFMMTcyLjQ0NCAzMjNMMTcxLjgzMyAzMjRMMTcxLjE5NCAzMjVMMTY5Ljk3MiAzMjdMMTY4LjYxMSAzMjlMMTY3Ljg4OSAzMzBMMTY2LjY5NCAzMzEuOTQ0TDE2Ni4xMTEgMzMzLjVMMTY2IDMzNUwxNjQuNTgzIDMzNS4zNjFMMTYzLjQ0NCAzMzYuMzMzTDE2Mi41IDMzOC4wMjhMMTYyLjE5NCAzMzkuODg5TDE2Mi4zMDYgMzQwLjY2N0wxNjIuODYxIDM0MS42MzlMMTY0IDM0MkwxNjIuNSAzNDIuNDcyTDE2MS45NDQgMzQyLjM2MUwxNjAuOTQ0IDM0Mi4zMzNMMTYwIDM0Mi4xNjdMMTU5IDM0MkwxNTcgMzQxLjYxMUwxNTYgMzQxLjM4OUwxNTQgMzQxLjA4M0wxNTIgMzQxTDE1MSAzNDFMMTQ5IDM0MS4wODNMMTQ3IDM0MS40MTdMMTQ2IDM0MS42OTRMMTQ0IDM0Mi4zMDZMMTQzIDM0Mi42MTFMMTQyIDM0Mi44NjFMMTQwLjA4MyAzNDMuNDcyTDEzOS4yMjIgMzQzLjkxN0wxMzguMzg5IDM0NC40MTdMMTM2LjgwNiAzNDUuNjExTDEzNiAzNDYuMTk0TDEzNC40NzIgMzQ3LjQ3MkwxMzMuODMzIDM0OC4yMjJMMTMyLjU1NiAzNDkuODA2TDEzMS44MzMgMzUwLjYxMUwxMzAuNDQ0IDM1Mi4yMjJMMTI5LjI3OCAzNTQuMDI4TDEyOC44MzMgMzU1TDEyNy45NDQgMzU3TDEyNi45NDQgMzU5TDEyNS44MzMgMzYxTDEyNS4yNSAzNjJMMTI0Ljc3OCAzNjNMMTI0LjIyMiAzNjRMMTIzLjc1IDM2NUwxMjIuNjExIDM2N0wxMjEuOTcyIDM2OEwxMjAuNTgzIDM2OS45MTdMMTE5IDM3MS42MTFMMTE4LjE5NCAzNzIuMzg5TDExNi42MTEgMzczLjk3MkwxMTUuNzc4IDM3NC43MjJMMTEzLjk3MiAzNzZMMTEyIDM3Ny4yMjJMMTEwIDM3OC41MjhMMTA4IDM3OS41MjhMMTA3IDM3OS44MzNMMTA1IDM4MC4zODlMMTA0IDM4MC42OTRMMTAyIDM4MS4zMDZMMTAxIDM4MS42MTFMMTAwIDM4MS44MzNMOTkgMzgyLjA1Nkw5OCAzODIuMTY3TDk2IDM4Mi4zODlMOTUgMzgyLjUyOEw5MyAzODIuODA2TDkxLjAyNzggMzgzLjA4M0w5MC4xMTExIDM4My4zMzNMODkuMzMzMyAzODMuNzIyTDg4LjcyMjIgMzg0LjI3OEw4OC4zMzMzIDM4NS4wNTZMODggMzg3TDg5LjUgMzg3Ljc1TDkxIDM4OC44MDZMOTEuNSAzODkuMjVMOTMgMzkwTDkyIDM4OEw5MyAzODhMOTQuNSAzODguMjVMOTYuMDU1NiAzODguNjExTDk4IDM4OUwxMDAgMzg5LjM4OUwxMDIgMzg5Ljg2MUwxMDMgMzkwLjEzOUwxMDUgMzkwLjYxMUwxMDYgMzkwLjgwNkwxMDggMzkxLjE5NEwxMDkgMzkxLjM4OUwxMTAgMzkxLjYxMUwxMTIgMzkxLjkxN0wxMTMgMzkxLjk3MkwxMTUgMzkyTDExNiAzOTJMMTE4IDM5MkwxMjAgMzkyLjA4M0wxMjIgMzkyLjM4OUwxMjMgMzkyLjYxMUwxMjUgMzkyLjkxN0wxMjYgMzkyLjk3MkwxMjggMzkzLjAyOEwxMjkgMzkzLjA4M0wxMzEgMzkzLjM2MUwxMzIgMzkzLjUyOEwxMzQgMzkzLjYxMUwxMzYgMzkzLjU4M0wxMzcgMzkzLjYxMUwxMzkgMzkzLjYxMUwxNDAgMzkzLjU1NkwxNDEgMzkzLjUyOEwxNDMgMzkzLjQxN0wxNDUgMzkzLjE5NEwxNDYgMzkzLjA1NkwxNDcgMzkyLjk0NEwxNDkgMzkyLjYxMUwxNTAgMzkyLjM4OUwxNTIgMzkyLjA4M0wxNTMgMzkyLjAyOEwxNTUgMzkxLjkxN0wxNTcgMzkxLjUyOEwxNTggMzkxLjE2N0wxNjAgMzkwLjM2MUwxNjEgMzg5Ljk0NEwxNjMgMzg4Ljk0NEwxNjQgMzg4LjM2MUwxNjYgMzg3LjI1TDE2Ni45NzIgMzg2Ljc1TDE2OC43NzggMzg1LjUyOEwxNzAuMzYxIDM4NEwxNzEuODMzIDM4Mi4zODlMMTcyLjU1NiAzODEuNjExTDE3My43MjIgMzc5LjkxN0wxNzQuNTI4IDM3OEwxNzQuNzUgMzc3TDE3NC45MTcgMzc2LjA1NkwxNzUgMzc0LjVMMTc1IDM3M0wxNzcgMzczTDE3NyAzNjhMMTc3IDM2NkwxNzcgMzY0TDE3Ni45MTcgMzYyTDE3Ni41ODMgMzYwTDE3Ni4zMDYgMzU5TDE3NS42MTEgMzU3TDE3NS4xNjcgMzU2TDE3NC4yMjIgMzU0LjAyOEwxNzMuNzUgMzUzLjA4M0wxNzIuNTU2IDM1MS4zODlMMTcxLjgzMyAzNTAuNjExTDE3MC4zNjEgMzQ4Ljk0NEwxNjkuNjExIDM0OC4wNTZMMTY3LjkxNyAzNDYuMzg5TDE2Ni4wNTYgMzQ0LjgzM0wxNjUuNSAzNDQuNDE3TDE2NCAzNDNMMTY1LjUgMzQzLjUyOEwxNjcuMDU2IDM0NC41TDE2OSAzNDYuMDgzTDE3MC45NzIgMzQ4TDE3MS45MTcgMzQ5TDE3My41MjggMzUwLjk0NEwxNzUgMzUzTDE3Ni41IDM1Mi44ODlMMTc4LjA1NiAzNTIuMzYxTDE3OS45MTcgMzUxLjI3OEwxODAuNzc4IDM1MC41ODNMMTgxLjYxMSAzNDkuODA2TDE4My4yMjIgMzQ4LjE5NEwxODQuOTQ0IDM0Ni42MTFMMTg2LjYxMSAzNDVMMTg4LjIyMiAzNDMuMzg5TDE4OS4wODMgMzQyLjYxMUwxOTEgMzQwLjkxN0wxOTIgMzM5Ljk3MkwxOTQgMzM4TDE5NiAzMzZMMTk3IDMzNUwxOTggMzM0LjAyOEwxOTguOTcyIDMzMy4wODNMMTk5LjkxNyAzMzIuMjIyTDIwMC43NzggMzMxLjQxN0wyMDIuMzg5IDMzMEwyMDQuMDgzIDMyOC41ODNMMjA1LjkxNyAzMjYuOTE3TDIwNi43NzggMzI2TDIwNy42MTEgMzI1LjA4M0wyMDkuMjIyIDMyMy4zODlMMjEwLjA4MyAzMjIuNjExTDIxMiAzMjAuOTE3TDIxMy45NzIgMzE5LjA4M0wyMTQuOTE3IDMxOC4yMjJMMjE2LjYxMSAzMTYuNjExTDIxNy4zODkgMzE1LjgwNkwyMTkuMDI4IDMxNC4yNUwyMjAuNSAzMTMuMDgzTDIyMiAzMTJMMjIxLjYzOSAzMTAuNUwyMjEuMjc4IDMwOS45NDRMMjIwLjY5NCAzMDguOTQ0TDIxOS4xOTQgMzA3LjAyOEwyMTcuNjExIDMwNS4yMjJMMjE2Ljc3OCAzMDQuMzg5TDIxNS45MTcgMzAzLjYxMUwyMTQgMzAxLjkxN0wyMTIgMzAwLjA4M0wyMTAuMDgzIDI5OC4zODlMMjA5LjIyMiAyOTcuNjM5TDIwOC4zODkgMjk2Ljg2MUwyMDYuNzc4IDI5NS40NDRMMjA1IDI5NC4xNjdMMjA0LjA4MyAyOTMuNTU2TDIwMi4zODkgMjkyLjE2N0wyMDEuNjExIDI5MS40NzJMMTk5LjkxNyAyOTAuNUwxOTguOTcyIDI5MC4yNUwxOTguMDU2IDI5MC4wODNMMTk2LjUgMjkwTDE5NSAyOTBNODcgMzk1TDg2LjIyMjIgMzk2LjVMODUuNjk0NCAzOTcuMDU2TDg0Ljg4ODkgMzk4LjA1Nkw4My4wODMzIDQwMEw4MS4zODg5IDQwMkw4MC42MTExIDQwM0w3OS4wMjc4IDQwNUw3OC4yNzc4IDQwNkw3NyA0MDhMNzYuNDE2NyA0MDlMNzUuMTM4OSA0MTFMNzQuNDQ0NCA0MTJMNzMuMjc3OCA0MTRMNzIuODMzMyA0MTVMNzEuOTQ0NCA0MTdMNzAuOTQ0NCA0MTlMNzAuMzg4OSA0MjBMNjkuNDE2NyA0MjJMNjkuMDI3OCA0MjNMNjguMzMzMyA0MjVMNjggNDI2TDY3LjQxNjcgNDI4TDY3LjA4MzMgNDMwTDY3LjAyNzggNDMxTDY3IDQzM0w2NyA0MzRMNjcgNDM2TDY3IDQzOEw2NyA0MzlMNjcgNDQwTDY3LjA4MzMgNDQyTDY3LjQxNjcgNDQ0TDY4LjAyNzggNDQ1Ljk3Mkw2OC40MTY3IDQ0Ni45MTdMNjguODg4OSA0NDcuNzc4TDY5LjQxNjcgNDQ4LjYxMUw3MC42MTExIDQ1MC4yMjJMNzEuODMzMyA0NTEuOTQ0TDcyLjQ3MjIgNDUyLjc1TDczLjI1IDQ1My41MjhMNzUuMDI3OCA0NTQuODA2TDc2IDQ1NS4zODlMNzggNDU2LjU4M0w4MCA0NTcuNUw4MSA0NTcuNzVMODMgNDU3Ljk3Mkw4NCA0NThMODUgNDU4TDg3IDQ1OEw5MCA0NThMOTIgNDU4TDkzIDQ1OEw5NSA0NTcuOTE3TDk2IDQ1Ny43NUw5NyA0NTcuNUw5OSA0NTYuNTI4TDEwMCA0NTUuODYxTDEwMS45NzIgNDU0LjU4M0wxMDMuNjk0IDQ1My4zODlMMTA0LjM4OSA0NTIuNjk0TDEwNSA0NTEuODg5TDEwNS41ODMgNDUwLjk3MkwxMDYuODYxIDQ0OUwxMDguMTM5IDQ0N0wxMDguNzIyIDQ0NkwxMDkuNTI4IDQ0NEwxMDkuOTE3IDQ0MkwxMDkuOTcyIDQ0MUwxMTAgNDQwTDExMCA0MzhMMTEwIDQzN0wxMTAgNDM0TDExMCA0MzJMMTA5LjkxNyA0MzBMMTA5Ljc3OCA0MjlMMTA5LjU4MyA0MjhMMTA5LjMwNiA0MjdMMTA4LjYxMSA0MjVMMTA3LjgwNiA0MjNMMTA3LjM2MSA0MjJMMTA2Ljk0NCA0MjFMMTA2LjQ3MiA0MjBMMTA1LjUyOCA0MThMMTA1LjA1NiA0MTdMMTA0LjE2NyA0MTVMMTAzLjcyMiA0MTRMMTAyLjU1NiA0MTJMMTAxLjIyMiA0MTBMMTAwLjU4MyA0MDlMMTAwIDQwOEw5OC43MjIyIDQwNkw5Ny4xOTQ0IDQwNEw5Ni4zODg5IDQwM0w5NS42MTExIDQwMkw5My45MTY3IDQwMEw5Mi45NzIyIDM5OUw5MS4wNTU2IDM5Ny4wNTZMODkgMzk1TDg3IDM5NXoiCiAgICAgaWQ9InBhdGg4IiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjsgc3Ryb2tlOm5vbmU7IgogICAgIGQ9Ik04NyA0MDJMODUuNTgzMyA0MDMuNUw4NS4xNjY3IDQwNC4wNTZMODMuNjM4OSA0MDZMODIuODYxMSA0MDdMODEuMzg4OSA0MDlMODAuMDI3OCA0MTFMNzguODA1NiA0MTNMNzcuNjExMSA0MTVMNzYuMzg4OSA0MTdMNzUuODMzMyA0MThMNzUuMjc3OCA0MTlMNzQuODMzMyA0MjBMNzQuMzg4OSA0MjFMNzQuMDI3OCA0MjJMNzMuNjY2NyA0MjNMNzMgNDI1TDcyLjMzMzMgNDI3TDcyIDQyOEw3MS40MTY3IDQzMEw3MS4wODMzIDQzMkw3MS4wMjc4IDQzM0w3MSA0MzVMNzEgNDM2TDcxLjAyNzggNDM4TDcxLjA4MzMgNDM5TDcxLjQxNjcgNDQxTDcyLjAyNzggNDQzTDcyLjQxNjcgNDQ0TDczLjUgNDQ2TDc1LjA4MzMgNDQ3Ljk3Mkw3Ni4wMjc4IDQ0OC45MTdMNzggNDUwLjUyOEw3OSA0NTEuMTM5TDgwIDQ1MS43MjJMODEgNDUyLjE2N0w4MyA0NTIuOTcyTDg1IDQ1My41ODNMODcgNDUzLjkxN0w4OCA0NTMuOTQ0TDg5IDQ1My45MTdMOTEgNDUzLjU4M0w5MyA0NTIuOTcyTDk1IDQ1Mi4xNjdMOTYgNDUxLjcyMkw5NyA0NTEuMTM5TDk4IDQ1MC41MjhMOTkuOTcyMiA0NDguOTE3TDEwMC45MTcgNDQ3Ljk3MkwxMDIuNSA0NDZMMTAzLjU4MyA0NDRMMTAzLjk3MiA0NDNMMTA0LjU4MyA0NDFMMTA0LjkxNyA0MzlMMTA0Ljk3MiA0MzhMMTA1IDQzNkwxMDUgNDM1TDEwNC45NzIgNDMzTDEwNC45MTcgNDMyTDEwNC41ODMgNDMwTDEwNCA0MjhMMTAzLjY2NyA0MjdMMTAzIDQyNUwxMDIuMzMzIDQyM0wxMDEuOTcyIDQyMkwxMDEuNjExIDQyMUwxMDEuMTY3IDQyMEwxMDAuNzIyIDQxOUwxMDAuMTY3IDQxOEw5OS42MTExIDQxN0w5OC4zODg5IDQxNUw5Ny4xOTQ0IDQxM0w5NS45NzIyIDQxMUw5NC42MTExIDQwOUw5My4xMzg5IDQwN0w5Mi4zNjExIDQwNkw5MC44MzMzIDQwNC4wNTZMOTAuNDE2NyA0MDMuNUw4OSA0MDJMODcgNDAyeiIKICAgICBpZD0icGF0aDEwIiAvPgo8L3N2Zz4='),
(9, 'Métier', 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiIHZpZXdCb3g9IjAgMCA1MDAgNTAwIiB2ZXJzaW9uPSIxLjEiPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2U6bm9uZTtvcGFjaXR5OjAiCiAgICAgZD0iTTAgMEwwIDUwMEw1MDAgNTAwTDUwMCAwTDAgMHoiCiAgICAgaWQ9InBhdGgyIiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2U6bm9uZSIKICAgICBkPSJNMTg0IDExNkwxMzAgMTE2QzEwOS4xNSAxMTYgODguODUxMiAxMTUuODc0IDcyLjQzOSAxMzEuMDE0QzYzLjA5NTEgMTM5LjYzMyA1NS41MDc5IDE1MC40NTQgNTIuNTI0NyAxNjNDNDkuMDUyNyAxNzcuNjAxIDUxIDE5NC4wOSA1MSAyMDlMNTEgMzUxQzUxIDM2Mi4xNjcgNDkuOTYzOCAzNzQuMDM2IDUyLjUyODUgMzg1QzU1LjMxNSAzOTYuOTEyIDYzLjI0NDggNDA4LjU4MiA3Mi4zOTk3IDQxNi40OTJDODkuMjY2NyA0MzEuMDY0IDEwNi45NTIgNDMxIDEyOCA0MzFMMTcwIDQzMUMyNDguOTIgNDMxIDMyOC4xMDcgNDMyLjkxOCA0MDcgNDMwLjk4NUM0MzEuNTggNDMwLjM4MyA0NTMuNzMyIDQwOC44MyA0NjAuMjExIDM4NkM0NjMuNjg0IDM3My43NjYgNDYyIDM1OS41NzUgNDYyIDM0N0w0NjIgMjc3TDQ2MiAyMDhDNDYyIDE5NC43OTMgNDYzLjg1IDE4MC4wMjkgNDYxLjY3NCAxNjdDNDU3Ljg3MSAxNDQuMjIzIDQzOS41MTkgMTI1LjI3NyA0MTggMTE4LjM1OUM0MDcuMTg4IDExNC44ODMgMzk1LjE5IDExNiAzODQgMTE2TDMyOSAxMTZDMzI5IDk2LjY2MyAzMzEuMTQzIDc3LjcyNTQgMzE2LjMzNCA2Mi44MDc5QzI5OC43NDIgNDUuMDg2NSAyNjcuNjg0IDUxIDI0NSA1MUMyMzUuMTIyIDUxIDIyNC42ODkgNTAuMDI0NCAyMTUgNTIuMzAwOUMyMDcuMjc4IDU0LjExNTQgMTk5LjY0MSA1OS40MTIgMTk0LjQyOCA2NS4yOTAxQzE4MS43NiA3OS41NzYyIDE4NCA5OC4zMTQ3IDE4NCAxMTZ6IgogICAgIGlkPSJwYXRoNCIgLz4KICA8cGF0aAogICAgIHN0eWxlPSJmaWxsOiMwMDAwMDA7c3Ryb2tlOm5vbmUiCiAgICAgZD0iTTIxNyAxMTZMMjk2IDExNkMyOTYgMTA3LjU3IDI5OC41NTcgOTMuNjgzNyAyOTEuODUzIDg3LjIyODRDMjg3LjM4IDgyLjkyMTIgMjgwLjY5MyA4NCAyNzUgODRMMjM3IDg0QzIzMS4yNDQgODQgMjI0LjgyOCA4My4xMzUgMjIwLjQzMyA4Ny42ODQ0QzIxNC40MzMgOTMuODk0NCAyMTcgMTA4LjEwNCAyMTcgMTE2TTg0IDE5N0w0MjkgMTk3QzQyOSAxODkuOTE4IDQzMC4wMTMgMTgxLjk1OSA0MjguNjIxIDE3NUM0MjYuMjQ5IDE2My4xNDQgNDE3LjI5NCAxNTMuODQzIDQwNiAxNTAuMTA0QzM5Ny41ODYgMTQ3LjMxOSAzODYuNzggMTQ5IDM3OCAxNDlMMzIzIDE0OUwxNzQgMTQ5TDEzMCAxNDlDMTIyLjY2MiAxNDkgMTE0LjA0NiAxNDcuNzcyIDEwNyAxNTAuMTA0Qzk1LjgzNTcgMTUzLjggODYuNDEwOSAxNjMuMTIxIDg0LjMyODcgMTc1QzgzLjA5NDkgMTgyLjAzOSA4NCAxODkuODY1IDg0IDE5N004NCAyMzFMODQgMzQxQzg0IDM1Ni40MTYgODAuNTk5MSAzNzUuMjAyIDkxLjY4MDYgMzg3LjcxMUMxMDEuMjE0IDM5OC40NzIgMTEyLjgyMSAzOTggMTI2IDM5OEwxNjUgMzk4TDM1MiAzOThMMzg3IDM5OEM0MDAuMTc5IDM5OCA0MTEuNzg2IDM5OC40NzIgNDIxLjMxOSAzODcuNzExQzQzMi40MDEgMzc1LjIwMiA0MjkgMzU2LjQxNiA0MjkgMzQxTDQyOSAyMzFMMjc0IDIzMUMyNzQgMjM5LjUxNSAyNzYuMzI1IDI1Mi4wOTkgMjcyLjkxIDI2MEMyNjcuNTI3IDI3Mi40NTYgMjUwLjg4MyAyNzQuODI5IDI0My40ODMgMjYyLjk2QzIzNy45MTIgMjU0LjAyNSAyNDAgMjQxLjA0MSAyNDAgMjMxTDg0IDIzMXoiCiAgICAgaWQ9InBhdGg2IiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2U6bm9uZSIKICAgICBkPSJNMzEzIDI3Ny40MjRDMzA5LjkyNSAyNzcuODI5IDMwNS4zODkgMjc3LjU0MSAzMDQuMzE4IDI4MS4xNDhDMzAyLjU5OSAyODYuOTM5IDMwNCAyOTQuOTc5IDMwNCAzMDFDMzA0IDMxMy4zNzQgMzAzLjM3OSAzMjUuNzE5IDMwMy4wNSAzMzguMDlDMzAyLjkxMSAzNDMuMzM2IDMwMS4xOSAzNTMuMTY5IDMwNC4wMjggMzU3Ljc2OUMzMDYuNDI1IDM2MS42NTMgMzE0LjE4NiAzNjEuMzA0IDMxOC4xNjUgMzYwLjU2NUMzMjYuNzEgMzU4Ljk3OCAzMjQgMzQ2LjM5NiAzMjQgMzQwQzMyNCAzMjYuMDAyIDMyMy44NiAzMTEuOTk3IDMyNC4wMDQgMjk4QzMyNC4wNTcgMjkyLjg2OCAzMjYuMDczIDI4NC45MTcgMzIzLjU1MiAyODAuMjI4QzMyMS41MDIgMjc2LjQxNyAzMTYuNjIyIDI3Ni45NDcgMzEzIDI3Ny40MjRNMzMyLjE0OCAyNzcuOTkyQzMyNi40NTIgMjc5Ljk5OSAzMjkgMjk1LjEzMyAzMjkgMzAwTDMyOSAzNDJDMzI5IDM0Ni41MDMgMzI3LjQyOSAzNTQuNzg3IDMzMC4wMjggMzU4LjY4MkMzMzIuMzg2IDM2Mi4yMTcgMzQyLjUzNyAzNjEuODMgMzQ2LjEgMzYwLjMxNkMzNTIuNiAzNTcuNTU1IDM0OS44NTcgMzQyLjY5MSAzNDkuODU5IDMzN0MzNDkuODYzIDMyMy41MzUgMzQ5LjY0IDMxMC4wNCAzNDkuODYxIDI5Ni41NzZDMzQ5LjkzMiAyOTIuMjYzIDM1MS41NzYgMjgzLjE1NyAzNDguOTcyIDI3OS41MTRDMzQ2LjM3IDI3NS44NzMgMzM1Ljg5NCAyNzYuNjczIDMzMi4xNDggMjc3Ljk5Mk0xNjIuMDgzIDI4MS4wNzhDMTU2Ljg0OCAyODQuMzY2IDE1OS4xODggMjk3LjAyNCAxNTkuMTQyIDMwMi40MjRDMTU5LjAyNCAzMTYuMTQxIDE1OS4yNjUgMzI5Ljg1OSAxNTkuMTU0IDM0My41NzZDMTU5LjExNiAzNDguMzQ2IDE1Ny41NjkgMzU2LjMzMiAxNTkuNjA0IDM2MC43MjJDMTYxLjYyIDM2NS4wNyAxNzMuOTE4IDM2NC44MzIgMTc3LjQ4NiAzNjIuNjY1QzE4Mi4xNTIgMzU5LjgzMSAxODAgMzQ1LjY4NSAxODAgMzQxTDE4MCAzMDFDMTgwIDI5NS44NTUgMTgxLjQ4MyAyODcuOTI2IDE3OS4zOTcgMjgzLjE0OEMxNzcuNDU2IDI3OC43MDQgMTY1Ljc0NiAyNzguNzc3IDE2Mi4wODMgMjgxLjA3OE0xODkuOTMgMjgwLjYyNkMxODIuMTUgMjgyLjg1NiAxODUgMjk2Ljc3OSAxODUgMzAzQzE4NSAzMTYuOTc5IDE4NS40MTEgMzMxLjAyOCAxODQuOTY1IDM0NUMxODQuODE2IDM0OS42MzYgMTgyLjkwNCAzNTcuNjAyIDE4NS45NDIgMzYxLjU2NkMxODguOTc1IDM2NS41MjUgMTk3Ljc4MSAzNjMuOTg2IDIwMS44ODcgMzYyLjY5N0MyMDguMDUyIDM2MC43NjEgMjA1LjQ5NyAzNDUuMTUgMjA1LjQzIDM0MC4wMDRDMjA1LjI1MiAzMjYuMzc1IDIwNiAzMTIuNjUxIDIwNiAyOTlDMjA2IDI5NC43MDQgMjA3LjQ0NyAyODcuMDQ4IDIwNC45NzIgMjgzLjMxN0MyMDIuNjEgMjc5Ljc1NSAxOTMuNjggMjc5LjU1MSAxODkuOTMgMjgwLjYyNk0yMTYuMzE4IDMwNi4wMjhDMjEzLjk3NyAzMDcuNTkgMjE0LjA5MSAzMTAuNTA3IDIxMy45OTEgMzEzQzIxMy43ODEgMzE4LjIyNSAyMTAuNzQxIDMyOS42NCAyMTcuMTQ0IDMzMi4zOTdDMjIxLjk1NCAzMzQuNDY3IDIyOS44MzIgMzMzIDIzNSAzMzNMMjc2IDMzM0MyODAuOTM0IDMzMyAyOTAuNDM1IDMzNC44MDYgMjk0LjY4MiAzMzEuOTcyQzI5OC44NzUgMzI5LjE3NCAyOTcuNjExIDMxNS41NTMgMjk3LjE3NyAzMTEuMDE1QzI5Ni45OCAzMDguOTY3IDI5Ni43MDkgMzA2Ljc3MyAyOTQuNjgyIDMwNS43NDJDMjkwLjE2OCAzMDMuNDQ2IDI4MS45NjEgMzA1IDI3NyAzMDVMMjM1IDMwNUMyMzAuMDY2IDMwNSAyMjAuNTY1IDMwMy4xOTQgMjE2LjMxOCAzMDYuMDI4eiIKICAgICBpZD0icGF0aDgiIC8+Cjwvc3ZnPg=='),
(10, 'Dev perso', 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiIHZpZXdCb3g9IjAgMCA1MDAgNTAwIiB2ZXJzaW9uPSIxLjEiPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2U6bm9uZTtvcGFjaXR5OjAiCiAgICAgZD0iTTAgMEwwIDUwMEw1MDAgNTAwTDUwMCAwTDAgMHoiCiAgICAgaWQ9InBhdGgyIiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2U6bm9uZSIKICAgICBkPSJNMjQ4IDU4LjQyNDRDMjI1LjY2NiA2MS4zNjQgMjA2LjQzNCA3NS4yMzU3IDIwMC42MSA5OEMxOTEuNjgzIDEzMi44ODkgMjIxLjA2OCAxNzAuNTEgMjU4IDE2NS43MTFDMjc4LjUwMSAxNjMuMDQ2IDI5Ny40MTMgMTUwLjIyIDMwNC4xNTQgMTMwQzMxNi4yMDYgOTMuODUxIDI4Ny4yOTUgNTMuMjUyMyAyNDggNTguNDI0NE0xODEgMzMxQzE4MC43NTkgMzQyLjMzIDE3Mi45NDcgMzQ4Ljg4MyAxNjQgMzU0Ljc3MkMxNTAuMjU2IDM2My44MTggMTM1LjY0IDM3MS4zNSAxMjEuODMgMzgwLjI5M0MxMTMuMDY2IDM4NS45NjkgMTA0LjA2IDM5MS44MTEgOTcuNjk4MyA0MDAuM0M4OS4xOTE3IDQxMS42NTMgODguNDg2NSA0MjkuOTQ2IDk4LjUxNDcgNDQwLjU2QzEwNC41NTkgNDQ2Ljk1OCAxMTIuNjI1IDQ0OS45NjggMTIxIDQ1MS44OEMxMzAuNjg4IDQ1NC4wOTIgMTQwLjEyMyA0NTQgMTUwIDQ1NEwxOTUgNDU0QzE5Mi41MTYgNDUwLjA5NyAxODguMDc4IDQ0Ny43OCAxODQuODg4IDQ0NC4zODVDMTc4LjkyNCA0MzguMDM2IDE3NS40MzEgNDMwLjYzMiAxNzQuMzA0IDQyMkMxNzEuNiA0MDEuMjk5IDE5Mi40IDM4Ny44NjMgMjA5IDM4MS44MjNDMjI1LjUzNSAzNzUuODA4IDI0Mi41MzkgMzcyLjUwNSAyNjAgMzcwLjgzQzI2Ni42NDMgMzcwLjE5MyAyNzMuMjgxIDM2OC4yNzYgMjgwIDM2OS4yMDlDMjk0LjExNiAzNzEuMTcxIDMwOC4yNTYgMzc3LjI1IDMyMiAzODFDMzE0LjgxNSAzODQuMDkxIDMwNy41NzggMzg0LjI1MyAzMDAgMzg1LjQzOUMyODQuNTcgMzg3Ljg1NSAyNjguMTE1IDM4OS42NjggMjUzIDM5My4zNzRDMjM3LjY2NiAzOTcuMTM0IDIxOC40NDcgMzk4LjMyNiAyMDYuMTg0IDQwOS40NzhDMTkzLjU4MSA0MjAuOTQgMTk4LjY3MiA0NDQuNTY0IDIxNC4wOSA0NTAuODg1QzIyOS41MDcgNDU3LjIwNiAyNDkuNjM4IDQ1NCAyNjYgNDU0QzMwMC44OCA0NTQgMzM2LjMzNCA0NTUuODc5IDM3MSA0NTIuMTY2QzM4Ni42MDIgNDUwLjQ5NSA0MTAuNjUzIDQ0Ni41NjkgNDE0LjYxIDQyOEM0MTkuNjI5IDQwNC40NTMgNDAyLjE0NiAzOTAuNTIyIDM4NS4wMzUgMzc4LjgyNkMzNzQuMTg5IDM3MS40MTEgMzYzLjM0OSAzNjQuMDk4IDM1MiAzNTcuNDQ5QzM0MS41MzIgMzUxLjMxNyAzMjUuMzM4IDM0NC45NjggMzI1IDMzMUMzMzMuNTgyIDMzMy4yMiAzNDIuNDQyIDMzNC4yMiAzNTEgMzM2LjU5NEMzNjMuNDk1IDM0MC4wNjEgMzc1LjE0OCAzNDYuNDc0IDM4Ni45NiAzMzcuNjk2QzM5Ni40ODQgMzMwLjYxOCAzOTcuNzQ4IDMxNy42OTUgMzk0LjAzNSAzMDdDMzg1LjM2NSAyODIuMDIzIDM3Ni44ODcgMjU2Ljg5MyAzNjcuOTM5IDIzMkMzNjMuNzkzIDIyMC40NjUgMzYwLjgyNiAyMDYuNTI2IDM1Mi42OTYgMTk3LjAwNEMzNDUuMzkzIDE4OC40NTEgMzM2Ljg3NiAxODYuNzY3IDMyNyAxODIuODA2QzMwNC4zNzEgMTczLjcyOCAyNzguNDQ0IDE2OC4yNTUgMjU0IDE2OC4wMDRDMjI4LjgzMyAxNjcuNzQ1IDIwMS4yNzEgMTczLjUgMTc4IDE4Mi44MDZDMTY4LjcxMyAxODYuNTE5IDE2MC4zMzIgMTg3Ljk2MiAxNTMuMzc5IDE5Ni4wMjVDMTQ0LjUzOCAyMDYuMjc5IDE0Mi4wNDYgMjIxLjU0OCAxMzcuNjA5IDIzNEMxMzEuNzAxIDI1MC41NzggMTI2LjQ4MiAyNjcuNDUyIDEyMC40NTYgMjg0QzExNy4yMTkgMjkyLjg5IDExMy4xNzQgMzAxLjgzMSAxMTAuNzY0IDMxMUMxMDcuOTg0IDMyMS41NzQgMTExLjQ2OCAzMzIuNDk4IDEyMC41NzYgMzM4Ljc3NUMxMzEuNTkyIDM0Ni4zNjcgMTQzLjYwOSAzMzkuNjIyIDE1NSAzMzYuNjA1QzE2My41NzIgMzM0LjMzNSAxNzIuNDE1IDMzMy4yMjEgMTgxIDMzMXoiCiAgICAgaWQ9InBhdGg0IiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2IzYjNiMztzdHJva2U6bm9uZSIKICAgICBkPSJNMjE4IDI3MUMyMjYuOTA2IDI2MS4xNTQgMjMwLjcyNiAyNDYuNjYgMjM4LjcyNSAyMzUuOTExQzI0MS41MiAyMzIuMTU2IDI0NC42MSAyMjcuOTkyIDI0OS4wMDEgMjI1Ljk4OEMyNTUuNTM1IDIyMy4wMDYgMjYxLjA4IDIyOC4yNTkgMjY0Ljg2OSAyMzMuMDM5QzI3NC4xMjEgMjQ0LjcxMyAyODIuMTM2IDI1OS4zMjUgMjg4IDI3M0MyODkuNjAzIDI2Ny41ODEgMjg2LjU4NCAyNTguNDI5IDI4NS4wMzkgMjUzQzI4MC45OTcgMjM4LjgwMiAyNzguMDMxIDIyMy40IDI2OC43MSAyMTEuNDI0QzI2NC45NzkgMjA2LjYzMSAyNTguNjM4IDIwMC44MDMgMjUyIDIwMS40ODRDMjQzLjk1MyAyMDIuMzA5IDIzOC4xOTEgMjA5LjU4MSAyMzQuMzgzIDIxNi4wMTVDMjI1LjMyNyAyMzEuMzEyIDIxOC4xNDggMjUzLjExIDIxOCAyNzFNMjE3LjMzMyAyNzIuNjY3QzIxNy4yNzggMjcyLjcyMiAyMTcuMjIyIDI3My43NzggMjE3LjY2NyAyNzMuMzMzQzIxNy43MjIgMjczLjI3OCAyMTcuNzc4IDI3Mi4yMjIgMjE3LjMzMyAyNzIuNjY3eiIKICAgICBpZD0icGF0aDYiIC8+Cjwvc3ZnPg==');

-- --------------------------------------------------------

--
-- Structure de la table `Titles`
--

CREATE TABLE `Titles` (
  `ID` int(11) NOT NULL,
  `Title` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Translations` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `AchievementsCondition` smallint(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `Titles`
--

INSERT INTO `Titles` (`ID`, `Title`, `Translations`, `AchievementsCondition`) VALUES
(1, 'Intrépide', '{\"en\": \"Fearless\" }', 4),
(2, 'L\'alpha et l\'omega', '{\"en\": \"Alpha and Omega\" }', 5),
(3, 'Hercules', '{\"en\": \"Hercules\" }', 6),
(4, 'Joueur', '{\"en\": \"Player \"}', 0),
(5, 'Soldat de l\'ombre', '{\"en\": \"Shadow\"}', 0),
(6, 'Chasseur de rang E ', '{\"en\": \"E rank hunter\"}', 0),
(7, 'Chasseur de rang D ', '{\"en\": \"D rank hunter\"}', 7),
(8, 'Chasseur de rang C', '{\"en\": \"C rank hunter\"}', 8),
(9, 'Chasseur de rang B', '{\"en\": \"B rank hunter\"}', 9),
(10, 'Chasseur de rang A', '{\"en\": \"A rank hunter\"}', 10),
(11, 'Chasseur de rang S ', '{\"en\": \"S rank hunter\"}', 11),
(12, 'Chasseur de rang Nation', '{\"en\": \"National level hunter\"}', 12),
(13, 'Monarque', '{\"en\": \"Monarch\"}', 13),
(14, 'Dirigeant', '{\"en\": \"Ruler\"}', 13),
(15, 'Beta Player', '{\"en\": \"Beta Player\"}', 14),
(16, 'Beater', '{\"en\": \"Beater\"}', 15),
(17, 'Master Mind', '{\"en\": \"Master Mind\"}', 2);

-- --------------------------------------------------------

--
-- Structure de la table `Users`
--

CREATE TABLE `Users` (
  `ID` int(11) NOT NULL,
  `Username` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(320) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Title` smallint(6) NOT NULL,
  `Banned` tinyint(1) NOT NULL DEFAULT 0,
  `Devices` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DevicesWait` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DevicesBlacklist` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `XP` int(11) NOT NULL,
  `Data` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `SolvedAchievements` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
  `LastPseudoDate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `FirstConnDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `LastConnDate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `Users`
--

INSERT INTO `Users` (`ID`, `Username`, `Email`, `Title`, `Banned`, `Devices`, `DevicesWait`, `DevicesBlacklist`, `XP`, `Data`, `SolvedAchievements`, `LastPseudoDate`, `FirstConnDate`, `LastConnDate`) VALUES
(1, 'Geremtedt', 'Geremy.lecaplain66@gmail.com', 0, 0, '37', '', '', 0, '{\"lang\":\"fr\",\"birth\":\"\",\"email\":\"geremy.lecaplain66@gmail.com\",\"xp\":0,\"activities\":[],\"pseudoDate\":\"2021-09-05T11:02:58.989Z\"}', '16', '2021-09-05 11:02:58', '2021-08-14 01:50:24', '2021-09-05 11:27:42'),
(2, 'Madar', 'Pierre.marsaa@icloud.com', 2, 0, '36,38', '', '', 1581, '{\"lang\":\"fr\",\"birth\":\"2000/05/24\",\"email\":\"Pierre.marsaa@icloud.com\",\"xp\":1581,\"activities\":[{\"skillID\":\"1\",\"startDate\":\"Tue Aug 24 2021 17:45:00 GMT+0200 (CEST)\",\"duration\":60},{\"skillID\":\"1\",\"startDate\":\"Wed Aug 25 2021 20:15:00 GMT+0200 (CEST)\",\"duration\":60},{\"skillID\":\"5\",\"startDate\":\"Wed Aug 25 2021 23:00:00 GMT+0200 (CEST)\",\"duration\":60},{\"skillID\":\"57\",\"startDate\":\"Thu Aug 26 2021 07:00:00 GMT+0200 (CEST)\",\"duration\":60},{\"skillID\":\"32\",\"startDate\":\"Thu Aug 26 2021 18:00:00 GMT+0200 (CEST)\",\"duration\":45},{\"skillID\":\"39\",\"startDate\":\"Thu Aug 26 2021 20:00:00 GMT+0200 (CEST)\",\"duration\":60},{\"skillID\":\"63\",\"startDate\":\"Thu Aug 26 2021 23:45:00 GMT+0200 (CEST)\",\"duration\":105},{\"skillID\":\"36\",\"startDate\":\"Fri Aug 27 2021 11:00:00 GMT+0200 (CEST)\",\"duration\":60},{\"skillID\":\"39\",\"startDate\":\"Sat Aug 28 2021 19:30:00 GMT+0200 (CEST)\",\"duration\":120},{\"skillID\":\"35\",\"startDate\":\"Mon Aug 30 2021 06:45:00 GMT+0200 (CEST)\",\"duration\":60},{\"skillID\":\"55\",\"startDate\":\"Mon Aug 30 2021 10:00:00 GMT+0200 (CEST)\",\"duration\":60},{\"skillID\":\"45\",\"startDate\":\"Mon Aug 30 2021 13:30:00 GMT+0200 (CEST)\",\"duration\":60},{\"skillID\":\"55\",\"startDate\":\"Mon Aug 30 2021 16:15:00 GMT+0200 (CEST)\",\"duration\":60},{\"skillID\":\"72\",\"startDate\":\"Sat Sep 04 2021 19:15:00 GMT+0200 (CEST)\",\"duration\":60}],\"pseudoDate\":\"2021-08-31T15:26:11.365Z\"}', '5,4', '2021-08-31 15:26:11', '2021-08-27 09:12:21', '2021-09-05 10:28:04'),
(3, 'Komorashu', 'samuelcarpentier2115@outlook.fr', 0, 0, '', '', '', 0, '', '14,15', '0000-00-00 00:00:00', '2021-09-02 08:39:20', '0000-00-00 00:00:00'),
(4, 'Calhan', 'JonathanCalvino10@gmail.com', 0, 0, '', '', '', 0, '', '14,15', '0000-00-00 00:00:00', '2021-09-02 08:39:20', '0000-00-00 00:00:00'),
(5, 'Mirko', 'Mirko.25.games@gmail.com', 0, 0, '', '', '', 0, '', '14', '0000-00-00 00:00:00', '2021-09-02 08:39:21', '0000-00-00 00:00:00'),
(6, 'FishChips', 'julien.machado2001@gmail.com', 0, 0, '', '', '', 0, '', '14,15', '0000-00-00 00:00:00', '2021-09-02 08:39:21', '0000-00-00 00:00:00'),
(7, 'Mr.Niihaal', 'kevinschreck68@outlook.fr', 0, 0, '', '', '', 0, '', '14', '0000-00-00 00:00:00', '2021-09-02 08:39:21', '0000-00-00 00:00:00'),
(8, 'ubvay', 'tanguyfrancoisditcharlemagne@gmail.com', 0, 0, '', '', '', 0, '', '14', '0000-00-00 00:00:00', '2021-09-02 08:39:21', '0000-00-00 00:00:00'),
(9, 'Valamo', 'delamauryandre@gmail.com', 0, 0, '', '', '', 0, '', '14', '0000-00-00 00:00:00', '2021-09-02 08:39:22', '0000-00-00 00:00:00'),
(10, 'StarFireXY', 'thomasxyoutub@gmail.com', 0, 0, '', '', '', 0, '', '14', '0000-00-00 00:00:00', '2021-09-02 08:39:22', '0000-00-00 00:00:00'),
(11, 'Kuro', 'kcadignan@gmail.com', 0, 0, '', '', '', 0, '', '14', '0000-00-00 00:00:00', '2021-09-02 08:39:22', '0000-00-00 00:00:00'),
(12, 'Piro', 'Reant.pascal@hotmail.fr', 0, 0, '', '', '', 0, '', '14', '0000-00-00 00:00:00', '2021-09-02 08:39:23', '0000-00-00 00:00:00'),
(13, 'Mordem', 'mordemparadox@gmail.com', 0, 0, '', '', '', 0, '', '14', '0000-00-00 00:00:00', '2021-09-02 08:39:23', '0000-00-00 00:00:00'),
(14, 'Sajira', 'cloecristol@gmail.com', 0, 0, '', '', '', 0, '', '14', '0000-00-00 00:00:00', '2021-09-02 08:39:24', '0000-00-00 00:00:00'),
(15, 'Noach', 'francoisdumon5@gmail.com', 0, 0, '', '', '', 0, '', '14', '0000-00-00 00:00:00', '2021-09-02 08:39:24', '0000-00-00 00:00:00'),
(16, 'Vulcain', 'ricyl74@gmail.com', 0, 0, '', '', '', 0, '', '14', '0000-00-00 00:00:00', '2021-09-02 08:39:24', '0000-00-00 00:00:00'),
(17, 'Félix Asderell', 'antoine.45.jeux@gmail.com', 0, 0, '', '', '', 0, '', '14', '0000-00-00 00:00:00', '2021-09-02 08:42:12', '0000-00-00 00:00:00'),
(18, 'Frenchaxe', 'leo.crafteam@gmail.com', 0, 0, '', '', '', 0, '', '14', '0000-00-00 00:00:00', '2021-09-02 08:42:12', '0000-00-00 00:00:00'),
(19, 'BeBen', 'trvrsbenjamin@gmail.com', 0, 0, '', '', '', 0, '', '14', '0000-00-00 00:00:00', '2021-09-02 08:42:13', '0000-00-00 00:00:00'),
(33, '', 'katanarise@hotmail.com', 0, 0, '', '39', '', 0, '', '', '0000-00-00 00:00:00', '2021-09-05 10:33:32', '2021-09-05 10:33:32'),
(34, 'Irnai', 'irnaivip@gmail.com', 0, 0, '', '', '', 0, '', '', '0000-00-00 00:00:00', '2021-09-05 10:42:48', '0000-00-00 00:00:00'),
(35, '', 'jafonthe@hotmail.fr', 0, 0, '', '39', '', 0, '', '', '0000-00-00 00:00:00', '2021-09-05 10:57:26', '2021-09-05 10:57:26');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Achievements`
--
ALTER TABLE `Achievements`
  ADD PRIMARY KEY (`ID`);

--
-- Index pour la table `Beta`
--
ALTER TABLE `Beta`
  ADD PRIMARY KEY (`ID`);

--
-- Index pour la table `Categories`
--
ALTER TABLE `Categories`
  ADD PRIMARY KEY (`ID`);

--
-- Index pour la table `Devices`
--
ALTER TABLE `Devices`
  ADD PRIMARY KEY (`ID`);

--
-- Index pour la table `Helpers`
--
ALTER TABLE `Helpers`
  ADD PRIMARY KEY (`ID`);

--
-- Index pour la table `Quotes`
--
ALTER TABLE `Quotes`
  ADD PRIMARY KEY (`ID`);

--
-- Index pour la table `Skills`
--
ALTER TABLE `Skills`
  ADD PRIMARY KEY (`ID`);

--
-- Index pour la table `SkillsIcon`
--
ALTER TABLE `SkillsIcon`
  ADD PRIMARY KEY (`ID`);

--
-- Index pour la table `Titles`
--
ALTER TABLE `Titles`
  ADD PRIMARY KEY (`ID`);

--
-- Index pour la table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `Achievements`
--
ALTER TABLE `Achievements`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `Beta`
--
ALTER TABLE `Beta`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=119;

--
-- AUTO_INCREMENT pour la table `Categories`
--
ALTER TABLE `Categories`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `Devices`
--
ALTER TABLE `Devices`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT pour la table `Helpers`
--
ALTER TABLE `Helpers`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT pour la table `Quotes`
--
ALTER TABLE `Quotes`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=151;

--
-- AUTO_INCREMENT pour la table `Skills`
--
ALTER TABLE `Skills`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

--
-- AUTO_INCREMENT pour la table `SkillsIcon`
--
ALTER TABLE `SkillsIcon`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `Titles`
--
ALTER TABLE `Titles`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT pour la table `Users`
--
ALTER TABLE `Users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
