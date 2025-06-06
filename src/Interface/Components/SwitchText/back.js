import * as React from 'react';
import { Animated, Dimensions } from 'react-native';

import user from 'Managers/UserManager';

import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 *
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 */

/**
 * @typedef SwitchTextPropsType
 * @property {StyleProp} style
 * @property {number} throttleTime
 * @property {ThemeColor} color
 * @property {number} fontSize
 * @property {Array<string>} texts
 * @property {number} value
 * @property {(index: number) => void} onChangeValue
 */

/** @type {SwitchTextPropsType} */
const SwitchTextProps = {
    style: {},
    throttleTime: 250,
    color: 'main1',
    fontSize: 14,
    texts: [],
    value: 0,
    onChangeValue: () => {}
};

class SwitchTextBack extends React.Component {
    state = {
        anim: new Animated.Value(0),
        parentWidth: 0
    };

    last = 0;

    /** @param {SwitchTextPropsType} props */
    constructor(props) {
        super(props);

        // Approximate parent width to avoid glitches on first render
        const { width } = Dimensions.get('window');
        this.state.parentWidth = width * 0.9;

        if (props.value < 0 || props.value >= props.texts.length) {
            user.interface.console?.AddLog('warn', 'TextSwitch value is out of bounds');
            return;
        }

        this.state.anim.setValue(props.value);
    }

    /**
     * @param {SwitchTextPropsType} nextProps
     * @param {SwitchTextBack['state']} nextState
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (
            this.props.value !== nextProps.value ||
            this.props.texts !== nextProps.texts ||
            this.state.parentWidth !== nextState.parentWidth
        );
    }

    /** @param {SwitchTextPropsType} prevProps */
    componentDidUpdate(prevProps) {
        const { value } = this.props;
        if (prevProps.value !== this.props.value) {
            if (value < 0 || value >= this.props.texts.length) {
                user.interface.console?.AddLog('warn', 'TextSwitch value is out of bounds');
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
    };

    /** @param {number} index */
    onChange = (index) => {
        // Prevent multiple clicks
        const now = Date.now();
        if (now - this.last < this.props.throttleTime) {
            return;
        }

        this.last = now;
        this.props.onChangeValue(index);
    };
}

SwitchTextBack.prototype.props = SwitchTextProps;
SwitchTextBack.defaultProps = SwitchTextProps;

export default SwitchTextBack;
