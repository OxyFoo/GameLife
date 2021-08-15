import * as React from 'react';
import { SafeAreaView } from 'react-native';

import user from './src/Managers/UserManager';
import PageManager from './src/Managers/PageManager';

class App extends React.Component {
    componentDidMount() {
        user.changePage('loading');
        this.loadData();
    }

    async loadData() {
        const t_start = new Date();

        // Load local user data
        await user.loadData();
        user.changePage('loading', { state: 1 });

        // Load internet data (if online)
        await user.conn.AsyncRefreshAccount();
        user.changePage('loading', { state: 2 });

        // Load internet user data (if connected)
        await user.loadAllData();
        user.changePage('loading', { state: 3 });

        // Wait to 5 seconds (with small glith)
        const TIME_MAX = 5 * 1000;
        const t_end = new Date();
        const time = Math.max(0, TIME_MAX - (t_end - t_start));
        setTimeout(() => { user.changePage('loading', { state: 4 }); }, time/2);
        setTimeout(this.loadedData, time);
    }

    loadedData() {
        user.changePage('home');
    }

    componentWillUnmount() {
        user.unmount();
    }

    render() {
        return (
            <SafeAreaView style={{ backgroundColor: "#000020" }}>
                <PageManager />
            </SafeAreaView>
        )
    }
}

export default App;
