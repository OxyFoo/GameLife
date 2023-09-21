# GameLife - Modifications

## Environnements
### Développement
L'environnement de développement est accessible à l'adresse suivante: [Gamelife dev](https://github.com/OxyFoo/GameLife/tree/dev)
Il est destiné à être utilisé pour le développement.

### Test
L'environnement de test est accessible à l'adresse suivante: [Gamelife test](https://github.com/OxyFoo/GameLife/tree/test)
Il est destiné à être utilisé pour les tests pour vérifier que tout fonctionne comme prévu.
Cette version peut être envoyée à des testeurs pour qu'ils puissent tester l'application.
:warning: **Attention** :warning: Cette branche ne doit être modifiée QUE par le pipeline de déploiement (pull requests), toute modification manuelle sera écrasée lors du prochain déploiement.

### Production
L'environnement de production est accessible à l'adresse suivante: [Gamelife](https://github.com/OxyFoo/GameLife/tree/prod)
Il est destiné à être utilisé par les utilisateurs finaux.
:warning: **Attention** :warning: Cette branche ne doit être modifiée QUE par le pipeline de déploiement (pull requests), toute modification manuelle sera écrasée lors du prochain déploiement.



## Fichiers de configuration
Les fichiers de configurations suivants:
- `android/app/gamelife.keystore`
- `firebase.json`
- ``keystore`
Ne sont pas stockés sur le repo pour des raisons de sécurité, pour que les modifications soient prises en compte dans le pipeline, il faut ajouter manuellement leurs contenus dans les **secrets** du repo, respectivement avec les noms:
- `ANDROID_KEYSTORE`
- `FIREBASE_JSON`
- `KEYSTORE`
Le contenu doit être converti en base 64, on peut les obtenir avec les commandes suivantes:
```bash
mkdir base64
base64 -w0 android/app/gamelife.keystore > base64/keystore
base64 -w0 firebase.json > base64/firebase.json
base64 -w0 keystore > base64/keystore
```

## Base de données
### Ressources
Les tables suivantes sont des tables qui contiennent des ressources:
- `Achievements`
- `Blacklist`
- `Contributors`
- `Items`
- `Quotes`
- `Skills`
- `SkillsCategory`
- `SkillsIcon`
- `Titles`
Elles sont synchronisées entre chaque déploiement, donc les modification ne doivent-être faites QUE dans l'environnement de développement.
Pour les cas d'urgence on peut faire des modifications directement sur la base de données de production, mais il faut ensuite les reporter dans l'environnement de développement, sans quoi elles seront supprimées lors du prochain déploiement.
Il est tout de même **très déconseillé** de faire des modifications directement sur la base de données de production, car cela peut entraîner des problèmes côté client.

### Données utilisateur
Les tables suivantes sont des tables qui contiennent des données utilisateurs:
- `Accounts`
- `Activities`
- `Avatars`
- `Inventories`
- `InventoriesAchievements`
- `InventoriesTitles`
- `Tasks`
Et les suivantes contienent des données annexes:
- `App`
- `Devices`
- `GiftCodes`
- `Logs`
- `Reports`
Ces tables ne sont pas synchronisées entre chaque déploiement, donc les modifications **peuvent** être faites **directement** sur la base de donnéesde n'importe quel environnement.
Il est tout de même conseillé de faire très attention lors des manipulations de données utilisateur, la suppression de contenu et la modification de données sensibles peuvent entraîner des problèmes côté client.