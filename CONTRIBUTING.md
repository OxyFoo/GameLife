# 🎮 Contribuer à GameLife

Bienvenue dans le projet **GameLife** ! Cette application React Native de gamification transforme votre vie quotidienne en jeu. Votre contribution peut aider des milliers d'utilisateurs à être plus productifs et motivés ! 🚀

## 📋 Sommaire

- [🚀 Démarrage rapide](#-démarrage-rapide)
  - [Prérequis](#prérequis)
  - [📋 Étapes essentielles](#-étapes-essentielles)
- [🛠️ Configuration VSCode (Recommandé)](#️-configuration-vscode-recommandé)
  - [ESLint - Qualité de code automatique ✨](#eslint---qualité-de-code-automatique-)
  - [GitHub Copilot - IA spécialisée GameLife 🤖](#github-copilot---ia-spécialisée-gamelife-)
- [🔄 Workflow de contribution](#-workflow-de-contribution)
- [📝 Conventions de commit](#-conventions-de-commit)
- [💡 Besoin d'aide ?](#-besoin-daide-)
- [🎉 Merci !](#-merci-)

## 🚀 Démarrage rapide

### Prérequis
- Git
- Node.js (version recommandée dans `.node-version`)
- Android Studio (android) ou Xcode (iOS)
- [React Native CLI](https://reactnative.dev/docs/environment-setup)

### 📋 Étapes essentielles

1. **📖 Lisez la documentation**
   
   Consultez le [Wiki du projet](https://github.com/OxyFoo/GameLife/wiki/Home) pour comprendre :
   - L'architecture du projet
   - Les concepts clés de GameLife
   - Les conventions de codage

2. **⚙️ Installation**
   
   ```bash
   # Cloner le projet
   git clone https://github.com/OxyFoo/GameLife.git
   cd GameLife
   
   # Installer les dépendances
   npm install
   ```
   
   📚 Instructions détaillées d'installation : [Wiki/Setup](https://github.com/OxyFoo/GameLife/wiki/Setup)

3. **🔧 Configuration de l'environnement de développement**

## 🛠️ Configuration VSCode (Recommandé)

### ESLint - Qualité de code automatique ✨

ESLint détecte automatiquement les erreurs et applique les standards de GameLife. **Installation obligatoire** pour contribuer.

**Installation :**
1. Installez l'extension "ESLint" (par Microsoft) dans VSCode
2. Créez ou modifiez `.vscode/settings.json` dans votre projet :

```json
{
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit"
    }
}
```

### GitHub Copilot - IA spécialisée GameLife 🤖

**Très recommandé** : Si vous utilisez GitHub Copilot, ajoutez cette ligne pour qu'il respecte automatiquement l'architecture GameLife :

```json
{
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit"
    },
    "github.copilot.chat.codeGeneration.useInstructionFiles": true
}
```

✅ **Avantage** : Copilot générera du code qui suit parfaitement les conventions GameLife !

## 🔄 Workflow de contribution

### 1. Créer une branche

```bash
# Créer une nouvelle branche pour votre fonctionnalité
git checkout -b feature/nom-de-votre-fonctionnalite

# Ou pour un bugfix
git checkout -b fix/description-du-bug
```

### 2. Développer

- Suivez les conventions de codage (ESLint vous aide !)
- Testez vos modifications
- Documentez si nécessaire

### 3. Commiter

```bash
# Ajouter vos fichiers
git add fichier1.js fichier2.js

# Commiter avec un message descriptif
git commit -m "feat: ajoute la fonctionnalité XYZ"
# ou
git commit -m "fix: corrige le bug ABC"
```

### 4. Créer une Pull Request

```bash
# Pousser votre branche
git push origin feature/nom-de-votre-fonctionnalite
```

Puis créez une Pull Request sur GitHub avec :
- Un titre clair
- Une description détaillée des changements
- Des captures d'écran si pertinent

## 📝 Conventions de commit

Utilisez des messages de commit clairs :

- `feat:` pour ajouter/modifier une fonctionnalité
- `fix:` pour un correctif
- `refactor:` pour la refactorisation ou suppression de code
- `docs:` pour la documentation
- `style:` pour le formatage
- `test:` pour les tests

## 💡 Besoin d'aide ?

- 📖 Consultez le [Wiki](https://github.com/OxyFoo/GameLife/wiki/Home)
- 🐛 Ouvrez une [Issue](https://github.com/OxyFoo/GameLife/issues) pour poser des questions
- 💬 Participez aux [discussions](https://github.com/OxyFoo/GameLife/discussions)

## 🎉 Merci !

Chaque contribution, petite ou grande, rend GameLife meilleur pour tous ! Votre aide est précieuse pour créer la meilleure app de gamification de la productivité. 

**Happy coding!** 🎮✨
