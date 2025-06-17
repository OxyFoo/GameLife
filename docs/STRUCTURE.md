# Structure du Projet GameLife

Ce document décrit l'arborescence complète du projet GameLife, une application React Native de gamification de la productivité personnelle.

## 📋 Vue d'ensemble

GameLife est structuré selon une architecture modulaire qui sépare clairement les responsabilités entre les données, l'interface utilisateur, la logique métier et les utilitaires.

## 🌳 Arborescence du projet

### 📁 Racine du projet
```
GameLife/
├── 📱 App.js                   # Point d'entrée de l'application React Native
├── 📝 index.js                 # Enregistrement du composant App
├── ⚙️ package.json             # Dépendances et scripts npm
├── 🔧 babel.config.js          # Configuration Babel
├── 🔧 metro.config.js          # Configuration Metro bundler
├── 🔧 jest.config.js           # Configuration des tests Jest
├── 🔧 react-native.config.js   # Configuration React Native
├── 📄 jsconfig.json            # Configuration TypeScript/JSDoc
└── 📚 README.md                # Documentation principale
```

### 📱 Plateformes natives

#### 🍎 ios/
```
ios/
├── 📱 GameLife/                 # Dossier principal iOS (AppDelegate, Info.plist, assets...)
├── 🔨 GameLife.xcodeproj/       # Projet Xcode
├── 🔨 GameLife.xcworkspace/     # Workspace Xcode (avec Pods)
├── 📦 Podfile                   # Dépendances CocoaPods
└── 📁 Resources/               # Ressources iOS (fonts, certificats, config Firebase)
```

#### 🤖 android/
```
android/
├── 📁 app/                     # Module principal Android (build config, keystores, sources natives)
├── 🔨 build.gradle             # Configuration Gradle racine
├── ⚙️ gradle.properties        # Propriétés Gradle
└── 📁 gradle/                  # Wrapper Gradle
```

### 🎨 res/ - Ressources
```
res/                             # 📦 Toutes les ressources de l'application
├── 📄 Icons.js                  # Export des icônes
├── 🔤 fonts/                   # Polices personnalisées
├── 🎨 icons/                   # Icônes SVG et PNG
├── 👕 items/                   # Assets des objets du jeu (monnaies, coffres, avatars, équipements)
├── 🌍 langs/                   # Fichiers de langues (fr.json, en.json)
├── 🎨 logo/                    # Logos de l'application
├── 🎭 themes/                  # Définitions des thèmes
├── 🚀 onboarding/              # Images d'onboarding
└── ⚡ zap/                     # Assets ZapGPT
```

### 💻 src/ - Code source

#### 🚀 src/App/ - Point de départ
```
src/App/                         # 🚀 Initialisation et configuration
├── 📱 Loading.js               # Logique de chargement de l'application
├── 🎭 popups.js                # Popups système (maintenance, mise à jour...)
└── 📝 template.js              # Données de template pour le mode hors ligne
```

#### 🏗️ src/Interface/ - Interface utilisateur
```
src/Interface/                   # 🏗️ Toute l'interface utilisateur
├── 📄 Components.js            # Export de tous les composants
├── 📄 Global.js                # Export des éléments globaux
├── 📄 Pages.js                 # Export de toutes les pages
├── 📄 Widgets.js               # Export de tous les widgets
│
├── 📱 Pages/                   # 📱 Écrans de l'application
│   ├── 🏠 Home/               # Page d'accueil
│   ├── 🎯 ActivityTimer/      # Chronomètre d'activités
│   ├── 📊 Skills/             # Page des compétences
│   ├── 🏆 Achievements/       # Page des succès
│   ├── 📝 Quests/             # Liste des quêtes
│   ├── ✅ Quest/              # Création/édition de quête
│   ├── 📋 Todo/               # Gestion des tâches
│   ├── 📅 Calendar/           # Calendrier des activités
│   ├── 👤 Profile/            # Profil utilisateur
│   ├── 👥 Multiplayer/        # Mode multijoueur
│   ├── 👫 Friends/            # Gestion des amis
│   ├── 🛒 Shop/               # Boutique in-app
│   ├── ⚙️ Settings/           # Paramètres
│   ├── 🔐 Login/              # Connexion
│   ├── 🎬 Onboarding/         # Introduction
│   ├── 📱 Loading/            # Écran de chargement
│   └── ℹ️  About/              # À propos
│
├── 🧩 Components/             # 🧩 Composants réutilisables (Button, Text, ProgressBar, Charts, etc.)
├── 🎛️ Widgets/                # 🎛️ Ensembles de composants (TodayPieChart, Missions, QuestsList, etc.)
├── 🌐 Global/                 # 🌐 Éléments globaux (NavBar, Popup, Console, Notifications, etc.)
├── 🎬 PageView/               # 🎬 Vues modales et spéciales (AddActivity, ProfileFriend)
├── 🏗️ FlowEngine/             # 🏗️ Moteur de navigation
└── 🎨 Primitives/             # 🎨 Éléments primitifs UI (Gradient, Background, etc.)
```

#### 🗃️ src/Data/ - Modèles de données
```
src/Data/                      # 🗃️ Structures de données
├── 📱 App/                    # 📱 Données de l'application (Achievements, Ads, Items, Skills, etc.)
└── 👤 User/                   # 👤 Données utilisateur (Activities, Inventory, Quests, Todos, etc.)
```

#### 🏭 src/Class/ - Classes métier
```
src/Class/                       # 🏭 Logique métier (Ads, Shop, Settings, Server, Notifications, etc.)
```

#### 🎛️ src/Managers/ - Gestionnaires globaux
```
src/Managers/                   # 🎛️ Gestionnaires de l'application
├── 👤 UserManager.js           # Gestionnaire central utilisateur
├── 🗃️ DataManager.js           # Gestionnaire des données app
├── 🌍 LangManager.js           # Gestionnaire des langues
└── 🎨 ThemeManager.js          # Gestionnaire des thèmes
```

#### 🛠️ src/Utils/ - Utilitaires
```
src/Utils/                       # 🛠️ Fonctions utilitaires (Time, Storage, Animations, TCP, etc.)
```

#### 📊 src/Constants/ - Constantes
```
src/Constants/                   # 📊 Constantes de l'application
```

### 🧪 Tests et configuration

#### 🧪 __tests__/
```
__tests__/                       # 🧪 Tests unitaires
```

#### 📄 Fichiers de configuration
```
📄 jest.setup.js                # Configuration des mocks Jest
📄 .eslintrc.js                 # Configuration ESLint (linting)
📄 .prettierrc.js               # Configuration Prettier (formatage)
📄 .gitignore                   # Fichiers ignorés par Git
```

### 📚 docs/ - Documentation
```
docs/                           # 📚 Documentation du projet
├── 📝 Structure.md             # Ce fichier - structure du projet
├── ✏️ Editing.md               # Guide d'édition
├── 🌍 Environments.md          # Configuration des environnements
└── [Autres docs...]            # Git.md, Guidelines.md
```

## 🔗 Relations entre les modules

### 🔄 Flux de données principal
```
App.js → UserManager → DataManager ↔ Interface
   ↓         ↓            ↓           ↓
Managers → Classes → Data/User → Pages/Components
```

### 🎯 Points d'entrée clés
- **App.js** : Composant racine React Native
- **src/App/Loading.js** : Initialisation de l'application
- **src/Managers/UserManager.js** : Gestionnaire central
- **src/Interface/FlowEngine/** : Moteur de navigation
- **src/Interface/Pages.js** : Index des pages

## 🎨 Conventions de nommage

- **Dossiers** : PascalCase pour les composants, camelCase pour les utilitaires
- **Fichiers** : 
  - `index.js` : Composant principal
  - `back.js` : Logique métier
  - `style.js` : Styles
- **Classes** : PascalCase
- **Fonctions privées** : camelCase
- **Fonctions publiques** : CamelCase
- **Constantes** : UPPER_SNAKE_CASE

## 🚀 Prochaines étapes

Cette structure modulaire permet :
- **Maintenabilité** : Séparation claire des responsabilités
- **Réutilisabilité** : Composants et utilitaires modulaires
- **Testabilité** : Isolation des modules pour les tests
- **Scalabilité** : Ajout facile de nouvelles fonctionnalités
