import * as React from 'react';
import { SafeAreaView } from 'react-native';

import PageManager from './src/Managers/PageManager';
import user from './src/Managers/UserManager';

class App extends React.Component {
    componentDidMount() {
        // Vérification de l'accès au serveur
        // Hors ligne
        //     OK
        // En ligne
        //     Authentification
        //     Actualisation des bdd
        //         Titres
        //         Citations
        //         Skills

        //user.changePage('loading');
        //setTimeout(() => { user.changePage('home'); }, 500);

        user.changePage('home');
    }

    render() {
        return (
            <SafeAreaView style={{ backgroundColor: "#000020" }}>
                <PageManager />
            </SafeAreaView>
        )
    }
}

export default App;
