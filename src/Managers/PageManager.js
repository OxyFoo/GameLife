import * as React from 'react';
import { Animated, View, BackHandler } from 'react-native';

import user from '../Managers/UserManager';
import { OptionsAnimation } from '../Components/Animations';
import { GLLeftPanel, GLPopup } from '../Components/GL-Components';
import langManager from './LangManager';

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
import Achievements from '../Pages/achievements';
import Leaderboard from '../Pages/leaderboard';
import About from '../Pages/about';

class PageManager extends React.Component{
    state = {
        page1: '',
        page2: '',
        animOpacity1: new Animated.Value(0),
        animOpacity2: new Animated.Value(0),
        arguments: {},
        popupArgs: [ null, null, true ],
        popupCallback: undefined,
        leftPanelState: false
    }

    componentDidMount() {
        this.changing = false;
        this.path = [];
        user.backPage = this.backPage;
        user.changePage = this.changePage;
        user.openPopup = this.openPopup;
        user.closePopup = this.closePopup;
        user.openLeftPanel = this.openLeftPanel;
        BackHandler.addEventListener('hardwareBackPress', this.backHandle);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backHandle);
    }

    backHandle = () => {
        const popup_opened = this.state.popupArgs[0] !== null;
        const cancelable = this.state.popupArgs[2];
        if (popup_opened && cancelable) {
            this.closePopup();
        } else if (!popup_opened) {
            this.backPage();
        }
        return true;
    }

    backPage = () => {
        if (this.changing) return;
        if (this.path.length < 3) {
            const callback = (button) => {
                if (button === 'yes') {
                    BackHandler.exitApp();
                }
            }
            const title = langManager.curr['home']['alert-exit-title'];
            const text = langManager.curr['home']['alert-exit-text'];
            this.openPopup('yesno', [ title, text ], callback);
            return;
        }
        this.changing = true;
        this.path.length = this.path.length - 1;
        const [ prevPage, prevArgs ] = this.path[this.path.length - 1];
        this.setState({ arguments: prevArgs });
        this.pageAnimation(prevPage);
    }

    changePage = (newpage, args, ignorePath = false, forceUpdate = false) => {
        if (this.changing) return;

        if (typeof(newpage) === 'undefined' || newpage === '') {
            this.forceUpdate(); return;
        }

        const newArgs = typeof(args) !== 'undefined' ? args : {};
        this.setState({ arguments: newArgs });

        if (!forceUpdate && newpage == (this.state.page1 || this.state.page2)) {
            return;
        }

        if (!this.GetPageContent(newpage)) {
            console.error('Calling an incorrect page');
            return;
        };
        this.changing = true;
        if (!ignorePath) {
            this.path.push([newpage, args]);
        }
        this.pageAnimation(newpage);
    }

    pageAnimation = (newpage) => {
        const animation_duration = 200;
        const animation_delay = 150;

        if (!this.state.page1) {
            // Clear page 2
            OptionsAnimation(this.state.animOpacity2, 0, 400).start(() => { this.setState({ page2: '' }); });
            // Load page 1
            setTimeout(() => { this.setState({ page1: newpage }); }, 0);
            setTimeout(() => { OptionsAnimation(this.state.animOpacity1, 1, animation_duration).start(); }, animation_delay);
        } else {
            // Clear page 1
            OptionsAnimation(this.state.animOpacity1, 0, 400).start(() => { this.setState({ page1: '' }); });
            // Load page 2
            setTimeout(() => { this.setState({ page2: newpage }); }, 0);
            setTimeout(() => { OptionsAnimation(this.state.animOpacity2, 1, animation_duration).start(); }, animation_delay);
        }

        setTimeout(() => {
            this.changing = false;
        }, animation_delay + animation_duration);
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
            case 'skill': p = <Skill args={this.state.arguments} />; break;
            case 'skills': p = <Skills />; break;
            case 'settings': p = <Settings />; break;
            case 'achievements': p = <Achievements />; break;
            case 'experience': p = <Experience />; break;
            case 'leaderboard': p = <Leaderboard />; break;
            case 'about': p = <About />; break;
        }
        return p;
    }

    openPopup = (type, args, callback, cancelable = true) => {
        const newArgs = typeof(type) !== 'undefined' ? [ type, args, cancelable ] : [ null, null, true ];
        this.setState({ popupArgs: newArgs, popupCallback: callback });
    }
    closePopup = () => {
        const type = this.state.popupArgs[0];
        if (type !== null) {
            const args = this.state.popupArgs[1];
            this.setState({ popupArgs: [ null, args, true ] });
        }
    }

    openLeftPanel = () => {
        this.setState({ leftPanelState: !this.state.leftPanelState });
    }

    render() {
        let page1 = this.GetPageContent(this.state.page1);
        let page2 = this.GetPageContent(this.state.page2);

        const fullscreen = { width: '100%', height: '100%', backgroundColor: "#000020" }

        /*const inter = {
            inputRange:  [0, 0.4, 0.8, 1],
            outputRange: [0, 0.8, 0.2, 1]
        };*/
        const inter = {
            inputRange:  [0, 1],
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
                <GLPopup
                    type={this.state.popupArgs[0]}
                    args={this.state.popupArgs[1]}
                    callback={this.state.popupCallback}
                    cancelable={this.state.popupArgs[2]}
                />
                <GLLeftPanel state={this.state.leftPanelState} />
            </View>
        )
    }
}

export default PageManager;