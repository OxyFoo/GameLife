import * as React from 'react';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').Animated.AnimatedProps<ViewStyle>} AnimatedProps
 * 
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 * 
 * @typedef {import('../Icon').Icons} Icons
 * @typedef {import('Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('Managers/ThemeManager').ColorThemeText} ColorThemeText
 */

const ButtonProps = {
    /** @type {string|JSX.Element|JSX.Element[]|undefined} */
    children: undefined,

    /** @type {StyleProp|Object} */
    style: {},

    /** @type {AnimatedProps|null} */
    styleAnimation: null,

    /** @type {string} */
    testID: 'button',

    /** @type {number} */
    fontSize: 16,

    /** @type {Icons|null} */
    icon: null,

    /** @type {string?} */
    iconXml: undefined,

    /** @type {number} */
    iconSize: 24,

    /** @type {ColorTheme|ColorThemeText} */
    iconColor: 'white',

    /** @type {number} Angle in degrees */
    iconAngle: 0,

    /** @type {boolean} If true, content will be replaced by loading icon & press event disabled */
    loading: false,

    /** @type {ColorTheme|ColorThemeText} */
    color: 'transparent',

    /** @type {ColorTheme|ColorThemeText} */
    colorText: 'primary',

    /** @type {ColorTheme|ColorThemeText} */
    rippleColor: 'black',

    /** @type {number} */
    borderRadius: 12,

    /** @type {boolean} If false, background is gray & press event disabled */
    enabled: true,

    /** @type {Function} */
    onPress: () => {},

    /** @type {Function} */
    onLongPress: () => {},

    /** @type {Function} */
    onLayout: (event) => {},

    /** @type {'auto'|'box-only'|'box-none'|'none'} */
    pointerEvents: 'box-only'
}

class ButtonBack extends React.Component {
    constructor(props) {
        super(props);
        this.rippleRef = React.createRef();
        this.posX = 0; this.posY = 0; this.time = 0;
        this.state = { width: 0 };
    }

    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        if (this.props.enabled) {
            this.rippleRef.current.onTouchStart(event);
        }
        this.posX = event.nativeEvent.pageX;
        this.posY = event.nativeEvent.pageY;
        this.time = new Date().getTime();
    }

    /** @param {GestureResponderEvent} event */
    onTouchCancel = (event) => {
        if (this.props.enabled) {
            this.rippleRef.current.onTouchEnd(event);
        }
    }

    /** @param {GestureResponderEvent} event */
    onTouchEnd = (event) => {
        if (this.props.enabled) {
            this.rippleRef.current.onTouchEnd(event);
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
        this.props.onLayout(event);
        this.setState({ width: event.nativeEvent.layout.width });
    }
}

ButtonBack.prototype.props = ButtonProps;
ButtonBack.defaultProps = ButtonProps;

export default ButtonBack;