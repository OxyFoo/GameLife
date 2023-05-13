import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import user from '../../../../Managers/UserManager';
import GLText from './GLText';
import GLIconButton from './GLIconButton';

function GLHeader(props) {
    const LeftIcon_Press = () => { if (props.leftIcon && props.onPressLeft) props.onPressLeft(); };
    const LeftIcon_LongPress = () => { if (props.leftIcon && props.onLongPressLeft) props.onLongPressLeft(); };
    const RightIcon_Press = () => { if (props.rightIcon && props.onPressRight) props.onPressRight(); };
    const RightIcon_LongPress = () => { if (props.rightIcon && props.onLongPressRight) props.onLongPressRight(); };

    const title = props.title.toUpperCase();
    const style = [
        styles.header,
        props.style, props.small && styles.headerSmall,
        { backgroundColor: user.themeManager.colors['globalBackcomponent'] }
    ];
    const leftIcon = props.leftIcon || '';
    const rightIcon = props.rightIcon || '';

    return (
        <>
            <GLText title={title} style={style} />
            <GLIconButton style={styles.leftIcon} icon={leftIcon} onPress={LeftIcon_Press} onLongPress={LeftIcon_LongPress} />
            <GLIconButton style={styles.rightIcon} icon={rightIcon} onPress={RightIcon_Press} onLongPress={RightIcon_LongPress} />
            <View style={styles.separator} />
        </>
    )
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 64,
        color: '#5AB4F0',
        padding: 20,
        fontSize: 30
    },
    headerSmall: {
        padding: 25,
        fontSize: 20
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