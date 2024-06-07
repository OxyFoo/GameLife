import * as React from 'react';
import { Animated, KeyboardAvoidingView, ScrollView } from 'react-native';

import styles from './style';
import BackFlowEngine from './back';
import { GetAnimationPageClose, GetAnimationPageOpen } from './animations';
import PAGES from 'Interface/Pages';

import { RadialBackground } from '../Primitives/radialBackground';
import { Console, Popup } from 'Interface/Widgets';

/**
 * @typedef {import('./back').PageNames} PageNames
 */

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

class FlowEngine extends BackFlowEngine {
    /**
     * @template {PageNames} T
     * @param {Object} props
     * @param {T} props.pageName
     */
    renderPage = ({ pageName }) => {
        const { selectedPage, currentTransition } = this.state;

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
                            ...GetAnimationPageOpen(page, currentTransition),
                            ...GetAnimationPageClose(page)
                        ]
                    }
                ]}
                pointerEvents={selectedPage === pageName ? 'auto' : 'none'}
            >
                <ScrollView
                    style={styles.scrollview}
                    contentContainerStyle={styles.scrollviewContainer}
                    scrollEnabled={true}
                    children={
                        // @ts-ignore
                        <Page
                            ref={page.ref}
                            args={page.args}
                            flowEngine={this}
                        />
                    }
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

                {this.availablePages.map(pageName => (
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

export default FlowEngine;
