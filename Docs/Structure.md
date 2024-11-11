# GameLife - Structure

## Fichiers source
| Répertoire | Fonction |
|-|-|
| `android` / `ios` | Contienent les configurations de compilation pour les 2 OS |
| `res` | Contient toutes les ressources, les icones, les fonts, les fichiers langues etc |
| `src` | Contient tous les codes sources pour la compilation de l'application |
| `src > App` | Contient le script principal, qui gère le chargement de l'application |
| `src > Class` | Toutes les classes utilisées par le UserManager, correspondantes aux données locales côté client |
| `src > Data` | Toutes données utilisées en tant que donnée d'application "AppData" ou que données utilisateur "UserData" |
| `src > Interface` | Les pages de l'app (front + back) ainsi que les composants et les widgets (ensemble de composants) |
| `src > Managers` | Classes qui gèrent toute une partie de l'app |
| `src > HTTP` | Contient tous les fichiers serveurs HTTP, responsables de tous les échanges de données entre le serveur et l'application |
| `src > TCP` | Contient tous les fichiers du serveur TCP, utilisé pour la partie multijoueur |
| `src > Utils` | Toutes les fonctions isolées (requêtes, notifications, ...) |
| `Tools` | Outils pour améliorer l'app (Legion pour DDOS l'app, TableFusion pour synchroniser les bases de données) |

### Variables
| App Data | User class | Database |
|-|-|-|
| Achievements | Achievement | InventoriesAchievements |
| Skills (SkillsIcon & SkillsCategory) | Activity | Activities |
| Items | Inventory (stuff) | Inventories & Avatars |
| Titles | Inventory (title) | InventoriesTitles |
| | Tasks | Tasks |



## Succès
### Conditions
Syntaxe : ``` COMPARATEUR OPERATEUR COMPARANT ```\
Exemple : ``` Sk8 GT 7 ``` ou ``` Battery LT 0.05 ```
<pre>
* Comparateur
    - Battery : Batterie (ratio de la batterie [0; 1])
    - Level~ : Niveau du joueur
    - Sk~ : Niveau du skill avec l'ID ~
    - SkT~ : Temps en heure du skill avec l'ID ~
    - St~ : Niveau d'une statistique (joueur) avec ~ => 0 = int, 1 = soc, 2 = for, 3 = end, 4 = agi, 5 = dex
    - Ca~ : Niveau d'une catégorie avec l'ID ~
    - HCa~ : Niveau de la ~ème catégorie la plus élevée
    - ItemCount : Nombre d'items accumulés
    - Ad~ : Nombre de publicités regardées
    - Title~ : Avoir le titre avec l'ID ~
    - SelfFriend : S'être demandé soi-même en ami (0: non, 1: oui)
* Opérateur
    - LT : less than
    - GT : grater (or equal) than
* Comparant
    - Number : Soit le nombre d'heure, soit de niveau
</pre>

### Récompenses (& GiftCodes Rewards)
Syntaxe : ``` TYPE ID ``` ou ``` TYPE Quantité ```\
Exemple : ``` Title 8 ``` ou ``` OX 20,Item top_08:1 ```
<pre>
Séparés par des virgules, sans espaces
* Types
    - Title + ID
    - Item + ID:COUNT
    - OX + Quantité
</pre>
