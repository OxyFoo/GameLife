# GameLife - Guidelines

## Fonctions et variables
Tous les noms de fonctions et de variable sont en anglais et en minuscules avec une majuscule par mot à partir du second (ex: variableDeOuf) et représentent le plus précisément possible ce qu'elles font.

* Exceptions :
    - A l'exception des fonctions puliques de classes, dont le 1er mot commence également par une majuscule (ex: fonctionPrivee | FonctionPublique)
    - Constantes en début de fichier, qui sont entièrement en majuscules avec des underscores à la place des espaces

## Code
* Ne pas dépasser les 100~200 lignes par fichier
* Ne pas imbriquer les if (faire l'inverse et return, les répartir dans plusieurs fonctions, etc)
* Les fonctions doivent être concises et faire strictement ce pour quoi elles sont faites
* L'indentation est de 4 espaces
* Toujours terminer le code par une ligne vide
* Terminer les lignes par un ";" sauf les fonctions/classes

## Noms des Fichiers et classes
La 1ère lettre de chaque mot est en majuscule et le reste en minuscule.

## Imports
Les imports sont par blocs espacés par une ligne vide.
Le 1er bloc contient les libs utilisées (dans l'ordre React, ReactNative puis les autres libs)
Le 2nd bloc c'est les libs internes principales (comme l'user et les managers, ou les fichiers de backend et de styles)
Le 3eme bloc concerne tout le reste (comme les composants, les widget, les utils etc)
De manière générale les mettre dans l'ordre croissant de longueur des caractères pour améliorer la lisibilité
