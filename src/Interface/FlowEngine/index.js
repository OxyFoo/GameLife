import * as React from 'react';
import { Animated, View, BackHandler, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';

import PAGES from 'Interface/Pages';

import { RadialBackground } from '../Primitives/radialBackground';
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

/** @type {Array<PageNames>} */
// @ts-ignore
const pageNames = Object.keys(PAGES);

const PATH1 = [
    { x: 0, y: 0 },
    { x: 1, y: .5 },
    { x: 0, y: .5 },
    { x: 1, y: 0 },
    { x: 0, y: 0 }
];
const PATH2 = [
    { x: 1, y: .5 },
    { x: 1, y: 1 },
    { x: 1, y: 0 },
    { x: .5, y: 1 },
    { x: 0, y: .5 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 0, y: 0 },
    { x: 1, y: .5 },
];

class FlowEngine extends React.Component{
    state = {
        /** @type {PageNames | null} */
        selectedPage: null,
        ignorePage: false,

        /** @type {Array<PageMemory<PageNames>>} */
        mountedPages: []
    };

    /** @type {Popup | null} */    popup       = null;
    /** @type {Console | null} */  console     = null;

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

    /**
     * @template {PageNames} T
     * @param {Object} props
     * @param {T} props.pageName
     */
    renderPage = ({ pageName }) => {
        const { selectedPage } = this.state;

        const page = this.getMountedPage(pageName);
        if (page === null) {
            return null;
        }

        const Page = PAGES[pageName];
        return (
            <Animated.View
                style={[
                    styles.parent,
                    {
                        opacity: Animated.subtract(1, page.transitionEnd),
                        transform: [
                            {
                                translateX: Animated.multiply(
                                    200,
                                    Animated.subtract(1, page.transitionStart)
                                )
                            },
                            {
                                scale: Animated.add(
                                    0.75,
                                    Animated.multiply(0.25, Animated.subtract(1, page.transitionEnd))
                                )
                            }
                        ]
                    }
                ]}
                pointerEvents={selectedPage === pageName ? 'auto' : 'none'}
            >
                <ScrollView
                    style={styles.scrollview}
                    contentContainerStyle={styles.scrollviewContainer}
                    scrollEnabled={true}
                    // @ts-ignore
                    children={<Page ref={page.ref} args={page.args} />}
                />
            </Animated.View>
        );
    }

    render() {
        return (
            <KeyboardAvoidingView style={[styles.fullscreen, styles.background]} behavior='height'>
                <RadialBackground
                    color='main1'
                    animPath={PATH1}
                    duration={10000}
                />
                <RadialBackground
                    color='main2'
                    animPath={PATH2}
                    duration={10000}
                />

                {pageNames.map(pageName => (
                    <this.renderPage
                        key={`fe-page-${pageName}`}
                        pageName={pageName}
                    />
                ))}

                <Popup ref={ref => { if (ref !== null) this.popup = ref } } />
                <Console ref={ref => { if (ref !== null) this.console = ref } } />
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    fullscreen: {
        width: '100%',
        height: '100%'
    },
    background: {
        backgroundColor: '#03052E'
    },

    parent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

        margin: 0,
        padding: 0
    },
    scrollview: {
        width: '100%',
        height: '100%'
    },
    scrollviewContainer: {
        minHeight: '100%'
    }
});

export { PAGES };
export default FlowEngine;
