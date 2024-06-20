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
 */

const IconProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {StyleProp} */
    containerStyle: {},

    /** @type {string | null} Display an icon from XML base64 encoded ('icon' skip if define) */
    xml: null,

    /** @type {IconsName | null} */
    icon: null,

    /** @type {number} Size of icon in pixels */
    size: 24,

    /** @type {number} Rotation angle in degrees */
    angle: 0,

    /** @type {ThemeColor | ThemeText | 'gradient'} */
    color: 'white',

    /** @type {((event: GestureResponderEvent) => void) | null} */
    onPress: null,

    /** @type {boolean} */
    show: true
};

class IconBack extends React.Component {
    /** @param {IconProps} nextProps */
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
}

IconBack.prototype.props = IconProps;
IconBack.defaultProps = IconProps;

export default IconBack;
