import * as React from 'react';
import { AppState } from 'react-native';

import user from 'Managers/UserManager';
import FlowEngine from 'Interface/FlowEngine';
import { env } from 'Utils/Env';
import GoogleSignIn from 'Utils/GoogleSignIn';

/**
 * @typedef {import('react-native').AppStateStatus} AppStateStatus
 */

const AppProps = {
    test: false
};

class App extends React.Component {
    /** @type {React.RefObject<FlowEngine | null>} */
    ref = React.createRef();

    componentDidMount() {
        if (!this.ref.current) {
            throw new Error('FlowEngine reference is not set');
        }

        // Get the app state (active or background) to check the date
        this.appStateSubscription = AppState.addEventListener('change', this.componentChangeState);

        // Expose FlowEngine's public interface to UserManager for UI interactions
        user.interface = this.ref.current._public;

        // Configure Google Sign-In
        GoogleSignIn.SetLogger(user.interface.console?.AddLog ?? null);
        GoogleSignIn.Configure();

        // Open the test page
        if (this.props.test || env.SHOW_PAGE_TEST) {
            this.ref.current?.ChangePage('test');
            return;
        }

        this.ref.current?.ChangePage('loading', { storeInHistory: false });
    }

    /** @param {AppStateStatus} state */
    async componentChangeState(state) {
        user.interface.console?.AddLog('info', `AppState changed: "${state}"`);

        if (state === 'active') {
            const reconnection = await user.server2.Reconnect();

            // If the user is not logged, disconnect the account
            if (reconnection === 'user-authentication-failed') {
                user.Disconnect();
            } else if (reconnection !== 'already-authenticated') {
                user.interface.console?.AddLog('info', 'Reconnecting to the server:', reconnection);
            }
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

App.defaultProps = AppProps;
App.prototype.props = AppProps;

export default App;
