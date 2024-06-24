import * as React from 'react';
import { Animated, BackHandler } from 'react-native';

import PageBase from './PageBase';
import PAGES from 'Interface/Pages';

import { SpringAnimation, TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('Interface/Pages').PageNames} PageNames
 * @typedef {import('Interface/Global').Popup} Popup
 * @typedef {import('Interface/Global').Console} Console
 * @typedef {import('Interface/Global').UserHeader} UserHeader
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
 */

/**
 * @typedef {BackFlowEngine['_public']} FlowEnginePublicClass
 */

/**
 * @typedef {Object} BackFlowEnginePropsType
 * @property {React.RefObject<BackFlowEngine['popup']>} popup
 * @property {React.RefObject<BackFlowEngine['console']>} console
 * @property {React.RefObject<BackFlowEngine['userHeader']>} userHeader
 */

/** @type {BackFlowEnginePropsType} */
const BackFlowEngineProps = {
    popup: React.createRef(),
    console: React.createRef(),
    userHeader: React.createRef()
};

class BackFlowEngine extends React.Component {
    /** @type {Popup | null} */
    popup = null;

    /** @type {Console | null} */
    console = null;

    /** @type {UserHeader | null} */
    userHeader = null;

    state = {
        /** @type {PageNames | null} */
        selectedPage: null,

        /** @type {Transitions} */
        currentTransition: 'auto',

        /** @type {Array<PageMemory<PageNames>>} */
        mountedPages: []
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
        BackHandler.addEventListener('hardwareBackPress', this.BackHandle);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.BackHandle);
    }

    /**
     * @param {BackFlowEnginePropsType} nextProps
     * @param {this['state']} nextState
     * @returns {boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        /** @type {Array<keyof BackFlowEnginePropsType>} */
        const toCheck = ['popup', 'console', 'userHeader'];
        let changed = false;
        for (const key of toCheck) {
            const ref = nextProps[key];
            if (this[key] === null && ref !== null && ref.current && ref?.current !== this[key]) {
                // @ts-ignore
                this[key] = ref.current;
                changed = true;
            }
        }
        if (changed) {
            return true;
        }

        return this.state.selectedPage !== nextState.selectedPage || this.state.mountedPages !== nextState.mountedPages;
    }

    /**
     * @description Get current page name
     * @returns {PageNames | null}
     * @public
     */
    GetCurrentPageName = () => this.state.selectedPage;

    /**
     * @description Check if page exist
     * @param {string} pageName
     * @returns {boolean}
     * @public
     */
    // @ts-ignore
    IsPage = (pageName) => this.availablePages.includes(pageName);

    /**
     * @description Custom back button handler
     * @type {(() => boolean) | null} Return true if back is handled
     * @private
     */
    customBackHandle = null;

    /**
     * @param {() => boolean} handle
     * @returns {boolean} True if handle is set
     * @public
     */
    SetCustomBackHandler = (handle) => {
        if (typeof handle !== 'function') {
            return false;
        }
        this.customBackHandle = handle;
        return true;
    };

    /**
     * @public
     */
    ResetCustomBackHandler = () => {
        this.customBackHandle = null;
    };

    /**
     * @description Handle back button
     * @param {Transitions} [transition]
     * @returns {boolean} True if back is handled
     * @public
     */
    BackHandle = (transition = 'auto') => {
        if (this.customBackHandle !== null) {
            if (!this.customBackHandle()) {
                return true;
            }
            this.ResetCustomBackHandler();
        }

        this.backPage(transition);
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
    ChangePage = (nextpage, options = { args: {}, storeInHistory: true, transition: 'auto' }) => {
        const { selectedPage } = this.state;

        if (this.changing) {
            return false;
        }

        if (nextpage === selectedPage) {
            return false;
        }

        this.changing = true;
        this.mountPage(nextpage, options);
        this.unmountPage(selectedPage);
        this.changing = false;
        this.pageDidUpdate(nextpage);

        return true;
    };

    /**
     * Change page to previous page in history
     * @param {Transitions} [transition]
     * @returns {boolean} True if page changed
     * @private
     */
    backPage = (transition = 'auto') => {
        const { selectedPage } = this.state;

        if (this.changing) {
            return false;
        }

        const lastPage = this.history.pop();
        if (lastPage === undefined) {
            return false;
        }

        const { pageName, args } = lastPage;
        if (pageName === selectedPage) {
            return false;
        }

        this.changing = true;
        this.mountPage(pageName, { args, transition }, true);
        this.unmountPage(selectedPage, true);
        this.changing = false;

        return true;
    };

    /**
     * Mount page if not already mounted
     * @template {PageNames} T
     * @param {T} nextPage
     * @param {PageOptions<T>} options
     * @param {boolean} [isGoingBack]
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

        this.setState(
            {
                selectedPage: nextPage,
                currentTransition: transition,
                mountedPages: [...mountedPages, newPage]
            },
            () => {
                if (newPage !== null) {
                    SpringAnimation(newPage.transitionStart, 1).start();
                    SpringAnimation(newPage.transitionEnd, 0).start();
                }
            }
        );
    };

    /**
     * Save page in history if needed and unmount if not keepMounted
     * @param {PageNames | null} pageName
     * @param {boolean} [isGoingBack] Save page in history if true
     * @private
     */
    unmountPage = (pageName, isGoingBack = false) => {
        const oldPage = this.getMountedPage(pageName);
        if (oldPage === null) {
            return;
        }

        if (!isGoingBack && oldPage.storeInHistory) {
            this.addPageToHistory(oldPage.pageName, oldPage.args);
        }

        TimingAnimation(oldPage.transitionEnd, 1, 200).start(() => {
            if (oldPage.ref.current?.feKeepMounted === true) {
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
        const showUserHeader = this.getMountedPage(pageName)?.ref.current?.feShowUserHeader ?? false;
        if (showUserHeader && this.userHeader?.show === false) {
            this.userHeader?.Show();
        } else if (!showUserHeader && this.userHeader?.show === true) {
            this.userHeader?.Hide();
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
        /** @type {Popup} */ // @ts-ignore
        popup: this.popup,

        /** @type {Console} */ // @ts-ignore
        console: this.console,

        /** @type {UserHeader} */ // @ts-ignore
        userHeader: this.userHeader,

        history: this.history,
        IsPage: this.IsPage,
        ChangePage: this.ChangePage,
        BackHandle: this.BackHandle,
        GetCurrentPageName: this.GetCurrentPageName,
        SetCustomBackHandler: this.SetCustomBackHandler,
        ResetCustomBackHandler: this.ResetCustomBackHandler
    };
}

BackFlowEngine.defaultProps = BackFlowEngineProps;
BackFlowEngine.prototype.props = BackFlowEngineProps;

export default BackFlowEngine;
