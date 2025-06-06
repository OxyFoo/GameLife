import * as React from 'react';
import { Animated } from 'react-native';

import { TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').TextInput} TextInput
 * @typedef {import('react-native').TextInputProps} TextInputProps
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 *
 * @typedef {import('react-native').TextInputSubmitEditingEventData} TextInputSubmitEditingEventData
 * @typedef {import('react-native').NativeSyntheticEvent<TextInputSubmitEditingEventData>} NativeSyntheticEvent
 *
 * @typedef {import('react-native').TextInputFocusEventData} TextInputFocusEventData
 * @typedef {import('react-native').NativeSyntheticEvent<TextInputFocusEventData>} NativeSyntheticEventFocus
 *
 * @typedef {import('Interface/Components/Icon/back').IconsName} IconsName
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 *
 * @typedef {'default' | 'email' | 'username' | 'name'} TextContentType
 *
 * @typedef {Object} InputTextPropsType
 * @property {StyleProp} containerStyle Style of the TextInput.
 * @property {string} label Label for the TextInput.
 * @property {IconsName | null} icon Icon for the TextInput.
 * @property {boolean} staticLabel If true, the label is static.
 * @property {ThemeColor} activeColor Color used when the TextInput is active.
 * @property {ThemeColor} inactiveColor Color used when the TextInput is inactive.
 * @property {ThemeText | ThemeColor} backgroundColor Background color of the input
 * @property {TextContentType} type Type of content to handle.
 * @property {boolean} error If true, the TextInput has an error.
 * @property {boolean} enabled If true, the TextInput is enabled.
 * @property {boolean} showCounter If true, the TextInput shows a counter.
 * @property {boolean} forceActive If true, the TextInput is forced to be active.
 * @property {(e: LayoutChangeEvent) => void} onParentLayout Handler for the layout event.
 * @property {(e: NativeSyntheticEvent) => void} onSubmit Handler for the submit event.
 */

/** @type {TextInputProps & InputTextPropsType} */
const InputTextProps = {
    containerStyle: {},
    label: '',
    icon: null,
    staticLabel: false,
    activeColor: 'main1',
    inactiveColor: 'borderLight',
    backgroundColor: 'transparent',
    type: 'default',
    error: false,
    enabled: true,
    showCounter: false,
    forceActive: false,
    onParentLayout: () => {},
    onSubmit: () => {}
};

const ANIM_DURATION = 200;

class InputTextBack extends React.Component {
    /** @type {React.RefObject<TextInput | null>} */
    refInput = React.createRef();

    state = {
        animTop: new Animated.Value(1),
        animLeft: new Animated.Value(16),
        animScale: new Animated.Value(1),

        isFocused: false,
        boxHeight: 0,
        borderWidth: 1.2,
        textWidth: 0,
        textHeight: 0,
        textCounterWidth: 0
    };

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
        return (
            nextProps.style !== this.props.style ||
            nextProps.containerStyle !== this.props.containerStyle ||
            nextProps.label !== this.props.label ||
            nextProps.value !== this.props.value ||
            nextProps.staticLabel !== this.props.staticLabel ||
            nextProps.activeColor !== this.props.activeColor ||
            nextProps.type !== this.props.type ||
            nextProps.error !== this.props.error ||
            nextProps.enabled !== this.props.enabled ||
            nextProps.forceActive !== this.props.forceActive ||
            nextProps.showCounter !== this.props.showCounter ||
            nextState.isFocused !== this.state.isFocused ||
            nextState.boxHeight !== this.state.boxHeight ||
            nextState.borderWidth !== this.state.borderWidth ||
            nextState.textWidth !== this.state.textWidth ||
            nextState.textHeight !== this.state.textHeight ||
            nextState.textCounterWidth !== this.state.textCounterWidth
        );
    }

    /** @param {InputTextProps} prevProps */
    componentDidUpdate(prevProps) {
        if (prevProps.staticLabel !== this.props.staticLabel) {
            if (this.props.staticLabel) {
                this.movePlaceHolderBorder();
            } else if (!this.state.isFocused) {
                this.movePlaceHolderIn();
            }
        }
        if (prevProps.value !== this.props.value) {
            if (this.props.value?.length) {
                this.movePlaceHolderBorder();
            } else if (!this.state.isFocused) {
                this.movePlaceHolderIn();
            }
        }
    }

    /** @param {LayoutChangeEvent} event */
    onBoxLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        if (height !== this.state.boxHeight) {
            this.setState({ boxHeight: height });
        }
        this.props.onParentLayout(event);
    };

    /** @param {LayoutChangeEvent} event */
    onTextLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        if (width !== this.state.textWidth) {
            this.setState({ textWidth: width });
        }
        if (height !== this.state.textHeight) {
            this.setState({ textHeight: height });
        }
    };

    /** @param {LayoutChangeEvent} event */
    onTextCounterLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        if (width !== this.state.textCounterWidth) {
            this.setState({ textCounterWidth: width });
        }
    };

    blur = () => this.refInput.current?.blur();
    focus = () => this.refInput.current?.focus();

    movePlaceHolderIn = () => {
        if (this.props.staticLabel) {
            return;
        }
        TimingAnimation(this.state.animTop, 1, ANIM_DURATION).start();
        TimingAnimation(this.state.animLeft, 16, ANIM_DURATION).start();
        TimingAnimation(this.state.animScale, 1, ANIM_DURATION).start();
        this.setState({ borderWidth: 1.2 });
    };

    movePlaceHolderBorder = () => {
        TimingAnimation(this.state.animTop, 0, ANIM_DURATION).start();
        TimingAnimation(this.state.animLeft, 8, ANIM_DURATION).start();
        TimingAnimation(this.state.animScale, 0.75, ANIM_DURATION).start();
        this.setState({ borderWidth: 1.6 });
    };

    /** @param {NativeSyntheticEventFocus} event */
    onFocusIn = (event) => {
        this.setState({ isFocused: true });
        this.movePlaceHolderBorder();
        if (this.props.onFocus) {
            this.props.onFocus(event);
        }
    };

    /** @param {NativeSyntheticEventFocus} event */
    onFocusOut = (event) => {
        this.setState({ isFocused: false });
        if (!this.props.value?.length) {
            this.movePlaceHolderIn();
        }
        if (this.props.onBlur) {
            this.props.onBlur(event);
        }
    };
}

InputTextBack.prototype.props = InputTextProps;
InputTextBack.defaultProps = InputTextProps;

export default InputTextBack;
