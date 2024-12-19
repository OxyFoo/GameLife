import * as React from 'react';
import { Animated } from 'react-native';

import { TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react').ReactNode} ReactNode
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 *
 * @typedef {import('Ressources/Icons').IconsName} IconsName
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 */

const ContainerProps = {
    /** @type {ReactNode} */
    children: null,

    /** @type {StyleProp} */
    style: {},

    /** @type {StyleProp} */
    styleHeader: {},

    /** @type {StyleProp} */
    styleContainer: {},

    /** @type {string} */
    text: 'Title',

    /** @type {ThemeText} */
    textcolor: 'primary',

    /** @type {ThemeColor} */
    backgroundColor: 'backgroundTransparent',

    /** @type {IconsName | null} Show the icon on the right side of the text, for static container */
    icon: null,

    /** @type {number} Size of the icon in pixels */
    iconSize: 24,

    /** @type {number} Angle of the icon in degrees */
    iconAngle: 0,

    /** @type {'static' | 'rollable'} */
    type: 'static',

    /** @type {boolean} */
    opened: true,

    /** @type {(opened: boolean) => void} */
    onChangeState: () => {},

    /** @type {(event: GestureResponderEvent) => void} For static container with an icon, event of icon press */
    onIconPress: () => {},

    /** @type {(event: LayoutChangeEvent) => void} event */
    onLayout: () => {}
};

class ContainerBack extends React.Component {
    state = {
        maxHeight: 0,
        opened: false,

        animAngleIcon: new Animated.Value(0),
        animHeightContent: new Animated.Value(0),
        animBorderRadius: new Animated.Value(8)
    };

    componentDidMount() {
        if (this.props.opened !== this.state.opened) {
            TimingAnimation(this.state.animAngleIcon, 0, 0, false).start();
            TimingAnimation(this.state.animHeightContent, 0, 0, false).start();
            TimingAnimation(this.state.animBorderRadius, 8, 0, false).start();
            this.onChangeState();
        }
    }

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        if (height > this.state.maxHeight && this.props.type === 'rollable') {
            this.setState({ maxHeight: height });
        }
    };

    onChangeState = () => {
        const newState = !this.state.opened;
        this.setState({ opened: newState });
        this.props.onChangeState(newState);

        TimingAnimation(this.state.animAngleIcon, newState ? 1 : 0, 400, false).start();
        TimingAnimation(this.state.animHeightContent, newState ? 1 : 0, 300, false).start();
        TimingAnimation(this.state.animBorderRadius, newState ? 0 : 8, newState ? 50 : 800, false).start();
    };
}

ContainerBack.prototype.props = ContainerProps;
ContainerBack.defaultProps = ContainerProps;

export default ContainerBack;
