import * as React from 'react';
import { AppState, LogBox, SafeAreaView } from 'react-native';
import { AppStateStatus } from 'react-native';
import RNExitApp from 'react-native-exit-app';

import user from './src/Managers/UserManager';
import PageManager from './src/Managers/PageManager';

import { CheckDate } from './src/Utils/DateCheck';

class App extends React.Component {
    componentDidMount() {
        // Get the app state (active or background) to check the date
        this.appStateSubscription = AppState.addEventListener('change', this.componentChangeState);

        // Open the test page
        //user.interface.ChangePage('test', undefined, true); return;
        user.interface.ChangePage('loading', undefined, true);
    }

    /** @param {AppStateStatus} state */
    async componentChangeState(state) {
        if (state === 'active') {
            if (!CheckDate()) {
                /*const title = langManager.curr['home']['alert-dateerror-title'];
                const text = langManager.curr['home']['alert-dateerror-text'];
                this.user.interface.popup.Open('ok', [ title, text ], RNExitApp.exitApp, false);*/
                console.error("TODO - Message d'erreur");
            }
        } else if (state === 'background' || state === 'inactive') {
            await user.OnlineSave() || await user.LocalSave();
        }
    }

    componentWillUnmount() {
        this.appStateSubscription.remove();
        user.Unmount();
    }

    render() {
        return (
            <SafeAreaView style={{ backgroundColor: "#000000" }}>
                <PageManager ref={ref => { if (ref !== null) user.interface = ref }} />
            </SafeAreaView>
        );
    }
}

export default App;
