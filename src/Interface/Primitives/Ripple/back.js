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
    rippleColor: 'white',

    /** @type {number} */
    duration: 300
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
     * @param {number} x
     * @param {number} y
     * @param {number} size
     */
    Press = (x, y, size) => {
        const { duration } = this.props;

        if (!this.anim_ended) return;
        if (this.timeoutAnim !== null) {
            clearTimeout(this.timeoutAnim);
        }

        this.pressed = true;
        this.anim_ended = false;

        TimingAnimation(this.ripplePosX, x, 0).start();
        TimingAnimation(this.ripplePosY, y, 0).start();

        TimingAnimation(this.ripple_opacity, 0.2, duration / 3).start();
        TimingAnimation(this.ripple_anim, size * 1.2, duration).start(() => {
            this.anim_ended = true;
            if (!this.pressed) {
                this.Hide();
            }
        });
    };

    Release = () => {
        this.pressed = false;
        if (this.anim_ended) {
            this.Hide();
        }
    };

    Hide() {
        const duration = 150;

        TimingAnimation(this.ripple_opacity, 0, duration).start();
        this.timeoutAnim = setTimeout(() => {
            TimingAnimation(this.ripple_anim, 0, 0).start();
        }, duration);
    }
}

RippleBack.prototype.props = RippleProps;
RippleBack.defaultProps = RippleProps;

export default RippleBack;
