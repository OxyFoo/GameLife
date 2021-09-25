import * as React from 'react';
import { AppState, BackHandler, SafeAreaView } from 'react-native';

import user from './src/Managers/UserManager';
import PageManager from './src/Managers/PageManager';
import { currentDateIsSafe } from './src/Functions/System';
import langManager from './src/Managers/LangManager';

class App extends React.Component {
    componentDidMount() {
        user.changePage('loading');
        this.appStateSubscription = AppState.addEventListener("change", this.componentChangeState);
        this.loadData();
    }

    async loadData() {
        // Load local user data
        await user.loadData(false);
        await user.sleep(user.random(200, 400));
        user.changePage('loading', { state: 1 }, true);

        // Load internet data (if online)
        await user.conn.AsyncRefreshAccount();
        await user.sleep(user.random(600, 800));
        user.changePage('loading', { state: 2 }, true);

        // Load internet user data (if connected)
        await user.loadInternalData();
        await user.refreshStats();
        await user.sleep(user.random(200, 400));
        user.changePage('loading', { state: 3 }, true);

        // Wait to 5 seconds (with small glith)
        await user.sleep(user.random(200, 400));
        user.changePage('loading', { state: 4 }, true);
    }

    async componentChangeState(newState) {
        if (newState === 'active') {
            // Check date errors
            const isSafe = await currentDateIsSafe();
            if (!isSafe) {
                const title = langManager.curr['home']['alert-dateerror-title'];
                const text = langManager.curr['home']['alert-dateerror-text'];
                user.openPopup('ok', [ title, text ], BackHandler.exitApp, false);
                return;
            }
        }
    }

    componentWillUnmount() {
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
