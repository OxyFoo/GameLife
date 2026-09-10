import * as React from 'react';
import { Animated, Dimensions } from 'react-native';

import user from 'Managers/UserManager';

import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').View} View
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 */

/**
 * @typedef TabsPropsType
 * @property {StyleProp} style
 * @property {number} throttleTime
 * @property {number} fontSize
 * @property {Array<string>} texts
 * @property {number} value
 * @property {(index: number) => void} onChangeValue
 * @property {React.RefObject<View | null>[]} refs One ref per tab (tutorial targets), optional
 */

/** @type {TabsPropsType} */
const TabsProps = {
    style: {},
    throttleTime: 250,
    fontSize: 14,
    texts: [],
    value: 0,
    onChangeValue: () => {},
    refs: []
};

/** Segmented control with a gradient pill sliding under the active tab (Raid Rank | Amis | Feed) */
class TabsBack extends React.Component {
    state = {
        anim: new Animated.Value(0),
        parentWidth: 0
    };

    last = 0;

    /** @param {TabsPropsType} props */
    constructor(props) {
        super(props);

        // Approximate parent width to avoid glitches on first render
        const { width } = Dimensions.get('window');
        this.state.parentWidth = width - 48;

        if (props.value >= 0 && props.value < props.texts.length) {
            this.state.anim.setValue(props.value);
        }
    }

    /**
     * @param {TabsPropsType} nextProps
     * @param {TabsBack['state']} nextState
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (
            this.props.value !== nextProps.value ||
            this.props.texts !== nextProps.texts ||
            this.props.refs !== nextProps.refs ||
            this.state.parentWidth !== nextState.parentWidth
        );
    }

    /** @param {TabsPropsType} prevProps */
    componentDidUpdate(prevProps) {
        const { value, texts } = this.props;
        if (prevProps.value !== value) {
            if (value < 0 || value >= texts.length) {
                user.interface.console?.AddLog('warn', 'Tabs value is out of bounds');
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
        const now = Date.now();
        if (now - this.last < this.props.throttleTime) {
            return;
        }
        this.last = now;
        this.props.onChangeValue(index);
    };
}

TabsBack.prototype.props = TabsProps;
TabsBack.defaultProps = TabsProps;

export default TabsBack;
