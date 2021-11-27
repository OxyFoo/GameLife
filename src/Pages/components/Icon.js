import * as React from 'react';
import { View, TouchableOpacity } from 'react-native';

import themeManager from '../../Managers/ThemeManager';
import { isUndefined } from '../../Functions/Functions';

import svgAdd from '../../../res/icons/add';
import svgArrowLeft from '../../../res/icons/arrow-left';
import svgCalendar from '../../../res/icons/calendar';
import svgCheckboxOn from '../../../res/icons/checkbox-on';
import svgCheckboxOff from '../../../res/icons/checkbox-off';
import svgChevron from '../../../res/icons/chevron';
import svgHome from '../../../res/icons/home';
import svgShop from '../../../res/icons/shop';
import svgSocial from '../../../res/icons/social';
import svgLoading from '../../../res/icons/loading';
import svgLoadingDots from '../../../res/icons/loading-dots';

const IconProps = {
    style: {},
    /**
     * @type {'add'|'arrowLeft'|'calendar'|'checkboxOn'|'checkboxOff'|'chevron'|'home'|'shop'|'social'|'loading'|'loadingDots'}
     */
    icon: '',
    size: 24,
    angle: 0,
    color: 'white',
    onPress: undefined,
    show: true
}

const SVGIcons = {
    add: svgAdd,
    arrowLeft: svgArrowLeft,
    calendar: svgCalendar,
    checkboxOn: svgCheckboxOn,
    checkboxOff: svgCheckboxOff,
    chevron: svgChevron,
    home: svgHome,
    shop: svgShop,
    social: svgSocial,
    loading: svgLoading,
    loadingDots: svgLoadingDots
}

class Icon extends React.Component {
    render() {
        let output;
        const { style, icon, size, angle, onPress, show } = this.props;
        const containerStyle = { width: size, height: size };
        const color = themeManager.getColor(this.props.color);

        if (show && icon !== '' && SVGIcons.hasOwnProperty(icon)) {
            const Icon = SVGIcons[icon];
            output = <Icon width={size} height={size} color={color} rotation={angle} />;
        } else {
            output = <View style={[containerStyle, style]} />;
        }

        if (!isUndefined(onPress)) {
            output = <TouchableOpacity style={[containerStyle, style]} onPress={this.props.onPress}>
                        {output}
                    </TouchableOpacity>;
        }

        return output;
    }
}

Icon.prototype.props = IconProps;
Icon.defaultProps = IconProps;

export default Icon;