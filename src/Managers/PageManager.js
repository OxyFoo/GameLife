import * as React from 'react';
import { Animated, BackHandler, StyleSheet } from 'react-native';
import RNExitApp from 'react-native-exit-app';
import LinearGradient from 'react-native-linear-gradient';

import * as Pages from '../Interface/Pages';
import langManager from './LangManager';
import themeManager from './ThemeManager';

import { TimingAnimation } from '../Utils/Animations';
import { IsUndefined, Range } from '../Utils/Functions';
import { BottomBar, Console, Popup, ScreenInput, ScreenList, UserHeader } from '../Interface/Widgets';

/**
 * @typedef {'about'|'achievements'|'activity'|'activityTimer'|'calendar'|'display'|'home'|'loading'|'login'|'multiplayer'|'onboarding'|'profile'|'report'|'settings'|'shop'|'shopitems'|'skill'|'skills'|'waitinternet'|'waitmail'|'task'|'tasks'|'test'} PageName
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
    'shopitems',
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
         * @description Custom back button handler
         * @type {function?}
         */
        this.customBackHandle = null;

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

        /**
         * @type {UserHeader}
         */
        this.header = new React.createRef();
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backHandle);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backHandle);
    }

    /**
     * @param {function} handle
     * @returns {boolean} True if handle is set
     */
    SetCustomBackHandle(handle) {
        if (typeof(handle) !== 'function') {
            return false;
        }
        this.customBackHandle = handle;
    }
    ResetCustomBackHandle() {
        this.customBackHandle = null;
    }
    backHandle = () => {
        if (!this.backable) return false;

        if (this.customBackHandle !== null) {
            this.customBackHandle();
            return true;
        }
        if (this.popup.Close()) return true;
        if (this.BackPage()) return true;

        return true;
    }

    setStateSync = (state) => new Promise((resolve) => this.setState(state, resolve));

    /**
     * Try to get last page content
     * @param {boolean} [force=false] If true, try to get back until page is changing
     * @returns {boolean} True if page changed
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
            const callback = (btn) => btn === 'yes' && RNExitApp.exitApp();
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
     * @param {object} pageArguments
     * @param {boolean} ignorePage
     * @param {boolean} forceUpdate
     * @returns {boolean} True if changing page started
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

    /**
     * Change theme
     * @param {number} index 0: Dark theme (default), 1: Light theme
     */
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

    /**
     * @param {PageName} page
     * @param {object} [args]
     */
    getPageContent(page, args) {
        let p;
        switch (page) {
            case 'about':           p = <Pages.About />;                    break;
            case 'achievements':    p = <Pages.Achievements />;             break;
            case 'activity':        p = <Pages.Activity args={args} />;     break;
            case 'activitytimer':   p = <Pages.ActivityTimer />;            break;
            case 'calendar':        p = <Pages.Calendar />;                 break;
            case 'display':         p = <Pages.Display args={args} />;      break;
            case 'experience':      p = <Pages.Experience />;               break;
            case 'home':            p = <Pages.Home />;                     break;
            case 'loading':         p = <Pages.Loading args={args} />;      break;
            case 'login':           p = <Pages.Login />;                    break;
            case 'multiplayer':     p = <Pages.Multiplayer />;              break;
            case 'onboarding':      p = <Pages.Onboarding />;               break;
            case 'profile':         p = <Pages.Profile />;                  break;
            case 'report':          p = <Pages.Report />;                   break;
            case 'settings':        p = <Pages.Settings />;                 break;
            case 'shop':            p = <Pages.Shop />;                     break;
            case 'shopitems':       p = <Pages.ShopItems />;                break;
            case 'skill':           p = <Pages.Skill args={args} />;        break;
            case 'skills':          p = <Pages.Skills />;                   break;
            case 'task':            p = <Pages.Task args={args} />;         break;
            case 'tasks':           p = <Pages.Tasks />;                    break;
            case 'waitinternet':    p = <Pages.Waitinternet />;             break;
            case 'waitmail':        p = <Pages.Waitmail args={args} />;     break;
            case 'test':            p = <Pages.Test />;                     break;
        }
        return p;
    }

    render() {
        const { pageIndex, pagesContent, pagesAnimations, animTransition, animTheme } = this.state;

        const interOpacity = { inputRange: [0, 1], outputRange: [0, 0.2] };
        const overlayStyle = [styles.fullscreen, styles.absolute, { backgroundColor: '#000000', opacity: animTransition.interpolate(interOpacity) }];

        const darkBackground = [ themeManager.THEMES.Dark.ground1, themeManager.THEMES.Dark.ground2 ];
        const lightBackground = [ themeManager.THEMES.Light.ground1, themeManager.THEMES.Light.ground2 ];
        const lightOpacity = { opacity: animTheme };

        const newPage = (index) => {
            const content = pagesContent[index];
            const style = [ styles.fullscreen, styles.absolute, { opacity: pagesAnimations[index] } ];
            const event = pageIndex === index ? 'auto' : 'none';
            return <Animated.View key={'page-'+index} style={style} pointerEvents={event}>{content}</Animated.View>;
        }

        if (DEBUG_MODE) console.log(this.state.pages);

        return (
            <LinearGradient style={styles.fullscreen} colors={darkBackground}>
                {/* Light background */}
                <Animated.View style={[styles.absolute, styles.fullscreen, lightOpacity]} pointerEvents='none'>
                    <LinearGradient style={styles.fullscreen} colors={lightBackground} />
                </Animated.View>

                {Range(PAGE_NUMBER).map(newPage)}
                <Animated.View style={overlayStyle} pointerEvents='none' />

                <UserHeader ref={ref => { if (ref !== null) this.header = ref }} show={this.state.bottomBarShow} editorMode={false} />
                <BottomBar show={this.state.bottomBarShow} selectedIndex={this.state.bottomBarIndex} />
                <Popup ref={ref => { if (ref !== null) this.popup = ref }} />

                <ScreenList ref={ref => { if (ref !== null) this.screenList = ref }} />
                <ScreenInput ref={ref => { if (ref !== null) this.screenInput = ref }} />

                <Console ref={ref => { if (ref !== null) this.console = ref }} />
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    fullscreen: {
        width: '100%',
        height: '100%'
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0
    }
});

export default PageManager;