import * as React from 'react';
import { Animated, StyleSheet } from 'react-native';

import RippleBack from './back';
import themeManager from 'Managers/ThemeManager';

class Ripple extends RippleBack {
    render() {
        const { rippleColor } = this.props;
        const color = themeManager.GetColor(rippleColor);

        return (
            <Animated.View
                style={[
                    styles.ripple, {
                    width: 2,
                    backgroundColor: color,
                    opacity: this.ripple_opacity,
                    borderRadius: this.ripple_anim,
                    transform: [
                        { translateX: this.ripplePosX },
                        { translateY: this.ripplePosY },
                        { scale: this.ripple_anim }
                    ]
                }]}
                pointerEvents={'none'}
            />
        );
    }
}

const styles = StyleSheet.create({
    ripple: {
        position: 'absolute',
        top: 0,
        left: 0,
        aspectRatio: 1
    }
});

export default Ripple;
