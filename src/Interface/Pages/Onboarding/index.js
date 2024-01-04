import * as React from 'react';
import { Animated, StyleSheet } from 'react-native';

import BackOnboarding from './back';
import langManager from 'Managers/LangManager';

import { renderPage0, renderPage1, renderPage2, renderPage3 } from './panels';
import { Button, Page, Swiper } from 'Interface/Components';

class Onboarding extends BackOnboarding {
    render() {
        const { animButtonNext, animButtonStart } = this.state;
        const lang = langManager.curr['onboarding'];

        const pages = [
            renderPage0.call(this),
            renderPage1.call(this),
            renderPage2.call(this),
            renderPage3.call(this)
        ];

        return (
            <Page
                ref={ref => this.refPage = ref}
                style={styles.page}
                scrollable={false}
            >
                <Swiper
                    ref={ref => this.refSwiper = ref}
                    height={'100%'}
                    style={styles.swiper}
                    pages={pages}
                    onSwipe={this.onSwipe}
                    backgroundColor='transparent'
                    enableAutoNext={false}
                    disableCircular
                />

                {/* Start button */}
                <Button
                    style={styles.buttonNext}
                    styleAnimation={{
                        opacity: animButtonStart,
                        transform: [{ translateX: Animated.multiply(Animated.subtract(1, animButtonStart), 96) }]
                    }}
                    onPress={this.next}
                    color='main1'
                    fontSize={14}
                    pointerEvents={this.last ? 'none' : 'auto'}
                >
                    {lang['start']}
                </Button>

                {/* Next button */}
                <Button
                    style={styles.buttonNext}
                    styleAnimation={{
                        opacity: animButtonNext,
                        transform: [{ translateY: Animated.multiply(animButtonStart, 96) }]
                    }}
                    onPress={this.next}
                    color='main1'
                    fontSize={14}
                >
                    {lang['next']}
                </Button>
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        paddingHorizontal: 0
    },
    swiper: {
        justifyContent: 'center'
    },
    buttonNext: {
        position: 'absolute',
        right: 24,
        bottom: 36,
        height: 42,
        paddingHorizontal: 16
    }
});

export default Onboarding;
