import * as React from 'react';
import { Animated, View } from 'react-native';
//import LinearGradient from 'react-native-linear-gradient';

import user from './src/Managers/UserManager';
import { OptionsAnimation } from './src/Components/Animations';

import Home from './src/Pages/home';
import AnimTest from './src/Pages/animTest';

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
        //if (newpage == this.state.page) return;
        let pages = [ 'home', 'animTest' ];
        if (!pages.includes(newpage)) return;
        
        OptionsAnimation(this.state.animOpacity, 0).start();
        setTimeout(() => { this.setState({ page: newpage }); }, 150);
        setTimeout(() => { OptionsAnimation(this.state.animOpacity, 1).start(); }, 250);
    }

    render() {
        let page;
        switch (this.state.page) {
            case 'home': page = <Home />; break;
            case 'animTest': page = <AnimTest />; break;
        }

        const full = { width: '100%', height: '100%', backgroundColor: "#01222C" }

        const inter = {
            inputRange:  [0, 0.50, 0.60, 0.70, 0.85, 1],
            outputRange: [0, 1,    0.2,  1,    0.2,  1]
        };

        return (
            <View style={full}>
                <Animated.View style={[full, { opacity: this.state.animOpacity.interpolate(inter) }]}>
                    {page}
                </Animated.View>
            </View>
        )
    }
}

export default App;
