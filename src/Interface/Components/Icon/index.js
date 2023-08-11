import * as React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';

import SVGIcons from './icons';
import themeManager from 'Managers/ThemeManager';

import Base64 from 'Utils/Base64';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 * 
 * @typedef {import('Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('Managers/ThemeManager').ColorThemeText} ColorThemeText
 * @typedef {'default'|'add'|'alarmClock'|'arrowLeft'|'calendar'|'check'|'checkboxOn'|'checkboxOff'|'chevron'|'chrono'|'cross'|'discord'|'edit'|'error'|'filter'|'flagEnglish'|'flagFrench'|'home'|'human'|'info'|'instagram'|'item'|'moveVertical'|'nowifi'|'onboarding1'|'onboarding2'|'onboarding3'|'ox'|'setting'|'shop'|'sleepZzz'|'social'|'success'|'tiktok'|'userAdd'|'world'|'loading'|'loadingDots'} Icons
 *
 * @callback GestureEvent
 * @param {GestureResponderEvent} event
 */

const IconProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {StyleProp} */
    containerStyle: {},

    /** @type {string|null} Display an icon from XML base64 encoded ('icon' skip if define) */
    xml: null,

    /** @type {Icons|null} */
    icon: null,

    /** @type {number} Size of icon in pixels */
    size: 24,

    /** @type {number} Rotation angle in degrees */
    angle: 0,

    /** @type {ColorTheme|ColorThemeText} */
    color: 'white',

    /** @type {(event: GestureResponderEvent) => void|null} */
    onPress: null,

    /** @type {boolean} */
    show: true
}

class Icon extends React.Component {
    render() {
        let output;
        const { style, containerStyle, icon, xml, size, angle, onPress, show } = this.props;
        const containerSize = { width: size, height: size };
        const color = themeManager.GetColor(this.props.color);

        // Icon
        if (show && xml !== null) {
            // Default icon (invalid xml)
            if (typeof(xml) !== 'string' || xml.length < 10) {
                output = <Icon icon='default' size={size} color={this.props.color} />;
            }

            // XML icon
            else {
                const XML = Base64.Decode(xml)
                    .split('#ffffff').join(color)
                    .split('#FFFFFF').join(color);
                output = <View style={[containerSize, style]}>
                            <SvgXml xml={XML} width={size} height={size} />
                        </View>;
            }
        }

        // Icon
        else if (show && icon !== null && SVGIcons.hasOwnProperty(icon)) {
            const _Icon = SVGIcons[icon];
            output = <View style={[containerSize, style]}>
                        <_Icon
                            width={size}
                            height={size}
                            color={color}
                            transform={[{ rotate: angle * Math.PI / 180 }]}
                        />
                    </View>;
        }

        // Empty icon
        else {
            output = <View style={[containerSize, style]} />;
        }

        if (onPress !== null) {
            output = <TouchableOpacity
                        testID='icon'
                        style={[containerSize, containerStyle]}
                        onPress={onPress}
                        activeOpacity={.5}
                    >
                        {output}
                    </TouchableOpacity>;
        }

        return output;
    }
}

Icon.prototype.props = IconProps;
Icon.defaultProps = IconProps;

export default Icon;