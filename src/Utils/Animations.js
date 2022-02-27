import { Animated, Easing } from 'react-native';

function TimingAnimation(anim, toValue, duration = 300, native = true) {
    return Animated.timing(anim, {
        toValue: toValue,
        duration: duration,
        easing: Easing.inOut(Easing.ease),
        delay: 0,
        useNativeDriver: native
    });
}

function SpringAnimation(anim, toValue, native = true) {
    return Animated.spring(anim, {
        toValue: toValue,
        useNativeDriver: native
    });
}

/**
 * @description Used to interpolate animated with function
 * @param {Function} func
 * @param {Number} [steps=50]
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

export { TimingAnimation, SpringAnimation, WithFunction };
export default () => {};