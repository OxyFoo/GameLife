import * as React from 'react';
import { Button } from 'react-native';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').Animated.AnimatedProps<ViewStyle>} AnimatedProps
 * @typedef {import('react-native').ButtonProps} ButtonProps
 * 
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 * 
 * @typedef {import('Ressources/Icons').IconsName} IconsName
 * @typedef {import('../../Primitives/Ripple').Ripple} Ripple
 * 
 * @typedef {Object} ButtonPropsType
 * @property {import('react').ReactNode | string | undefined} children
 * @property {StyleProp} style
 * @property {AnimatedProps | null} styleAnimation
 * @property {StyleProp} styleContent
 * @property {'normal' | 'outline' | 'outline-blur' | 'transparent'} appearance
 * @property {number} fontSize
 * @property {IconsName | null} icon
 * @property {string | null} iconXml
 * @property {number} iconSize
 * @property {number} iconAngle
 * @property {boolean} loading
 * @property {boolean} enabled
 * @property {() => void} onPress
 * @property {() => void} onLongPress
 * @property {(event: GestureResponderEvent) => void} onTouchStart
 * @property {(event: GestureResponderEvent) => void} onTouchMove
 * @property {(event: GestureResponderEvent) => void} onTouchEnd
 * @property {(event: GestureResponderEvent) => void} onTouchCancel
 * @property {(event: LayoutChangeEvent) => void} onLayout
 */

/** @type {ButtonProps & ButtonPropsType} */
const ButtonProps = {
    ...Button.prototype.props,

    children: undefined,
    style: {},
    styleAnimation: null,
    styleContent: {},
    appearance: 'normal',
    fontSize: 16,
    icon: null,
    iconXml: null,
    iconSize: 24,
    iconAngle: 0,
    loading: false,
    enabled: true,

    onPress: () => {},
    onLongPress: () => {},
    onTouchStart: (event) => {},
    onTouchMove: (event) => {},
    onTouchEnd: (event) => {},
    onTouchCancel: (event) => {},
    onLayout: (event) => {}
};

class ButtonBack extends React.Component {
    /** @type {React.RefObject<Ripple>} */
    rippleRef = React.createRef();

    time = 0;
    posX = 0;
    posY = 0;
    size = 0;

    /** @param {ButtonProps & ButtonPropsType} nextProps */
    shouldComponentUpdate(nextProps) {
        return this.props.children !== nextProps.children ||
            this.props.style !== nextProps.style ||
            this.props.styleAnimation !== nextProps.styleAnimation ||
            this.props.styleContent !== nextProps.styleContent ||
            this.props.appearance !== nextProps.appearance ||
            this.props.fontSize !== nextProps.fontSize ||
            this.props.icon !== nextProps.icon ||
            this.props.iconXml !== nextProps.iconXml ||
            this.props.iconSize !== nextProps.iconSize ||
            this.props.iconAngle !== nextProps.iconAngle ||
            this.props.loading !== nextProps.loading ||
            this.props.enabled !== nextProps.enabled;
    }

    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        this.props.onTouchStart(event);
        if (this.props.enabled) {
            this.rippleRef.current?.Press(event, this.size);
        }
        this.posX = event.nativeEvent.pageX;
        this.posY = event.nativeEvent.pageY;
        this.time = new Date().getTime();
    }

    /** @param {GestureResponderEvent} event */
    onTouchMove = (event) => {
        this.props.onTouchMove(event);
    }

    /** @param {GestureResponderEvent} event */
    onTouchCancel = (event) => {
        this.props.onTouchCancel(event);
        if (this.props.enabled) {
            this.rippleRef.current?.Release(event);
        }
    }

    /** @param {GestureResponderEvent} event */
    onTouchEnd = (event) => {
        this.props.onTouchEnd(event);
        if (this.props.enabled) {
            this.rippleRef.current?.Release(event);
        }

        const deltaX = Math.abs(event.nativeEvent.pageX - this.posX);
        const deltaY = Math.abs(event.nativeEvent.pageY - this.posY);
        const deltaT = new Date().getTime() - this.time;
        const isPress = deltaX < 20 && deltaY < 20;

        const { enabled, loading, onPress, onLongPress } = this.props;
        if (isPress && !loading && enabled) {
            if (deltaT < 500) onPress();
            else onLongPress();
        }
    }

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        this.size = Math.max(width, height);
        this.props.onLayout(event);
    }
}

ButtonBack.prototype.props = ButtonProps;
ButtonBack.defaultProps = ButtonProps;

export default ButtonBack;
