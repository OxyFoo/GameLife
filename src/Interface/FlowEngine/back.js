import * as React from 'react';
import { Animated, BackHandler } from 'react-native';
import RNExitApp from 'react-native-exit-app';

import PageBase from './PageBase';
import PAGES from 'Interface/Pages';
import langManager from 'Managers/LangManager';

import DynamicVar from 'Utils/DynamicVar';
import { SpringAnimation, TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('Interface/Pages').PageNames} PageNames
 * @typedef {import('Interface/Global').Popup} Popup
 * @typedef {import('Interface/Global').ScreenList} ScreenList
 * @typedef {import('Interface/Global').ScreenInput} ScreenInput
 * @typedef {import('Interface/Global').BottomPanel} BottomPanel
 * @typedef {import('Interface/Global').Console} Console
 * @typedef {import('Interface/Global').UserHeader} UserHeader
 * @typedef {import('Interface/Global').NavBar} NavBar
 * @typedef {import('Interface/Global').NotificationsInApp} NotificationsInApp
 * @typedef {'auto' | 'fromTop' | 'fromBottom' | 'fromLeft' | 'fromRight' | 'fromCenter'} Transitions
 */

/**
 * @template {PageNames} T
 * @typedef {Object} PageMemory
 * @property {T} pageName
 * @property {PAGES[T]['prototype']['props']['args']} args
 * @property {React.RefObject<InstanceType<PAGES[T]>>} ref
 * @property {boolean} storeInHistory
 * @property {Transitions} transition
 * @property {Animated.Value} transitionStart
 * @property {Animated.Value} transitionEnd
 */

/**
 * @template {PageNames} T
 * @typedef {Object} PageHistory
 * @property {T} pageName
 * @property {PAGES[T]['prototype']['props']['args']} args
 */

/**
 * @template {PageNames} T
 * @typedef {Object} PageOptions
 * @property {PAGES[T]['prototype']['props']['args']} [args]
 * @property {boolean} [storeInHistory]
 * @property {Transitions} [transition]
 * @property {() => void} [callback] Callback after page changed
 */

/**
 * @typedef {Object} PageOptionsBack
 * @property {any} [args] Pass args to callback function
 * @property {Transitions} [transition]
 * @property {() => void} [callback] Callback after page changed
 */

/**
 * @typedef {BackFlowEngine['_public']} FlowEnginePublicClass
 */

class BackFlowEngine extends React.Component {
    /** @type {React.RefObject<Popup>} */
    popup = React.createRef();

    /** @type {React.RefObject<ScreenList>} */
    screenList = React.createRef();

    /** @type {React.RefObject<ScreenInput>} */
    screenInput = React.createRef();

    /** @type {React.RefObject<Console>} */
    console = React.createRef();

    /** @type {React.RefObject<BottomPanel>} */
    bottomPanel = React.createRef();

    /** @type {React.RefObject<UserHeader>} */
    userHeader = React.createRef();

    /** @type {React.RefObject<NavBar>} */
    navBar = React.createRef();

    /** @type {React.RefObject<NotificationsInApp>} */
    notificationsInApp = React.createRef();

    state = {
        /** @type {PageNames | null} */
        selectedPage: null,

        /** @type {Transitions} */
        currentTransition: 'auto',

        /** @type {Array<PageMemory<PageNames>>} */
        mountedPages: []
    };

    responsive = new DynamicVar({
        scale: 1,
        paddingVertical: 0,
        paddingHorizontal: 0
    });

    size = {
        width: 0,
        height: 0
    };

    /**
     * @type {Array<PageNames>}
     * @protected
     */
    availablePages = [];

    /**
     * @description Disable changing page while loading
     * @type {boolean}
     * @private
     */
    changing = false;

    /**
     * @description Represent all pages before current page
     * Increment when changing page
     * Decrement when back page
     * @type {Array<PageHistory<PageNames>>}
     */
    history = [];

    constructor(props = {}) {
        super(props);

        // Check if all PAGES are valid & if extends PageBase
        for (const page of Object.entries(PAGES)) {
            const [pageName, Page] = page;
            if (typeof Page !== 'function') {
                throw new Error(`Page ${pageName} must be a class`);
            }
            if (Page.prototype instanceof PageBase === false) {
                throw new Error(`Page ${pageName} must extends PageBase`);
            }

            // @ts-ignore
            this.availablePages.push(/** @type {PageNames} */ pageName);
        }
    }

    componentDidMount() {
        this._public.popup = this.popup.current;
        this._public.console = this.console.current;
        this._public.screenList = this.screenList.current;
        this._public.screenInput = this.screenInput.current;
        this._public.bottomPanel = this.bottomPanel.current;
        this._public.userHeader = this.userHeader.current;
        this._public.navBar = this.navBar.current;
        this._public.notificationsInApp = this.notificationsInApp.current;

        BackHandler.addEventListener('hardwareBackPress', this.BackHandle);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.BackHandle);
    }

    /**
     * @param {any} _nextProps
     * @param {this['state']} nextState
     * @returns {boolean}
     */
    shouldComponentUpdate(_nextProps, nextState) {
        return this.state.selectedPage !== nextState.selectedPage || this.state.mountedPages !== nextState.mountedPages;
    }

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        this.size.width = width;
        this.size.height = height;
    };

    /**
     * @description Get current page name
     * @returns {PageNames | null}
     * @public
     */
    GetCurrentPageName = () => this.state.selectedPage;

    /**
     * @description Get current page instance
     * @template {PageNames} T
     * @param {T} pageName
     * @returns {InstanceType<PAGES[T]> | null}
     * @public
     */
    GetPage = (pageName) => {
        const page = this.getMountedPage(pageName);
        return page?.ref.current || null;
    };

    GetCurrentPage = () => this.getMountedPage(this.state.selectedPage);

    /**
     * @description Check if page exist
     * @param {string} pageName
     * @returns {PageNames | null} Return pageName if exist else null
     * @public
     */
    // @ts-ignore
    GetPageName = (pageName) => (this.availablePages.includes(pageName) ? pageName : null);

    // TODO: Remove
    /**
     * @description Custom back button handler
     * @type {(() => boolean) | null} Return true if back is handled
     * @private
     */
    customBackHandle = null;

    /**
     * @description Custom back button handler
     * @type {((args: any) => (boolean | (() => void)))[]} Return true if back is handled
     * @private
     */
    customBackHandlers = [];

    /**
     * @param {() => (boolean | (() => void))} handle Function to handle back button, return true or function (to execute after back handle) if back is handled or false if not
     * @returns {boolean} True if handle is set
     * @public
     */
    AddCustomBackHandler = (handle) => {
        if (typeof handle !== 'function') {
            return false;
        }
        this.customBackHandlers.push(handle);
        return true;
    };

    // TODO: Remove
    /**
     * @param {() => boolean} handle
     * @returns {boolean} True if handle is set
     * @public
     * @deprecated
     */
    SetCustomBackHandler = (handle) => {
        if (typeof handle !== 'function') {
            return false;
        }
        this.customBackHandle = handle;
        return true;
    };

    // TODO: Remove
    /**
     * @public
     * @deprecated
     */
    ResetCustomBackHandler = () => {
        this.customBackHandle = null;
    };

    /**
     * @param {() => boolean} handle
     * @returns {boolean} True if handle is removed
     * @public
     */
    RemoveCustomBackHandler = (handle) => {
        const index = this.customBackHandlers.findIndex((h) => h === handle);
        if (index === -1) {
            return false;
        }
        this.customBackHandlers.splice(index, 1);
        return true;
    };

    /**
     * @description Handle back button
     * @param {PageOptionsBack} [options]
     * @returns {boolean} True if back is handled
     * @public
     */
    BackHandle = (options = {}) => {
        // No custom back handler, use default back page
        if (this.customBackHandlers.length <= 0) {
            this.backPage(options);
            return true;
        }

        // Get custom back handler
        const customHandler = this.customBackHandlers.at(-1);
        if (typeof customHandler === 'undefined') {
            return true;
        }

        // Execute custom back handler
        const resultBackHandler = customHandler(options.args);
        if (resultBackHandler === true || typeof resultBackHandler === 'function') {
            options?.callback?.();
            this.customBackHandlers.pop();
            if (typeof resultBackHandler === 'function') {
                resultBackHandler();
            }
        }

        return true;
    };

    /**
     * Open page
     * @template {PageNames} T
     * @param {T} nextpage
     * @param {PageOptions<T>} options
     * @returns {boolean} True if page changed
     * @public
     */
    ChangePage = (nextpage, options = {}) => {
        const { selectedPage } = this.state;

        if (this.changing) {
            return false;
        }

        if (nextpage === selectedPage) {
            return false;
        }

        const isGoingBack = nextpage === this.history[this.history.length - 1]?.pageName;
        this.changing = true;
        this.mountPage(nextpage, options).then(options.callback);
        this.unmountPage(selectedPage, isGoingBack);
        this.pageDidUpdate(nextpage);
        this.changing = false;

        // Avoid next back handle to go back to the same page
        if (isGoingBack) {
            this.history.pop();
        }

        return true;
    };

    /**
     * Change page to previous page in history
     * @param {PageOptionsBack} options
     * @returns {boolean} True if page changed
     * @private
     */
    backPage = (options) => {
        const { selectedPage } = this.state;

        if (this.changing) {
            return false;
        }

        const lastPage = this.history.pop();
        if (lastPage === undefined) {
            this.AskToClose();
            return false;
        }

        const { pageName, args } = lastPage;
        if (pageName === selectedPage) {
            return false;
        }

        this.changing = true;
        this.mountPage(pageName, { args, transition: options.transition }, true).then(options.callback);
        this.unmountPage(selectedPage, true);
        this.pageDidUpdate(pageName);
        this.changing = false;

        return true;
    };

    AskToClose = () => {
        this.popup.current?.OpenT({
            type: 'yesno',
            data: {
                title: langManager.curr['home']['alert-exit-title'],
                message: langManager.curr['home']['alert-exit-text']
            },
            callback: (btn) => {
                if (btn === 'yes') {
                    RNExitApp.exitApp();
                }
            }
        });
    };

    /**
     * Mount page if not already mounted
     * @template {PageNames} T
     * @param {T} nextPage
     * @param {PageOptions<T>} options
     * @param {boolean} [isGoingBack]
     * @returns {Promise<void>}
     * @private
     */
    mountPage = (nextPage, options, isGoingBack = false) => {
        const { mountedPages } = this.state;

        let newPage = this.getMountedPage(nextPage);

        // Page doesn't existe: Add it to memory
        if (newPage === null) {
            newPage = this.createPage(nextPage, options);
        }

        // Page is already mounted: Update args, call _componentDidFocused and reset transition values
        else {
            if (newPage.args !== options.args) {
                newPage.args = options.args;
            }
            newPage.ref.current?._componentDidFocused(newPage.args);
            newPage.transitionStart.setValue(0);
            newPage.transitionEnd.setValue(0);
        }

        if (newPage === null) {
            throw new Error('FlowEngine: Page not found');
        }

        /** @type {Transitions} */
        let transition = options?.transition || 'auto';
        if (transition === 'auto') {
            if (mountedPages.length === 0) {
                transition = 'fromCenter';
            } else if (isGoingBack) {
                transition = 'fromLeft';
            } else {
                transition = 'fromRight';
            }
        }

        return new Promise((resolve) => {
            this.setState(
                {
                    selectedPage: nextPage,
                    currentTransition: transition,
                    mountedPages: [...mountedPages, newPage]
                },
                () => {
                    resolve();
                    if (newPage !== null) {
                        SpringAnimation(newPage.transitionStart, 1).start();
                        SpringAnimation(newPage.transitionEnd, 0).start();
                    }
                }
            );
        });
    };

    /**
     * Save page in history if needed and unmount if not keepMounted
     * @param {PageNames | null} pageName
     * @param {boolean} [isGoingBack] Save page in history if true
     * @private
     */
    unmountPage = (pageName, isGoingBack = false) => {
        const oldPage = this.getMountedPage(pageName);
        if (pageName === null || oldPage === null) {
            return;
        }

        if (!isGoingBack && oldPage.storeInHistory) {
            this.addPageToHistory(oldPage.pageName, oldPage.args);
        }

        TimingAnimation(oldPage.transitionEnd, 1, 200).start(() => {
            if (PAGES[pageName].feKeepMounted === true) {
                oldPage.ref.current?._componentDidUnfocused();
            } else {
                this.removeFromMountedPages(oldPage.pageName);
            }
        });
    };

    /**
     * @param {PageNames} pageName
     * @private
     */
    pageDidUpdate = (pageName) => {
        // Update user header visibility
        const showUserHeader = PAGES[pageName].feShowUserHeader;
        if (showUserHeader && this.userHeader.current?.show === false) {
            this.userHeader.current?.Show();
            this.userHeader.current?.refBellButton.current?.StartOpenCountAnimation(3000, 250);
        } else if (!showUserHeader && this.userHeader.current?.show === true) {
            this.userHeader.current?.Hide();
        }

        // Update bottom panel visibility
        if (this.bottomPanel.current?.IsOpened()) {
            this.bottomPanel.current?.Close();
        }

        // Update nav bar visibility
        const showNavBar = PAGES[pageName].feShowNavBar;
        if (showNavBar && this.navBar.current?.show === false) {
            this.navBar.current?.Show();
        } else if (!showNavBar && this.navBar.current?.show === true) {
            this.navBar.current?.Hide();
        }
    };

    /**
     * @template {PageNames} T
     * @param {T} pageName
     * @param {PageOptions<T>} options
     * @returns {PageMemory<T>}
     * @private
     */
    createPage = (pageName, options) => {
        return {
            pageName: pageName,
            args: options.args || {},
            ref: React.createRef(),
            storeInHistory: options.storeInHistory ?? true,
            transition: options.transition || 'auto',
            transitionStart: new Animated.Value(0),
            transitionEnd: new Animated.Value(0)
        };
    };

    /**
     * @template {PageNames} T
     * @param {T} pageName
     * @param {PAGES[T]['prototype']['props']['args']} args
     * @private
     */
    addPageToHistory = (pageName, args) => {
        this.history.push({
            pageName: pageName,
            args: args
        });
    };

    /**
     * @template {PageNames} T
     * @param {T | null} pageName
     * @returns {PageMemory<T> | null}
     * @protected
     */
    getMountedPage = (pageName) => {
        const { mountedPages } = this.state;
        if (pageName === null) {
            return null;
        }
        // @ts-ignore
        return mountedPages.find((p) => p.pageName === pageName) || null;
    };

    /**
     * @param {PageNames} pageName
     * @private
     */
    removeFromMountedPages = async (pageName) => {
        const { mountedPages } = this.state;
        const index = mountedPages.findIndex((p) => p.pageName === pageName);
        if (index === -1) {
            return;
        }

        return new Promise((resolve) => {
            this.setState(
                (/** @type {this['state']} */ prevState) => {
                    const newPages = [...prevState.mountedPages];
                    newPages.splice(index, 1);
                    return { mountedPages: newPages };
                },
                () => {
                    resolve(null);
                }
            );
        });
    };

    _public = {
        /** @type {Popup | null} */
        popup: null,

        /** @type {Console | null} */
        console: null,

        /** @type {ScreenList | null} */
        screenList: null,

        /** @type {ScreenInput | null} */
        screenInput: null,

        /** @type {BottomPanel | null} */
        bottomPanel: null,

        /** @type {UserHeader | null} */
        userHeader: null,

        /** @type {NavBar | null} */
        navBar: null,

        /** @type {NotificationsInApp | null} */
        notificationsInApp: null,

        history: this.history,
        size: this.size,
        responsive: this.responsive,
        ChangePage: this.ChangePage,
        BackHandle: this.BackHandle,
        GetPage: this.GetPage,
        GetPageName: this.GetPageName,
        GetCurrentPage: this.GetCurrentPage,
        GetCurrentPageName: this.GetCurrentPageName,
        AddCustomBackHandler: this.AddCustomBackHandler,
        RemoveCustomBackHandler: this.RemoveCustomBackHandler,

        /** @deprecated */
        SetCustomBackHandler: this.SetCustomBackHandler,
        /** @deprecated */
        ResetCustomBackHandler: this.ResetCustomBackHandler
    };
}

export default BackFlowEngine;
