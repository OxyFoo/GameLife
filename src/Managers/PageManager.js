import * as React from 'react';
import { Animated, BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import langManager from './LangManager';

import { TimingAnimation } from '../Utils/Animations';
import { IsUndefined, Range } from '../Utils/Functions';
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
import Onboarding from '../Interface/PageFront/Onboarding';
import Report from '../Interface/PageFront/Report';
import Settings from '../Interface/PageFront/Settings';
import Shop from '../Interface/PageFront/Shop';
import Skill from '../Interface/PageFront/Skill';
import Skills from '../Interface/PageFront/Skills';
import Waitinternet from '../Interface/PageFront/WaitInternet';
import Waitmail from '../Interface/PageFront/WaitMail';
import Test from '../Interface/PageFront/Test';

/**
 * @typedef {'about'|'achievements'|'activity'|'activityTimer'|'calendar'|'display'|'home'|'identity'|'loading'|'login'|'multiplayer'|'onboarding'|'report'|'settings'|'shop'|'skill'|'skills'|'waitinternet'|'waitmail'|'test'} PageName
 */

const pageNumber = 3;

class PageManager extends React.Component{
    state = {
        pageIndex: 0,
        pageArguments: {},
        pages: Array(pageNumber).fill(''),
        pagesAnimations: Array(pageNumber).fill(0).map(() => new Animated.Value(0)),

        animTransition: new Animated.Value(1),
        animTheme: new Animated.Value(0),

        ignorePage: false,
        bottomBarShow: false,
        bottomBarIndex: -1,
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
        this.setState({ pageArguments: prevArgs, ignorePage: false });
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

        const prevPage = this.state.pages[this.state.pageIndex];

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
            this.path.push([prevPage, this.state.pageArguments]);
        }

        const newArgs = !IsUndefined(args) ? args : {};
        this.setState({ pageArguments: newArgs, ignorePage: ignorePage });

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
        const newBarState = { bottomBarShow: bottomBarShow, bottomBarIndex: index !== -1 ? index : 2 };
        if (!bottomBarShow) this.setState(newBarState);

        const { pages, pageIndex, pagesAnimations, animTransition } = this.state;
        let nextIndex = pageIndex;
        if (pages.includes(newpage)) nextIndex = pages.indexOf(newpage);
        else if (pages[pageIndex])   nextIndex = (pageIndex + 1) % pageNumber;

        // Start loading animation
        TimingAnimation(animTransition, 1, animTransitionDuration).start();

        const AnimationEnd = () => {
            this.changing = false;
            this.setState({ pageIndex: nextIndex });
            TimingAnimation(animTransition, 0, animTransitionDuration).start();
            TimingAnimation(pagesAnimations[nextIndex], 1, animTransitionDuration).start();
        };
        const AnimationStart = () => {
            TimingAnimation(pagesAnimations[pageIndex], 0, animTransitionDuration).start();
            pages.splice(nextIndex, 1, newpage);
            const newPages = { pages: pages };
            const newState = Object.assign(newBarState, newPages);
            this.setState(newState, AnimationEnd);
        }

        setTimeout(AnimationStart, animTransitionDuration);
    }

    GetCurrentPage = () => {
        const { pages, pageIndex } = this.state;
        return pages[pageIndex];
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
            case 'onboarding': p = <Onboarding />; break;
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
        const { pages, pageIndex, pageArguments, pagesAnimations, animTransition, animTheme } = this.state;

        const interOpacity = { inputRange: [0, 1], outputRange: [0, 0.2] };
        const fullscreen = { width: '100%', height: '100%' };
        const absolute = { position: 'absolute', top: 0, left: 0 };
        const overlayStyle = [fullscreen, absolute, { backgroundColor: '#000000', opacity: animTransition.interpolate(interOpacity) }];

        const darkBackground = ['#03052E', '#353657'];
        const lightBackground = ['#FFFFFF', '#FFFFFF'];
        const lightOpacity = { opacity: animTheme };

        const newPage = (index) => {
            const page = this.getPageContent(pages[index], pageArguments);
            const style = [ fullscreen, absolute, { opacity: pagesAnimations[index] } ];
            const event = pageIndex === index ? 'auto' : 'none';
            return <Animated.View key={'page-'+index} style={style} pointerEvents={event}>{page}</Animated.View>;
        }

        return (
            <LinearGradient style={fullscreen} colors={darkBackground}>
                {/* Light background */}
                <Animated.View style={[absolute, fullscreen, lightOpacity]} pointerEvents='none'>
                    <LinearGradient style={fullscreen} colors={lightBackground} />
                </Animated.View>

                {Range(pageNumber).map(i => newPage(i))}
                <Animated.View style={overlayStyle} pointerEvents='none' />

                <BottomBar show={this.state.bottomBarShow} selectedIndex={this.state.bottomBarIndex} />
                <Popup ref={ref => { if (ref !== null) this.popup = ref }} />

                <ScreenList ref={ref => { if (ref !== null) this.screenList = ref }} />
                <ScreenInput ref={ref => { if (ref !== null) this.screenInput = ref }} />

                <Console ref={ref => { if (ref !== null) this.console = ref }} enable={this.state.console} />
            </LinearGradient>
        )
    }
}

export default PageManager;