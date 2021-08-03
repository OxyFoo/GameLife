import * as React from 'react';
import { Animated, SafeAreaView, View } from 'react-native';

import user from './src/Managers/UserManager';
import { OptionsAnimation } from './src/Components/Animations';

import Loading from './src/Pages/loading';
import Home from './src/Pages/home';
import Skills from './src/Pages/skills';
import SkillsEdition from './src/Pages/skillsEdition';
import Identity from './src/Pages/identity';
import Settings from './src/Pages/settings';
import Characteristics from './src/Pages/characteristics';
import Charactescription from './src/Pages/charactescription';
import Experience from './src/Pages/experience';

class App extends React.Component {
    state = {
        page1: '',
        page2: '',
        animOpacity1: new Animated.Value(0),
        animOpacity2: new Animated.Value(0)
    }

    componentDidMount() {
      user.changePage = this.changePage;
      user.changePage('loading');
    }

    changePage = (newpage) => {
        if (newpage == (this.state.page1 || this.state.page2)) return;

        let pages = [ 'loading', 'home', 'skills', 'skillsEdition', 'characteristics', 'charactescription', 'experience', 'identity', 'settings' ];
        if (!pages.includes(newpage)) return;

        if (!this.state.page1) {
            // Clear page 2
            OptionsAnimation(this.state.animOpacity2, 0, 400).start(() => { this.setState({ page2: '' }); });
            // Load page 1
            setTimeout(() => { this.setState({ page1: newpage }); }, 0);
            setTimeout(() => { OptionsAnimation(this.state.animOpacity1, 1, 100).start(); }, 200);
        } else {
            // Clear page 1
            OptionsAnimation(this.state.animOpacity1, 0, 400).start(() => { this.setState({ page1: '' }); });
            // Load page 2
            setTimeout(() => { this.setState({ page2: newpage }); }, 0);
            setTimeout(() => { OptionsAnimation(this.state.animOpacity2, 1, 100).start(); }, 200);
        }
    }

    render() {
        function GetPageContent(page) {
            let p;
            switch (page) {
                case 'loading': p = <Loading />; break;
                case 'home': p = <Home />; break;
                case 'skills': p = <Skills />; break;
                case 'skillsEdition': p = <SkillsEdition />; break;
                case 'identity': p = <Identity />; break;
                case 'settings': p = <Settings />; break;
                case 'experience': p = <Experience />; break;
                case 'characteristics': p = <Characteristics />; break;
                case 'charactescription': p = <Charactescription />; break;
            }
            return p;
        }

        let page1 = GetPageContent(this.state.page1);
        let page2 = GetPageContent(this.state.page2);

        const full = { width: '100%', height: '100%', backgroundColor: "#000011" }

        const inter = {
            inputRange:  [0, 0.4, 0.8, 1],
            outputRange: [0, 0.8, 0.2, 1]
        };

        return (
            <View style={full}>
                <SafeAreaView style={full}>
                    <Animated.View pointerEvents={this.state.page1 ? 'auto' : 'none'} style={[full, { position: 'absolute', left: 0, top: 0, opacity: this.state.animOpacity1.interpolate(inter) }]}>
                        {page1}
                    </Animated.View>
                    <Animated.View pointerEvents={this.state.page2 ? 'auto' : 'none'} style={[full, { position: 'absolute', left: 0, top: 0, opacity: this.state.animOpacity2.interpolate(inter) }]}>
                        {page2}
                    </Animated.View>
                </SafeAreaView>
            </View>
        )
    }
}

export default App;
