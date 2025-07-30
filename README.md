# 🎮 GameLife

[![⚙️ Continuous Integration](https://github.com/OxyFoo/GameLife/actions/workflows/ci.yml/badge.svg)](https://github.com/OxyFoo/GameLife/actions/workflows/ci.yml)
[![✋ GameLife - Continuous Delivery](https://github.com/OxyFoo/GameLife/actions/workflows/workflow-delivery.yml/badge.svg)](https://github.com/OxyFoo/GameLife/actions/workflows/workflow-delivery.yml)

## 🌟 Qu'est-ce que GameLife ?

GameLife est une application mobile innovante qui gamifie ta productivité personnelle. Elle te permet de :

- **🎯 Suivre tes activités** et gagner de l'expérience
- **🛡️ Développer tes compétences** dans différents domaines de la vie
- **⚔️ Accomplir des quêtes** et missions personnalisées
- **🏆 Débloquer des achievements** et récompenses
- **👥 Interagir en multijoueur** avec d'autres utilisateurs
- **🎨 Personnaliser ton avatar** et explorer le shop in-app

## 📲 Télécharger GameLife & Rejoindre la communauté

<div align="center">
  <a href="https://play.google.com/store/apps/details?id=com.gamelife&hl=fr&gl=US"><img src="https://img.shields.io/badge/Google_Play-414141?style=for-the-badge&logo=google-play&logoColor=white" alt="Télécharger sur Google Play" height="60"/></a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://apps.apple.com/fr/app/game-life/id1587486522"><img src="https://img.shields.io/badge/App_Store-0D96F6?style=for-the-badge&logo=app-store&logoColor=white" alt="Télécharger sur l'App Store" height="60"/></a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://discord.gg/FfJRxjNAwS"><img src="https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white" alt="Rejoindre le Discord" height="60"/></a>
</div>

## 📖 Documentation

Si vous voulez plus d'informations sur le projet, sa structure et les concepts clés, consultez la documentation complète dans le wiki du projet : [Wiki GameLife](https://github.com/OxyFoo/GameLife/wiki/Home).

Pour les contributeurs, vous trouverez des guides détaillés sur la contribution dans le fichier [CONTRIBUTING.md](CONTRIBUTING.md).

Pour une installation détaillée, consultez la section [Installation](https://github.com/OxyFoo/GameLife/wiki/Setup).

## 🚀 Installation rapide

Pour pouvoir développer et tester GameLife, il est nécessaire d'avoir installé [React Native](https://reactnative.dev/docs/set-up-your-environment).

Ensuite, vous pouvez cloner le dépôt, installer les dépendances et lancer l'application avec les commandes suivantes :

```bash
git clone https://github.com/OxyFoo/GameLife.git  # Cloner le dépôt
cd GameLife                                       # Accéder au dossier du projet
npm install                                       # Installer les dépendances
npm run podi                                      # Installer les Pods (uniquement pour iOS)
npm start                                         # Lancer le serveur Metro
```

Dans un autre terminal, lancez l'application :
```bash
npm run ios       # Pour iOS
npm run android   # Pour Android
```

## 📚 Sources

<details>
<summary>React native packages</summary>

### 🔐 Authentification
* [React Native Google Sign-In](https://github.com/react-native-google-signin/google-signin)

### 🔒 Sécurité & Intégrité
* [React Native Google Play Integrity](https://www.npmjs.com/package/react-native-google-play-integrity)
* [React Native iOS AppAttest](https://www.npmjs.com/package/react-native-ios-appattest)
* [React Native Keychain](https://npmjs.com/package/react-native-keychain)
* [Obfuscator io metro plugin](https://www.npmjs.com/package/obfuscator-io-metro-plugin)
* [React Native Pinned WebSocket](https://github.com/Gerem66/react-native-pinned-ws) 📦

### 💰 Monétisation & achats in-app
* [React Native IAP](https://github.com/dooboolab-community/react-native-iap)
* [React Native Google Mobile Ads](https://github.com/invertase/react-native-google-mobile-ads)

### 🎨 UI & graphisme
* [React Native Svg](https://github.com/react-native-svg/react-native-svg)
* [React Native Reanimated](https://npmjs.com/package/react-native-reanimated)
* [React Native Linear Gradient](https://github.com/react-native-linear-gradient/react-native-linear-gradient)
* [React Native Shadow 2](https://www.npmjs.com/package/react-native-shadow-2)
* [React Native Community Blur](https://www.npmjs.com/package/@react-native-community/blur)
* [React Native Masked View](https://www.npmjs.com/package/@react-native-masked-view/masked-view)
* [React Native Modal Datetime Picker](https://github.com/mmazzarolo/react-native-modal-datetime-picker) depends on [React Native Datetimepicker](https://github.com/react-native-community/react-native-datetimepicker)
* [React Native Gifted Charts](https://www.npmjs.com/package/react-native-gifted-charts)

### 💾 Stockage & état
* [React Native Config](https://www.npmjs.com/package/react-native-config)
* [React Native Device Info](https://github.com/react-native-device-info/react-native-device-info)
* [React Native Async Storage](https://github.com/react-native-async-storage/async-storage)

### ⚙️ Fonctionnalités natives
* [React Native Notifee](https://www.npmjs.com/package/@notifee/react-native)
* [React Native Permissions](https://www.npmjs.com/package/react-native-permissions)
* [React Native App Control](https://github.com/Gerem66/react-native-app-control) 📦

### 📦 Our packages
* [OxyFoo GameLife Types](https://github.com/OxyFoo/GameLife-Types)
* [Dotenv-Oxy](https://github/com/Gerem66/dotenv-oxy) (with React Native Config)
* [React Native Pinned WebSocket](https://github.com/Gerem66/react-native-pinned-ws)
* [React Native App Control](https://github.com/Gerem66/react-native-app-control)

</details>

<details>
<summary>Useful links</summary>

* [AppIcon.co](https://appicon.co/)
* [PHP Sandbox](https://sandbox.onlinephpfunctions.com/)
* [JS benchmarks](https://jsben.ch/WqlIl)
* [Svg to RNSvg](https://react-svgr.com/playground/?native=true&svgo=false)
* [Installer des fonts custom](https://www.bigbinary.com/learn-react-native/adding-custom-fonts)
* [Préparer l'environnement iOS (Github Actions)](https://docs.github.com/en/actions/deployment/deploying-xcode-applications/installing-an-apple-certificate-on-macos-runners-for-xcode-development)

</details>

---

🎮 **GameLife transforme la vie quotidienne en aventure !**

> *"Chaque jour est une nouvelle quête, chaque tâche une opportunité de progresser."*
