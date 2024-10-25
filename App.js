import * as React from 'react';
import { AppState } from 'react-native';

import user from './src/Managers/UserManager';
import FlowEngine from './src/Interface/FlowEngine';

import { CheckDate } from './src/Utils/DateCheck';

/**
 * @typedef {import('react-native').AppStateStatus} AppStateStatus
 * @typedef {import('./src/Interface/FlowEngine/back').default} FlowEngineBack
 */

const TEST_PAGE = false;

class App extends React.Component {
    /** @type {React.RefObject<FlowEngineBack>} */
    ref = React.createRef();

    componentDidMount() {
        // Get the app state (active or background) to check the date
        this.appStateSubscription = AppState.addEventListener('change', this.componentChangeState);

        // Open the test page
        user.interface = this.ref.current._public;

        if (TEST_PAGE) {
            this.ref.current?.ChangePage('test');
            return;
        }

        this.ref.current?.ChangePage('loading', { storeInHistory: false });
    }

    /** @param {AppStateStatus} state */
    async componentChangeState(state) {
        if (state === 'active') {
            CheckDate(user.server2.tcp);
            //user.tcp.Connect();
        } else if (state === 'background' || state === 'inactive') {
            (await user.OnlineSave()) || (await user.LocalSave());
        }
    }

    componentWillUnmount() {
        this.appStateSubscription.remove();
        user.Unmount();
    }

    render() {
        return <FlowEngine ref={this.ref} />;
    }
}

export default App;
