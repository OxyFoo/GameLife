import * as React from 'react';
import { Animated, Keyboard, Platform, Dimensions } from 'react-native';

import { SpringAnimation, TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 * @typedef {import('react-native').KeyboardEventListener} KeyboardEventListener
 * @typedef {import('Interface/Components').InputText} InputText
 *
 * @typedef {Object} ScreenInputType
 * @property {string} [label] Title of the input
 * @property {string} [initialText] Initial text of the input
 * @property {number} [maxLength] Maximum length of the input
 * @property {boolean} [multiline] If true, the input is multiline
 * @property {(text: string | null) => void} [callback] Callback called when the input is validated or closed, with the text or null
 */

class ScreenInputBack extends React.Component {
    state = {
        opened: false,

        /** @type {ScreenInputType | null} */
        input: null,
        text: '',

        anim: new Animated.Value(0),
        keyboardHeight: new Animated.Value(Dimensions.get('window').height)
    };

    /** @type {React.RefObject<InputText>} */
    refInput = React.createRef();

    posX = 0;
    posY = 0;
    timer = 0;
    layoutHeight = 0;

    componentDidMount() {
        Keyboard.addListener('keyboardDidShow', this.onKeyboardShow);
        Keyboard.addListener('keyboardDidHide', this.onKeyboardHide);
    }
    componentWillUnmount() {
        Keyboard.removeAllListeners('keyboardDidShow');
        Keyboard.removeAllListeners('keyboardDidHide');
    }

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        this.layoutHeight = event.nativeEvent.layout.height;
    };

    /** @type {KeyboardEventListener} */
    onKeyboardShow = (event) => {
        const { height } = event.endCoordinates;
        const { height: screenHeight } = Dimensions.get('window');

        //const offset = Platform.OS === 'android' ? -24 : -height;
        const offset = screenHeight - height - this.layoutHeight - (Platform.OS === 'android' ? 48 : 48 + 24);
        SpringAnimation(this.state.keyboardHeight, offset).start();
    };

    /** @type {KeyboardEventListener} event */
    onKeyboardHide = () => {
        const { height: screenHeight } = Dimensions.get('window');
        SpringAnimation(this.state.keyboardHeight, screenHeight).start();
        this.refInput?.current?.blur?.();
        this.Close(false);
    };

    /**
     * Open the screen input
     * @param {ScreenInputType} params
     */
    Open = (params) => {
        /** @type {ScreenInputType} */
        const defaultParams = {
            label: 'Input',
            initialText: '',
            multiline: false,
            maxLength: params.multiline ?? false ? 1024 : 64,
            callback: () => {}
        };
        const mergedParams = { ...defaultParams, ...params };

        TimingAnimation(this.state.anim, 1, 200).start();
        this.setState(
            {
                opened: true,
                text: mergedParams.initialText,
                input: mergedParams
            },
            this.refInput?.current?.focus
        );
    };

    /**
     * Close the screen input
     * @param {boolean} valid If true, the callback is called
     * @returns {boolean} True if the screen input is closed
     */
    Close = (valid = false) => {
        const { opened, input, text } = this.state;

        if (!opened || input === null) {
            return false;
        }

        input.callback?.(valid ? text : null);

        TimingAnimation(this.state.anim, 0, 200).start();
        this.setState({
            opened: false,
            callback: () => {}
        });

        return true;
    };

    /** @param {GestureResponderEvent} event */
    onPressIn = (event) => {
        const { pageX, pageY } = event.nativeEvent;
        this.posX = pageX;
        this.posY = pageY;
        this.timer = Date.now();
    };

    /** @param {GestureResponderEvent} event */
    onPressOut = (event) => {
        const { pageX, pageY } = event.nativeEvent;
        const deltaX = Math.abs(pageX - this.posX);
        const deltaY = Math.abs(pageY - this.posY);
        const deltaTime = Date.now() - this.timer;

        if (deltaX < 10 && deltaY < 10 && deltaTime < 300) {
            this.Close(false);
            this.refInput?.current?.blur?.(); // Hide keyboard
        }
    };

    /** @param {string} text */
    onChangeText = (text) => this.setState({ text: text });

    onValid = () => {
        this.refInput?.current?.blur?.();
        this.Close(true);
    };
}

export default ScreenInputBack;
