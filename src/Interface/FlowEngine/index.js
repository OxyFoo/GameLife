import React from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';

import styles from './style';
import BackFlowEngine from './back';
import SafeAreaWithResponsive from './SafeAreaWithResponsive';
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
        const styleBackground = {
            backgroundColor: themeManager.GetColor('ground1')
        };

        return (
            <SafeAreaWithResponsive onLayout={this.onLayout} testID={this.props.testID}>
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
        return this.state.mountedPages.map((page) => {
            const { selectedPage, currentTransition } = this.state;

            const Page = PAGES[page.pageName];

            return (
                <PageWrapper key={'page-' + page.pageName} ref={page.wrapperRef} transition={currentTransition}>
                    <View
                        style={[
                            styles.parent,
                            Page.feShowUserHeader && { top: this.userHeader.current?.state.height },
                            Page.feShowNavBar && { bottom: this.navBar.current?.state.height }
                        ]}
                        pointerEvents={selectedPage === page.pageName ? 'auto' : 'none'}
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
