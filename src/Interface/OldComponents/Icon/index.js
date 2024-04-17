import * as React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';

import IconBack from './back';
import SVGIcons from './icons';
import themeManager from 'Managers/ThemeManager';

import Base64 from 'Utils/Base64';

/**
 * @typedef {import('./back').Icons} Icons
 */

class Icon extends IconBack {
    render() {
        const { style, containerStyle, icon, xml, size, angle, onPress, show } = this.props;

        let output = null;
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
                output = (
                    <View style={[containerSize, style]}>
                        <SvgXml xml={XML} width={size} height={size} />
                    </View>
                );
            }
        }

        // Icon
        else if (show && icon !== null && SVGIcons.hasOwnProperty(icon)) {
            const _Icon = SVGIcons[icon];
            output = (
                <View style={[containerSize, style]}>
                    <_Icon
                        width={size}
                        height={size}
                        color={color}
                        transform={[{ rotate: angle * Math.PI / 180 }]}
                    />
                </View>
            );
        }

        // Empty icon
        else {
            output = <View style={[containerSize, style]} />;
        }

        if (onPress !== null) {
            output = (
                <TouchableOpacity
                    testID='icon'
                    style={[containerSize, containerStyle]}
                    onPress={onPress}
                    activeOpacity={.5}
                >
                    {output}
                </TouchableOpacity>
            );
        }

        return output;
    }
}

export default Icon;
