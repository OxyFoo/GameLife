import * as React from 'react';
import { AppState } from 'react-native';
import { initSSLPinning } from 'react-native-ssl-pinning';

import { env } from './src/Utils/Env';
import user from './src/Managers/UserManager';
import FlowEngine from './src/Interface/FlowEngine';

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

        // Initialize SSL Pinning
        if (env.VPS_PROTOCOL === 'wss') {
            initSSLPinning({
                [env.VPS_HOST]: {
                    includeSubDomains: false,
                    enforcePinning: true,
                    publicKeyHashes: [
                        'sbzOVXslQjOsnO/Uw3pp7a2boF58AcC6xUQDktk6iSc='
                        // // TODO: Backup hash
                        //   'sha256/J2k9dsLLzsO5…=='
                    ]
                }
            });
        }

        // Open the test page
        user.interface = this.ref.current?._public;

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
        this.appStateSubscription.remove();
        user.onUnmount();
    }

    render() {
        return <FlowEngine ref={this.ref} testID='FlowEngine' />;
    }
}

export default App;
