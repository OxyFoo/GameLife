import { Animated } from 'react-native';

function OptionsAnimation(anim, toValue, duration = 300, native = true) {
    return Animated.timing(anim, {
        toValue: toValue,
        duration: duration,
        delay: 0,
        useNativeDriver: native
    });
}

function OptionsAnimationSpring(anim, toValue, native = true) {
    return Animated.spring(anim, {
        toValue: toValue,
        useNativeDriver: native
    });
}

export { OptionsAnimation, OptionsAnimationSpring };
export default () => {};