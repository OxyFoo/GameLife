import * as React from 'react';
import { Animated, BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import user from '../Managers/UserManager';
import langManager from './LangManager';
import { TimingAnimation } from '../Functions/Animations';
import { GLPopup } from '../Interface/Components';
import { BottomBar } from '../Interface/Widgets';

import About from '../Interface/pageFront/about';
import Achievements from '../Interface/pageFront/achievements';
import Activity from '../Interface/pageFront/activity';
import Calendar from '../Interface/pageFront/calendar';
import Dailyquest from '../Interface/pageFront/dailyquest';
import Experience from '../Interface/pageFront/experience';
import Home from '../Interface/pageFront/home';
import Identity from '../Interface/pageFront/identity';
import Leaderboard from '../Interface/pageFront/leaderboard';
import Loading from '../Interface/pageFront/loading';
import Login from '../Interface/pageFront/login';
import Report from '../Interface/pageFront/report';
import Settings from '../Interface/pageFront/settings';
import Shop from '../Interface/pageFront/shop';
import Skill from '../Interface/pageFront/skill';
import Skills from '../Interface/pageFront/skills';
import Statistic from '../Interface/pageFront/statistic';
import Waitinternet from '../Interface/pageFront/waitinternet';
import Waitmail from '../Interface/pageFront/waitmail';
import Test from '../Interface/pageFront/test';

class PageManager extends React.Component{
    state = {
        page1: '',
        page2: '',
        animOpacity1: new Animated.Value(0),
        animOpacity2: new Animated.Value(0),
        arguments: {},

        bottomBarShow: false,
        pageIndex: -1,

        // Old
        popupArgs: [ null, null, true ],
        popupCallback: undefined
    }

    componentDidMount() {
        this.changing = false;
        this.path = [];
        user.backPage = this.backPage;
        user.changePage = this.changePage;
        user.openPopup = this.openPopup;
        user.closePopup = this.closePopup;
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
        if (this.changing) return false;

        if (typeof(newpage) === 'undefined' || newpage === '') {
            this.forceUpdate(); return false;
        }

        const newArgs = typeof(args) !== 'undefined' ? args : {};
        this.setState({ arguments: newArgs });

        if (!forceUpdate && newpage == (this.state.page1 || this.state.page2)) {
            return false;
        }

        if (!this.GetPageContent(newpage)) {
            console.error('Calling an incorrect page');
            return false;
        };

        this.changing = true;
        if (!ignorePath) {
            this.path.push([newpage, args]);
        }
        this.pageAnimation(newpage);

        return true;
    }

    pageAnimation = (newpage) => {
        const animation_duration = 200;
        const animation_delay = 100;

        if (!this.state.page1) {
            // Clear page 2
            TimingAnimation(this.state.animOpacity2, 0, 400).start(() => { this.setState({ page2: '' }); });
            // Load page 1
            setTimeout(() => { this.setState({ page1: newpage }); }, 0);
            setTimeout(() => { TimingAnimation(this.state.animOpacity1, 1, animation_duration).start(); }, animation_delay);
        } else {
            // Clear page 1
            TimingAnimation(this.state.animOpacity1, 0, 400).start(() => { this.setState({ page1: '' }); });
            // Load page 2
            setTimeout(() => { this.setState({ page2: newpage }); }, 0);
            setTimeout(() => { TimingAnimation(this.state.animOpacity2, 1, animation_duration).start(); }, animation_delay);
        }

        const bottomBarPages = [ 'home', 'calendar', 'x', 'settings', 'shop' ];
        const bottomBarShow = bottomBarPages.includes(newpage);
        this.setState({ bottomBarShow: bottomBarShow });

        const index = bottomBarPages.indexOf(newpage);
        this.setState({ pageIndex: index !== -1 ? index : 2 });

        setTimeout(() => {
            this.changing = false;
        }, animation_delay + animation_duration + 200);
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

    GetPageContent(page, args) {
        let p;
        switch (page) {
            case 'about': p = <About />; break;
            case 'achievements': p = <Achievements />; break;
            case 'activity': p = <Activity args={args} />; break;
            case 'calendar': p = <Calendar />; break;
            case 'dailyquest': p = <Dailyquest />; break;
            case 'experience': p = <Experience />; break;
            case 'home': p = <Home />; break;
            case 'identity': p = <Identity />; break;
            case 'leaderboard': p = <Leaderboard />; break;
            case 'loading': p = <Loading args={args} />; break;
            case 'login': p = <Login />; break;
            case 'report': p = <Report />; break;
            case 'settings': p = <Settings />; break;
            case 'shop': p = <Shop />; break;
            case 'skill': p = <Skill args={args} />; break;
            case 'skills': p = <Skills />; break;
            case 'statistic': p = <Statistic args={args} />; break;
            case 'waitinternet': p = <Waitinternet />; break;
            case 'waitmail': p = <Waitmail args={args} />; break;
            case 'test': p = <Test />; break;
        }
        return p;
    }

    render() {
        const page1 = this.GetPageContent(this.state.page1, this.state.arguments);
        const page2 = this.GetPageContent(this.state.page2, this.state.arguments);

        const fullscreen = { width: '100%', height: '100%' }

        /*const inter = {
            inputRange:  [0, 0.4, 0.8, 1],
            outputRange: [0, 0.8, 0.2, 1]
        };*/
        const inter = {
            inputRange:  [0, .5, 1],
            outputRange: [0, 0, 1]
        };

        return (
            <LinearGradient style={fullscreen} colors={['#03052E', '#353657']}>
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
                <BottomBar show={this.state.bottomBarShow} selectedIndex={this.state.pageIndex} />
            </LinearGradient>
        )
    }
}

export default PageManager;