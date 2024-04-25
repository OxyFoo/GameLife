import * as React from 'react';
import SVGIcons from 'Ressources/Icons';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 * 
 * @typedef {keyof SVGIcons} Icons
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

    /** @type {Icons | null} */
    icon: null,

    /** @type {number} Size of icon in pixels */
    size: 24,

    /** @type {number} Rotation angle in degrees */
    angle: 0,

    /** @type {ThemeColor | ThemeText} */
    color: 'white',

    /** @type {((event: GestureResponderEvent) => void) | null} */
    onPress: null,

    /** @type {boolean} */
    show: true
};

class IconBack extends React.Component {
}

IconBack.prototype.props = IconProps;
IconBack.defaultProps = IconProps;

export default IconBack;
