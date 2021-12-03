import * as React from 'react';
import { AppState, SafeAreaView } from 'react-native';

import user from './src/Managers/UserManager';
import PageManager from './src/Managers/PageManager';
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

        const TEST = false;

        if (TEST) {
            user.changePage('test');
            return;
        }

        const email = user.settings.email;
        const online = user.server.online;
        const connected = user.settings.connected;
        const showOnboard = !user.settings.onboardingWatched;
        if (email === '') {
            /*if (showOnboard) user.changePage('onboarding', { 'nextPage': 'home' });
            else */if (online) user.changePage('login');
            else             user.changePage('waitinternet');
        } else {
            if (connected) user.changePage('loading');
            else           user.changePage('waitmail');
        }

        return;
        // TODO - Code at end of onboarding
        user.settings.onboardingWatched = true;
        user.settings.Save();
        user.changePage(this.props.args['nextPage']);
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
