import * as React from 'react';
import { Animated, BackHandler, StyleSheet, View } from 'react-native';
import RNExitApp from 'react-native-exit-app';
import LinearGradient from 'react-native-linear-gradient';

import * as Pages from '../Interface/Pages';
import langManager from './LangManager';
import themeManager from './ThemeManager';

import { TimingAnimation } from '../Utils/Animations';
import { IsUndefined, Range } from '../Utils/Functions';
import { BottomBar, Console, Popup, ScreenInput, ScreenList, UserHeader } from '../Interface/Widgets';
import { PageBack } from '../Interface/Components';

/**
 * @typedef {import('../Interface/Components').PageBack} PageBack
 * @typedef {'about'|'achievements'|'activity'|'activityTimer'|'calendar'|'display'|'home'|'loading'|'login'|'multiplayer'|'onboarding'|'profile'|'report'|'settings'|'shop'|'shopitems'|'skill'|'skills'|'waitinternet'|'waitmail'|'task'|'tasks'|'test'} PageName
 * @typedef {typeof Pages.About | typeof Pages.Achievements | typeof Pages.Activity | typeof Pages.ActivityTimer | typeof Pages.Calendar | typeof Pages.Display | typeof Pages.Home | typeof Pages.Loading | typeof Pages.Login | typeof Pages.Multiplayer | typeof Pages.Onboarding | typeof Pages.Profile | typeof Pages.Report | typeof Pages.Settings | typeof Pages.Shop | typeof Pages.ShopItems | typeof Pages.Skill | typeof Pages.Skills | typeof Pages.Task | typeof Pages.Tasks | typeof Pages.Waitinternet | typeof Pages.Waitmail | typeof Pages.Test} PageType
 * @typedef {{ content: PageType, ref: PageBack, args: object }} PageState
 */

const DEBUG_MODE = false;

/** @type {Array<PageName>} */
const PAGES_PERSISTENT = [
    'calendar',
    'home',
    //'multiplayer',
    'profile',
    'settings',
    'shop',
    'shopitems',
    'skills',
    'tasks'
];

class PageManager extends React.Component{
    state = {
        pageArguments: {},

        pages: {
            /** @type {PageName} */
            selected: '',

            /** @type {{[key: PageName|string]: PageState}} */
            persistent: {},

            /** @type {PageState|null} */
            temp: null
        },

        animTransition: new Animated.Value(1),
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

    LoadDefaultPages = () => {
        const addPage = (page) => ({ [page]: { content: this.getPageContent(page), ref: null, args: {} } });
        const persistentPages = Object.assign({}, ...PAGES_PERSISTENT.map(addPage));
        this.setState({ pages: { ...this.state.pages, persistent: persistentPages } });
    }

    /**
     * @param {function} handle
     * @returns {boolean} True if handle is set
     */
    SetCustomBackHandle(handle) {
        if (typeof(handle) !== 'function') return false;

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
        this.setState({ pageArguments: prevArgs, ignorePage: false });
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

        const currentPage = this.state.pages.selected;

        // Undefined page: update & return false
        if (IsUndefined(nextpage) || nextpage === '') {
            this.forceUpdate();
            return false;
        }

        // Same page & not force update: return false
        if (!forceUpdate && nextpage === currentPage) {
            return false;
        }

        // Page not exist: return false
        if (this.getPageContent(nextpage) === null) {
            console.warn('error', 'Calling an incorrect page');
            return false;
        };

        // If current (prev) page is not ignored, add it to path, except first loading (no first pages)
        if (!this.state.ignorePage && currentPage !== '') {
            this.path.push([currentPage, this.state.pageArguments]);
        }

        // Set page arguments
        const { pages } = this.state;
        if (Object.keys(pages).includes(nextpage)) {
            this.setState({ pages: { ...pages, persistent: { ...pages.persistent, [nextpage]: { ...pages.persistent[nextpage], args: pageArguments } } } });
        } else {
            this.setState({ pages: { ...pages, temp: { ...pages.temp, args: pageArguments } } });
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
        console.log('start anim');
        this.changing = true;

        const T = new Date().getTime();
        if (DEBUG_MODE) console.log('PageManager path:', this.path);

        // Bottom bar selected index animation
        const bottomBarPages = [ 'home', 'calendar', 'x', 'multiplayer', 'shop' ];
        const bottomBarShow = bottomBarPages.includes(newPage);
        const index = bottomBarPages.indexOf(newPage);
        const newBarState = { bottomBarShow: bottomBarShow, bottomBarIndex: index !== -1 ? index : 2 };
        if (!bottomBarShow) this.setState(newBarState); // Hide bar before animation if needed

        const { pages } = this.state;

        // Hide current page
        const selectedPage = pages.selected;
        if (selectedPage !== '') {
            if (Object.keys(pages.persistent).includes(selectedPage)) {
                if (typeof(pages.persistent[selectedPage]?.ref?.refPage?.Hide) === 'function') {
                    console.log('Hide a', selectedPage);//, pages.persistent[selectedPage]);
                    pages.persistent[selectedPage].ref.refPage.Hide();
                }
            } else {
                if (typeof(pages.temp?.ref?.refPage?.Hide) === 'function') {
                    console.log('Hide b', selectedPage);//, pages.temp.ref.refPage);
                    pages.temp.ref.refPage.Hide();
                }
            }
        }

        // Show new page
        if (Object.keys(pages.persistent).includes(newPage)) {
            if (typeof(pages.persistent[newPage]?.ref?.refPage?.Show) === 'function') {
                console.log('Show a', newPage);
                pages.persistent[newPage].ref.refPage.Show();
                this.onPageChange();
                pages.persistent[newPage].ref.componentDidFocused();
                this.setState({ pages: { ...pages, selected: newPage } });
            }
        } else {
            const tempContent = { content: this.getPageContent(newPage, {}, true), ref: null };
            this.setState({ pages: { ...pages, selected: newPage, temp: { ...this.state.pages.temp, ...tempContent } } }, () => {
                if (typeof(this.state.pages.temp?.ref?.refPage?.Show) === 'function') {
                    this.state.pages.temp.ref.refPage.Show();
                    this.onPageChange();
                    this.state.pages.temp.ref.componentDidFocused();
                } else {
                    console.log('Ref undefined');
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
     * @param {object} args
     * @param {boolean} tempRef
     * @returns {JSX.Element|null}
     */
    getPageContent(page, args = {}, tempRef = false) {
        const setRef = () => null;
        const key = 'page-' + page;
        if (tempRef && pages.temp !== null) {
            setRef = (ref) => pages.temp.ref = ref;
        } else if (pages.persistent[page] !== null) {
            setRef = (ref) => pages.persistent[page].ref = ref;
        }
        const pages = {
            'about':            <Pages.About            key={key} args={args} ref={setRef} />,
            'achievements':     <Pages.Achievements     key={key} args={args} ref={setRef} />,
            'activity':         <Pages.Activity         key={key} args={args} ref={setRef} />,
            'activitytimer':    <Pages.ActivityTimer    key={key} args={args} ref={setRef} />,
            'calendar':         <Pages.Calendar         key={key} args={args} ref={setRef} />,
            'display':          <Pages.Display          key={key} args={args} ref={setRef} />,
            'home':             <Pages.Home             key={key} args={args} ref={setRef} />,
            'loading':          <Pages.Loading          key={key} args={args} ref={setRef} />,
            'login':            <Pages.Login            key={key} args={args} ref={setRef} />,
            'multiplayer':      <Pages.Multiplayer      key={key} args={args} ref={setRef} />,
            'onboarding':       <Pages.Onboarding       key={key} args={args} ref={setRef} />,
            'profile':          <Pages.Profile          key={key} args={args} ref={setRef} />,
            'report':           <Pages.Report           key={key} args={args} ref={setRef} />,
            'settings':         <Pages.Settings         key={key} args={args} ref={setRef} />,
            'shop':             <Pages.Shop             key={key} args={args} ref={setRef} />,
            'shopitems':        <Pages.ShopItems        key={key} args={args} ref={setRef} />,
            'skill':            <Pages.Skill            key={key} args={args} ref={setRef} />,
            'skills':           <Pages.Skills           key={key} args={args} ref={setRef} />,
            'task':             <Pages.Task             key={key} args={args} ref={setRef} />,
            'tasks':            <Pages.Tasks            key={key} args={args} ref={setRef} />,
            'waitinternet':     <Pages.Waitinternet     key={key} args={args} ref={setRef} />,
            'waitmail':         <Pages.Waitmail         key={key} args={args} ref={setRef} />,
            'test':             <Pages.Test             key={key} args={args} ref={setRef} />
        };
        if (pages[page])
            return pages[page];
        return null;
    }

    onPageChange = () => {
    }

    renderPage = () => {
    }

    render() {
        const { pages, animTheme } = this.state;

        const darkBackground = [ themeManager.THEMES.Dark.ground1, themeManager.THEMES.Dark.ground2 ];
        const lightBackground = [ themeManager.THEMES.Light.ground1, themeManager.THEMES.Light.ground2 ];
        const lightOpacity = { opacity: animTheme };

        const newPage = (pageName = 'temp') => {
            // Not temp page and not persistent page
            if (pageName !== 'temp' && !Object.keys(pages.persistent).includes(pageName)) {
                return null;
            }

            const key = 'page-' + pageName;
            const Content = pageName === 'temp' ? pages.temp?.content || null : pages.persistent[pageName]?.content || null;
            return Content;
            if (Content === null) return null;

            if (pageName === 'temp' && pages.temp?.content) {
                return <Content key={key} ref={ref => pages.temp.ref = ref} />;
            } else if (pages.persistent[pageName]?.content) {
                return <Content key={key} ref={ref => pages.persistent[pageName].ref = ref} />;
            }
            return null;
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