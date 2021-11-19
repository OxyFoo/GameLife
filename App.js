import * as React from 'react';
import { AppState, SafeAreaView } from 'react-native';

import user from './src/Managers/UserManager';
import PageManager from './src/Managers/PageManager';
import DataStorage, { STORAGE } from './src/Functions/DataStorage';
import { checkDate } from './src/Tools/DateCheck';

class App extends React.Component {
    componentDidMount() {
        this.startApp();
        this.appStateSubscription = AppState.addEventListener("change", this.componentChangeState);
    }

    async componentChangeState(state) {
        if (state === 'active') {
            if (!checkDate()) {
                /*const title = langManager.curr['home']['alert-dateerror-title'];
                const text = langManager.curr['home']['alert-dateerror-text'];
                this.user.openPopup('ok', [ title, text ], BackHandler.exitApp, false);*/
                console.error("TODO - Message d'erreur");
            }
        }
    }

    componentWillUnmount() {
        this.appStateSubscription.remove();
        user.unmount();
    }

    async startApp() {
        await user.settings.Load();
        await user.server.Ping();

        const email = user.settings.email;
        const online = user.server.online;
        const connected = user.settings.connected;
        if (email === '') {
            if (online) user.changePage('login');
            else        user.changePage('waitinternet');
        } else {
            if (connected) user.changePage('loading');
            else           user.changePage('waitmail');
        }
        return;

        let onboardingWatched = false;
        console.log("AH");
        const data = await DataStorage.Load(STORAGE.ONBOARDING, false);
        console.log(data);
        if (data !== null && data.hasOwnProperty('on-boarding')) {
            console.log(data['on-boarding']);
            onboardingWatched = data['on-boarding'];
        }
        if (onboardingWatched) {
            user.changePage('home');
        } else {
            const callback = () => {
                DataStorage.Save(STORAGE.ONBOARDING, { 'on-boarding': true }, false);
                user.changePage('home');
            }
            user.changePage('onboarding', { 'callback': callback });
        }
        
        // View
    }

    render() {
        return (
            <SafeAreaView style={{ backgroundColor: "#000000" }}>
                <PageManager />
            </SafeAreaView>
        )
    }
}

export default App;
