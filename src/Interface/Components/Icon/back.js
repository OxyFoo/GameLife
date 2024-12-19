import * as React from 'react';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 *
 * @typedef {import('Ressources/Icons').IconsName} IconsName
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 *
 * @callback GestureEvent
 * @param {GestureResponderEvent} event
 *
 * @typedef {Object} IconPropsType
 * @property {StyleProp} style
 * @property {StyleProp} containerStyle
 * @property {number} throttleTime
 * @property {string | null} xml Display an icon from XML base64 encoded ('icon' skip if define)
 * @property {IconsName | null} icon
 * @property {number} size Size of icon in pixels
 * @property {number} angle Rotation angle in degrees
 * @property {ThemeColor | ThemeText | 'gradient'} color
 * @property {GestureEvent | null} onPress
 * @property {boolean} show
 */

/** @type {IconPropsType} */
const IconProps = {
    style: {},
    containerStyle: {},
    throttleTime: 250,
    xml: null,
    icon: null,
    size: 24,
    angle: 0,
    color: 'white',
    onPress: null,
    show: true
};

class IconBack extends React.Component {
    last = 0;

    /** @param {IconPropsType} nextProps */
    shouldComponentUpdate(nextProps) {
        return (
            this.props.show !== nextProps.show ||
            this.props.xml !== nextProps.xml ||
            this.props.icon !== nextProps.icon ||
            this.props.size !== nextProps.size ||
            this.props.angle !== nextProps.angle ||
            this.props.color !== nextProps.color
        );
    }

    /** @param {GestureResponderEvent} event */
    onPress = (event) => {
        const now = Date.now();
        if (now - this.last < this.props.throttleTime) {
            return;
        }

        this.last = now;
        if (this.props.onPress !== null) {
            this.props.onPress(event);
        }
    };
}

IconBack.prototype.props = IconProps;
IconBack.defaultProps = IconProps;

export default IconBack;
