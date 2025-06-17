# GameLife - Guidelines

## Standards de développement

### Noms de fichiers et classes

La 1ère lettre de chaque mot est en majuscule et le reste en minuscule (ex: MyComponent.js, UserManager.js).

### Noms des fonctions et variables

Tous les noms de fonctions et de variable sont en anglais et en minuscules avec une majuscule par mot à partir du second (ex: variableDeOuf) et représentent le plus précisément possible ce qu'elles font.

* Exceptions :
    - A l'exception des fonctions publiques de classes, dont le 1er mot commence également par une majuscule (ex: fonctionPrivee | FonctionPublique)
    - Constantes en début de fichier, qui sont entièrement en majuscules avec des underscores à la place des espaces

<details>
<summary>Exemple de noms</summary>

```javascript
class MyComponent extends React.Component {
    // Propriétés statiques en premier
    static defaultProps = {};

    // État du composant
    state = {};

    // Méthodes du cycle de vie
    componentDidMount() {}

    // Méthodes privées personnalisées
    handleSomething = () => {};

    // Méthodes publiques
    FonctionPublique = () => {};

    // Render en dernier - Ou dans un fichier séparé si le composant est complexe
    render() {}
}
```

</details>

## Code

* Ne pas dépasser les 100~200 lignes par fichier
* Ne pas imbriquer les if (faire l'inverse et return, les répartir dans plusieurs fonctions, etc)
* Les fonctions doivent être concises et faire strictement ce pour quoi elles sont faites
* L'indentation est de 4 espaces et les lignes vides ne sont pas indentées
* Toujours terminer le code par une ligne vide, et ne pas mettre de lignes vides sans raisons
* Terminer les lignes par un ";" sauf les fonctions/classes
* Pour les string prioriser les single quotes (') pour la lisibilité du code

## Imports

Les imports sont par blocs espacés par une ligne vide.
Le 1er bloc contient les libs utilisées (dans l'ordre React, ReactNative puis les autres libs)
Le 2nd bloc c'est les libs internes principales (comme l'user et les managers, ou les fichiers de backend et de styles)
Le 3eme bloc concerne tout le reste (comme les composants, les widget, les utils etc)
De manière générale les mettre dans l'ordre croissant de longueur des caractères pour améliorer la lisibilité

<details>
<summary>Exemple d'import</summary>

```javascript
// 1. React et React Native
import * as React from 'react';
import { View, Text } from 'react-native';

// 2. Bibliothèques externes
import LinearGradient from 'react-native-linear-gradient';

// 3. Fichiers internes (back, styles)
import styles from './style';
import BackComponent from './back';

// 4. Managers
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

// 5. Composants et utils
import { Button, Text } from 'Interface/Components';
import { GetLocalTime } from 'Utils/Time';
```

</details>
