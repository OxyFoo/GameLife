import * as React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';

import Base64 from '../../Functions/Base64';
import themeManager from '../../Managers/ThemeManager';
import { isUndefined } from '../../Functions/Functions';

import svgDefault from '../../../res/icons/default';
import svgAdd from '../../../res/icons/add';
import svgArrowLeft from '../../../res/icons/arrow-left';
import svgCalendar from '../../../res/icons/calendar';
import svgCheckboxOn from '../../../res/icons/checkbox-on';
import svgCheckboxOff from '../../../res/icons/checkbox-off';
import svgChevron from '../../../res/icons/chevron';
import svgChrono from '../../../res/icons/chrono';
import svgCross from '../../../res/icons/cross';
import svgHome from '../../../res/icons/home';
import svgInfo from '../../../res/icons/info';
import svgItem from '../../../res/icons/item';
import svgShop from '../../../res/icons/shop';
import svgSocial from '../../../res/icons/social';
import svgSuccess from '../../../res/icons/success';
import svgLoading from '../../../res/icons/loading';
import svgLoadingDots from '../../../res/icons/loading-dots';

const IconProps = {
    style: {},
    containerStyle: {},
    /**
     * @description Display an icon from XML base64 encoded ('icon' sikp if define)
     * @type {String}
     */
    xml: undefined,
    /**
     * @type {'default'|'add'|'arrowLeft'|'calendar'|'checkboxOn'|'checkboxOff'|'chevron'|'chrono'|'cross'|'home'|'info'|'item'|'shop'|'social'|'success'|'loading'|'loadingDots'}
     */
    icon: '',
    size: 24,
    angle: 0,
    color: 'white',
    onPress: undefined,
    show: true
}

const SVGIcons = {
    default: svgDefault,
    add: svgAdd,
    arrowLeft: svgArrowLeft,
    calendar: svgCalendar,
    checkboxOn: svgCheckboxOn,
    checkboxOff: svgCheckboxOff,
    chevron: svgChevron,
    chrono: svgChrono,
    cross: svgCross,
    home: svgHome,
    info: svgInfo,
    item: svgItem,
    shop: svgShop,
    social: svgSocial,
    success: svgSuccess,
    loading: svgLoading,
    loadingDots: svgLoadingDots
}

class Icon extends React.Component {
    render() {
        let output;
        const { style, icon, xml, size, angle, onPress, show } = this.props;
        const containerStyle = { width: size, height: size };
        const color = themeManager.getColor(this.props.color);

        if (show && !isUndefined(xml)) {
            if (typeof(xml) !== 'string' || xml.length < 10) {
                return <Icon icon='default' width={size} height={size} color={color} />
            }
            const XML = Base64.decode(xml).split('#FFFFFF').join(color);
            output = <View style={[containerStyle, style]}>
                        <SvgXml xml={XML} width={size} height={size} />
                    </View>;
        } else if (show && icon !== '' && SVGIcons.hasOwnProperty(icon)) {
            const _Icon = SVGIcons[icon];
            output = <View style={[containerStyle, style]}>
                        <_Icon width={size} height={size} color={color} rotation={angle} />
                    </View>;
        } else {
            output = <View style={[containerStyle, style]} />;
        }

        if (!isUndefined(onPress)) {
            output = <TouchableOpacity
                        style={[containerStyle, this.props.containerStyle]}
                        onPress={this.props.onPress}
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