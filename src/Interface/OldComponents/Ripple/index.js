import * as React from 'react';
import { Animated, StyleSheet } from 'react-native';

import RippleBack from './back';
import themeManager from 'Managers/ThemeManager';

class Ripple extends RippleBack {
    render() {
        const color = themeManager.GetColor(this.props.rippleColor);
        return (
            <Animated.View
                style={[
                    styles.ripple, {
                    width: this.props.parentWidth * .02,
                    backgroundColor: color,
                    opacity: this.state.ripple_opacity,
                    top: this.state.ripple_posY,
                    left: this.state.ripple_posX,
                    borderRadius: this.state.ripple_anim,
                    transform: [{ scale: this.state.ripple_anim }]
                }]}
            />
        );
    }
}

const styles = StyleSheet.create({
    ripple: {
        position: 'absolute',
        aspectRatio: 1
    }
});

export default Ripple;
