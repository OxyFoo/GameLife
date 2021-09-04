-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : sam. 04 sep. 2021 à 19:50
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
(114, 'Geremy.lecaplain66@gmail.com', 0),
(115, 'Pierre.marsaa@icloud.com', 0);

-- --------------------------------------------------------

--
-- Structure de la table `Categories`
--

CREATE TABLE `Categories` (
  `ID` int(11) NOT NULL,
  `Name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Translations` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Logo` varchar(8192) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `Categories`
--

INSERT INTO `Categories` (`ID`, `Name`, `Translations`, `Logo`) VALUES
(1, 'Sport', '{\"en\": \"Sport\", \"es\": \"Deporte\"}', ''),
(2, 'Musique', '{\"en\": \"Music\"}', ''),
(3, 'Informatique', '{\"en\": \"Computer work\"}', ''),
(4, 'Travaux manuels', '{\"en\": \"Crafts\"}', ''),
(5, 'Savoir', '{\"en\": \"Knowledge\"}', ''),
(6, 'Tâches maison', '{\"en\": \"Household chores\"}', ''),
(7, 'Jeu de réflexion', '{\"en\": \"Puzzle games\"}', ''),
(8, 'Art', '{\"en\": \"Art\"}', ''),
(9, 'Métier (Physique)', '{\"en\": \"Physical job\"}', ''),
(10, 'Développement personnel', '{\"en\": \"Personal development\"}', ''),
(11, 'Animaux', '{\"en\": \"Pet\"}', '');

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
(38, '$2y$10$znJE4hh5qQANEDOVERXN9uUizSejOPLQVCoevnMps8SRHWQe5i5dK', 'iPhone de Pierre', '', '2021-09-04 17:25:03', '0000-00-00 00:00:00');

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
(136, 'en', '20 minutes of doing something is more valuable than 20 hours of thinking about doing something. ', 'Unknown');

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
  `Logo` varchar(8192) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Creator` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `Skills`
--

INSERT INTO `Skills` (`ID`, `Name`, `Translations`, `CategoryID`, `Wisdom`, `Intelligence`, `Confidence`, `Strength`, `Stamina`, `Dexterity`, `Agility`, `Logo`, `Creator`) VALUES
(1, 'Corde à sauter', '{\"en\": \"Jumping rope\", \"es\": \"Cuerda de saltar\"}', 1, 0, 0, 1, 0, 4, 1, 1, '', 'Lucas Pouchele'),
(2, 'Accrobranche', '{\"en\": \"Tree climbing\"}', 1, 0, 0, 1, 2, 1, 1, 2, '', 'Ubavy'),
(3, 'Volleyball', '{\"en\": \"Volleyball\"}', 1, 0, 0, 1, 1, 2, 3, 0, '', 'Hinata Shoyo'),
(4, 'Teakwondo', '{\"en\": \"Taekwondo\"}', 1, 0, 0, 1, 3, 1, 0, 2, '', ''),
(5, 'Musculation (poids de corps)', '{\"en\": \"Calisthenics\"}', 1, 0, 0, 1, 3, 3, 0, 0, '', 'Mirko'),
(6, 'Lecture', '{\"en\": \"Reading\"}', 5, 2, 4, 1, 0, 0, 0, 0, '', ''),
(7, 'Via-Ferrata', '{\"en\": \"Via-Ferrata\"}', 1, 0, 0, 1, 3, 2, 0, 1, '', ''),
(8, 'Natation', '{\"en\": \"Swimming\"}', 1, 0, 0, 1, 3, 3, 0, 0, '', ''),
(9, 'Ecriture (d\'histoire)', '{\"en\": \"Story writing\"}', 8, 2, 3, 1, 0, 0, 1, 0, '', ''),
(10, 'Dessin', '{\"en\": \"Drawing\"}', 8, 0, 1, 1, 0, 0, 5, 0, '', ''),
(11, 'Musculation (salle)', '{\"en\": \"Musculation\"}', 1, 0, 0, 1, 4, 2, 0, 0, '', 'StarFireXY'),
(12, 'Danse', '{\"en\": \"Dance\"}', 1, 0, 0, 1, 0, 3, 0, 3, '', ''),
(13, 'Scoutisme', '{\"en\": \"Scouting\"}', 10, 3, 3, 1, 0, 0, 0, 0, '', ''),
(14, 'Marche', '{\"en\": \"Walk\"}', 1, 0, 0, 1, 0, 6, 0, 0, '', ''),
(15, 'Travail Scolaire', '{\"en\": \"School work\"}', 5, 0, 6, 1, 0, 0, 0, 0, '', ''),
(16, 'Piano', '{\"en\": \"Piano\"}', 2, 0, 1, 1, 0, 0, 5, 0, '', ''),
(17, 'Bricolage', '{\"en\": \"Handiwork\"}', 4, 0, 3, 1, 2, 0, 1, 0, '', ''),
(18, 'Modélisation 3D', '{\"en\": \"3D Modeling\"}', 3, 0, 6, 1, 0, 0, 0, 0, '', ''),
(19, 'Violon', '{\"en\": \"Violon\"}', 2, 0, 2, 1, 0, 0, 4, 0, '', ''),
(20, 'Cuisine', '{\"en\": \"Cooking\"}', 6, 0, 2, 1, 0, 0, 4, 0, '', 'Evounn'),
(21, 'Ménage', '{\"en\": \"Household\"}', 6, 0, 0, 1, 0, 4, 0, 2, '', ''),
(22, 'Puzzle', '{\"en\": \"Jigsaw puzzle\"}', 7, 1, 5, 1, 0, 0, 0, 0, '', ''),
(23, 'Rubiks Cube', '{\"en\": \"Rubiks Cube\"}', 7, 1, 5, 1, 0, 0, 0, 0, '', 'Gerem'),
(25, 'Peinture', '{\"en\": \"Painting\"}', 8, 1, 3, 1, 0, 0, 2, 0, '', ''),
(26, 'Basketball', '{\"en\": \"Basketball\"}', 1, 0, 1, 1, 1, 2, 1, 1, '', 'Noach'),
(27, 'Course', '{\"en\": \"Run\"}', 1, 0, 0, 1, 0, 6, 0, 0, '', ''),
(28, 'Vélo', '{\"en\": \"Bike\"}', 1, 0, 0, 1, 0, 6, 0, 0, '', ''),
(29, 'Ultimate', '{\"en\": \"Ultimate\"}', 1, 0, 0, 1, 0, 3, 1, 2, '', ''),
(30, 'Trail', '{\"en\": \"Trail\"}', 1, 0, 1, 1, 0, 4, 0, 1, '', ''),
(31, 'Combat', '{\"en\": \"Fight\"}', 1, 0, 1, 1, 2, 2, 0, 1, '', ''),
(32, 'Sport freestyle', '{\"en\": \"Freestyle sport\"}', 1, 0, 0, 1, 0, 3, 0, 3, '', ''),
(33, 'Escrime', '{\"en\": \"Fencing\"}', 1, 0, 1, 1, 0, 2, 1, 2, '', ''),
(34, 'Boxe', '{\"en\": \"Boxing\"}', 1, 0, 0, 1, 2, 2, 0, 2, '', ''),
(35, 'Hacking', '{\"en\": \"Hacking\"}', 3, 0, 4, 1, 0, 0, 2, 0, '', ''),
(36, 'Méditation', '{\"en\": \"Meditation\"}', 10, 6, 0, 1, 0, 0, 0, 0, '', 'Komorashu'),
(37, 'Surf', '{\"en\": \"Surfing\"}', 1, 0, 1, 1, 1, 2, 0, 2, '', ''),
(38, 'Skateboad', '{\"en\": \"Skateboarding\"}', 1, 0, 1, 1, 1, 2, 0, 2, '', ''),
(39, 'Apprentissage langue', '{\"en\": \"Language learning\"}', 5, 0, 6, 1, 0, 0, 0, 0, '', ''),
(40, 'Judo', '{\"en\": \"Judo\"}', 1, 0, 0, 1, 2, 2, 0, 2, '', 'Marion'),
(41, 'Aïkido', '{\"en\": \"Aikido\"}', 1, 0, 1, 1, 0, 2, 2, 1, '', ''),
(42, 'Tricot / Couture', '{\"en\": \"Knitting / Sewing\"}', 4, 0, 0, 1, 0, 0, 6, 0, '', ''),
(43, 'Chant', '{\"en\": \"Singing\"}', 2, 0, 6, 1, 0, 0, 0, 0, '', ''),
(44, 'Escalade', '{\"en\": \"Climbing\"}', 1, 0, 0, 1, 2, 2, 0, 2, '', ''),
(45, 'Lutte', '{\"en\": \"Wrestling\"}', 1, 0, 0, 1, 2, 2, 0, 2, '', ''),
(46, 'Equitation', '{\"en\": \"Horseback riding\"}', 1, 0, 1, 1, 0, 3, 2, 0, '', ''),
(47, 'Shadow Boxing', '{\"en\": \"Shadow Boxing\"}', 1, 0, 0, 1, 2, 4, 0, 0, '', 'Vulcain'),
(48, 'Mécanique', '{\"en\": \"mechanic\"}', 4, 0, 2, 1, 1, 0, 3, 0, '', ''),
(49, 'Yoga', '{\"en\": \"Yoga\"}', 1, 2, 0, 1, 0, 0, 0, 4, '', ''),
(50, 'Football', '{\"en\": \"Soccer\"}', 1, 0, 1, 1, 1, 2, 0, 2, '', ''),
(51, 'Gymnastique', '{\"en\": \"Gymnastics\"}', 1, 0, 0, 1, 1, 1, 2, 2, '', ''),
(52, 'Tennis', '{\"en\": \"Tennis\"}', 1, 0, 1, 1, 1, 2, 1, 1, '', ''),
(53, 'Rugby', '{\"en\": \"Rugby\"}', 1, 0, 1, 1, 2, 2, 1, 0, '', ''),
(54, 'Trampoline', '{\"en\": \"Trampoline\"}', 1, 0, 0, 1, 0, 2, 0, 4, '', ''),
(55, 'Production musicale', '{\"en\": \"Music production\"}', 2, 0, 6, 1, 0, 0, 0, 0, '', ''),
(56, 'Tir (précision)', '{\"en\": \"Precision shooting\"}', 1, 0, 1, 1, 0, 0, 5, 0, '', 'Mordem'),
(57, 'Jardinage', '{\"en\": \"Gardening\"}', 6, 0, 1, 1, 2, 2, 1, 0, '', ''),
(58, 'Sprint', '{\"en\": \"Sprinting\"}', 1, 0, 0, 1, 5, 1, 0, 0, '', 'Frenchaxe'),
(59, 'Maitrise arme (baton, lance, épé', 'Weapon control (stick, lance, sword)', 1, 0, 0, 1, 0, 0, 3, 3, '', ''),
(60, 'Pen Spinning', '{\"en\": \"Pen spinning\"}', 8, 0, 0, 1, 0, 0, 6, 0, '', ''),
(61, 'Création artistique', '{\"en\": \"Artistic creation\"}', 8, 2, 4, 1, 0, 0, 0, 0, '', ''),
(62, 'Promener animal', '{\"en\": \"Pet walking\"}', 11, 0, 0, 1, 0, 0, 6, 0, '', ''),
(63, 'S\'occuper d\'enfants', '{\"en\": \"Childcare\"}', 6, 1, 3, 1, 0, 2, 0, 0, '', ''),
(64, 'Musée, galerie', '{\"en\": \"Museum, gallery\"}', 8, 0, 6, 1, 0, 0, 0, 0, '', ''),
(65, 'Casse-tête', '{\"en\": \"Puzzle\"}', 7, 1, 5, 1, 0, 0, 0, 0, '', ''),
(66, 'Mixologie', '{\"en\": \"Mixology\"}', 4, 0, 3, 1, 0, 0, 3, 0, '', 'FishChips'),
(67, 'Roller', '{\"en\": \"Roller\"}', 1, 0, 0, 1, 2, 3, 0, 1, '', 'Mr.Niihaal'),
(68, 'VTT free-ride', '{\"en\": \"Free-ride bike\"}', 1, 0, 0, 1, 0, 5, 1, 0, '', 'Valamo'),
(69, 'Muay thai', '{\"en\": \"Muay thai\"}', 1, 0, 0, 1, 3, 2, 0, 1, '', 'Kuro'),
(70, 'Football Americain', '{\"en\": \"Football\"}', 1, 0, 0, 1, 2, 3, 0, 1, '', 'Eyeshield 21'),
(71, 'Jeune Sapeur Pompiers', '{\"en\": \"Young firefighter\"}', 9, 0, 1, 1, 1, 2, 0, 2, '', 'alixloulou68@gmail.com'),
(72, 'Programmation', '{\"en\": \"Coding\"}', 3, 0, 4, 1, 0, 0, 2, 0, '', 'Calhan'),
(73, 'Guitare', '{\"en\": \"Guitare\"}', 2, 0, 1, 1, 0, 0, 5, 0, '', ''),
(74, 'Discours', '{\"en\": \"Speech\"}', 5, 0, 6, 1, 0, 0, 0, 0, '', 'Félix Asderell'),
(77, 'Forgeron', '{\"en\": \"Blacksmith\"}', 9, 0, 1, 1, 3, 2, 0, 0, '', 'Piro'),
(78, 'Pétanque', '{\"en\": \"Petanque\"}', 1, 0, 2, 1, 1, 0, 3, 0, '', ''),
(79, 'Plongée sous marine', '{\"en\": \"Scuba Diving\"}', 1, 0, 0, 1, 0, 4, 0, 2, '', ''),
(80, 'Voile', '{\"en\": \"Sailing\"}', 1, 0, 2, 1, 2, 2, 0, 0, '', ''),
(81, 'Randonnee', '{\"en\": \"Hike\"}', 1, 0, 0, 1, 0, 5, 0, 1, '', ''),
(82, 'Ping pong', '{\"en\": \"Table tennis\"}', 1, 0, 2, 1, 0, 1, 2, 1, '', ''),
(83, 'Gainage', '{\"en\": \"Core building\"}', 1, 0, 0, 1, 0, 6, 0, 0, '', ''),
(84, 'Jujitsu', '{\"en\": \"Jujitsu\"}', 1, 0, 0, 1, 2, 2, 0, 2, '', ''),
(85, 'Crossfit', '{\"en\": \"Crossfit\"}', 1, 0, 0, 1, 2, 3, 0, 1, '', ''),
(86, 'Lancer de poids', '{\"en\": \"Weight throw\"}', 1, 0, 0, 1, 4, 1, 0, 1, '', ''),
(87, 'Jogging', '{\"en\": \"Jogging\"}', 1, 0, 0, 1, 0, 6, 0, 0, '', ''),
(88, 'Renforcement musculaire', '{\"en\": \"muscular reinforcement\"}', 1, 0, 0, 1, 2, 3, 0, 1, '', ''),
(89, 'Pôle dance', '{\"en\": \"Dance pole\"}', 1, 0, 0, 1, 0, 2, 2, 2, '', ''),
(90, 'Saut en hauteur', '{\"en\": \"High Jump\"}', 1, 0, 0, 1, 0, 4, 0, 2, '', ''),
(91, 'Kait surf', '{\"en\": \"Kait surfing\"}', 1, 0, 0, 1, 0, 3, 1, 2, '', ''),
(92, 'Apnée', '{\"en\": \"Apnea\"}', 1, 0, 0, 1, 0, 6, 0, 0, '', ''),
(93, 'Parkour', '{\"en\": \"Parkour\"}', 1, 0, 0, 1, 2, 2, 1, 1, '', ''),
(94, 'Kayak', '{\"en\": \"Kayak\"}', 1, 0, 0, 1, 3, 2, 0, 1, '', ''),
(95, 'Handball', '{\"en\": \"Handball\"}', 1, 0, 0, 1, 2, 2, 1, 1, '', ''),
(96, 'Badminton', '{\"en\": \"Badminton\"}', 1, 0, 1, 1, 0, 2, 2, 1, '', ''),
(97, 'Accordeon', '{\"en\": \"Accordion\"}', 2, 0, 1, 1, 0, 0, 4, 0, '', ''),
(98, 'Trombone', '{\"en\": \"Trombone\"}', 2, 0, 1, 1, 1, 1, 2, 0, '', ''),
(99, 'Solfege', '{\"en\": \"Music theory\"}', 2, 0, 6, 1, 0, 0, 0, 0, '', ''),
(100, 'Billard', '{\"en\": \"Pool\"}', 1, 0, 3, 1, 0, 0, 3, 0, '', ''),
(101, 'Echec', '{\"en\": \"Chess\"}', 7, 0, 6, 1, 0, 0, 0, 0, '', ''),
(102, 'Tour de carte', '{\"en\": \"Card trick\"}', 7, 0, 2, 1, 0, 0, 4, 0, '', ''),
(103, 'Theâtre', '{\"en\": \"Théâtre\"}', 8, 0, 4, 1, 0, 2, 0, 0, '', ''),
(104, 'Photographie', '{\"en\": \"Photography\"}', 8, 0, 5, 1, 0, 0, 1, 0, '', ''),
(105, 'Montage', '{\"en\": \"Editing\"}', 3, 0, 4, 1, 0, 1, 1, 0, '', ''),
(106, 'Dressage (animal)', '{\"en\": \"Animal training\"}', 11, 0, 2, 1, 0, 3, 0, 1, '', ''),
(107, 'Redaction', '{\"en\": \"Redaction\"}', 5, 0, 4, 1, 0, 0, 2, 0, '', ''),
(108, 'Couteau papillon', '{\"en\": \"Butterfly knife\"}', 1, 0, 0, 1, 0, 0, 6, 0, '', ''),
(109, 'Création cosplay', '{\"en\": \"Cosplay creation\"}', 8, 0, 3, 1, 0, 0, 3, 0, '', ''),
(110, 'Botanique', '{\"en\": \"Botany\"}', 6, 0, 5, 1, 0, 0, 1, 0, '', '');

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
(1, 'Testaaagg', 'Geremy.lecaplain66@gmail.com', 2, 0, '35,37', '', '', 303, '{\"firstStart\":false,\"lang\":\"fr\",\"birth\":\"2000/03/07\",\"email\":\"Geremy.lecaplain66@gmail.com\",\"xp\":303,\"activities\":[{\"skillID\":\"4\",\"startDate\":\"Wed Sep 01 2021 16:45:00 GMT+0200 (CEST)\",\"duration\":60},{\"skillID\":\"4\",\"startDate\":\"Fri Sep 03 2021 01:15:00 GMT+0200 (CEST)\",\"duration\":60},{\"skillID\":\"1\",\"startDate\":\"Fri Sep 03 2021 10:45:00 GMT+0200 (CEST)\",\"duration\":60}],\"pseudoDate\":\"2021-09-04T12:24:25.971Z\"}', '1,2,5,16', '2021-09-04 12:24:25', '2021-08-14 01:50:24', '2021-09-04 16:59:00'),
(2, 'Madar', 'Pierre.marsaa@icloud.com', 2, 0, '36', '', '', 1494, '{\"lang\":\"fr\",\"birth\":\"2000/05/24\",\"email\":\"Pierre.marsaa@icloud.com\",\"xp\":1493.5,\"activities\":[{\"skillID\":\"1\",\"startDate\":\"Tue Aug 24 2021 17:45:00 GMT+0200 (CEST)\",\"duration\":60},{\"skillID\":\"1\",\"startDate\":\"Wed Aug 25 2021 20:15:00 GMT+0200 (CEST)\",\"duration\":60},{\"skillID\":\"5\",\"startDate\":\"Wed Aug 25 2021 23:00:00 GMT+0200 (CEST)\",\"duration\":60},{\"skillID\":\"57\",\"startDate\":\"Thu Aug 26 2021 07:00:00 GMT+0200 (CEST)\",\"duration\":60},{\"skillID\":\"32\",\"startDate\":\"Thu Aug 26 2021 18:00:00 GMT+0200 (CEST)\",\"duration\":45},{\"skillID\":\"39\",\"startDate\":\"Thu Aug 26 2021 20:00:00 GMT+0200 (CEST)\",\"duration\":60},{\"skillID\":\"63\",\"startDate\":\"Thu Aug 26 2021 23:45:00 GMT+0200 (CEST)\",\"duration\":105},{\"skillID\":\"36\",\"startDate\":\"Fri Aug 27 2021 11:00:00 GMT+0200 (CEST)\",\"duration\":60},{\"skillID\":\"39\",\"startDate\":\"Sat Aug 28 2021 19:30:00 GMT+0200 (CEST)\",\"duration\":120},{\"skillID\":\"35\",\"startDate\":\"Mon Aug 30 2021 06:45:00 GMT+0200 (CEST)\",\"duration\":60},{\"skillID\":\"55\",\"startDate\":\"Mon Aug 30 2021 10:00:00 GMT+0200 (CEST)\",\"duration\":60},{\"skillID\":\"45\",\"startDate\":\"Mon Aug 30 2021 13:30:00 GMT+0200 (CEST)\",\"duration\":60},{\"skillID\":\"55\",\"startDate\":\"Mon Aug 30 2021 16:15:00 GMT+0200 (CEST)\",\"duration\":60}],\"pseudoDate\":\"2021-08-31T15:26:11.365Z\"}', '5,4', '2021-08-31 15:26:11', '2021-08-27 09:12:21', '2021-09-04 16:28:55'),
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
(19, 'BeBen', 'trvrsbenjamin@gmail.com', 0, 0, '', '', '', 0, '', '14', '0000-00-00 00:00:00', '2021-09-02 08:42:13', '0000-00-00 00:00:00');

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
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=116;

--
-- AUTO_INCREMENT pour la table `Categories`
--
ALTER TABLE `Categories`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `Devices`
--
ALTER TABLE `Devices`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT pour la table `Helpers`
--
ALTER TABLE `Helpers`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT pour la table `Quotes`
--
ALTER TABLE `Quotes`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=150;

--
-- AUTO_INCREMENT pour la table `Skills`
--
ALTER TABLE `Skills`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- AUTO_INCREMENT pour la table `Titles`
--
ALTER TABLE `Titles`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT pour la table `Users`
--
ALTER TABLE `Users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
