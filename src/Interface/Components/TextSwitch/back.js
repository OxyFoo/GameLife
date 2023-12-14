import * as React from 'react';
import { Animated } from 'react-native';

import user from 'Managers/UserManager';

import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 */

const TextSwitchProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {Array<string>} */
    texts: [],

    /** @type {number} */
    fontSize: 12,

    /** @param {number} index Called when seleted part change */
    onChange: (index) => {}
};

class TextSwitchBack extends React.Component {
    state = {
        anim: new Animated.Value(0),
        parentWidth: 0,
        selectedIndex: 0
    }

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        if (width !== this.state.parentWidth) {
            this.setState({ parentWidth: width });
        }
    }

    /**
     * Set selected index
     * @param {number} index
     * @returns {boolean} True if index is valid
     */
    SetSelectedIndex(index) {
        if (index < 0 || index >= this.props.texts.length) {
            user.interface.console.AddLog('warn', 'TextSwitch index is out of bounds');
            return false;
        }

        this.onChange(index, false);
        return true;
    }

    onChange = (index, callback = true) => {
        if (callback) this.props.onChange(index);
        SpringAnimation(this.state.anim, index).start();
        this.setState({ selectedIndex: index });
    }
}

TextSwitchBack.prototype.props = TextSwitchProps;
TextSwitchBack.defaultProps = TextSwitchProps;

export default TextSwitchBack;
