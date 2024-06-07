import * as React from 'react';
import { Animated } from 'react-native';

import user from 'Managers/UserManager';

import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * 
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 */

const SwitchTextProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {ThemeColor} */
    color: 'main1',

    /** @type {number} */
    fontSize: 14,

    /** @type {Array<string>} */
    texts: [],

    /** @type {number} Selected index */
    value: 0,

    /** @param {number} index Called when seleted part change */
    onChangeValue: (index) => {}
};

class SwitchTextBack extends React.Component {
    state = {
        anim: new Animated.Value(this.props.value),
        parentWidth: 0
    }

    /**
     * @param {SwitchTextProps} nextProps
     * @param {SwitchTextBack['state']} nextState
     */
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.value !== nextProps.value ||
            this.props.texts !== nextProps.texts ||
            this.state.parentWidth !== nextState.parentWidth;
    }

    /** @param {SwitchTextProps} prevProps */
    componentDidUpdate(prevProps) {
        const { value } = this.props;
        if (prevProps.value !== this.props.value) {
            if (value < 0 || value >= this.props.texts.length) {
                user.interface.console.AddLog('warn', 'TextSwitch value is out of bounds');
                return;
            }

            SpringAnimation(this.state.anim, value).start();
        }
    }

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        if (width !== this.state.parentWidth) {
            this.setState({ parentWidth: width });
        }
    }

    /** @param {number} index */
    onChange = (index) => {
        this.props.onChangeValue(index);
    }
}

SwitchTextBack.prototype.props = SwitchTextProps;
SwitchTextBack.defaultProps = SwitchTextProps;

export default SwitchTextBack;
