import * as React from 'react';
import { AppState } from 'react-native';

import user from 'Managers/UserManager';
import FlowEngine from 'Interface/FlowEngine';
import { env } from 'Utils/Env';
import GoogleSignIn from 'Utils/GoogleSignIn';
import AppleSignIn from 'Utils/AppleSignIn';

/**
 * @typedef {import('react-native').AppStateStatus} AppStateStatus
 */

const AppProps = {
    test: false
};

class App extends React.Component {
    /** @type {React.RefObject<FlowEngine | null>} */
    ref = React.createRef();

    /** @param {import('Interface/FlowEngine/back').default} flowEngine */
    onFlowEngineReady = (flowEngine) => {
        // Expose FlowEngine's public interface to UserManager for UI interactions
        user.interface = flowEngine._public;

        // Listen to app state changes only after interface is ready
        this.appStateSubscription = AppState.addEventListener('change', this.componentChangeState);

        // Configure Google Sign-In
        GoogleSignIn.SetLogger(user.interface.console?.AddLog ?? null);
        GoogleSignIn.Configure();

        // Configure Apple Sign-In
        AppleSignIn.SetLogger(user.interface.console?.AddLog ?? null);

        // Open the test page
        if (this.props.test || env.SHOW_PAGE_TEST) {
            flowEngine.ChangePage('test');
            return;
        }

        flowEngine.ChangePage('loading', { storeInHistory: false });
    };

    /** @param {AppStateStatus} state */
    async componentChangeState(state) {
        user.interface?.console?.AddLog('info', `AppState changed: "${state}"`);

        if (state === 'active') {
            const reconnection = await user.server2.Reconnect();

            // If the user is not logged, disconnect the account
            if (reconnection === 'user-authentication-failed') {
                user.Disconnect();
            } else if (reconnection !== 'already-authenticated') {
                user.interface?.console?.AddLog('info', 'Reconnecting to the server:', reconnection);
            }
        } else if (state === 'background' || state === 'inactive') {
            (await user.SaveOnline()) || (await user.SaveLocal());
        }
    }

    /**
     * @param {Error} error
     * @param {import('react').ErrorInfo} info
     */
    componentDidCatch(error, info) {
        user.interface?.console?.AddLog('error', 'Uncaught error in App component:', error, info);
        user.interface?.popup?.OpenT({
            type: 'ok',
            data: {
                title: 'Uncaught error',
                message: `An unexpected error occurred:\n\n${error.toString()}\n\nInfo:\n${info.componentStack}`
            }
        });
    }

    componentWillUnmount() {
        // Remove the app state listener
        this.appStateSubscription?.remove();
        user.onUnmount();
    }

    render() {
        return <FlowEngine ref={this.ref} testID='FlowEngine' onReady={this.onFlowEngineReady} />;
    }
}

App.defaultProps = AppProps;
App.prototype.props = AppProps;

export default App;
