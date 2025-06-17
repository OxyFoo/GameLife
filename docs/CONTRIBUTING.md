# Guide de Contribution - GameLife

Bienvenue dans le projet GameLife ! Ce guide vous aidera à contribuer efficacement au développement de cette application React Native de gamification de la productivité personnelle.

## 📋 Table des matières

- [Prérequis](#prérequis)
- [Installation et configuration](#installation-et-configuration)
- [Architecture du projet](#architecture-du-projet)
- [Standards de développement](#standards-de-développement)
- [Processus de contribution](#processus-de-contribution)
- [Tests](#tests)
- [Débogage](#débogage)
- [Déploiement](#déploiement)

## 🔧 Prérequis

### Environnement de développement
- **Node.js** ≥ 18
- **React Native** installé globalement [voir guide officiel](https://reactnative.dev/docs/set-up-your-environment)
- **Android Studio** (pour Android) - avec SDK Android
- **Xcode** (pour iOS) - Version récente avec support iOS 15.1+

## 🚀 Installation et configuration

### 1. Cloner et installer
```bash
git clone https://github.com/OxyFoo/GameLife.git
cd GameLife
npm install

# Setup Pods pour iOS
npm run podi
```

### 2. [Optionnel] Configuration des environnements
Modifiez le fichier `.env` avec les variables nécessaires.

### 3. Lancer l'application
```bash
# Terminal 1 => Metro séparément
npm start

# Terminal 2
## iOS
npm run ios

## Android
npm run android
```

### [Optionnel] Nettoyer le projet
```bash
# Nettoyer tous les caches, y compris Metro, Pods, Gradle et npm
npm run clean
```

## 🏗️ Architecture du projet

### Structure des dossiers
Voir [STRUCTURE.md](./STRUCTURE.md) pour une description complète de l'arborescence.

### Concepts clés

#### Managers
Les managers gèrent les aspects globaux de l'application :
- `UserManager` : Gestion centralisée des données utilisateur, interface, etc
- `DataManager` : Gestion des données de l'application (compétences, objets, etc.)
- `LangManager` : Internationalisation
- `ThemeManager` : Gestion des thèmes et variants

#### FlowEngine
Système de navigation personnalisé qui gère :
- Le routage entre les pages
- L'historique de navigation
- Les animations de transition
- Les overlays globaux (popup, console, etc.)

#### Data vs Class
- **Data/** : Modèles de données (structures)
- **Class/** : Logique métier et comportements

## 📝 Standards de développement

### Conventions de nommage

- [GUIDELINES.md](./GUIDELINES.md) : Conventions de nommage et standards de code

### Patterns de développement

#### Structure des pages
Chaque page doit avoir cette structure :
```
PageName/
├── index.js        # Composant principal (UI)
├── back.js         # Logique métier
├── style.js        # Styles
└── Components/     # Sous-composants spécifiques
```

## 🔄 Processus de contribution

### 1. Workflow Git

```bash
# Créer une branche pour votre fonctionnalité
git checkout -b feature/nom-de-la-fonctionnalite

# Développer et commiter
git add .
git commit -m "feat: description de la fonctionnalité"

# Pousser et créer une PR
git push origin feature/nom-de-la-fonctionnalite
```

### 2. Convention de commits

- [GIT.md](./GIT.md) : Conventions de commits et gestion des branches

### 3. Pull Requests

- Titre clair et descriptif
- Description détaillée des changements
- Tests ajoutés si applicable
- Screenshots pour les changements UI
- Vérifier que les tests passent

## 🧪 Tests

### Lancer les tests
```bash
npm test
```

### Écrire des tests
```javascript
// __tests__/MyComponent.test.js
import React from 'react';
import { render } from '@testing-library/react-native';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
    it('should render correctly', () => {
        const { getByText } = render(<MyComponent />);
        expect(getByText('Expected Text')).toBeTruthy();
    });
});
```

## 🛠️ Outils de développement

### Scripts npm utiles
```bash
npm run start         # Démarrer Metro
npm install           # Installer les dépendances
npm run podi          # Réinstaller les pods iOS
npm run android       # Lancer sur Android
npm run ios           # Lancer sur iOS
npm run test          # Tests
npm run lint          # Vérifier le code
npm run clean         # Nettoyer tous les caches
```

## 🤝 Remerciements

Merci de contribuer à GameLife ! Chaque contribution, qu'elle soit petite ou grande, aide à améliorer l'expérience pour tous les utilisateurs.
