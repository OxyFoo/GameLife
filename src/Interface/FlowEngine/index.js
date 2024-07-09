import * as React from 'react';
import { KeyboardAvoidingView } from 'react-native';

import styles from './style';
import FlowEnginePagesRender from './pagesRender';

import { DynamicBackground } from 'Interface/Primitives';
import { NavBar, Console, NotificationsInApp, Popup, UserHeader, BottomPanel } from 'Interface/Global';

/**
 * @typedef {import('./back').PageNames} PageNames
 */

const FlowEngine = React.forwardRef((_, ref) => {
    /** @type {React.MutableRefObject<Popup | null>} */
    const refPopup = React.useRef(null);

    /** @type {React.MutableRefObject<BottomPanel | null>} */
    const refBottomPanel = React.useRef(null);

    /** @type {React.MutableRefObject<Console | null>} */
    const refConsole = React.useRef(null);

    /** @type {React.MutableRefObject<NotificationsInApp | null>} */
    const refNotificationsInApp = React.useRef(null);

    /** @type {React.MutableRefObject<NavBar | null>} */
    const refBottomBar = React.useRef(null);

    /** @type {React.MutableRefObject<UserHeader | null>} */
    const refUserHeader = React.useRef(null);

    return (
        <KeyboardAvoidingView style={[styles.fullscreen, styles.background]} behavior={'padding'}>
            <DynamicBackground opacity={0.15} />
            <FlowEnginePagesRender
                ref={ref}
                popup={refPopup}
                bottomPanel={refBottomPanel}
                console={refConsole}
                userHeader={refUserHeader}
                navBar={refBottomBar}
                notificationsInApp={refNotificationsInApp}
            />
            <UserHeader ref={refUserHeader} />
            <BottomPanel ref={refBottomPanel} />
            <NavBar ref={refBottomBar} />
            <NotificationsInApp ref={refNotificationsInApp} />
            <Popup ref={refPopup} />
            <Console ref={refConsole} />
        </KeyboardAvoidingView>
    );
});

export default FlowEngine;
