import * as React from 'react';
import { Animated } from 'react-native';

import { TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').TextInput} TextInput
 * @typedef {import('react-native').TextInputProps} TextInputProps
 *
 * @typedef {import('react-native').TextInputSubmitEditingEventData} TextInputSubmitEditingEventData
 * @typedef {import('react-native').NativeSyntheticEvent<TextInputSubmitEditingEventData>} NativeSyntheticEvent
 *
 * @typedef {import('react-native').TextInputFocusEventData} TextInputFocusEventData
 * @typedef {import('react-native').NativeSyntheticEvent<TextInputFocusEventData>} NativeSyntheticEventFocus
 *
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 *
 * @typedef {'default' | 'email' | 'username' | 'name'} TextContentType
 *
 * @typedef {Object} InputTextThinPropsType
 * @property {StyleProp} containerStyle Style of the TextInput.
 * @property {ThemeColor} activeColor Color used when the TextInput is active.
 * @property {TextContentType} type Type of content to handle.
 * @property {boolean} enabled If true, the TextInput is enabled.
 * @property {number} borderWidth Width of the border.
 * @property {boolean} forceActive If true, the TextInput is forced to be active.
 * @property {(e: NativeSyntheticEvent) => void} onSubmit Handler for the submit event.
 */

/** @type {TextInputProps & InputTextThinPropsType} */
const InputTextThinProps = {
    containerStyle: {},
    activeColor: 'main1',
    type: 'default',
    enabled: true,
    borderWidth: 1,
    forceActive: false,
    onSubmit: () => {}
};

const ANIM_DURATION = 200;

class InputTextThinBack extends React.Component {
    /** @type {React.RefObject<TextInput>} */
    refInput = React.createRef();

    state = {
        animBorder: new Animated.Value(0)
    };

    /**
     * @param {InputTextThinProps} nextProps
     * @param {InputTextThinBack['state']} _nextState
     */
    shouldComponentUpdate(nextProps, _nextState) {
        return (
            nextProps.style !== this.props.style ||
            nextProps.containerStyle !== this.props.containerStyle ||
            nextProps.value !== this.props.value ||
            nextProps.activeColor !== this.props.activeColor ||
            nextProps.type !== this.props.type ||
            nextProps.borderWidth !== this.props.borderWidth ||
            nextProps.enabled !== this.props.enabled ||
            nextProps.forceActive !== this.props.forceActive
        );
    }

    blur = this.refInput.current?.blur;
    focus = this.refInput.current?.focus;

    /** @param {NativeSyntheticEventFocus} event */
    onFocusIn = (event) => {
        TimingAnimation(this.state.animBorder, 1, ANIM_DURATION).start();

        if (this.props.onFocus) {
            this.props.onFocus(event);
        }
    };

    /** @param {NativeSyntheticEventFocus} event */
    onFocusOut = (event) => {
        TimingAnimation(this.state.animBorder, 0, ANIM_DURATION).start();

        if (this.props.onBlur) {
            this.props.onBlur(event);
        }
    };
}

InputTextThinBack.prototype.props = InputTextThinProps;
InputTextThinBack.defaultProps = InputTextThinProps;

export default InputTextThinBack;
