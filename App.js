import * as React from 'react';
import { AppState, LogBox, SafeAreaView } from 'react-native';

import user from './src/Managers/UserManager';
import PageManager from './src/Managers/PageManager';

import { CheckDate } from './src/Utils/DateCheck';

class App extends React.Component {
    componentDidMount() {
        // Ignore the warning
        LogBox.ignoreLogs(['new NativeEventEmitter']);

        // Get the app state (active or background) to check the date
        this.appStateSubscription = AppState.addEventListener("change", this.componentChangeState);

        // Open the test page
        //user.interface.ChangePage('test', undefined, true); return;
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
        } else if (state === 'background') {
            user.OnlineSave();
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
        )
    }
}

export default App;
