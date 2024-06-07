import * as React from 'react';
import { Animated } from 'react-native';

import { TimingAnimation } from 'Utils/Animations';

class RippleBack extends React.PureComponent {
    anim_ended = true;
    pressed = false;

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
        TimingAnimation(this.state.ripple_anim, 200, 300).start(() => {
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
}

export default RippleBack;
