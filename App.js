import * as React from 'react';
import { AppState, LogBox, SafeAreaView } from 'react-native';

import user from './src/Managers/UserManager';
import PageManager from './src/Managers/PageManager';
import { CheckDate } from './src/Tools/DateCheck';

class App extends React.Component {
    componentDidMount() {
        // Ignore the warning
        LogBox.ignoreLogs(['new NativeEventEmitter']);

        // Get the app state (active or background) to check the date
        this.appStateSubscription = AppState.addEventListener("change", this.componentChangeState);

        // Start the app
        //user.interface.ChangePage('test', undefined, true); return; // TEST
        user.interface.ChangePage('loading', undefined, true);
    }

    async componentChangeState(state) {
        if (state === 'active') {
            if (!CheckDate()) {
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

    render() {
        return (
            <SafeAreaView style={{ backgroundColor: "#000000" }}>
                <PageManager />
            </SafeAreaView>
        )
    }
}

export default App;
