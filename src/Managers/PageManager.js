import * as React from 'react';
import { Animated, View } from 'react-native';

import user from '../Managers/UserManager';
import { OptionsAnimation } from '../Components/Animations';

import Loading from '../Pages/loading';
import Home from '../Pages/home';
import Identity from '../Pages/identity';
import Statistic from '../Pages/statistic';
import Calendar from '../Pages/calendar';
import Activity from '../Pages/activity';
import Skill from '../Pages/skill';
import Skills from '../Pages/skills';
import Settings from '../Pages/settings';
import Experience from '../Pages/experience';

class PageManager extends React.Component{
    state = {
        page1: '',
        page2: '',
        animOpacity1: new Animated.Value(0),
        animOpacity2: new Animated.Value(0),
        arguments: {}
    }

    componentDidMount() {
        user.changePage = this.changePage;
    }

    changePage = (newpage, args) => {
        const newArgs = typeof(args) !== 'undefined' ? args : {};
        this.setState({ arguments: newArgs });

        if (typeof(newpage) === 'undefined' || newpage === '') {
            this.forceUpdate(); return;
        }

        if (newpage == (this.state.page1 || this.state.page2)) {
            return;
        }

        if (!this.GetPageContent(newpage)) {
            console.error('Calling an incorrect page');
            return;
        };

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

    GetPageContent = (page) => {
        let p;
        switch (page) {
            case 'loading': p = <Loading args={this.state.arguments} />; break;
            case 'home': p = <Home />; break;
            case 'identity': p = <Identity />; break;
            case 'statistic': p = <Statistic args={this.state.arguments} />; break;
            case 'calendar': p = <Calendar />; break;
            case 'activity': p = <Activity args={this.state.arguments} />; break;
            case 'skill': p = <Skill />; break;
            case 'skills': p = <Skills />; break;
            case 'settings': p = <Settings />; break;
            case 'experience': p = <Experience />; break;
        }
        return p;
    }

    render() {
        let page1 = this.GetPageContent(this.state.page1);
        let page2 = this.GetPageContent(this.state.page2);

        const fullscreen = { width: '100%', height: '100%' }

        /*const inter = {
            inputRange:  [0, 0.4, 0.8, 1],
            outputRange: [0, 0.8, 0.2, 1]
        };*/
        const inter = {
            inputRange:  [0, 0.5],
            outputRange: [0, 1]
        };

        return (
            <View style={fullscreen}>
                <Animated.View pointerEvents={this.state.page1 ? 'auto' : 'none'} style={[fullscreen, { position: 'absolute', left: 0, top: 0, opacity: this.state.animOpacity1.interpolate(inter) }]}>
                    {page1}
                </Animated.View>
                <Animated.View pointerEvents={this.state.page2 ? 'auto' : 'none'} style={[fullscreen, { position: 'absolute', left: 0, top: 0, opacity: this.state.animOpacity2.interpolate(inter) }]}>
                    {page2}
                </Animated.View>
            </View>
        )
    }
}

export default PageManager;