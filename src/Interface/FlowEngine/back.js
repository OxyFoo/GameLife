import * as React from 'react';
import { Animated, BackHandler } from 'react-native';

import PageBase from './PageBase';
import PAGES from 'Interface/Pages';

import { SpringAnimation, TimingAnimation } from 'Utils/Animations';
import { Console, Popup } from 'Interface/Widgets';

/**
 * @typedef {import('Interface/Pages').PageNames} PageNames
 * @typedef {'auto' | 'fromTop' | 'fromBottom' | 'fromLeft' | 'fromRight' | 'fromCenter'} Transitions
 */

/**
 * @template {PageNames} T
 * @typedef {Object} PageMemory
 * @property {T} pageName
 * @property {PAGES[T]['prototype']['props']['args']} args
 * @property {React.RefObject<InstanceType<PAGES[T]>>} ref
 * @property {Animated.Value} transitionStart
 * @property {Animated.Value} transitionEnd
 */

/**
 * @template {PageNames} T
 * @typedef {Object} PathMemory
 * @property {T} pageName
 * @property {PAGES[T]['prototype']['props']['args']} args
 */

class BackFlowEngine extends React.Component{
    /** @type {Popup | null} */    popup       = null;
    /** @type {Console | null} */  console     = null;

    state = {
        /** @type {PageNames | null} */
        selectedPage: null,
        ignorePage: false,

        /** @type {Array<PageMemory<PageNames>>} */
        mountedPages: []
    };

    /** @type {Array<PageNames>} */
    availablePages = [];

    /** @description Disable changing page while loading */
    changing = false;

    /**
     * @description Represent all pages before current page
     * Increment when changing page
     * Decrement when back page
     * @type {Array<PathMemory<PageNames>>}
     */
    history = [];

    /**
     * @description Custom back button handler
     * @type {(() => boolean) | null} Return true if back is handled
     */
    customBackHandle = null;

    constructor(props = {}) {
        super(props);

        // Check if all PAGES are valid & if extends PageBase
        for (const page of Object.entries(PAGES)) {
            const [pageName, Page] = page;
            if (typeof(Page) !== 'function') {
                throw new Error(`Page ${pageName} must be a class`);
            }
            if (Page.prototype instanceof PageBase === false) {
                throw new Error(`Page ${pageName} must extends PageBase`);
            }
            this.availablePages.push(/** @type {PageNames} */ (pageName));
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.BackHandle);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.BackHandle);
    }

    /**
     * @param {() => boolean} handle
     * @returns {boolean} True if handle is set
     */
    SetCustomBackHandler(handle) {
        if (typeof(handle) !== 'function') {
            return false;
        }
        this.customBackHandle = handle;
        return true;
    }

    ResetCustomBackHandler() {
        this.customBackHandle = null;
    }

    BackHandle = () => {
        if (this.customBackHandle !== null) {
            if (!this.customBackHandle()) {
                return true;
            }
            this.ResetCustomBackHandler();
        }

        this.backPage();
        return true;
    }

    /**
     * @private
     * Try to get last page content
     * @param {boolean} [force=false] If true, try to get back until page is changing
     * @returns {boolean} True if page changed
     */
    backPage = (force = false) => {
        return false
    }

    /**
     * Open page
     * @template {PageNames} T
     * @param {T} nextpage
     * @param {Object} options
     * @param {PAGES[T]['prototype']['props']['args']} [options.args]
     * @param {boolean} [options.storeInHistory] Store page in history to allow back navigation (default: true)
     * @param {Transitions} [options.transition]
     * @returns {boolean} True if page changed
     */
    ChangePage = (nextpage, options = { args: {}, storeInHistory: true, transition: 'auto' }) => {
        if (this.changing) {
            return false;
        }

        const { mountedPages, selectedPage } = this.state;

        this.changing = true;
        const newState = {};
        let newPage = this.getMountedPage(nextpage);
        const oldPage = selectedPage === null ? null : this.getMountedPage(selectedPage);

        // Add page to memory or select and reset it
        if (newPage === null) {
            newPage = {
                pageName: nextpage,
                ref: React.createRef(),
                args: options.args,
                transitionStart: new Animated.Value(0),
                transitionEnd: new Animated.Value(0)
            };
            newState.mountedPages = [ ...mountedPages, newPage ];
        } else {
            newPage.ref.current?._componentDidFocused(newPage.args);
            newPage.transitionStart.setValue(0);
            newPage.transitionEnd.setValue(0);
        }

        if (nextpage !== selectedPage) {
            newState.selectedPage = nextpage;
        }

        if (Object.keys(newState).length > 0) {
            this.setState(newState);
        }

        if (newPage !== null) {
            SpringAnimation(newPage.transitionStart, 1).start();
            SpringAnimation(newPage.transitionEnd, 0).start();
        }

        if (oldPage !== null) {
            TimingAnimation(oldPage.transitionEnd, 1, 200).start(() => {
                this.changing = false;
                if (oldPage.ref.current?.feKeepMounted !== true) {
                    this.removeFromMountedPages(oldPage.pageName);
                } else {
                    oldPage.ref.current?._componentDidUnfocused();
                }
            });
        } else {
            this.changing = false
        }

        return true;
    }

    /**
     * @param {PageNames} pageName
     */
    removeFromMountedPages = async (pageName) => {
        const { mountedPages } = this.state;
        const index = mountedPages.findIndex((p) => p.pageName === pageName);
        if (index !== -1) {
            await new Promise((resolve) => {
                mountedPages.splice(index, 1);
                this.setState({ mountedPages }, () => {
                    console.log('Page removed from memory:', pageName);
                    resolve(null);
                });
            });
        }
    }

    /**
     * @template {PageNames} T
     * @param {T} pageName
     * @returns {PageMemory<T> | null}
     */
    getMountedPage = (pageName) => {
        const { mountedPages } = this.state;
        if (pageName === null) {
            return null;
        }
        // @ts-ignore
        return mountedPages.find((p) => p.pageName === pageName) || null;
    }

    GetCurrentPageName = () => this.state.selectedPage;
}

export default BackFlowEngine;
