import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import SwitchBack from './back';
import themeManager from 'Managers/ThemeManager';

import Button from 'Interface/OldComponents/Button';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').Animated.AnimatedProps<ViewStyle>} AnimatedViewStyle
 */

class Switch extends SwitchBack {
    render() {
        const color = this.props.value ? themeManager.GetColor('main1') : themeManager.GetColor('backgroundCard');

        const barStyle = [ styles.bar, {
            borderColor: color,
            backgroundColor: themeManager.GetColor('background')
        } ];

        /** @type {AnimatedViewStyle} */
        const btnStyle = {
            ...styles.circle,
            backgroundColor: color, transform: [{ translateX: this.state.anim }]
        };

        return (
            <View>
                <View style={barStyle} onTouchStart={this.onPress} />
                <Button styleAnimation={btnStyle} color='main1' onPress={this.onPress} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    circle: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 28,
        height: 'auto',
        paddingHorizontal: 0,
        aspectRatio: 1,
        borderRadius: 48
    },
    bar: {
        width: 56,
        height: 28,
        borderRadius: 14,
        borderWidth: 1
    }
});

export default Switch;
