import * as React from 'react';
import { Animated, StyleSheet } from 'react-native';

import themeManager from '../../Managers/ThemeManager';
import { TimingAnimation } from '../../Functions/Animations';

class Ripple extends React.Component {
    constructor(props) {
        super(props);
        this.anim_ended = true;
        this.pressed = false;
    }

    state = {
        ripple_posX: 0,
        ripple_posY: 0,
        ripple_anim: new Animated.Value(0),
        ripple_opacity: new Animated.Value(0)
    }

    onTouchStart = (event) => {
        if (!this.anim_ended) return;

        this.pressed = true;
        this.anim_ended = false;

        const posX = event.nativeEvent.locationX;
        const posY = event.nativeEvent.locationY;
        this.setState({ ripple_posX: posX, ripple_posY: posY });

        TimingAnimation(this.state.ripple_opacity, 0.2, 100).start();
        TimingAnimation(this.state.ripple_anim, this.props.rippleFactor * 100, 300).start(() => {
            this.anim_ended = true;
            if (!this.pressed) {
                this.Hide();
            }
        });
    }
    onTouchEnd = () => {
        this.pressed = false;
        if (this.anim_ended) {
            this.Hide();
        }
    }

    Hide(duration = 200) {
        TimingAnimation(this.state.ripple_opacity, 0, duration).start();
        TimingAnimation(this.state.ripple_anim, 0, duration+100).start();
    }

    render() {
        const color = themeManager.getColor(this.props.rippleColor);
        return (
            <Animated.View
                style={[
                    styles.ripple, {
                    backgroundColor: color,
                    opacity: this.state.ripple_opacity,
                    top: this.state.ripple_posY,
                    left: this.state.ripple_posX,
                    borderRadius: this.state.ripple_anim,
                    transform: [{ scale: this.state.ripple_anim }]
                }]}
            />
        )
    }
}

const styles = StyleSheet.create({
    ripple: {
        position: 'absolute',
        width: '2%',
        aspectRatio: 1
    }
});

export default Ripple;