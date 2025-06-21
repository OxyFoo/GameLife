import * as React from 'react';
import { AppState } from 'react-native';

import user from './src/Managers/UserManager';
import FlowEngine from './src/Interface/FlowEngine';
import GoogleSignIn from './src/Utils/GoogleSignIn';

/**
 * @typedef {import('react-native').AppStateStatus} AppStateStatus
 * @typedef {import('./src/Interface/FlowEngine/back').default} FlowEngineBack
 */

const TEST_PAGE = false;

class App extends React.Component {
    /** @type {React.RefObject<FlowEngineBack | null>} */
    ref = React.createRef();

    componentDidMount() {
        // Get the app state (active or background) to check the date
        this.appStateSubscription = AppState.addEventListener('change', this.componentChangeState);

        // Expose FlowEngine's public interface to UserManager for UI interactions
        user.interface = this.ref.current?._public;

        // Configure Google Sign-In
        GoogleSignIn.Configure();

        // Open the test page
        if (TEST_PAGE) {
            this.ref.current?.ChangePage('test');
            return;
        }

        this.ref.current?.ChangePage('loading', { storeInHistory: false });
    }

    /** @param {AppStateStatus} state */
    async componentChangeState(state) {
        if (state === 'active') {
            await user.server2.Reconnect();
        } else if (state === 'background' || state === 'inactive') {
            (await user.SaveOnline()) || (await user.SaveLocal());
        }
    }

    componentWillUnmount() {
        // Remove the app state listener
        this.appStateSubscription?.remove();
        user.onUnmount();
    }

    render() {
        return <FlowEngine ref={this.ref} testID='FlowEngine' />;
    }
}

export default App;
