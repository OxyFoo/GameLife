import * as React from 'react';
import { SafeAreaView } from 'react-native';

import PageManager from './src/Managers/PageManager';

class App extends React.Component {
    componentDidMount() {
    }

    render() {
        return (
            <SafeAreaView style={{ backgroundColor: "#000011" }}>
                <PageManager />
            </SafeAreaView>
        )
    }
}

export default App;
