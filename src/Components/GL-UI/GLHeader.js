import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { GLText, GLIconButton } from '../GL-Components';


function GLHeader(props) {
    const LeftIcon_Press = () => { if (props.leftIcon && props.onPressLeft) props.onPressLeft(); };
    const LeftIcon_LongPress = () => { if (props.leftIcon && props.onLongPressLeft) props.onLongPressLeft(); };
    const RightIcon_Press = () => { if (props.rightIcon && props.onPressRight) props.onPressRight(); };
    const RightIcon_LongPress = () => { if (props.rightIcon && props.onLongPressRight) props.onLongPressRight(); };

    const title = props.title;
    const style = [ Style.header, props.style ];
    const leftIcon = props.leftIcon || '';
    const rightIcon = props.rightIcon || '';

    return (
        <>
            <GLText title={title} style={style} />
            <GLIconButton style={Style.leftIcon} icon={leftIcon} onPress={LeftIcon_Press} onLongPress={LeftIcon_LongPress} />
            <GLIconButton style={Style.rightIcon} icon={rightIcon} onPress={RightIcon_Press} onLongPress={RightIcon_LongPress} />
            <View style={Style.separator} />
        </>
    )
}

const Style = StyleSheet.create({
    header: {
        width: '100%',
        color: '#5AB4F0',
        padding: 14,
        fontSize: 38,
        backgroundColor: '#000022'
    },
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: '#FFFFFF'
    },
    leftIcon: {
        position: 'absolute',
        left: 16,
        height: 64,
        justifyContent: 'center'
    },
    rightIcon: {
        position: 'absolute',
        right: 16,
        height: 64,
        justifyContent: 'center'
    }
});

export default GLHeader;