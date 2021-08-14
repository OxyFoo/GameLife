import * as React from 'react';
import { SafeAreaView } from 'react-native';

import PageManager from './src/Managers/PageManager';
import user from './src/Managers/UserManager';

class App extends React.Component {
    componentDidMount() {
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
