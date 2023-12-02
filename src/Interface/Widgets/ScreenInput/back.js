import * as React from 'react';
import { Animated, Keyboard } from 'react-native';

import user from 'Managers/UserManager';

import { TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('Interface/Components').Input} Input
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 */

class ScreenInputBack extends React.Component {
    state = {
        opened: false,
        label: '',
        text: '',
        multiline: false,
        anim: new Animated.Value(0),
        keyboardHeight: 0,
        callback: (text) => {},
        callbackClose: () => {}
    }

    /** @type {React.RefObject<Input>} */
    refInput = React.createRef();

    componentDidMount() {
        Keyboard.addListener('keyboardDidShow', this.onKeyboardShow);
        Keyboard.addListener('keyboardDidHide', this.onKeyboardHide);
    }
    componentWillUnmount() {
        Keyboard.removeAllListeners('keyboardDidShow');
        Keyboard.removeAllListeners('keyboardDidHide');
    }
    onKeyboardShow = (event) => {
        const { height, screenY } = event.endCoordinates;
        this.setState({ keyboardHeight: Math.ceil(user.interface.screenHeight - screenY) });
    }
    onKeyboardHide = () => {
        this.setState({ keyboardHeight: 0 });
        this.refInput?.current?.unfocus();
        this.Close(false);
    }

    /**
     * Open the screen input
     * @param {string} label Title of the input
     * @param {string} initialText Initial text of the input
     * @param {(text: string) => void} callback Callback called when the input is validated
     * @param {boolean} multiline If true, the input is multiline
     * @param {() => void} callbackClose Callback called when the input is closed
     */
    Open = (label = 'Input', initialText = '', callback = (text) => {}, multiline = false, callbackClose = () => {}) => {
        TimingAnimation(this.state.anim, 1, 200).start();
        this.setState({
            opened: true,
            label: label,
            text: initialText,
            multiline: multiline,
            callback: callback,
            callbackClose: callbackClose
        }, this.refInput?.current?.focus);
    }

    /**
     * Close the screen input
     * @param {boolean} valid If true, the callback is called
     * @returns {boolean} True if the screen input is closed
     */
    Close = (valid = false) => {
        if (!this.state.opened) return false;

        if (valid) {
            this.state.callback(this.state.text);
        }
        this.state.callbackClose();
        TimingAnimation(this.state.anim, 0, 200).start();
        this.setState({
            opened: false,
            callback: () => {}
        });

        return true;
    }

    /** @param {GestureResponderEvent} event */
    onPressIn = (event) => {
        const { pageX, pageY } = event.nativeEvent;
        this.posX = pageX;
        this.posY = pageY;
    }
    /** @param {GestureResponderEvent} event */
    onPressOut = (event) => {
        const { pageX, pageY } = event.nativeEvent;
        const deltaX = Math.abs(pageX - this.posX);
        const deltaY = Math.abs(pageY - this.posY);

        if (deltaX < 10 && deltaY < 10) {
            this.Close(false);
            this.refInput?.current?.unfocus(); // Hide keyboard
        }
    }
    onChangeText = (text) => this.setState({ text: text });

    onValid = () => {
        this.refInput?.current?.unfocus();
        this.Close(true);
    }
}

export default ScreenInputBack;
