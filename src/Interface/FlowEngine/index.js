import * as React from 'react';
import { Animated, View, BackHandler, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';

import PAGES from 'Interface/Pages';
import themeManager from 'Managers/ThemeManager';

import { RadialBackground } from './radialBackground';
import { SpringAnimation, TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {keyof PAGES} PageName
 * @typedef {PAGES[keyof PAGES]} PageType
 * @typedef {import('Interface/FlowEngine/PageBase').default} PageBase
 * 
 * @typedef PageState
 * @type {Object}
 * @property {JSX.Element | null} content
 * @property {PageBase | null} ref
 * @property {object} args
 */

/**
 * @typedef {Object} PageMemory
 * @property {PageName} pageName
 * @property {React.RefObject<PageBase>} ref
 * @property {Animated.Value} transitionStart
 * @property {Animated.Value} transitionEnd
 */

/** @type {Array<PageName>} */
//@ts-ignore
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
        /** @type {PageName|''} */
        selectedPage: '',
        ignorePage: false,

        /** @type {Array<PageMemory>} */
        mountedPages: []
    };

    /** @description Disable changing page while loading */
    changing = false;

    /**
     * @description Custom back button handler
     * @type {(() => boolean) | null} Return true if back is handled
     */
    customBackHandle = null;

    /**
     * @description Represent all pages before current page
     * Increment when changing page
     * Decrement when back page
     * @type {Array<[PageName, object]>}
     */
    path = [];

    //intervalFastRefresh = null;

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
     * @param {PageName} nextpage
     * @param {object} pageArguments
     * @param {boolean} ignorePage
     * @param {boolean} forceUpdate
     */
    ChangePage = (nextpage, pageArguments = {}, ignorePage = false, forceUpdate = false) => {
        if (this.changing) {
            return;
        }

        const { mountedPages, selectedPage } = this.state;

        this.changing = true;
        const newState = {};
        const oldPage = mountedPages.find((p) => p.pageName === selectedPage);
        let newPage = mountedPages.find((p) => p.pageName === nextpage) || null;

        // Add page to memory or select and reset it
        if (newPage === null) {
            newPage = {
                pageName: nextpage,
                ref: React.createRef(),
                transitionStart: new Animated.Value(0),
                transitionEnd: new Animated.Value(0)
            };
            newState.mountedPages = [ ...mountedPages, newPage ];
        } else {
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

        if (oldPage !== undefined) {
            TimingAnimation(oldPage.transitionEnd, 1, 200).start(() => {
                this.changing = false;
                if (oldPage.ref.current?.feKeepMounted !== true) {
                    this.removeFromMountedPages(oldPage.pageName);
                }
            });
        } else [
            this.changing = false
        ]
    }

    /**
     * @param {PageName} pageName
     */
    removeFromMountedPages = (pageName) => {
        const { mountedPages } = this.state;
        const index = mountedPages.findIndex((p) => p.pageName === pageName);
        if (index !== -1) {
            mountedPages.splice(index, 1);
            this.setState({ mountedPages }, () => {
                console.log('Page removed from memory:', pageName);
            });
        }
    }

    GetCurrentPageName = () => this.state.selectedPage;

    /** @param {PageName} pageName */
    renderPage = (pageName) => {
        const { selectedPage, mountedPages } = this.state;

        const Page = PAGES[pageName];
        const page = mountedPages.find((p) => p.pageName === pageName);
        if (page === undefined) {
            return null;
        }

        return (
            <Animated.View
                key={`fe-page-${pageName}`}
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
                >
                    <Page
                        ref={page.ref}
                        args={{ test: 'yesss' }}
                    />
                </ScrollView>
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

                {pageNames.map(this.renderPage)}
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
        height: '100%',
        backgroundColor: '#00000001'
    },
    scrollviewContainer: {
        padding: 32
    }
});

export { PAGES };
export default FlowEngine;
