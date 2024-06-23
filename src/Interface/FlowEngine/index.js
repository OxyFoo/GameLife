import * as React from 'react';
import { Animated, KeyboardAvoidingView, ScrollView } from 'react-native';

import styles from './style';
import BackFlowEngine from './back';
import { GetAnimationPageClose, GetAnimationPageOpen } from './animations';
import PAGES from 'Interface/Pages';

import { DynamicBackground } from 'Interface/Primitives';
import { Console, Popup, UserHeader } from 'Interface/Global';

/**
 * @typedef {import('./back').PageNames} PageNames
 */

const FlowEngine = React.forwardRef((_, ref) => {
    /** @type {React.MutableRefObject<Popup | null>} */
    const refPopup = React.useRef(null);

    /** @type {React.MutableRefObject<Console | null>} */
    const refConsole = React.useRef(null);

    /** @type {React.MutableRefObject<UserHeader | null>} */
    const refUserHeader = React.useRef(null);

    return (
        <KeyboardAvoidingView style={[styles.fullscreen, styles.background]} behavior='height'>
            <DynamicBackground />
            <FlowEngineClass ref={ref} popup={refPopup} console={refConsole} userHeader={refUserHeader} />
            <UserHeader ref={refUserHeader} />
            <Popup ref={refPopup} />
            <Console ref={refConsole} />
        </KeyboardAvoidingView>
    );
});

class FlowEngineClass extends BackFlowEngine {
    render() {
        return this.availablePages.map((pageName) => {
            const { selectedPage, currentTransition } = this.state;

            const page = this.getMountedPage(pageName);
            if (page === null) {
                return null;
            }

            const Page = PAGES[pageName];
            return (
                <Animated.View
                    key={'page-' + pageName}
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
        });
    }
}

export default FlowEngine;
