import * as React from 'react';
import { Animated, View } from 'react-native';
//import LinearGradient from 'react-native-linear-gradient';

import user from './src/Managers/UserManager';
import { OptionsAnimation } from './src/Components/Animations';

import Home from './src/Pages/home';

class App extends React.Component {
    state = {
        page: '',
        animOpacity: new Animated.Value(1)
    }

    componentDidMount() {
      user.changePage = this.changePage;
      user.changePage('home');
    }

    changePage = (newpage) => {
        if (newpage == this.state.page) return;
        let pages = [ 'home' ];
        if (!pages.includes(newpage)) return;
        
        OptionsAnimation(this.state.animOpacity, 0).start();
        setTimeout(() => { this.setState({ page: newpage }); }, 300);
        setTimeout(() => { OptionsAnimation(this.state.animOpacity, 1).start(); }, 500);
    }

    render() {
        let page;
        switch (this.state.page) {
            case 'home': page = <Home />; break;
        }

        const full = { width: '100%', height: '100%', backgroundColor: "#01222C" }

        return (
            <View style={full}>
                <Animated.View style={[full, { opacity: this.state.animOpacity }]}>
                    {page}
                </Animated.View>
            </View>
        )
    }
}

export default App;
