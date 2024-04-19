import * as React from 'react';
import { AppState, SafeAreaView } from 'react-native';

import user from './src/Managers/UserManager';
import PageManager from './src/Managers/PageManager';

import { CheckDate } from './src/Utils/DateCheck';

/**
 * @typedef {import('react-native').AppStateStatus} AppStateStatus
 */

class App extends React.Component {
    componentDidMount() {
        // Get the app state (active or background) to check the date
        this.appStateSubscription = AppState.addEventListener("change", this.componentChangeState);

        // Open the test page
        user.interface.ChangePage('test', undefined, true); return;
        user.interface.ChangePage('loading', undefined, true);
    }

    /** @param {AppStateStatus} state */
    async componentChangeState(state) {
        if (state === 'active') {
            CheckDate();
            user.tcp.Connect();
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
