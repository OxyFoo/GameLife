import * as React from 'react';
import { Animated, BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import langManager from './LangManager';

import { TimingAnimation } from '../Functions/Animations';
import { IsUndefined } from '../Functions/Functions';
import { BottomBar, Console, Popup, ScreenInput, ScreenList } from '../Interface/Widgets';

import About from '../Interface/PageFront/About';
import Achievements from '../Interface/PageFront/Achievements';
import Activity from '../Interface/PageFront/Activity';
import ActivityTimer from '../Interface/PageFront/ActivityTimer';
import Calendar from '../Interface/PageFront/Calendar';
import Display from '../Interface/PageFront/Display';
import Home from '../Interface/PageFront/Home';
import Identity from '../Interface/PageFront/Identity';
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

/**
 * @typedef {'about'|'achievements'|'activity'|'activityTimer'|'calendar'|'display'|'home'|'identity'|'loading'|'login'|'multiplayer'|'report'|'settings'|'shop'|'skill'|'skills'|'waitinternet'|'waitmail'|'test'} PageName
 */

class PageManager extends React.Component{
    state = {
        page1: '',
        page2: '',
        anim: {
            page1: new Animated.Value(0),
            page2: new Animated.Value(0)
        },
        animTransition: new Animated.Value(1),
        animTheme: new Animated.Value(0),
        arguments: {},
        ignorePage: false,

        bottomBarShow: false,
        pageIndex: -1,
        console: false
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
         * @type {Popup}
         */
        this.popup = new React.createRef();

        /**
         * @type {ScreenInput}
         */
        this.screenInput = new React.createRef();

        /**
         * @type {ScreenList}
         */
        this.screenList = new React.createRef();

        /**
         * @type {Console}
         */
        this.console = new React.createRef();
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

    EnableConsole = () => this.setState({ console: true });

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

    /**
     * Open page
     * @param {PageName} newpage 
     * @param {Object} args 
     * @param {Boolean} ignorePage 
     * @param {Boolean} forceUpdate 
     * @returns 
     */
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
            console.warn('error', 'Calling an incorrect page');
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

    SetTheme = (index) => {
        TimingAnimation(this.state.animTheme, index, 100).start();
    }

    pageAnimation = async (newpage) => {
        const animDuration = 200;
        const animTransitionDuration = 50;

        // Bottom bar selected index animation
        const bottomBarPages = [ 'home', 'calendar', 'x', 'multiplayer', 'shop' ];
        const bottomBarShow = bottomBarPages.includes(newpage);
        const index = bottomBarPages.indexOf(newpage);
        const newBarState = { bottomBarShow: bottomBarShow, pageIndex: index !== -1 ? index : 2 };
        if (!bottomBarShow) this.setState(newBarState);

        // Start loading animation
        TimingAnimation(this.state.animTransition, 1, animTransitionDuration).start();

        // Page animation
        const nextPage = this.state.page1 === '' ? 'page1' : 'page2';
        const prevPage = nextPage === 'page1' ? 'page2' : 'page1';

        TimingAnimation(this.state.anim[nextPage], 1, animTransitionDuration).start();
        const AnimationEnd = () => {
            this.changing = false;
            this.setState({ [prevPage]: '' });
            TimingAnimation(this.state.animTransition, 0, animTransitionDuration).start();
        };
        const AnimationStart = () => {
            TimingAnimation(this.state.anim[prevPage], 0, animTransitionDuration).start();
            const newState = Object.assign(newBarState, { [nextPage]: newpage });
            this.setState(newState, AnimationEnd);
        }

        setTimeout(AnimationStart, animTransitionDuration);
        //setTimeout(() => { this.setState(newState, AnimationEnd); }, 10);
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
            case 'activitytimer': p = <ActivityTimer />; break;
            case 'calendar': p = <Calendar />; break;
            case 'display': p = <Display args={args} />; break;
            case 'experience': p = <Experience />; break;
            case 'home': p = <Home />; break;
            case 'identity': p = <Identity />; break;
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

        const interOpacity = { inputRange: [0, 1], outputRange: [0, 0.2] };

        const fullscreen = { width: '100%', height: '100%' };
        const absolute = { position: 'absolute', top: 0, left: 0 };

        const page1Style = [fullscreen, absolute, { opacity: this.state.anim['page1'] }];
        const page2Style = [fullscreen, absolute, { opacity: this.state.anim['page2'] }];
        const overlayStyle = [fullscreen, absolute, { backgroundColor: '#000000', opacity: this.state.animTransition.interpolate(interOpacity) }];

        const page1Event = this.state.page1 ? 'auto' : 'none';
        const page2Event = this.state.page2 ? 'auto' : 'none';
        const darkBackground = ['#03052E', '#353657'];
        const lightBackground = ['#FFFFFF', '#FFFFFF'];
        const lightOpacity = { opacity: this.state.animTheme };

        return (
            <LinearGradient style={fullscreen} colors={darkBackground}>
                {/* Light background */}
                <Animated.View style={[absolute, fullscreen, lightOpacity]} pointerEvents='none'>
                    <LinearGradient style={fullscreen} colors={lightBackground} />
                </Animated.View>

                <Animated.View style={page1Style} pointerEvents={page1Event}>{page1}</Animated.View>
                <Animated.View style={page2Style} pointerEvents={page2Event}>{page2}</Animated.View>
                <Animated.View style={overlayStyle} pointerEvents='none' />

                <BottomBar show={this.state.bottomBarShow} selectedIndex={this.state.pageIndex} />
                <Popup ref={ref => { if (ref !== null) this.popup = ref }} />

                <ScreenList ref={ref => { if (ref !== null) this.screenList = ref }} />
                <ScreenInput ref={ref => { if (ref !== null) this.screenInput = ref }} />

                <Console ref={ref => { if (ref !== null) this.console = ref }} enable={this.state.console} />
            </LinearGradient>
        )
    }
}

export default PageManager;