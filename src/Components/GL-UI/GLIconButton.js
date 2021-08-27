import * as React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

const iconsDir = '../../../ressources/icons/';

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
    cross: require(iconsDir + 'cross.png'),
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

function GLIconButton(props) {
    const pad = props.small ? 0 : 4;
    const style = [props.style, { padding: pad }];
    const size = props.size || 24;
    const source = Icons[props.icon];
    const onPress = props.onPress;
    const hide = props.hide || false;

    return (
        <TouchableOpacity style={style} onPress={onPress} onLongPress={props.onLongPress} activeOpacity={.5} disabled={typeof(onPress) === 'undefined'}>
            {!hide ? (
                <Image style={{ width: size, height: size, resizeMode: 'contain' }} source={source} />
            ) : (
                <View style={{ width: size, height: size }} />
            )}
        </TouchableOpacity>
    )
}

export default GLIconButton;