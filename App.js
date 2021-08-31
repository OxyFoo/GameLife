import * as React from 'react';
import { SafeAreaView } from 'react-native';

import user from './src/Managers/UserManager';
import PageManager from './src/Managers/PageManager';

const LOADING_TIME_MAX = 5 * 1000;

class App extends React.Component {
    componentDidMount() {
        user.changePage('loading');
        this.loadData();
    }

    async loadData() {
        const t_start = new Date();

        // Load local user data
        await user.loadData(false);
        await user.sleep(user.random(200, 400));
        user.changePage('loading', { state: 1 }, true);
        
        // Load internet data (if online)
        await user.conn.AsyncRefreshAccount();
        await user.sleep(user.random(500, 800));
        user.changePage('loading', { state: 2 }, true);
        
        // Load internet user data (if connected)
        await user.loadData();
        await user.loadInternalData();
        user.refreshStats();
        await user.sleep(user.random(200, 400));
        user.changePage('loading', { state: 3 }, true);

        // Wait to 5 seconds (with small glith)
        const t_end = new Date();
        const time_left = LOADING_TIME_MAX - (t_end - t_start);
        await user.sleep(time_left / 2); user.changePage('loading', { state: 4 }, true);
        await user.sleep(time_left / 2); user.changePage('home');
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
