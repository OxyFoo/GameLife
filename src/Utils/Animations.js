import { Animated, Easing } from 'react-native';

/**
 * @description Used to create a timing animation
 * @param {Animated.Value | Animated.ValueXY} anim Animated value to animate
 * @param {number | Animated.ValueXY} toValue Value to animate to
 * @param {number} [duration=300] Duration of animation
 * @param {boolean} [native=true] Use native driver
 * @returns {Animated.CompositeAnimation}
 */
function TimingAnimation(anim, toValue, duration = 300, native = true) {
    return Animated.timing(anim, {
        toValue: toValue,
        duration: duration,
        easing: Easing.inOut(Easing.ease),
        delay: 0,
        useNativeDriver: native
    });
}

/**
 * @description Used to create a spring animation
 * @param {Animated.Value | Animated.ValueXY} anim Animated value to animate
 * @param {number | Animated.ValueXY} toValue Value to animate to
 * @param {boolean} [native=true] Use native driver
 * @returns {Animated.CompositeAnimation}
 */
function SpringAnimation(anim, toValue, native = true) {
    return Animated.spring(anim, {
        toValue: toValue,
        useNativeDriver: native
    });
}

/**
 * @description Used to interpolate animated with function
 * @param {Function} func
 * @param {number} [steps=50]
 * @returns Input and output interpolation function
 */
function WithFunction(func, steps = 50, max = 1) {
    let inputRange = [];
    let outputRange = [];
    for (let i = 0; i <= steps; ++i) {
        const value = (i / steps) * max;
        inputRange.push(value);
        outputRange.push(func(value));
    }
    return { inputRange: inputRange, outputRange: outputRange };
}

/**
 * @param {Animated.Value} animation Animated value to interpolate (0 to 1)
 * @param {number} minValue Correspond to inputRange[0]
 * @param {number} maxValue Correspond to inputRange[1]
 */
function WithInterpolation(animation, minValue, maxValue) {
    return animation.interpolate({
        inputRange: [0, 1],
        outputRange: [minValue, maxValue]
    });
}

export { TimingAnimation, SpringAnimation, WithFunction, WithInterpolation };
export default () => {};
