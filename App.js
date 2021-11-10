import * as React from 'react';
import { AppState, SafeAreaView } from 'react-native';

import user from './src/Managers/UserManager';
import PageManager from './src/Managers/PageManager';
import DataStorage, { STORAGE } from './src/Functions/DataStorage';

class App extends React.Component {
    componentDidMount() {
        user.changePage('login');
        this.appStateSubscription = AppState.addEventListener("change", this.componentChangeState);
    }

    async componentChangeState(newState) {
        user.dateCheck.changeState(newState);
    }

    componentWillUnmount() {
        this.appStateSubscription.remove();
        user.unmount();
    }

    async startApp() {
        let onboardingWatched = false;
        const data = await DataStorage.Load(STORAGE.ONBOARDING, false);
        if (typeof(data) !== 'undefined' && data.hasOwnProperty('on-boarding')) {
            onboardingWatched = data['on-boarding'];
        }
        if (onboardingWatched) {
            user.changePage('home');
        } else {
            const callback = () => {
                DataStorage.Save(STORAGE.ONBOARDING, { 'on-boarding': true }, false);
                user.changePage('home');
            }
            user.changePage('onboarding', { 'callback': callback });
        }
        
        // View
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
