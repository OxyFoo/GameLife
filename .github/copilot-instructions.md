# Instructions pour l'IA - Projet GameLife

Commence **TOUTES** tes réponses par `[GameLife Assistant]` pour indiquer que tu es en mode GameLife.

## 📋 Maintenance des instructions

**IMPORTANT** : Ces instructions doivent être maintenues à jour avec l'évolution du projet :

- **Lors de refactoring** : Si tu modifies l'architecture, les patterns ou les conventions, mets à jour ce fichier pour refléter les nouvelles méthodes
- **Lors de corrections** : Si une pratique s'avère incorrecte ou obsolète, corrige les instructions pour éviter de répéter l'erreur
- **Mémoire permanente** : Utilise ce fichier comme référence pour te rappeler des décisions architecturales et des bonnes pratiques spécifiques au projet
- **Cohérence** : Assure-toi que les instructions restent cohérentes avec le code réel du projet

## Vue d'ensemble du projet

GameLife est une application mobile React Native (v0.79.2) de gamification de la vie quotidienne. L'app utilise TypeScript/JavaScript avec une architecture modulaire stricte et des patterns de conception spécifiques.

## Architecture générale

### Structure des dossiers

```
src/
├── App/           # Logique d'initialisation et templates
├── Class/         # Classes métier (logique business)
├── Constants/     # Constantes globales
├── Data/          # Couches de données (App et User)
├── Interface/     # Interface utilisateur (composants, pages, widgets)
├── Managers/      # Gestionnaires globaux (singleton pattern)
└── Utils/         # Utilitaires et helpers
```

### Patterns architecturaux

1. **Singleton Pattern** : Tous les managers sont des singletons exportés par défaut
2. **Dependency Injection** : Les classes reçoivent leurs dépendances via le constructeur
3. **Interface Pattern** : Utilisation d'interfaces TypeScript depuis `@oxyfoo/gamelife-types`
4. **Observer Pattern** : Utilisation de DynamicVar pour la réactivité

## Conventions de codage

### Style et formatage

- **ESLint/Prettier** : Configuration stricte avec Prettier
- **Indentation** : 4 espaces (tabWidth: 4)
- **Quotes** : Simple quotes (`'`) pour JS, JSX single quotes
- **Semicolons** : Obligatoires
- **Max line length** : 120 caractères
- **Trailing commas** : Interdites

### Imports et exports

```javascript
// ✅ Bon - Imports depuis baseUrl (src/)
import user from 'Managers/UserManager';
import { Button } from 'Interface/Components';

// ✅ Bon - Alias pour ressources
import logo from 'Ressources/logo/GameLife_Text.png';

// ✅ Bon - Types depuis @oxyfoo/gamelife-types
import { IUserClass } from '@oxyfoo/gamelife-types/Interface/IUserClass';

// ❌ Éviter - Imports relatifs
import user from '../../../Managers/UserManager';
```

### Documentation JSDoc

```javascript
/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').Item} Item
 */

/**
 * Description de la fonction
 * @param {UserManager} user - Le gestionnaire utilisateur
 * @param {Item[]} items - Liste des items
 * @returns {Promise<boolean>} - True si succès
 */
```

## Architecture des classes

### Classes métier (src/Class/)

Les classes métier héritent de `IUserClass<SaveObject>` :

```javascript
import { IUserClass } from '@oxyfoo/gamelife-types/Interface/IUserClass';

/** @extends {IUserClass<SaveObject_Shop>} */
class Shop extends IUserClass {
    /** @param {UserManager} user */
    constructor(user) {
        super('shop'); // key unique pour la sauvegarde
        this.user = user;
    }

    // Méthodes obligatoires
    Clear = () => { /* Reset state */ };
    Load = (data) => { /* Load from save */ };
    Save = () => { /* Return save object */ };
}
```

### Classes de données (src/Data/)

#### App Data (src/Data/App/)
Classes héritant de `IAppData<DataType>` pour les données partagées :

```javascript
import { IAppData } from '@oxyfoo/gamelife-types/Interface/IAppData';

/** @extends {IAppData<Item[]>} */
class Items extends IAppData {
    /** @type {Item[]} */
    items = [];

    Clear = () => { this.items = []; };
    Load = (items) => { /* Load data */ };
    Save = () => { return this.items; };
    Get = () => { return this.items; };
}
```

#### User Data (src/Data/User/)
Classes héritant de `IUserData<SaveObject>` pour les données utilisateur :

```javascript
import { IUserData } from '@oxyfoo/gamelife-types/Interface/IUserData';

/** @extends {IUserData<SaveObject_Inventory>} */
class Inventory extends IUserData {
    constructor(user) {
        super('inventory'); // key unique
        this.user = user;
    }
}
```

### Managers (src/Managers/)

Singletons pour la gestion globale :

```javascript
class DataManager {
    constructor() {
        // Initialisation des données
    }
}

const dataManager = new DataManager();
export default dataManager;
export { DataManager };
```

## Interface utilisateur

### Structure des composants

```
Interface/
├── Components/    # Composants réutilisables
├── FlowEngine/    # Gestionnaire de navigation
├── Global/        # Composants globaux (popups, headers)
├── Pages/         # Pages de l'application
├── Primitives/    # Composants de base
└── Widgets/       # Widgets complexes
```

### Composants React

```javascript
import * as React from 'react';
import styles from './style';
import BackComponent from './back';

class Component extends BackComponent {
    render() {
        return (
            // JSX avec single quotes
        );
    }
}

export default Component;
```

### Pages avec FlowEngine

```javascript
import PageBase from 'Interface/FlowEngine/PageBase';

class PageName extends PageBase {
    static feShowNavBar = true;     // Afficher la navbar
    static feShowUserHeader = true; // Afficher l'header utilisateur

    state = {
        // État de la page
    };

    componentDidMount() {
        this.componentDidFocused(this.props);
    }

    componentDidFocused(props) {
        // Logique au focus
    }
}
```

## Gestion des données

### Sauvegarde/Chargement

```javascript
// Sauvegarde locale
await user.SaveLocal();

// Sauvegarde en ligne
await user.SaveOnline();

// Chargement
await user.LoadLocal();
await user.LoadOnline();
```

### Réactivité avec DynamicVar

```javascript
import DynamicVar from 'Utils/DynamicVar';

class UserData {
    constructor() {
        this.ox = new DynamicVar(0);
    }

    // Usage
    this.ox.Set(100);
    const currentOx = this.ox.Get();
    this.ox.Subscribe(callback); // Observer les changements
}
```

## Communication serveur

### TCP WebSocket sécurisé

```javascript
// Via UserManager
const response = await user.server2.tcp.SendAndWait({
    action: 'get-inventories',
    token: this.token
});

// Vérification de réponse
if (response === 'interrupted' || 
    response === 'not-sent' || 
    response === 'timeout' ||
    response.status !== 'expected-status' ||
    response.result === 'error') {
    // Gestion d'erreur
    return;
}
```

## Navigation et UI

### Changement de page

```javascript
// Via interface FlowEngine
user.interface.ChangePage('pageName', {
    args: { /* paramètres */ },
    storeInHistory: false
});

// Retour arrière
user.interface.BackHandle();
```

### Popups

```javascript
user.interface.popup?.OpenT({
    type: 'ok',
    data: {
        title: 'Titre',
        message: 'Message'
    }
});
```

## Sécurité et intégrité

- **SSL Pinning** : WebSocket sécurisé
- **Device Authentication** : Attestation iOS/Android
- **Integrity Checks** : Google Play Integrity
- **Obfuscation** : Code obfusqué en production

## Tests et qualité

### Configuration Jest

```javascript
// jest.setup.js configuré
// Tests dans __tests__/
// Coverage configuré
```

### Scripts npm

```bash
npm run lint        # ESLint
npm run test        # Jest
npm run typecheck   # TypeScript check
npm run build       # Build Android
```

## Bonnes pratiques spécifiques

### 1. Nommage des fichiers
- **Pages** : PascalCase (ex: `Loading/index.js`)
- **Components** : PascalCase (ex: `Button/index.js`)
- **Utils** : PascalCase (ex: `Functions.js`)
- **Styles** : lowercase (ex: `style.js`)

### 2. Gestion d'état
- **État local** : `this.state` dans les composants
- **État global** : Managers + DynamicVar
- **Persistence** : AsyncStorage via Storage utils

### 3. Performance
- **Lazy loading** : Composants et pages
- **Optimisations React** : PureComponent, shouldComponentUpdate
- **Memory management** : Cleanup dans componentWillUnmount

### 4. Internationalisation
```javascript
import langManager from 'Managers/LangManager';
const lang = langManager.curr['section'];
const text = lang['key'];
```

### 5. Thèmes
```javascript
import themeManager from 'Managers/ThemeManager';
const colors = themeManager.GetColors();
```

## Erreurs à éviter

1. **❌ Imports relatifs** : Utiliser les alias de base
2. **❌ Mutations directes** : Utiliser DynamicVar pour la réactivité
3. **❌ Logique métier dans l'UI** : Séparer dans les classes métier
4. **❌ État partagé dans composants** : Utiliser les managers
5. **❌ Appels serveur directs** : Passer par UserManager.server2
6. **❌ Fichiers d'exemple** : Ne jamais créer de fichiers EXAMPLE.md, README.md ou autres fichiers de documentation

## Types et interfaces

Toujours utiliser les types de `@oxyfoo/gamelife-types` :

```javascript
/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').Item} Item
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Inventory').Stuff} Stuff
 */
```

## Configuration environnement

- **React Native Config** : Variables d'environnement
- **Babel** : Module resolver configuré
- **Metro** : Configuration personnalisée
- **Gradle** : Build Android optimisé

Suivre strictement ces conventions pour maintenir la cohérence et la qualité du code GameLife.
