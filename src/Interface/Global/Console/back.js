import * as React from 'react';
import { Animated } from 'react-native';
import RNExitApp from 'react-native-exit-app';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';

import { TimingAnimation, SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {'info' | 'warn' | 'error'} ConsoleType
 * @typedef {{ type: ConsoleType, content: string }} ConsoleLine
 * @typedef {import('react-native').FlatList<ConsoleLine>} FlatList
 */

/**
 * - 0: Show all logs
 * - 1: Show only warnings and errors
 * - 2: Show only errors
 * @type {0 | 1 | 2}
 */
const LEVEL_CONSOLE = 1;

class ConsoleBack extends React.Component {
    state = {
        enabled: false,
        opened: false,
        animation: new Animated.Value(-1),
        animationDeleteButtons: new Animated.Value(0),

        /** @type {Array<ConsoleLine>} */
        debug: []
    };

    /** @type {React.RefObject<FlatList>} */
    refDebug = React.createRef();

    /** @type {boolean} State of delete buttons */
    toggle = false;

    /**
     * @private
     * @type {Array<ConsoleLine>}
     */
    messages = [];

    /**
     * @private
     * @type {boolean}
     */
    refreshing = false;

    /**
     * @private
     * @type {NodeJS.Timeout | null}
     */
    refreshTimeout = null;

    componentWillUnmount() {
        if (this.refreshTimeout !== null) {
            clearTimeout(this.refreshTimeout);
        }
    }

    Enable = () => {
        if (this.state.enabled) {
            return;
        }
        this.setState({ enabled: true }, this.processQueue);
        TimingAnimation(this.state.animation, 0, 400).start();
    };
    Disable = () => {
        if (!this.state.enabled) {
            return;
        }
        TimingAnimation(this.state.animation, -1, 400).start(() => {
            this.setState({ enabled: false });
        });
    };

    /**
     * Show message in app console
     * @param {ConsoleType} type
     * @param {string} text
     * @param {Array<any>} params
     * @returns {number} index of the message
     */
    AddLog = (type, text, ...params) => {
        if (!this.state.enabled) {
            return -1;
        }

        /** @type {ConsoleLine} */
        const newMessage = {
            type: type,
            content: this.formatText(text, ...params)
        };

        this.messages.push(newMessage);

        // Add to terminal
        let printLog = console.log;
        if (type === 'warn') {
            printLog = console.warn;
        } else if (type === 'error') {
            printLog = console.error;
        }

        if (
            LEVEL_CONSOLE === 0 ||
            (LEVEL_CONSOLE === 1 && type === 'warn') ||
            (LEVEL_CONSOLE >= 1 && type === 'error')
        ) {
            printLog(text, ...params);
        }

        // If error in production, send it to server
        if (type === 'error' && !__DEV__ && user.server2.IsAuthenticated()) {
            const errorSended = user.server2.tcp.Send({
                action: 'send-error',
                error: JSON.stringify(this.messages.slice(-4))
            });

            if (!errorSended) {
                console.error('[Console] Error not sended');
            }
        }

        this.processQueue();
        return this.messages.length - 1;
    };

    /**
     * Edit text in console, to update state debug
     * @param {number | undefined} index
     * @param {ConsoleType | 'same'} type
     * @param {string} text
     * @param {Array<any>} params
     * @returns {boolean} Success of edition
     */
    EditLog = (index, type, text, ...params) => {
        if (typeof index !== 'number') {
            // If undefined don't show error, probably console not mounted
            if (typeof index !== 'undefined') {
                console.warn('Index must be a number');
            }
            return false;
        }

        if (!this.state.enabled || index < 0 || index >= this.messages.length) {
            return false;
        }

        const _type = type === 'same' ? this.messages[index].type : type;

        /** @type {ConsoleLine} */
        this.messages[index] = {
            type: _type,
            content: this.formatText(text, ...params)
        };

        if (
            LEVEL_CONSOLE === 0 ||
            (LEVEL_CONSOLE >= 1 && _type === 'warn') ||
            (LEVEL_CONSOLE >= 2 && _type === 'error')
        ) {
            console.log(`Edit (${index}):`, text, ...params);
        }

        this.processQueue();
        return true;
    };

    processQueue = async () => {
        if (!this.state.enabled || !this.state.opened) {
            return;
        }

        // If already refreshing, wait
        if (this.refreshing === true) {
            if (this.refreshTimeout === null) {
                this.refreshTimeout = setTimeout(this.processQueue, 1000);
            }
            return;
        }

        // Not already refreshing, start
        if (this.refreshTimeout !== null) {
            clearTimeout(this.refreshTimeout);
            this.refreshTimeout = null;
        }

        // Refresh
        this.refreshing = true;
        await new Promise((resolve) => {
            this.setState({ debug: this.messages }, () => {
                resolve(null);
            });
        });

        // Scroll to end
        if (this.state.opened) {
            setTimeout(() => {
                this.refDebug?.current?.scrollToEnd();
            }, 100);
        }

        // End
        this.refreshing = false;
    };

    /**
     * Format text to show in console
     * @param {string} text
     * @param {Array<any>} params
     */
    formatText = (text, ...params) => {
        /** @param {any} v */
        const toString = (v) => (typeof v === 'object' ? JSON.stringify(v) : v);
        return [text, ...params].map(toString).join(' ');
    };

    open = () => {
        if (this.state.opened) {
            return;
        }
        this.setState({ opened: true }, this.processQueue);
        SpringAnimation(this.state.animation, 1).start();
        this.refDebug?.current?.scrollToEnd();
        user.interface.AddCustomBackHandler(this.close);
    };
    onClosePress = () => {
        user.interface.BackHandle();
    };
    close = () => {
        if (!this.state.opened) {
            return true;
        }

        this.setState({ opened: false });
        SpringAnimation(this.state.animation, 0).start();
        TimingAnimation(this.state.animationDeleteButtons, 0).start();
        return true;
    };
    toggleDeleteButtons = () => {
        this.toggle = !this.toggle;
        if (this.toggle) {
            SpringAnimation(this.state.animationDeleteButtons, 1).start();
        } else {
            TimingAnimation(this.state.animationDeleteButtons, 0).start();
        }
    };

    goToBenchMark = () => {
        user.interface.BackHandle();
        user.interface.ChangePage('benchmark');
    };

    goToResponsive = () => {
        user.interface.BackHandle();
        user.interface.ChangePage('responsive');
    };

    refreshAppData = async () => {
        this.toggleDeleteButtons();

        dataManager.Clear();
        await dataManager.SaveLocal(user);
        await dataManager.LoadOnline(user);
        await dataManager.SaveLocal(user);
    };

    deleteAll = async () => {
        await user.Clear(false);
        RNExitApp.exitApp();
    };
}

export default ConsoleBack;
