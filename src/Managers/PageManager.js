import * as React from 'react';
import { Animated, BackHandler, StyleSheet, View } from 'react-native';
import RNExitApp from 'react-native-exit-app';
import LinearGradient from 'react-native-linear-gradient';

import * as Pages from '../Interface/Pages';
import langManager from './LangManager';
import themeManager from './ThemeManager';

import { TimingAnimation } from '../Utils/Animations';
import { IsUndefined, Sleep } from '../Utils/Functions';
import { BottomBar, Console, Popup, ScreenInput, ScreenList, UserHeader } from '../Interface/Widgets';
import { PageBack } from '../Interface/Components';

/**
 * @typedef {import('../Interface/Components').PageBack} PageBack
 * @typedef {'about'|'achievements'|'activity'|'activityTimer'|'calendar'|'display'|'home'|'loading'|'login'|'multiplayer'|'onboarding'|'profile'|'report'|'settings'|'shop'|'shopitems'|'skill'|'skills'|'waitinternet'|'waitmail'|'task'|'tasks'|'test'} PageName
 * @typedef {typeof Pages.About | typeof Pages.Achievements | typeof Pages.Activity | typeof Pages.ActivityTimer | typeof Pages.Calendar | typeof Pages.Display | typeof Pages.Home | typeof Pages.Loading | typeof Pages.Login | typeof Pages.Multiplayer | typeof Pages.Onboarding | typeof Pages.Profile | typeof Pages.Report | typeof Pages.Settings | typeof Pages.Shop | typeof Pages.ShopItems | typeof Pages.Skill | typeof Pages.Skills | typeof Pages.Task | typeof Pages.Tasks | typeof Pages.Waitinternet | typeof Pages.Waitmail | typeof Pages.Test} PageType
 * 
 * @typedef PageState
 * @type {Object}
 * @property {PageType} content
 * @property {PageBack} ref
 * @property {object} args Unused
 */

const DEBUG_MODE = false;

/**
 * @description Pages that will be cached
 * /!\ Do not forget "super.componentDidMount()" in BackPages
 * /!\ Do not put "tasks" or "skills" pages in this list
 * @type {Array<PageName>}
 */
const PAGES_PERSISTENT = [
    'calendar',
    'home',
    'multiplayer',
    'profile',
    'shop',
    'shopitems',
];

const CACHE_PAGES = {
    /** @type {{[key: PageName|string]: PageState}} */
    persistent: {},

    /** @type {PageState|null} */
    temp: null
};

class PageManager extends React.Component{
    state = {
        /** @type {PageName} */
        selectedPage: '',

        animTheme: new Animated.Value(0),

        ignorePage: false,
        bottomBarShow: false,
        bottomBarIndex: -1
    }

    constructor(props) {
        super(props);

        /** @description Disable changing page while loading */
        this.changing = false;

        /** @description Disable back button */
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

        /** @type {Popup} */        this.popup = new React.createRef();
        /** @type {ScreenInput} */  this.screenInput = new React.createRef();
        /** @type {ScreenList} */   this.screenList = new React.createRef();
        /** @type {UserHeader} */   this.header = new React.createRef();
        /** @type {BottomBar} */    this.bottomBar = new React.createRef();
        /** @type {Console} */      this.console = new React.createRef();
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backHandle);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backHandle);
    }

    LoadDefaultPages = async () => {
        PAGES_PERSISTENT.forEach(page => {
            CACHE_PAGES.persistent[page] = { content: null, ref: null, args: {} };
            CACHE_PAGES.persistent[page].content = this.getPageContent(page);
        });
        this.forceUpdate();

        // Wait for all pages to be loaded
        const pageIsLoading = page => page.ref === null || page.ref.loaded === false;
        while (Object.values(CACHE_PAGES.persistent).some(pageIsLoading)) {
            await Sleep(1000);
        }
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
        if (this.changing) {
            if (force) {
                setTimeout(() => this.BackPage(true), 100);
            }
            return false;
        }

        if (this.path.length < 1) {
            const title = langManager.curr['home']['alert-exit-title'];
            const text = langManager.curr['home']['alert-exit-text'];
            const callback = (btn) => btn === 'yes' && RNExitApp.exitApp();
            this.popup.Open('yesno', [ title, text ], callback);
            return false;
        }

        const [ prevPage, prevArgs ] = this.path[this.path.length - 1];
        this.path.length = this.path.length - 1;
        this.setState({ ignorePage: false });
        this.pageAnimation(prevPage);
        return true;
    }

    /**
     * Open page
     * @param {PageName} nextpage
     * @param {object} pageArguments
     * @param {boolean} ignorePage
     * @param {boolean} forceUpdate
     * @returns {Promise|false} True if changing page started
     */
    ChangePage = (nextpage, pageArguments = {}, ignorePage = false, forceUpdate = false) => {
        if (this.changing) return false;

        // Undefined page: update & return false
        if (IsUndefined(nextpage) || nextpage === '') {
            this.forceUpdate();
            return false;
        }

        // Same page & not force update: return false
        const { selectedPage } = this.state;
        if (!forceUpdate && nextpage === selectedPage) {
            return false;
        }

        // Page not exist: return false
        if (this.getPageContent(nextpage) === null) {
            console.warn('error', 'Calling an incorrect page');
            return false;
        };

        // If current (prev) page is not ignored, add it to path, except first loading (no first pages)
        if (!this.state.ignorePage && selectedPage !== '') {
            this.path.push([selectedPage, pageArguments]);
        }

        // Exception: if page is login, clear path
        if (nextpage === 'login') {
            this.path = [];
        }

        // Set page arguments
        if (Object.keys(CACHE_PAGES.persistent).includes(nextpage)) {
            CACHE_PAGES.persistent[nextpage].args = pageArguments;
        }

        // Set temp page arguments
        else if (CACHE_PAGES.temp !== null) {
            CACHE_PAGES.temp.args = pageArguments;
        }

        this.setState({ ignorePage });
        return new Promise(async (resolve) => {
            await this.pageAnimation(nextpage);
            resolve();
        });
    }

    /**
     * Change theme
     * @param {number} index 0: Dark theme (default), 1: Light theme
     */
    SetTheme = (index) => {
        TimingAnimation(this.state.animTheme, index, 100).start();
    }

    /**
     * @param {PageName} newPage
     * @returns {Promise}
     */
    pageAnimation = async (newPage) => {
        this.changing = true;

        const T = new Date().getTime();
        if (DEBUG_MODE) console.log('PageManager path:', this.path);

        // Bottom bar selected index animation
        const bottomBarPages = [ 'home', 'calendar', 'x', 'multiplayer', 'shop' ];
        const bottomBarShow = bottomBarPages.includes(newPage);
        const index = bottomBarPages.indexOf(newPage);
        const newBarState = { bottomBarShow: bottomBarShow, bottomBarIndex: index !== -1 ? index : 2 };
        if (!bottomBarShow) this.setState(newBarState); // Hide bar before animation if needed

        // Hide current page
        const { selectedPage } = this.state;
        if (selectedPage !== '') {
            if (Object.keys(CACHE_PAGES.persistent).includes(selectedPage)) {
                if (typeof(CACHE_PAGES.persistent[selectedPage]?.ref?.refPage?.Hide) === 'function') {
                    CACHE_PAGES.persistent[selectedPage].ref.refPage.Hide();
                }
            } else {
                if (typeof(CACHE_PAGES.temp?.ref?.refPage?.Hide) === 'function') {
                    CACHE_PAGES.temp.ref.refPage.Hide();
                }
            }
        }

        // Show new page
        if (Object.keys(CACHE_PAGES.persistent).includes(newPage)) {
            if (typeof(CACHE_PAGES.persistent[newPage]?.ref?.refPage?.Show) === 'function') {
                CACHE_PAGES.persistent[newPage].ref.refPage.Show();
                CACHE_PAGES.persistent[newPage].ref.componentDidFocused();
                this.setState({ selectedPage: newPage });
            } else {
                console.log('Ref undefined (' + newPage + ')');
            }
        } else {
            CACHE_PAGES.temp = { content: null, ref: null, args: {} };
            CACHE_PAGES.temp.content = this.getPageContent(newPage, true);
            this.setState({ selectedPage: newPage }, () => {
                if (typeof(CACHE_PAGES.temp?.ref?.refPage?.Show) === 'function') {
                    CACHE_PAGES.temp.ref.refPage.Show();
                    CACHE_PAGES.temp.ref.componentDidFocused();
                } else {
                    console.log('Ref undefined (temp)', CACHE_PAGES.temp);
                }
            });
        }

        if (bottomBarShow) this.setState(newBarState); // Show bar after animation if needed

        this.changing = false;
        const elapsedTime = (new Date().getTime()) - T;
        if (DEBUG_MODE) console.log('Page changed in ' + elapsedTime + 'ms');
    }

    /**
     * @param {PageName} page
     * @param {boolean} tempRef
     * @returns {JSX.Element|null}
     */
    getPageContent(page, tempRef = false) {
        let setRef = () => null;
        if (tempRef && CACHE_PAGES.temp !== null) {
            setRef = (ref) => { if (CACHE_PAGES.temp !== null) CACHE_PAGES.temp.ref = ref };
        } else if (Object.keys(CACHE_PAGES.persistent).includes(page)) {
            setRef = (ref) => CACHE_PAGES.persistent[page].ref = ref;
        }

        const key = 'page-' + page + '-' + Math.random();
        const pages = {
            'about':            Pages.About,
            'achievements':     Pages.Achievements,
            'activity':         Pages.Activity,
            'activitytimer':    Pages.ActivityTimer,
            'calendar':         Pages.Calendar,
            'display':          Pages.Display,
            'home':             Pages.Home,
            'loading':          Pages.Loading,
            'login':            Pages.Login,
            'multiplayer':      Pages.Multiplayer,
            'onboarding':       Pages.Onboarding,
            'profile':          Pages.Profile,
            'report':           Pages.Report,
            'settings':         Pages.Settings,
            'shop':             Pages.Shop,
            'shopitems':        Pages.ShopItems,
            'skill':            Pages.Skill,
            'skills':           Pages.Skills,
            'task':             Pages.Task,
            'tasks':            Pages.Tasks,
            'waitinternet':     Pages.Waitinternet,
            'waitmail':         Pages.Waitmail,
            'test':             Pages.Test
        };

        if (!pages.hasOwnProperty(page)) {
            return null;
        }

        const Page = pages[page];
        const args = this.path.length ? this.path[this.path.length - 1][1] : {};
        return <Page key={key} args={args} ref={setRef} />;
    }

    renderPage = () => {
    }

    render() {
        const { animTheme } = this.state;

        const darkBackground = [ themeManager.THEMES.Dark.ground1, themeManager.THEMES.Dark.ground2 ];
        const lightBackground = [ themeManager.THEMES.Light.ground1, themeManager.THEMES.Light.ground2 ];
        const lightOpacity = { opacity: animTheme };

        const newPage = (pageName = 'temp') => {
            // Not temp page and not persistent page
            if (pageName !== 'temp' && !Object.keys(CACHE_PAGES.persistent).includes(pageName)) {
                return null;
            }

            if (pageName === 'temp')
                return CACHE_PAGES.temp?.content || null;
            return CACHE_PAGES.persistent[pageName]?.content || null;
        }

        return (
            <LinearGradient style={styles.fullscreen} colors={darkBackground}>
                {/* Light background */}
                <Animated.View style={[styles.absolute, styles.fullscreen, lightOpacity]} pointerEvents='none'>
                    <LinearGradient style={styles.fullscreen} colors={lightBackground} />
                </Animated.View>

                {['temp', ...PAGES_PERSISTENT].map(newPage)}
                {this.renderPage()}

                <UserHeader ref={ref => { if (ref !== null) this.header = ref } } show={this.state.bottomBarShow} editorMode={false} />
                <BottomBar ref={ref => { if (ref !== null) this.bottomBar = ref } } show={this.state.bottomBarShow} selectedIndex={this.state.bottomBarIndex} />
                <Popup ref={ref => { if (ref !== null) this.popup = ref } } />

                <ScreenList ref={ref => { if (ref !== null) this.screenList = ref } } />
                <ScreenInput ref={ref => { if (ref !== null) this.screenInput = ref } } />

                <Console ref={ref => { if (ref !== null) this.console = ref } } />
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