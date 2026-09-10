# Instructions pour l'IA - Projet GameLife

Commence **TOUTES** tes réponses par `[GameLife Assistant]` pour indiquer que tu es en mode GameLife.

## 📋 Maintenance des instructions

**IMPORTANT** : Ces instructions doivent être maintenues à jour avec l'évolution du projet :

- **Lors de refactoring** : Si tu modifies l'architecture, les patterns ou les conventions, mets à jour ce fichier pour refléter les nouvelles méthodes
- **Lors de corrections** : Si une pratique s'avère incorrecte ou obsolète, corrige les instructions pour éviter de répéter l'erreur
- **Mémoire permanente** : Utilise ce fichier comme référence pour te rappeler des décisions architecturales et des bonnes pratiques spécifiques au projet
- **Cohérence** : Assure-toi que les instructions restent cohérentes avec le code réel du projet

## 📝 Workflow de développement

- **Proposition de commit** : Après avoir développé une feature complète ou un fix, propose systématiquement un nom de commit au format conventionnel :
  - `feat(scope): description` pour une nouvelle fonctionnalité
  - `fix(scope): description` pour une correction de bug
  - `refactor(scope): description` pour un refactoring
  - `docs(scope): description` pour la documentation
  - `style(scope): description` pour le formatage
  - `chore(scope): description` pour les tâches de maintenance

## Vue d'ensemble du projet

GameLife est une application mobile React Native (v0.82.1, React 19) de gamification de la vie quotidienne. L'app utilise TypeScript/JavaScript avec une architecture modulaire stricte et des patterns de conception spécifiques.

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
- **Config Prettier** : `.prettierrc` à la racine, doublée par la règle `prettier/prettier` de
  `.eslintrc.json` (les deux doivent rester identiques). `.prettierignore` reflète les
  `ignorePatterns` d'ESLint pour que `npm run lint` et `npm run format` couvrent le même périmètre.
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

### Règles métier partagées client / serveur

Certaines règles sont exécutées **des deux côtés** : l'app pour l'aperçu et l'XP, le serveur
pour ce qui touche à la monnaie et au classement (autoritaires). Elles ne sont **pas dupliquées** :
elles vivent dans le paquet partagé `@oxyfoo/gamelife-types`, sous `Rules/`, en fonctions pures
sans dépendance ni état, et les deux projets importent ce module.

- `@oxyfoo/gamelife-types/Rules/OxEconomy` — jour local d'une activité (`GetLocalDayIndex`),
  éligibilité à l'XP (`DoesGrantXP`), limite 12 h / jour local (`UsefulActivities`, tout-ou-rien et
  chronologique, seules les compétences avec XP consomment le budget) et économie des Ox
  (1 Ox / minute ; supprimer ou éditer règle la différence signée ; première opération coûteuse de la
  semaine, lundi 00:00 UTC, au prix de base, les suivantes +50 % ; solde possiblement négatif, puis plus
  d'opération coûteuse).
- `@oxyfoo/gamelife-types/Rules/RaidEngine` — multiplicateurs de stats (250 points = ×1, plafond ×25),
  budget de combat (48 h d'activité utile × endurance), guérison (24 h ÷ social), points
  (1/min × force, ×2 sur critique), fenêtre d'une saison (`SeasonWindow`, toujours du 1er du mois au 1er
  suivant moins le repos) et rejeu chronologique (`SimulateParticipant`). Les activités qui marquent des
  points sont celles des Ox, via `UsefulActivities`.

L'app ne fait que **prévisualiser** : `user.activities.SimulateOx`, `GetDeleteOxQuote`, `GetEditOxQuote`,
`GetOxReward` rejouent ses seaux en attente sur l'instantané serveur, et `user.raids` simule sans les
critiques (le seed reste sur le serveur). Le serveur règle dans une transaction verrouillée par compte
(`GameLifeActivites.Save`, puis `GameLifeRaids`) et fait foi : il renvoie `ox`, `oxDelta`, `oxPenalty`,
`oxFreeSlotUntil`, et arbitre dégâts, vie du boss et classement. Le devis confirmé est figé
(`oxQuotedDelta` → `oxExpectedDelta`) et l'opération gratuite désignée (`oxFreeKey`) ; le serveur répond
`ox-quote-changed` / `ox-negative` plutôt que d'appliquer un montant non vu.

Ces règles sont couvertes par `GameLife-Server/src/Services/GameLife/__tests__/OxEconomy.test.ts` et
`RaidEngine.test.ts` (scénarios S1…S16 et R1…R19), qui sont la suite de référence du module partagé :
le paquet de types n'a pas de lanceur de tests à lui. Après toute modification dans `GameLife-Types`,
reconstruire le paquet et recopier son `dist/` dans les `node_modules/@oxyfoo/gamelife-types` des trois
consommateurs, sinon les deux côtés n'exécutent plus le même code.

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
- **Obfuscation** : ⚠️ Actuellement **désactivée**. `obfuscator-io-metro-plugin` est incompatible
  avec Metro >= 0.83 (il génère des fichiers nommés `undefined`) ; le code est commenté dans
  `metro.config.js`. Les builds de production ne sont donc pas obfusqués tant que le plugin
  n'est pas corrigé ou remplacé.

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
