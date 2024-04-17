import * as React from 'react';
import { View, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import XPBarBack from './back';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 */

class XPBar extends XPBarBack {
    render() {
        const style = [ styles.body, this.props.style ];
        const leftOffset = Animated.multiply(this.state.animation, this.state.width);
        const suppOffset = Animated.multiply(this.state.animCover, this.state.width);
        const black = [styles.black, { transform: [{ translateX: leftOffset } ]}];

        // Cover is used to show the progress of the next level
        // And preCover is used to avoid empty space at left with spring animation
        const preCover = [styles.preCover, { transform: [{ translateX: suppOffset } ]}];
        const cover = [styles.cover, { transform: [{ translateX: suppOffset } ]}];

        return (
            <View style={style} onLayout={this.onLayout}>
                <LinearGradient
                    style={styles.bar}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    colors={['#DBA1FF', '#9095FF', '#8CF7FF']}
                />
                <Animated.View style={black}>
                    <Animated.View style={[cover, preCover]} />
                    <Animated.View style={cover} />
                </Animated.View>
            </View>
        );
    }
}

export default XPBar;
