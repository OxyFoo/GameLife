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
                this.user.interface.popup.Open('ok', [ title, text ], BackHandler.exitApp, false);*/
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

        const TEST = true;

        if (TEST) {
            user.interface.changePage('test', undefined, true);
            return;
        }

        const email = user.settings.email;
        const online = user.server.online;
        const connected = user.settings.connected;
        const showOnboard = !user.settings.onboardingWatched;
        if (email === '') {
            /*if (showOnboard) user.interface.changePage('onboarding', { 'nextPage': 'home' });
            else */if (online) user.interface.changePage('login', undefined, true);
            else             user.interface.changePage('waitinternet', undefined, true);
        } else {
            if (connected) user.interface.changePage('loading', undefined, true);
            else           user.interface.changePage('waitmail', undefined, true);
        }

        return;
        // TODO - Code at end of onboarding
        user.settings.onboardingWatched = true;
        user.settings.Save();
        user.interface.changePage(this.props.args['nextPage'], undefined, true);
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
