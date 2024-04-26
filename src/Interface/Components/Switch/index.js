import * as React from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import SwitchBack from './back';
import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').Animated.AnimatedProps<ViewStyle>} AnimatedViewStyle
 */

class Switch extends SwitchBack {
    render() {
        const { style, color } = this.props;
        const { anim, animBackground } = this.state;

        /** @type {StyleProp} */
        const bgStyle = {
            opacity: Animated.subtract(1, anim)
        };

        /** @type {AnimatedViewStyle} */
        const activeBgStyle = {
            transform: [
                { translateX: Animated.multiply(anim, 24)},
                { scale: Animated.multiply(animBackground, 100)}
            ],
            backgroundColor: themeManager.GetColor(color)
        };

        /** @type {AnimatedViewStyle} */
        const btnStyle = {
            backgroundColor: themeManager.GetColor('white'),
            transform: [
                { translateX: Animated.multiply(anim, 24) }
            ]
        };

        return (
            <TouchableOpacity
                style={[styles.parent, style]}
                onPress={this.onPress}
                activeOpacity={.8}
            >
                {/** Gradient background */}
                <Animated.View style={[styles.background, bgStyle]}>
                    <LinearGradient
                        style={styles.fill}
                        colors={['#999EB573', '#43454F26']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    />
                </Animated.View>

                {/** Active background */}
                <Animated.View style={[styles.activeBackground, activeBgStyle]} />

                {/** Circle button */}
                <Animated.View style={[styles.circle, btnStyle]} />
            </TouchableOpacity>
        );
    }
}

export { Switch };
