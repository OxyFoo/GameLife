import React from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
                </DynamicArea>
            </SafeAreaProvider>
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
