import * as React from 'react';
import { StyleSheet } from 'react-native';

import BackOnboarding from './back';
import langManager from '../../../Managers/LangManager';

import { renderPage0, renderPage1, renderPage2, renderPage3 } from './panels';
import { Button, Page, Swiper } from '../../Components';

class Onboarding extends BackOnboarding {
    render() {
        const lang = langManager.curr['onboarding'];
        const pages = [
            renderPage0.bind(this)(),
            renderPage1.bind(this)(),
            renderPage2.bind(this)(),
            renderPage3.bind(this)()
        ];
        const buttonText = this.state.last ? lang['start'] : lang['next'];
        const buttonStyle = [ styles.buttonNext, { top: this.state.swiperHeight - 42 } ];

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
                    onLayout={this.onLayoutSwiper}
                    enableAutoNext={false}
                    pages={pages}
                    onSwipe={this.onSwipe}
                    backgroundColor='transparent'
                    disableCircular
                />
                <Button
                    style={buttonStyle}
                    onPress={this.next}
                    color='main1'
                    fontSize={14}
                >
                    {buttonText}
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
        height: 42,
        paddingHorizontal: 16
    }
});

export default Onboarding;