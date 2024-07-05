import * as React from 'react';
import { Animated, View, ScrollView } from 'react-native';

import styles from './style';
import BackFlowEngine from './back';
import { GetAnimationPageClose, GetAnimationPageOpen } from './animations';
import PAGES from 'Interface/Pages';

class FlowEnginePagesRender extends BackFlowEngine {
    render() {
        return this.availablePages.map((pageName) => {
            const { selectedPage, currentTransition } = this.state;

            const page = this.getMountedPage(pageName);

            // Page not found or not mounted and not keep mounted
            if (page === null) {
                return null;
            }

            const Page = PAGES[pageName];
            return (
                <Animated.View
                    key={'page-' + pageName}
                    style={[
                        styles.parent,
                        Page.feShowUserHeader && { top: this.userHeader?.state.height },
                        Page.feShowNavBar && { bottom: this.navBar?.state.height },
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
                    {Page.feScrollEnabled ? (
                        <ScrollView
                            style={styles.fullscreen}
                            contentContainerStyle={styles.scrollviewContainer}
                            children={<Page ref={page.ref} args={page.args} flowEngine={this} />}
                        />
                    ) : (
                        <View
                            style={styles.fullscreen}
                            children={<Page ref={page.ref} args={page.args} flowEngine={this} />}
                        />
                    )}
                </Animated.View>
            );
        });
    }
}

export default FlowEnginePagesRender;
