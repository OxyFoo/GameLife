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

export { TimingAnimation, SpringAnimation };
export default () => {};