import * as React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { StyleProp, ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';

import themeManager from '../../Managers/ThemeManager';

import Base64 from '../../Utils/Base64';
import { IsUndefined } from '../../Utils/Functions';

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
import svgFilter from '../../../res/icons/filter';
import svgFlagEnglish from '../../../res/icons/flag-english';
import svgFlagFrench from '../../../res/icons/flag-french';
import svgHome from '../../../res/icons/home';
import svgInfo from '../../../res/icons/info';
import svgInstagram from '../../../res/icons/instagram';
import svgItem from '../../../res/icons/item';
import svgNowifi from '../../../res/icons/nowifi';
import svgOnboarding1 from '../../../res/icons/onboarding1';
import svgOnboarding2 from '../../../res/icons/onboarding2';
import svgOnboarding3 from '../../../res/icons/onboarding3';
import svgOx from '../../../res/icons/ox';
import svgSetting from '../../../res/icons/setting';
import svgShop from '../../../res/icons/shop';
import svgSocial from '../../../res/icons/social';
import svgSuccess from '../../../res/icons/success';
import svgTiktok from '../../../res/icons/tiktok';
import svgUserAdd from '../../../res/icons/user-add';
import svgWorld from '../../../res/icons/world';

import svgLoading from '../../../res/icons/loading';
import svgLoadingDots from '../../../res/icons/loading-dots';

/**
 * @typedef {import('../../Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {'default'|'add'|'arrowLeft'|'calendar'|'checkboxOn'|'checkboxOff'|'chevron'|'chrono'|'cross'|'discord'|'edit'|'filter'|'flagEnglish'|'flagFrench'|'home'|'info'|'instagram'|'item'|'nowifi'|'onboarding1'|'onboarding2'|'onboarding3'|'ox'|'setting'|'shop'|'social'|'success'|'tiktok'|'userAdd'|'world'|'loading'|'loadingDots'} Icons
 */

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
    filter: svgFilter,
    flagEnglish: svgFlagEnglish,
    flagFrench: svgFlagFrench,
    home: svgHome,
    info: svgInfo,
    instagram: svgInstagram,
    item: svgItem,
    nowifi: svgNowifi,
    onboarding1: svgOnboarding1,
    onboarding2: svgOnboarding2,
    onboarding3: svgOnboarding3,
    ox: svgOx,
    setting: svgSetting,
    shop: svgShop,
    social: svgSocial,
    success: svgSuccess,
    tiktok: svgTiktok,
    userAdd: svgUserAdd,
    world: svgWorld,

    loading: svgLoading,
    loadingDots: svgLoadingDots
}

const IconProps = {
    /** @type {StyleProp<ViewStyle>} */
    style: {},

    /** @type {StyleProp<ViewStyle>} */
    containerStyle: {},

    /** @type {String} Display an icon from XML base64 encoded ('icon' skip if define) */
    xml: undefined,

    /** @type {Icons} */
    icon: '',

    /** @type {Number} Size of icon in pixels */
    size: 24,

    /** @type {Number} Rotation angle in degrees */
    angle: 0,

    /** @type {ColorTheme} */
    color: 'white',

    /** @type {Function?} */
    onPress: undefined,

    /** @type {Boolean} */
    show: true
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