# Game Life - Doc



## Fichiers source
| Répertoire | Fonction |
|-|-|
| `android` / `ios` | Contienent les configurations de compilation pour les 2 OS |
| `res` | Contient toutes les ressources, les icones, les fonts, les fichiers langues etc |
| `servHTTP` | Contient tous les fichiers serveurs, pour la version publique ou la version de dev |
| `servTCP` | Contient tous les fichiers du serveur TCP, utilisé pour la partie multijoueur
| `src` | Contient tous les codes sources pour la compilation de l'application |
| `src > Class` | Toutes les classes utilisées par le UserManager, correspondantes aux données côté utilisateur |
| `src > Data` | Toutes les classes utilisées dans les "Internal data" correspondantes aux données côté base de donnée |
| `src > Interface` | Les pages de l'app (front + back) ainsi que les composants et les widgets (ensemble de composants) |
| `src > Managers` | Classes qui gèrent toute une partie de l'app |
| `src > Utils` | Toutes les fonctions isolées (requêtes, notifications, ...) |
| `Tools` | Outils pour améliorer l'app (Legion pour DDOS l'app, ...) |

### Variables
| Internal Data | User class |
|-|-|
| Achievements | Achievement |
| Skills | Activity |
| Items | Inventory (stuff) |
| Titles | Inventory (title) |
| Inventories | Inventory |

* Stuffs
    - body
    - gloves
    - legs
    - shoes

    - hair
    - face
    - accessory
    - weapon



## Succès
### Conditions
Syntaxe : ``` COMPARATEUR OPERATEUR COMPARANT ```
Exemple : ``` Sk8 GT 7 ``` ou ``` B LT 0.05 ```
* Comparateur
    - B : Batterie (ratio de la batterie [0; 1])
    - Lvl$ : Niveau du joueur
    - Sk$ : Niveau du skill avec l'ID $
    - SkT$ : Temps en heure du skill avec l'ID $
    - St$ : Niveau d'une statistique (joueur) avec $ => 0 = int, 1 = soc, 2 = for, 3 = end, 4 = agi, 5 = dex
    - Ca$ : Niveau d'une catégorie avec l'ID $
    - HCa$ : Niveau de la $ème catégorie la plus élevée
    - It$ : Nombre d'items accumulés
    - Ad$ : Nombre de publicités regardées
* Opérateur
    - LT : less than
    - GT : grater (or equal) than
* Comparant
    - Number : Soit le nombre d'heure, soit de niveau

### Récompenses
Syntaxe : ``` TYPE ID ``` ou ``` TYPE Quantité ```
Exemple : ``` Title 8 ``` ou ``` OX 20,Item 50 ```
Séparés par des virgules, sans espaces
* Types
    - Title + ID
    - Item + ID
    - XP + Quantité
    - OX + Quantité



## News
* Template exemple

[
    {
        "ID": 0,
        "Content": {
            "fr": "Vide",
            "en": "Empty"
        },
        "Icon": null,
        "ButtonText": null,
        "ButtonEvent": null,
        "TextAlign": "auto"
    },
    {
        "ID": 1,
        "Content": {
            "fr": "Test - Texte en français",
            "en": "Test - Text in english"
        },
        "Icon": "cdsiuchdsidcsuhscd___ICONe_en_xml_base64",
        "ButtonText": {
            "fr": "Ouvir le shop",
            "en": "Open shop"
        },
        "ButtonEvent": "shop",
        "TextAlign": "right"
    }
]