import * as React from 'react';
import { Animated, KeyboardAvoidingView, ScrollView } from 'react-native';

import styles from './style';
import BackFlowEngine from './back';
import { GetAnimationPageClose, GetAnimationPageOpen } from './animations';
import PAGES from 'Interface/Pages';

import { DynamicBackground } from 'Interface/Primitives';
import { Console, Popup } from 'Interface/Global';

/**
 * @typedef {import('./back').PageNames} PageNames
 */

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
                        <Page ref={page.ref} args={page.args} flowEngine={this} />
                    }
                />
            </Animated.View>
        );
    };

    render() {
        return (
            <KeyboardAvoidingView style={[styles.fullscreen, styles.background]} behavior='height'>
                <DynamicBackground />

                {this.availablePages.map((pageName) => (
                    <this.renderPage key={`fe-page-${pageName}`} pageName={pageName} />
                ))}

                <Popup ref={(ref) => (this.popup = ref ?? this.popup)} />
                <Console ref={(ref) => (this.console = ref ?? this.console)} />
            </KeyboardAvoidingView>
        );
    }
}

export default FlowEngine;
