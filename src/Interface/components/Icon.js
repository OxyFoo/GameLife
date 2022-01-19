import * as React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';

import themeManager from '../../Managers/ThemeManager';

import Base64 from '../../Functions/Base64';
import { IsUndefined } from '../../Functions/Functions';

import svgDefault from '../../../res/icons/default';
import svgAdd from '../../../res/icons/add';
import svgArrowLeft from '../../../res/icons/arrow-left';
import svgCalendar from '../../../res/icons/calendar';
import svgCheckboxOn from '../../../res/icons/checkbox-on';
import svgCheckboxOff from '../../../res/icons/checkbox-off';
import svgChevron from '../../../res/icons/chevron';
import svgChrono from '../../../res/icons/chrono';
import svgCross from '../../../res/icons/cross';
import svgDiscord from '../../../res/icons/discord';
import svgEdit from '../../../res/icons/edit';
import svgHome from '../../../res/icons/home';
import svgInfo from '../../../res/icons/info';
import svgInstagram from '../../../res/icons/instagram';
import svgItem from '../../../res/icons/item';
import svgOx from '../../../res/icons/ox';
import svgSetting from '../../../res/icons/setting';
import svgShop from '../../../res/icons/shop';
import svgSocial from '../../../res/icons/social';
import svgSuccess from '../../../res/icons/success';
import svgTiktok from '../../../res/icons/tiktok';

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
     * @type {'default'|'add'|'arrowLeft'|'calendar'|'checkboxOn'|'checkboxOff'|'chevron'|'chrono'|'cross'|'discord'|'edit'|'home'|'info'|'instagram'|'item'|'ox'|'setting'|'shop'|'social'|'success'|'tiktok'|'loading'|'loadingDots'}
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
    discord: svgDiscord,
    edit: svgEdit,
    home: svgHome,
    info: svgInfo,
    instagram: svgInstagram,
    item: svgItem,
    ox: svgOx,
    setting: svgSetting,
    shop: svgShop,
    social: svgSocial,
    success: svgSuccess,
    tiktok: svgTiktok,
    loading: svgLoading,
    loadingDots: svgLoadingDots
}

class Icon extends React.Component {
    render() {
        let output;
        const { style, icon, xml, size, angle, onPress, show } = this.props;
        const containerStyle = { width: size, height: size };
        const color = themeManager.GetColor(this.props.color);

        if (show && !IsUndefined(xml)) {
            if (typeof(xml) !== 'string' || xml.length < 10) {
                return <Icon icon='default' width={size} height={size} color={color} />
            }
            const XML = Base64.Decode(xml).split('#FFFFFF').join(color);
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

        if (!IsUndefined(onPress)) {
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