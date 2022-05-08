import * as React from 'react';
import { Animated, BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import * as Pages from '../Interface/Pages';
import langManager from './LangManager';

import { TimingAnimation } from '../Utils/Animations';
import { IsUndefined, Range } from '../Utils/Functions';
import { BottomBar, Console, Popup, ScreenInput, ScreenList } from '../Interface/Widgets';

/**
 * @typedef {'about'|'achievements'|'activity'|'activityTimer'|'calendar'|'display'|'home'|'identity'|'loading'|'login'|'multiplayer'|'onboarding'|'report'|'settings'|'shop'|'skill'|'skills'|'waitinternet'|'waitmail'|'task'|'tasks'|'test'} PageName
 */

const DEBUG_MODE = false;
const PAGE_NUMBER = 4;

/** @type {Array<PageName>} */
const CACHE_IGNORE = [
    'about',
    'activity',
    'activityTimer',
    'onboarding',
    'loading',
    'login',
    'waitinternet',
    'waitmail',
    'display',
    'skill',
    'shop',
    'task',
    'tasks'
];

class PageManager extends React.Component{
    state = {
        pageIndex: 0,
        pageIndexNext: Math.min(1, PAGE_NUMBER - 1),
        pageArguments: {},
        pages: Array(PAGE_NUMBER).fill(''),
        pagesContent: Array(PAGE_NUMBER).fill(null),
        pagesAnimations: Array(PAGE_NUMBER).fill(0).map(() => new Animated.Value(0)),

        animTransition: new Animated.Value(1),
        animTheme: new Animated.Value(0),

        ignorePage: false,
        bottomBarShow: false,
        bottomBarIndex: -1
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

    setStateSync = (state) => new Promise((resolve) => this.setState(state, resolve));

    /**
     * Try to get last page content
     * @param {Boolean} [force=false] If true, try to get back until page changed
     * @returns {Boolean} True if page changed
     */
    BackPage = (force = false) => {
        if (force && this.changing) {
            setTimeout(() => this.BackPage(true), 100);
            return false;
        }
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
     * @param {Object} pageArguments
     * @param {Boolean} ignorePage
     * @param {Boolean} forceUpdate
     * @returns 
     */
    ChangePage = (newpage, pageArguments = {}, ignorePage = false, forceUpdate = false) => {
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

        this.changing = true;
        this.setState({ pageArguments, ignorePage }, () => this.pageAnimation(newpage));

        return true;
    }

    SetTheme = (index) => {
        TimingAnimation(this.state.animTheme, index, 100).start();
    }

    pageAnimation = async (newPage) => {
        const animDuration = 120;
        this.T = new Date().getTime();
        if (DEBUG_MODE) console.log('PageManager path:', this.path);

        // Bottom bar selected index animation
        const bottomBarPages = [ 'home', 'calendar', 'x', 'multiplayer', 'shop' ];
        const bottomBarShow = bottomBarPages.includes(newPage);
        const index = bottomBarPages.indexOf(newPage);
        const newBarState = { bottomBarShow: bottomBarShow, bottomBarIndex: index !== -1 ? index : 2 };
        if (!bottomBarShow) this.setState(newBarState); // Hide bar before animation if needed

        const { pages, pageIndex, pageIndexNext, pagesContent, pagesAnimations, pageArguments, animTransition } = this.state;

        // Start loading animation
        TimingAnimation(animTransition, 1, animDuration).start();
        TimingAnimation(pagesAnimations[pageIndex], 0, animDuration).start();

        let nextIndex = pageIndex;

        // Not keep cache for some pages
        if (pages.some(p => CACHE_IGNORE.indexOf(p) !== -1)) {
            const notInCachePage = pages.find(p => CACHE_IGNORE.indexOf(p) !== -1);
            nextIndex = pages.indexOf(notInCachePage);
            pages.splice(nextIndex, 1, '');
            pagesContent.splice(nextIndex, 1, null);
            await this.setStateSync({ pages, pagesContent });
        }

        if (pages.includes(newPage)) {
            nextIndex = pages.indexOf(newPage);
        } else {
            if (pages[pageIndex]) {
                nextIndex = pageIndexNext;
                if (!CACHE_IGNORE.includes(newPage)) {
                    this.setState({ pageIndexNext: (pageIndexNext + 1) % PAGE_NUMBER });
                }
            }
            pages.splice(nextIndex, 1, newPage);
            pagesContent.splice(nextIndex, 1, this.getPageContent(newPage, pageArguments));
            await this.setStateSync({ pages, pagesContent });
        }

        await this.setStateSync({ ...newBarState, pageIndex: nextIndex });

        this.changing = false;
        const elapsedTime = (new Date().getTime()) - this.T;
        if (DEBUG_MODE) console.log('Page changed in ' + elapsedTime + 'ms');

        Animated.parallel([
            TimingAnimation(animTransition, 0, animDuration),
            TimingAnimation(pagesAnimations[nextIndex], 1, animDuration)
        ]).start();
    }

    getPageContent(page, args) {
        let p;
        switch (page) {
            case 'about':           p = <Pages.About />; break;
            case 'achievements':    p = <Pages.Achievements />; break;
            case 'activity':        p = <Pages.Activity args={args} />; break;
            case 'activitytimer':   p = <Pages.ActivityTimer />; break;
            case 'calendar':        p = <Pages.Calendar />; break;
            case 'display':         p = <Pages.Display args={args} />; break;
            case 'experience':      p = <Pages.Experience />; break;
            case 'home':            p = <Pages.Home />; break;
            case 'identity':        p = <Pages.Identity />; break;
            case 'loading':         p = <Pages.Loading args={args} />; break;
            case 'login':           p = <Pages.Login />; break;
            case 'multiplayer':     p = <Pages.Multiplayer />; break;
            case 'onboarding':      p = <Pages.Onboarding />; break;
            case 'report':          p = <Pages.Report />; break;
            case 'settings':        p = <Pages.Settings />; break;
            case 'shop':            p = <Pages.Shop />; break;
            case 'skill':           p = <Pages.Skill args={args} />; break;
            case 'skills':          p = <Pages.Skills />; break;
            case 'task':            p = <Pages.Task args={args} />; break;
            case 'tasks':           p = <Pages.Tasks />; break;
            case 'waitinternet':    p = <Pages.Waitinternet />; break;
            case 'waitmail':        p = <Pages.Waitmail args={args} />; break;
            case 'test':            p = <Pages.Test />; break;
        }
        return p;
    }

    render() {
        const { pageIndex, pagesContent, pagesAnimations, animTransition, animTheme } = this.state;

        const interOpacity = { inputRange: [0, 1], outputRange: [0, 0.2] };
        const fullscreen = { width: '100%', height: '100%' };
        const absolute = { position: 'absolute', top: 0, left: 0 };
        const overlayStyle = [fullscreen, absolute, { backgroundColor: '#000000', opacity: animTransition.interpolate(interOpacity) }];

        const darkBackground = ['#03052E', '#353657'];
        const lightBackground = ['#FFFFFF', '#FFFFFF'];
        const lightOpacity = { opacity: animTheme };

        const newPage = (index) => {
            const content = pagesContent[index];
            const style = [ fullscreen, absolute, { opacity: pagesAnimations[index] } ];
            const event = pageIndex === index ? 'auto' : 'none';
            return <Animated.View key={'page-'+index} style={style} pointerEvents={event}>{content}</Animated.View>;
        }

        if (DEBUG_MODE) console.log(this.state.pages);

        return (
            <LinearGradient style={fullscreen} colors={darkBackground}>
                {/* Light background */}
                <Animated.View style={[absolute, fullscreen, lightOpacity]} pointerEvents='none'>
                    <LinearGradient style={fullscreen} colors={lightBackground} />
                </Animated.View>

                {Range(PAGE_NUMBER).map(newPage)}
                <Animated.View style={overlayStyle} pointerEvents='none' />

                <BottomBar show={this.state.bottomBarShow} selectedIndex={this.state.bottomBarIndex} />
                <Popup ref={ref => { if (ref !== null) this.popup = ref }} />

                <ScreenList ref={ref => { if (ref !== null) this.screenList = ref }} />
                <ScreenInput ref={ref => { if (ref !== null) this.screenInput = ref }} />

                <Console ref={ref => { if (ref !== null) this.console = ref }} />
            </LinearGradient>
        )
    }
}

export default PageManager;