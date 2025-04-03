import * as React from 'react';
import { Animated, View, KeyboardAvoidingView, Platform } from 'react-native';

import styles from './style';
import BackFlowEngine from './back';
import SafeAreaWithResponsive from './SafeAreaWithResponsive';
import { GetAnimationPage } from './animations';
import themeManager from 'Managers/ThemeManager';

import PAGES from 'Interface/Pages';
import { DynamicBackground } from 'Interface/Primitives';
import {
    BottomPanel,
    Console,
    NavBar,
    NotificationsInApp,
    Popup,
    ScreenInput,
    ScreenTuto,
    UserHeader
} from 'Interface/Global';
import { KeyboardSpacerView } from 'Interface/Components';

class FlowEnginePagesRender extends BackFlowEngine {
    render() {
        const styleBackground = {
            backgroundColor: themeManager.GetColor('ground1')
        };

        return (
            <SafeAreaWithResponsive onLayout={this.onLayout}>
                <KeyboardAvoidingView style={[styles.fullscreen, styleBackground]} behavior='padding'>
                    <DynamicBackground opacity={0.15} />
                    {this.renderPages()}
                    <UserHeader ref={this.userHeader} />
                    <BottomPanel ref={this.bottomPanel} />
                    <NavBar ref={this.navBar} />
                    <NotificationsInApp ref={this.notificationsInApp} />
                    <ScreenTuto ref={this.screenTuto} />
                    <Popup ref={this.popup} />
                    <ScreenInput ref={this.screenInput} />
                    <Console ref={this.console} />
                </KeyboardAvoidingView>
            </SafeAreaWithResponsive>
        );
    }

    renderPages() {
        return this.availablePages.map((pageName) => {
            const { selectedPage, currentTransition } = this.state;

            const page = this.getActivePage(pageName);

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
                        Page.feShowUserHeader && { top: this.userHeader.current?.state.height },
                        Page.feShowNavBar && { bottom: this.navBar.current?.state.height },
                        {
                            opacity: Animated.subtract(1, page.transitionEnd),
                            transform: GetAnimationPage(page, currentTransition)
                        }
                    ]}
                    pointerEvents={selectedPage === pageName ? 'auto' : 'none'}
                >
                    <View style={styles.page}>
                        <Page ref={page.ref} args={page.args} flowEngine={this._public} />
                        {Platform.OS === 'ios' && <KeyboardSpacerView offset={96} />}
                    </View>
                </Animated.View>
            );
        });
    }
}

export default FlowEnginePagesRender;
