import * as React from 'react';

/**
 * @typedef {import('react-native').View} View
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').Animated.AnimatedProps<ViewStyle>} AnimatedProps
 * @typedef {import('react-native').ButtonProps} ButtonProps
 *
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 *
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 * @typedef {import('Ressources/Icons').IconsName} IconsName
 * @typedef {import('Interface/Primitives').Ripple} Ripple
 *
 * @typedef {Object} ButtonPropsType
 * @property {React.RefObject<View | null>} nativeRef
 * @property {import('react').ReactNode | string | undefined} children
 * @property {StyleProp} style
 * @property {AnimatedProps | null} styleAnimation
 * @property {StyleProp} styleContent
 * @property {StyleProp} styleBackground
 * @property {number} throttleTime Time in ms to throttle the press event
 * @property {'normal' | 'outline' | 'outline-blur' | 'uniform'} appearance
 * @property {ThemeColor | ThemeText} color Background color of the button, only used in 'uniform' appearance
 * @property {number} fontSize
 * @property {ThemeColor | ThemeText | 'automatic' | 'gradient'} fontColor
 * @property {ThemeColor | ThemeText | 'automatic'} borderColor
 * @property {IconsName | null} icon
 * @property {string | null} iconXml
 * @property {number} iconSize
 * @property {number} iconAngle
 * @property {boolean} loading
 * @property {boolean} enabled
 * @property {() => void} onPress
 * @property {() => void} onLongPress
 * @property {'none' | 'auto' | 'box-none' | 'box-only'} pointerEvents
 * @property {(event: GestureResponderEvent) => void} onTouchStart
 * @property {(event: GestureResponderEvent) => void} onTouchMove
 * @property {(event: GestureResponderEvent) => void} onTouchEnd
 * @property {(event: GestureResponderEvent) => void} onTouchCancel
 * @property {(event: LayoutChangeEvent) => void} onLayout
 * @property {number} [rippleDuration]
 */

/** @type {Partial<ButtonProps> & ButtonPropsType} */
const ButtonProps = {
    nativeRef: React.createRef(),
    children: undefined,
    style: {},
    styleAnimation: null,
    styleContent: {},
    styleBackground: {},
    throttleTime: 250,
    appearance: 'normal',
    color: 'main1',
    fontSize: 16,
    fontColor: 'automatic',
    borderColor: 'automatic',
    icon: null,
    iconXml: null,
    iconSize: 24,
    iconAngle: 0,
    loading: false,
    enabled: true,
    pointerEvents: 'auto',

    onPress: () => {},
    onLongPress: () => {},
    onTouchStart: () => {},
    onTouchMove: () => {},
    onTouchEnd: () => {},
    onTouchCancel: () => {},
    onLayout: () => {}
};

class ButtonBack extends React.Component {
    /** @type {React.RefObject<Ripple | null>} */
    rippleRef = React.createRef();

    time = 0;
    last = 0;
    posX = 0;
    posY = 0;
    size = 0;
    validAction = false;

    /** @param {ButtonProps & ButtonPropsType} nextProps */
    shouldComponentUpdate(nextProps) {
        return (
            this.props.children !== nextProps.children ||
            this.props.style !== nextProps.style ||
            this.props.styleAnimation !== nextProps.styleAnimation ||
            this.props.styleContent !== nextProps.styleContent ||
            this.props.appearance !== nextProps.appearance ||
            this.props.color !== nextProps.color ||
            this.props.fontSize !== nextProps.fontSize ||
            this.props.icon !== nextProps.icon ||
            this.props.iconXml !== nextProps.iconXml ||
            this.props.iconSize !== nextProps.iconSize ||
            this.props.iconAngle !== nextProps.iconAngle ||
            this.props.loading !== nextProps.loading ||
            this.props.enabled !== nextProps.enabled
        );
    }

    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        this.props.onTouchStart(event);
        const { pageX, pageY, locationX, locationY } = event.nativeEvent;
        if (this.props.enabled) {
            this.rippleRef.current?.Press(locationX, locationY, this.size);
        }
        this.posX = pageX;
        this.posY = pageY;
        this.time = new Date().getTime();
        this.validAction = true;
    };

    /** @param {GestureResponderEvent} event */
    onTouchMove = (event) => {
        const { pageX, pageY } = event.nativeEvent;
        const deltaX = Math.abs(pageX - this.posX);
        const deltaY = Math.abs(pageY - this.posY);
        if (deltaX > 10 || deltaY > 10) {
            this.validAction = false;
        }

        this.props.onTouchMove(event);
    };

    /** @param {GestureResponderEvent} event */
    onTouchCancel = (event) => {
        this.props.onTouchCancel(event);
        if (this.props.enabled) {
            this.rippleRef.current?.Release();
        }
    };

    /** @param {GestureResponderEvent} event */
    onTouchEnd = (event) => {
        this.props.onTouchEnd(event);
        if (this.props.enabled) {
            this.rippleRef.current?.Release();
        }

        // Prevent multiple press events
        const now = Date.now();
        if (now - this.last < this.props.throttleTime) {
            return;
        }

        // Prevent press event if the user moved the finger
        if (!this.validAction) {
            return;
        }

        const deltaX = Math.abs(event.nativeEvent.pageX - this.posX);
        const deltaY = Math.abs(event.nativeEvent.pageY - this.posY);
        const deltaT = now - this.time;
        const isPress = deltaX < 20 && deltaY < 20;

        const { enabled, loading, onPress, onLongPress } = this.props;
        if (isPress && !loading && enabled) {
            this.last = now;
            if (deltaT < 500) {
                onPress();
            } else if (deltaT < 3000) {
                onLongPress();
            }
        }
    };

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        this.size = Math.max(width, height);
        this.props.onLayout(event);
    };
}

ButtonBack.prototype.props = ButtonProps;
ButtonBack.defaultProps = ButtonProps;

export default ButtonBack;
