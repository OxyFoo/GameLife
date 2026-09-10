import React from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaInsetsContext } from 'react-native-safe-area-context';

import styles from './style';
import BackFlowEngine from './back';
import DynamicArea from './DynamicArea';
import PageWrapper from './wrapper';
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
        const { testID } = this.props;
        const { customResponsive } = this.state;

        return (
            <SafeAreaProvider style={styles.fullscreen} testID={testID}>
                <DynamicBackground opacity={0.15} backgroundColor={themeManager.GetColor('ground1')} />
                <DynamicArea customResponsive={customResponsive}>
                    <KeyboardAvoidingView style={styles.fullscreen} behavior='padding'>
                        <SafeAreaInsetsContext.Consumer>
                            {(insets) => this.renderPages(insets)}
                        </SafeAreaInsetsContext.Consumer>
                        <UserHeader ref={this.userHeader} />
                        <BottomPanel ref={this.bottomPanel} />
                        <NavBar ref={this.navBar} />
                        <NotificationsInApp ref={this.notificationsInApp} />
                        <ScreenTuto ref={this.screenTuto} />
                        <Popup ref={this.popup} />
                        <ScreenInput ref={this.screenInput} />
                        <Console ref={this.console} />
                    </KeyboardAvoidingView>
                </DynamicArea>
            </SafeAreaProvider>
        );
    }

    /**
     * @param {import('./DynamicArea').AreaInsets | null} insets Safe-area insets, already applied as
     * padding by `DynamicArea`. A page declaring `feHeaderOverlay` gets them back as negative
     * offsets so its background reaches the physical edges of the screen; `overflow: hidden` then
     * clips to that enlarged box, not to the padded one. The bottom is left alone: the navbar owns
     * it, and the pages that overlay their header still sit above it.
     */
    renderPages(insets) {
        return this.state.mountedPages.map((page) => {
            const { selectedPage, currentTransition } = this.state;

            const Page = PAGES[page.pageName];
            const isActive = selectedPage === page.pageName;

            return (
                <PageWrapper
                    key={'page-' + page.pageName}
                    ref={page.wrapperRef}
                    transition={currentTransition}
                    pointerEvents={isActive ? 'auto' : 'none'}
                >
                    <View
                        style={[
                            styles.parent,
                            Page.feShowUserHeader &&
                                !Page.feHeaderOverlay && { top: this.userHeader.current?.state.height },
                            Page.feHeaderOverlay && {
                                top: -(insets?.top ?? 0),
                                left: -(insets?.left ?? 0),
                                right: -(insets?.right ?? 0)
                            },
                            Page.feShowNavBar && { bottom: this.navBar.current?.state.height }
                        ]}
                    >
                        <Page ref={page.ref} args={page.args} flowEngine={this._public} />
                        {Platform.OS === 'ios' && <KeyboardSpacerView offset={96} />}
                    </View>
                </PageWrapper>
            );
        });
    }
}

export default FlowEnginePagesRender;
