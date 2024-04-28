import * as React from 'react';
import { Animated, TextInput } from 'react-native';

import { TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').TextInputProps} TextInputProps
 * 
 * @typedef {import('react-native').TextInputSubmitEditingEventData} TextInputSubmitEditingEventData
 * @typedef {import('react-native').NativeSyntheticEvent<TextInputSubmitEditingEventData>} NativeSyntheticEvent
 * 
 * @typedef {import('react-native').TextInputFocusEventData} TextInputFocusEventData
 * @typedef {import('react-native').NativeSyntheticEvent<TextInputFocusEventData>} NativeSyntheticEventFocus
 * 
 * @typedef {import('Interface/Components/Icon/back').Icons} Icons
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * 
 * @typedef {'default' | 'email' | 'username' | 'name'} TextContentType
 * 
 * @typedef {Object} InputTextPropsType
 * @property {StyleProp} style Style of the TextInput.
 * @property {string} label Label for the TextInput.
 * @property {Icons | null} icon Icon for the TextInput.
 * @property {boolean} staticLabel If true, the label is static.
 * @property {ThemeColor} activeColor Color used when the TextInput is active.
 * @property {TextContentType} type Type of content to handle.
 * @property {boolean} error If true, the TextInput has an error.
 * @property {boolean} enabled If true, the TextInput is enabled.
 * @property {boolean} forceActive If true, the TextInput is forced to be active.
 * @property {(e: NativeSyntheticEvent) => void} onSubmit Handler for the submit event.
 */

/** @type {TextInputProps & InputTextPropsType} */
const InputTextProps = {
    style: {},
    label: 'Default',
    icon: null,
    staticLabel: false,
    activeColor: 'main1',
    type: 'default',
    error: false,
    enabled: true,
    forceActive: false,
    onSubmit: (e) => {}
};

const ANIM_DURATION = 200;

class InputTextBack extends React.Component {
    /** @type {React.RefObject<TextInput>} */
    refInput = React.createRef();

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
        if (this.props.staticLabel || this.props.value?.length) {
            this.movePlaceHolderBorder();
        }
    }

    /**
     * @param {InputTextProps} nextProps
     * @param {InputTextBack['state']} nextState
     */
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.style !== this.props.style ||
            nextProps.label !== this.props.label ||
            nextProps.value !== this.props.value ||
            nextProps.staticLabel !== this.props.staticLabel ||
            nextProps.activeColor !== this.props.activeColor ||
            nextProps.type !== this.props.type ||
            nextProps.error !== this.props.error ||
            nextProps.enabled !== this.props.enabled ||
            nextProps.forceActive !== this.props.forceActive ||
            nextState.isFocused !== this.state.isFocused ||
            nextState.boxHeight !== this.state.boxHeight ||
            nextState.borderWidth !== this.state.borderWidth ||
            nextState.textWidth !== this.state.textWidth ||
            nextState.textHeight !== this.state.textHeight;
    }

    /** @param {InputTextProps} prevProps */
    componentDidUpdate(prevProps) {
        if (prevProps.staticLabel !== this.props.staticLabel) {
            if (this.props.staticLabel) this.movePlaceHolderBorder();
            else if (!this.state.isFocused) this.movePlaceHolderIn();
        }
        if (prevProps.value !== this.props.value) {
            if (this.props.value?.length) this.movePlaceHolderBorder();
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

    movePlaceHolderIn = () => {
        if (this.props.staticLabel) return;
        TimingAnimation(this.state.animTop, 1, ANIM_DURATION).start();
        TimingAnimation(this.state.animLeft, 16, ANIM_DURATION).start();
        TimingAnimation(this.state.animScale, 1, ANIM_DURATION).start();
        this.setState({ borderWidth: 1.2 });
    }

    movePlaceHolderBorder = () => {
        TimingAnimation(this.state.animTop, 0, ANIM_DURATION).start();
        TimingAnimation(this.state.animLeft, 8, ANIM_DURATION).start();
        TimingAnimation(this.state.animScale, 0.75, ANIM_DURATION).start();
        this.setState({ borderWidth: 1.6 });
    }

    /** @param {NativeSyntheticEventFocus} event */
    onFocusIn = (event) => {
        this.setState({ isFocused: true });
        this.movePlaceHolderBorder();
        if (!!this.props.onFocus) {
            this.props.onFocus(event);
        }
    }

    /** @param {NativeSyntheticEventFocus} event */
    onFocusOut = (event) => {
        this.setState({ isFocused: false });
        if (!this.props.value?.length) {
            this.movePlaceHolderIn();
        }
        if (!!this.props.onBlur) {
            this.props.onBlur(event);
        }
    }
}

InputTextBack.prototype.props = InputTextProps;
InputTextBack.defaultProps = InputTextProps;

export default InputTextBack;
