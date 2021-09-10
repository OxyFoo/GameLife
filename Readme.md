# Game Life

## Idée
En 3 mots : Gestion RPG IRL
(flemme)

## Font
Si beug avec les font, aller les supprimer dans info.plist et dans resources

## Sources
### Sites
* [AppIcon.co](https://appicon.co/)
* [JS benchmarks](https://jsben.ch/WqlIl)
* [Installer des fonts custom](https://www.bigbinary.com/learn-react-native/adding-custom-fonts)
* [Custom shapes in RN](https://codedaily.io/tutorials/The-Shapes-of-React-Native)
* [Base64 Class (Cross-Browser)](https://stackoverflow.com/questions/246801/how-can-you-encode-a-string-to-base64-in-javascript)

### React native packages
* [React Native Datetimepicker](https://github.com/react-native-community/react-native-datetimepicker)
* [React Native Modal Datetime Picker](https://github.com/mmazzarolo/react-native-modal-datetime-picker)
* [React Native Device Info](https://github.com/react-native-device-info/react-native-device-info)
* [React Native Async Storage](https://github.com/react-native-async-storage/async-storage)
* [React Native Sound Player](https://www.npmjs.com/package/react-native-sound-player)
* [React Native Svg](https://github.com/react-native-svg/react-native-svg)

### Unused
* [React native gesture handler](https://www.npmjs.com/package/react-native-gesture-handler)
* [React Native AES Crypto](https://www.npmjs.com/package/react-native-aes-crypto)

# Sécu (Requests)
## Clés - Chiffrement / déchiffrement AES-256-OCB
* Clé A : Stockées sur le serveur ET sur l'app
* Clé B : Stockée uniquement sur le serveur
## DBB
* Inscription
    - Ajout d'un user empty
    - Ajout du deviceID/deviceName en suspend
    - Envoi d'un mail pour valider ce device
* Device validé
    - Validation du device dans la BDD
* Device refusé
    - Blacklist du device dans la BDD
## Serveur
* Token = Crypt(random, KeyB)
* getKey
    * Input : App hash (chiffré avec la clé A)
    * Process : Compare l'app hash avec une liste interne
    * Return : Clé B (chiffré avec la clé A) ou vide si BuildID incorrect
* getToken
    * Input : DeviceName & DeviceID (chiffrés (séparéments) avec la clé B)
    * Process :
        - Vérification dans la BDD
            - si inexistant : *inscription
            - On vérifie l'appareil
                - S'il a les droits
                    - Génération du token
                    - Stockage du token dans la BDD
                    - Renvoie le token
                - Sinon, rien
    * Return : State (état, token)
* tokenVerification
    * Comparaison avec le token dans la BDD
* getInternalData
    * Input : Token
    * Process : tokenVerification et lecture de la BDD
    * Return : State, Citations, Titres (Leaderboard) (chiffrés avec la clé B)
* getUserData
    * Input : Token
    * Process : tokenVerification et lecture de la BDD (chiffrés avec la clé B)
    * Return : State & user data (chiffrés avec la clé B)
* setUserData
    * Input : Token & Data
    * Process : tokenVerification et écritude dans la BDD
    * Return : State
* getLeaderboard
    * Input : Token
    * Process tokenVerification et récupération des X 1ers joueurs + soi-même
    * Return : State & Leaderboard
## App
* Au démarrage (si internet)
    * getKey (BuildID chiffré avec la clé A)
* Si mail && connecté && pas token
    * Si pas token : getToken
* Si token (donc connecté):
    * Récup des données
        - getInternalData
        - getUserData

* Sauvegarde
    - Sauvegarde locale
    - Si token
        - setUserData

* Chargement
    - Chargement local
    - Si token
        - getUserData

## 19/08/21
* PHP: 560
* JS: 2222
## 05/09/21
* PHP: 1042
* JS: 5520
* Total: 6562

# Succès
* Comparaisons
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


@Pass bêta Merci pour tous vos retours et vos suggestions depuis hier ça fait très plaisir, et on ne va pas s'arrêter là !
J'aimerais bien préciser un point étant donné que le but est d'améliorer l'app
Merci à ceux qui postent des problèmes/bugs de l'app, mais veuillez svp indiquer précisément votre problème ainsi que le contexte de celui-ci (android/ios, émulateur/physique, appareil ancien/récent etc) car je ne peux malheureusement pas faire grand chose d'un simple "ça ne fonctionne pas".
Sinon encore merci pour l'aide que vous nous avez déjà apporté :grin:

Prendre en compte la casse pr la vérif des pseudos