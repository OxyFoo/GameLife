# Game Life - Doc

## Fichiers source
| Répertoire | Fonction |
|-|-|
| `android` / `ios` | Contienent les configurations de compilation pour les 2 OS |
| `res` | Contient toutes les ressources, les icones, les fonts, les fichiers langues etc |
| `serv` | Contient tous les fichiers serveurs, pour la version publique ou la version de dev |
| `src` | Contient tous les codes sources pour la compilation de l'application |
| `src > Class` | Toutes les classes utilisées par le UserManager, nécessaires au fonctionnement de toute la partie utilisateur |
| `src > Data` | Toutes les classes qui gèrent les "Internal data" (les skills, les titres, achievements tout ça tout ça) |
| `src > Functions` | Toutes les fonctions isolées (requêtes, notifications, ...) |
| `src > Interface` | Les pages de l'app (front + back) ainsi que les composants et les widgets (ensemble de composants) |
| `src > Managers` | Classes qui gèrent toute une partie de l'app |
| `src > Tools` | Outils pour améliorer l'app (vérifications des dates, anti-cheat, ...) |

## Succès
### Comparaisons
* élément 1
    - B : Batterie
    - SkX : Niveau du skill avec l'ID x
    - SkTX : Temps du skill avec l'ID x
    - StX : Niveau d'une statistique (joueur) avec X = sag, int, ...
    - Ca : Niveau de la catégorie la plus élevée
    - XCa : Niveau de la Xème catégorie la plus élevée
    - [ ] CaX : Niveau d'une catégorie avec l'ID x
    - [ ] CaTX : Temps d'une catégorie avec l'ID x
* Comparateur
    - LT : less than
    - GT : grater (or equal) than
* Comparant
    - Integer : Soit le nombre d'heure, soit de niveau
* Récompense
    - XP_ : _ nombre de point d'xp
    - TODO

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