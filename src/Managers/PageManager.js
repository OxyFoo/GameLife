import * as React from 'react';
import { Animated, BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import user from '../Managers/UserManager';
import langManager from './LangManager';
import { TimingAnimation } from '../Functions/Animations';
import { IsUndefined } from '../Functions/Functions';
import { BottomBar, Popup } from '../Interface/Widgets';

import About from '../Interface/PageFront/About';
import Achievements from '../Interface/PageFront/Achievements';
import Activity from '../Interface/PageFront/Activity';
import ActivityTimer from '../Interface/PageFront/ActivityTimer';
import Calendar from '../Interface/PageFront/Calendar';
import Dailyquest from '../Interface/PageFront/Dailyquest';
import Display from '../Interface/PageFront/Display';
import Experience from '../Interface/PageFront/Experience';
import Home from '../Interface/PageFront/Home';
import Identity from '../Interface/PageFront/Identity';
import Leaderboard from '../Interface/PageFront/Leaderboard';
import Loading from '../Interface/PageFront/Loading';
import Login from '../Interface/PageFront/Login';
import Multiplayer from '../Interface/PageFront/Multiplayer';
import Report from '../Interface/PageFront/Report';
import Settings from '../Interface/PageFront/Settings';
import Shop from '../Interface/PageFront/Shop';
import Skill from '../Interface/PageFront/Skill';
import Skills from '../Interface/PageFront/Skills';
import Waitinternet from '../Interface/PageFront/WaitInternet';
import Waitmail from '../Interface/PageFront/WaitMail';
import Test from '../Interface/PageFront/Test';

class PageManager extends React.Component{
    state = {
        page1: '',
        page2: '',
        animOpacity1: new Animated.Value(0),
        animOpacity2: new Animated.Value(0),
        animTransition: new Animated.Value(1),
        arguments: {},
        ignorePage: false,

        bottomBarShow: false,
        pageIndex: -1
    }

    constructor(props) {
        super(props);

        /**
         * @description Disable changing page while loading
         */
        this.changing = false;

        /**
         * @description Disable back button
         */
        this.backable = true;

        /**
         * @description Represent all pages before current page
         * Increment when changing page
         */
        this.path = [];

        /**
         * Link this class to user to skip cycle warnings
         */
        user.interface = this;

        this.popup = new React.createRef();
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backHandle);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backHandle);
    }

    backHandle = () => {
        if (!this.backable) return false;

        if (this.popup.Close()) return true;
        if (this.BackPage()) return true;

        return true;
    }

    BackPage = () => {
        if (this.changing) return false;
        if (this.path.length < 1) {
            const title = langManager.curr['home']['alert-exit-title'];
            const text = langManager.curr['home']['alert-exit-text'];
            const callback = (btn) => btn === 'yes' && BackHandler.exitApp();
            this.popup.Open('yesno', [ title, text ], callback);
            return false;
        }
        this.changing = true;
        const [ prevPage, prevArgs ] = this.path[this.path.length - 1];
        this.path.length = this.path.length - 1;
        this.setState({ arguments: prevArgs, ignorePage: false });
        this.pageAnimation(prevPage);
        return true;
    }

    ChangePage = (newpage, args, ignorePage = false, forceUpdate = false) => {
        if (this.changing) return false;

        const prevPage = this.state.page1 || this.state.page2;

        if (IsUndefined(newpage) || newpage === '') {
            this.forceUpdate(); return false;
        }

        if (!forceUpdate && newpage == prevPage) {
            return false;
        }

        if (!this.getPageContent(newpage)) {
            console.error('Calling an incorrect page');
            return false;
        };

        // If current (prev) page is not ignored, add it to path, except first loading (no first pages)
        if (!this.state.ignorePage && prevPage != '') {
            this.path.push([prevPage, this.state.arguments]);
        }

        const newArgs = !IsUndefined(args) ? args : {};
        this.setState({ arguments: newArgs, ignorePage: ignorePage });

        this.changing = true;
        this.pageAnimation(newpage);

        return true;
    }

    pageAnimation = async (newpage) => {
        const animDuration = 200;
        const animScaleDuration = 100;

        TimingAnimation(this.state.animTransition, 0, animScaleDuration).start();
        //await Sleep(animScaleDuration/4);

        // Switch pages animation
        if (!this.state.page1) {
            setTimeout(() => {
                // Load page 1
                this.setState({ page1: newpage }, () => {
                    TimingAnimation(this.state.animTransition, 1, animScaleDuration).start();
                    // Clear page 2
                    TimingAnimation(this.state.animOpacity2, 0, animDuration).start(() => { this.setState({ page2: '' }); });
                    // Show page 1
                    TimingAnimation(this.state.animOpacity1, 1, animDuration).start();
                });
            }, 0);
        } else {
            setTimeout(() => {
                // Load page 2
                this.setState({ page2: newpage }, () => {
                    TimingAnimation(this.state.animTransition, 1, animScaleDuration).start();
                    // Clear page 1
                    TimingAnimation(this.state.animOpacity1, 0, animDuration).start(() => { this.setState({ page1: '' }); });
                    // Show page 2
                    TimingAnimation(this.state.animOpacity2, 1, animDuration).start();
                });
            }, 0);
        }

        // Bottom bar selected index animation
        const bottomBarPages = [ 'home', 'calendar', 'x', 'multiplayer', 'shop' ];
        const bottomBarShow = bottomBarPages.includes(newpage);
        this.setState({ bottomBarShow: bottomBarShow });
        const index = bottomBarPages.indexOf(newpage);
        this.setState({ pageIndex: index !== -1 ? index : 2 });

        setTimeout(() => {
            this.changing = false;
        }, animDuration + 300);
    }

    GetCurrentPage = () => {
        return this.state.page1 || this.state.page2;
    }

    getPageContent(page, args) {
        let p;
        switch (page) {
            case 'about': p = <About />; break;
            case 'achievements': p = <Achievements />; break;
            case 'activity': p = <Activity args={args} />; break;
            case 'activitytimer': p = <ActivityTimer args={args} />; break;
            case 'calendar': p = <Calendar />; break;
            case 'dailyquest': p = <Dailyquest />; break;
            case 'display': p = <Display args={args} />; break;
            case 'experience': p = <Experience />; break;
            case 'home': p = <Home />; break;
            case 'identity': p = <Identity />; break;
            case 'leaderboard': p = <Leaderboard />; break;
            case 'loading': p = <Loading args={args} />; break;
            case 'login': p = <Login />; break;
            case 'multiplayer': p = <Multiplayer />; break;
            case 'report': p = <Report />; break;
            case 'settings': p = <Settings />; break;
            case 'shop': p = <Shop />; break;
            case 'skill': p = <Skill args={args} />; break;
            case 'skills': p = <Skills />; break;
            case 'waitinternet': p = <Waitinternet />; break;
            case 'waitmail': p = <Waitmail args={args} />; break;
            case 'test': p = <Test />; break;
        }
        return p;
    }

    render() {
        const page1 = this.getPageContent(this.state.page1, this.state.arguments);
        const page2 = this.getPageContent(this.state.page2, this.state.arguments);

        const interScale = { inputRange: [0, 1], outputRange: [0.95, 1] };
        const interOpacity = { inputRange: [0, 1], outputRange: [0.2, 0] };

        const fullscreen = { width: '100%', height: '100%' };
        const absolute = { position: 'absolute', top: 0, left: 0 };
        const scale = { transform: [{ scale: this.state.animTransition.interpolate(interScale) }] };
        const page1Style = [fullscreen, absolute, scale, { opacity: this.state.animOpacity1 }];
        const page2Style = [fullscreen, absolute, scale, { opacity: this.state.animOpacity2 }];
        const page1Event = this.state.page1 ? 'auto' : 'none';
        const page2Event = this.state.page2 ? 'auto' : 'none';
        const overlayStyle = [fullscreen, absolute, { backgroundColor: '#000000', opacity: this.state.animTransition.interpolate(interOpacity) }];

        return (
            <LinearGradient style={fullscreen} colors={['#03052E', '#353657']}>
                <Animated.View style={page1Style} pointerEvents={page1Event}>{page1}</Animated.View>
                <Animated.View style={page2Style} pointerEvents={page2Event}>{page2}</Animated.View>
                <BottomBar show={this.state.bottomBarShow} selectedIndex={this.state.pageIndex} />
                <Popup ref={ref => { if (ref !== null) this.popup = ref }} />
                <Animated.View style={overlayStyle} pointerEvents='none' />
            </LinearGradient>
        )
    }
}

export default PageManager;