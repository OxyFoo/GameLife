import * as React from 'react';
import { Animated } from 'react-native';

import { TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').TextInput} TextInput
 * 
 * @typedef {import('react-native').TextInputSubmitEditingEventData} TextInputSubmitEditingEventData
 * @typedef {import('react-native').NativeSyntheticEvent<TextInputSubmitEditingEventData>} NativeSyntheticEvent
 * 
 * @typedef {import('Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('Managers/ThemeManager').ColorThemeText} ColorThemeText
 * 
 * @typedef {'default'|'email'|'username'|'name'} TextContentType
 */

const InputProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {number} */
    height: 56,

    /** @type {string} */
    label: 'Default',

    /** @type {boolean} If true, label still always at the top of input */
    staticLabel: false,

    /** @type {ColorTheme} */
    activeColor: 'main1',

    /** @type {string} Content of input */
    text: '',

    /** @type {number?} Set max length of input content */
    maxLength: null,

    /** @type {TextContentType} The type of the input. */
    textContentType: 'default',

    /** @param {string} newText */
    onChangeText: (newText) => {},

    /** @type {(e: NativeSyntheticEvent) => void} */
    onSubmit: (e) => {},

    /** @type {boolean} If false, user can't select or edit the input content */
    enabled: true,

    /** @type {boolean} If true, force focus (set active color) */
    active: false,

    /** @type {boolean} */
    multiline: false,

    /** @type {'auto'|'box-only'|'box-none'|'none'} */
    pointerEvents: 'auto'
}

const ANIM_DURATION = 200;

class InputBack extends React.Component {
    /** @type {TextInput|null} props */
    refInput = null;

    state = {
        animTop: new Animated.Value(1),
        animLeft: new Animated.Value(16),
        animScale: new Animated.Value(1),

        isFocused: false,
        boxHeight: 0,
        borderWidth: 1.2,
        textWidth: 0,
        textHeight: 0
    }

    componentDidMount() {
        if (this.props.staticLabel || this.props.text.length > 0) {
            this.movePlaceHolderBorder();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.staticLabel) {
            this.movePlaceHolderBorder();
        }
        if (prevProps.text !== this.props.text) {
            if (this.props.text.length > 0) this.movePlaceHolderBorder();
            else if (!this.state.isFocused) this.movePlaceHolderIn();
        }
    }

    /** @param {LayoutChangeEvent} event */
    onBoxLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        if (height !== this.state.boxHeight) {
            this.setState({ boxHeight: height });
        }
    }

    /** @param {LayoutChangeEvent} event */
    onTextLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        if (width !== this.state.textWidth) {
            this.setState({ textWidth: width });
        }
        if (height !== this.state.textHeight) {
            this.setState({ textHeight: height });
        }
    }

    movePlaceHolderIn() {
        if (this.props.staticLabel) return;
        TimingAnimation(this.state.animTop, 1, ANIM_DURATION).start();
        TimingAnimation(this.state.animLeft, 16, ANIM_DURATION).start();
        TimingAnimation(this.state.animScale, 1, ANIM_DURATION).start();
        this.setState({ borderWidth: 1.2 });
    }

    movePlaceHolderBorder() {
        TimingAnimation(this.state.animTop, 0, ANIM_DURATION).start();
        TimingAnimation(this.state.animLeft, 8, ANIM_DURATION).start();
        TimingAnimation(this.state.animScale, 0.75, ANIM_DURATION).start();
        this.setState({ borderWidth: 1.6 });
    }

    onFocusIn = (ev, a) => {
        this.setState({ isFocused: true });
        this.movePlaceHolderBorder();
    }
    
    onFocusOut = () => {
        this.setState({ isFocused: false });
        if (!this.props.text.length) {
            this.movePlaceHolderIn();
        }
    }

    focus() {
        this.refInput?.focus();
    }
    unfocus() {
        this.refInput?.blur();
    }
}

InputBack.prototype.props = InputProps;
InputBack.defaultProps = InputProps;

export default InputBack;