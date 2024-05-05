import * as React from 'react';
import { AppState, SafeAreaView } from 'react-native';

import user from './src/Managers/UserManager';
import FlowEngine from './src/Interface/FlowEngine';

import { CheckDate } from './src/Utils/DateCheck';

/**
 * @typedef {import('react-native').AppStateStatus} AppStateStatus
 */

class App extends React.Component {
    /** @type {React.RefObject<FlowEngine>} */
    ref = React.createRef();

    componentDidMount() {
        // Get the app state (active or background) to check the date
        this.appStateSubscription = AppState.addEventListener('change', this.componentChangeState);

        // Open the test page
        user.interface = this.ref.current;
        this.ref.current?.ChangePage('test'); return;
        this.ref.current?.ChangePage('loading', undefined, true);
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
                <FlowEngine ref={this.ref} />
            </SafeAreaView>
        );
    }
}

export default App;
