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
    }

    /** @type {React.RefObject<FlatList>} */
    refDebug = React.createRef();

    /** @type {boolean} State of delete buttons */
    toggle = false;

    Enable = () => {
        this.setState({ enabled: true });
        TimingAnimation(this.state.animation, 0, 400).start();
    }
    Disable = () => {
        TimingAnimation(this.state.animation, -1, 400).start(() => {
            this.setState({ enabled: false });
        });
    }

    /**
     * Show message in app console
     * @param {ConsoleType} type
     * @param {string} text
     * @param {Array<any>} params
     * @returns {number} index of the message
     */
    AddLog = (type, text, ...params) => {
        if (!this.state.enabled) return -1;

        // Add to app console
        let messages = [...this.state.debug];

        /** @type {ConsoleLine} */
        const newMessage = {
            type: type,
            content: this.formatText(text, ...params)
        };
        messages.push(newMessage);
        this.setState({ debug: messages });

        // Add to terminal
        let printLog = console.log;
        if (type === 'warn') printLog = console.warn;
        else if (type === 'error') printLog = console.error;

        if (LEVEL_CONSOLE === 0
            || (LEVEL_CONSOLE === 1  && type === 'warn')
            || (LEVEL_CONSOLE >= 1  && type === 'error')) {
            printLog(text, ...params);
        }

        // If error, send to server
        if (type === 'error' && !__DEV__ && user.server.online) {
            user.server.SendReport('error', messages.slice(-4));
        }

        // Scroll to end
        if (this.state.opened) {
            this.refDebug?.current?.scrollToEnd();
        }

        return messages.length - 1;
    }

    /**
     * Edit text in console, to update state debug
     * @param {number} index
     * @param {ConsoleType | 'same'} type
     * @param {string} text
     * @param {Array<any>} params
     * @returns {boolean} Success of edition
     */
    EditLog = (index, type, text, ...params) => {
        if (!this.state.enabled) return false;

        let messages = [...this.state.debug];
        if (index < 0 || index >= messages.length) return false;

        const _type = type === 'same' ? messages[index][0] : type;
        /** @type {ConsoleLine} */
        const newMessage = {
            type: _type,
            content: this.formatText(text, ...params)
        };
        messages.splice(index, 1, newMessage);
        this.setState({ debug: messages });

        if (LEVEL_CONSOLE === 0 ||
           (LEVEL_CONSOLE >= 1  && _type === 'warn') ||
           (LEVEL_CONSOLE >= 2  && _type === 'error')) {
            console.log(`Edit (${index}):`, text, ...params);
        }

        return true;
    }

    /**
     * Format text to show in console
     * @param {string} text
     * @param {Array<any>} params
     */
    formatText = (text, ...params) => {
        const toString = (v) => typeof(v) === 'object' ? JSON.stringify(v) : v;
        return [text, ...params].map(toString).join(' ');
    }

    open = () => {
        this.setState({ opened: true });
        SpringAnimation(this.state.animation, 1).start();
        this.refDebug?.current?.scrollToEnd();
    }
    close = () => {
        this.setState({ opened: false });
        SpringAnimation(this.state.animation, 0).start();
        TimingAnimation(this.state.animationDeleteButtons, 0).start();
    }
    toggleDeleteButtons = () => {
        this.toggle = !this.toggle;
        if (this.toggle) {
            SpringAnimation(this.state.animationDeleteButtons, 1).start();
        } else {
            TimingAnimation(this.state.animationDeleteButtons, 0).start();
        }
    }

    goToBenchMark = () => {
        this.close();
        user.interface.ChangePage('benchmark');
    }

    refreshInternalData = async () => {
        this.toggleDeleteButtons();

        dataManager.Clear();
        await dataManager.LocalSave(user);
        await dataManager.OnlineLoad(user);
        await dataManager.LocalSave(user);
    }

    deleteAll = async () => {
        await user.Clear(false);
        RNExitApp.exitApp();
    }
}

export default ConsoleBack;
