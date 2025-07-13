# Guide de Contribution - GameLife

Bienvenue dans le projet GameLife ! Ce guide vous aidera à contribuer efficacement au développement de cette application React Native de gamification de la productivité personnelle.

## 🔄 Processus de contribution

### 1. Setup du projet

#### Installation de GameLife

Pour pouvoir développer et tester GameLife, assurez-vous d'avoir installé les outils nécessaires pour le développement React Native.

Consultez le [Wiki/Setup](https://github.com/OxyFoo/GameLife/wiki/Setup) pour les instructions d'installation de l'application.

#### Installation d'ESLint

ESLint est un outil de linting pour JavaScript et React Native.

Il permet de détecter **automatiquement** les erreurs de syntaxe, les problèmes de style et d'autres incohérences dans le code.

**Il est nécessaire** de l'installer avant de commencer à développer sur GameLife pour garantir la qualité du code et respecter les standards de développement.

Il permet à tous les développeurs de suivre les mêmes conventions de codage, ce qui facilite la collaboration et la maintenance du code.

<details>
<summary>Installer ESLint</summary>

### 1. Dépendances

Pour installer ESLint dans votre projet, il faut installer les dépendances si ce n'est pas déjà fait :

```bash
npm install
```

### 2. Extensions

Ensuite, installez l'extension ESLint dans Visual Studio Code (VSCode) :

1. Ouvrez VSCode.
2. Allez dans l'onglet des extensions (icône de blocs empilés sur la barre latérale gauche).
3. Recherchez "ESLint" et installez l'extension officielle de ESLint, signée par Microsoft.

### 3. Activation de ESLint lors de la sauvegarde

Pour que ESLint vérifie et corrige le code à chaque sauvegarde, et faire de la correction de la syntaxe un lointain souvenir : ajoutez la configuration suivante dans votre fichier `.vscode/settings.json` de VSCode :

```json
{
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit"
    }
}
```

</details>

### 2. Renseignez vous sur le projet

Avant de commencer, prenez le temps de lire le [Wiki](https://github.com/OxyFoo/GameLife/wiki/Home) pour comprendre la structure du projet, les concepts clés et les conventions de codage.

### 3. Créez une branche

Créer une branche pour votre fonctionnalité

```bash
git checkout -b feature/nom-de-la-fonctionnalite
```

Développer et commiter

```bash
git add fichier1.js fichier2.js
git commit -m "feat: description de la fonctionnalité"
```

Pousser et créer une PR

```bash
git push origin feature/nom-de-la-fonctionnalite
```

## 🤝 Remerciements

Merci de contribuer à GameLife ! Chaque contribution, qu'elle soit petite ou grande, aide à améliorer l'expérience pour tous les utilisateurs.
