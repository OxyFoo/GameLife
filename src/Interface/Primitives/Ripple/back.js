import * as React from 'react';
import { Animated } from 'react-native';

import { TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 */

const RippleProps = {
    /** @type {ThemeColor | ThemeText} */
    rippleColor: 'white'
};

class RippleBack extends React.PureComponent {
    anim_ended = true;
    pressed = false;

    /** @type {NodeJS.Timeout | null} */
    timeoutAnim = null;

    ripplePosX = new Animated.Value(0);
    ripplePosY = new Animated.Value(0);
    ripple_anim = new Animated.Value(0);
    ripple_opacity = new Animated.Value(0);

    /**
     * @param {GestureResponderEvent} event
     * @param {number} size
     */
    Press = (event, size) => {
        if (!this.anim_ended) return;
        if (this.timeoutAnim !== null) {
            clearTimeout(this.timeoutAnim);
        }

        this.pressed = true;
        this.anim_ended = false;

        const posX = event.nativeEvent.locationX;
        const posY = event.nativeEvent.locationY;
        TimingAnimation(this.ripplePosX, posX, 0).start();
        TimingAnimation(this.ripplePosY, posY, 0).start();

        TimingAnimation(this.ripple_opacity, 0.2, 100).start();
        TimingAnimation(this.ripple_anim, size * 1.2, 300).start(() => {
            this.anim_ended = true;
            if (!this.pressed) {
                this.Hide();
            }
        });
    }

    /** @param {GestureResponderEvent} event */
    Release = (event) => {
        this.pressed = false;
        if (this.anim_ended) {
            this.Hide();
        }
    }

    Hide(duration = 150) {
        TimingAnimation(this.ripple_opacity, 0, duration).start();
        this.timeoutAnim = setTimeout(() => {
            TimingAnimation(this.ripple_anim, 0, 0).start();
        }, duration);
    }
}

RippleBack.prototype.props = RippleProps;
RippleBack.defaultProps = RippleProps;

export default RippleBack;
