import * as React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import GLSvg from './GLSvg';
import { isUndefined } from '../../Functions/Functions';

import svgAdd from '../../../res/icons/add';
import svgCalendar from '../../../res/icons/calendar';
import svgHome from '../../../res/icons/home';
import svgShop from '../../../res/icons/shop';
import svgSocial from '../../../res/icons/social';

const iconsDir = '../../../res/icons/';

const Icons = {
    accept: require(iconsDir + 'accept.png'),
    back: require(iconsDir + 'back.png'),
    check: require(iconsDir + 'check.png'),
    checked_blue: require(iconsDir + 'checked_blue.png'),
    checked_green: require(iconsDir + 'checked_green.png'),
    checked_red: require(iconsDir + 'checked_red.png'),
    checked_yellow: require(iconsDir + 'checked_yellow.png'),
    checked: require(iconsDir + 'checked.png'),
    chevron: require(iconsDir + 'chevron.png'),
    chevronLeft: require(iconsDir + 'chevron-left.png'),
    chevronTop: require(iconsDir + 'chevron-top.png'),
    chevronBottom: require(iconsDir + 'chevron-bottom.png'),
    chrono: require(iconsDir + 'chrono.png'),
    cross: require(iconsDir + 'cross.png'),
    discord: require(iconsDir + 'discord.png'),
    gamelife: require(iconsDir + 'gamelife.png'),
    gear: require(iconsDir + 'gear.png'),
    info: require(iconsDir + 'info.png'),
    instagram: require(iconsDir + 'instagram.png'),
    pencil: require(iconsDir + 'pencil.png'),
    plus: require(iconsDir + 'plus.png'),
    reject: require(iconsDir + 'reject.png'),
    reset: require(iconsDir + 'reset.png'),
    sandwich: require(iconsDir + 'sandwich.png'),
    save: require(iconsDir + 'save.png'),
    signout: require(iconsDir + 'signout.png'),
    tiktok: require(iconsDir + 'tiktok.png'),
    trash: require(iconsDir + 'trash.png'),
    trophy: require(iconsDir + 'trophy.png'),
    unchecked: require(iconsDir + 'unchecked.png')
}

const SVGIcons = {
    add: svgAdd,
    calendar: svgCalendar,
    home: svgHome,
    shop: svgShop,
    social: svgSocial
}


function GLIconButton(props) {
    const pad = props.small ? 0 : 4;
    const style = [props.style, { padding: pad }];
    const size = props.size || 24;
    const onPress = props.onPress;
    const hide = props.hide || false;

    let image;
    if (!hide && !isUndefined(props.icon) && Icons.hasOwnProperty(props.icon)) {
        image = <Image style={{ width: size, height: size, resizeMode: 'contain' }} source={Icons[props.icon]} />;
    } else if (!hide && !isUndefined(props.svg) && SVGIcons.hasOwnProperty(props.svg)) {
        const Icon = SVGIcons[props.svg];
        image = <Icon color={props.color} />;
    }
    if (isUndefined(image)) {
        image = <View style={{ width: size, height: size }} />;
    }

    return (
        <TouchableOpacity style={style} onPress={onPress} onLongPress={props.onLongPress} activeOpacity={.5} disabled={typeof(onPress) === 'undefined'}>
            {image}
        </TouchableOpacity>
    )
}

export default GLIconButton;