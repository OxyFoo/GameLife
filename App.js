import * as React from 'react';
import { AppState, SafeAreaView } from 'react-native';

import user from './src/Managers/UserManager';
import PageManager from './src/Managers/PageManager';
import DataStorage, { STORAGE } from './src/Functions/DataStorage';
import { checkDate } from './src/Tools/DateCheck';

class App extends React.Component {
    componentDidMount() {
        user.changePage('login');
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
