import { Animated, Easing } from 'react-native';

function QuarterAnimation(anim, toValue) {
    return Animated.spring(anim, {
        toValue: toValue,
        tension: 28,
        isInteraction: false,
        useNativeDriver: false
    });
}

function SmoothAnimation(anim, toValue) {
    return Animated.timing(anim, {
        toValue: toValue,
        duration: 800,
        easing: Easing.out(Easing.exp),
        isInteraction: false,
        useNativeDriver: false
    });
}

function SpringSlowAnimation(anim, toValue) {
    return Animated.spring(anim, {
        toValue: toValue,
        delay: 200,
        speed: 5,
        useNativeDriver: true
    });
}

function DirectAnimation(anim, toValue) {
    return Animated.timing(anim, {
        toValue: toValue,
        duration: 1,
        useNativeDriver: true
    });
}

function OptionsAnimation(anim, toValue) {
    return Animated.spring(anim, {
        toValue: toValue,
        speed: 8,
        useNativeDriver: true
    });
}

export { QuarterAnimation, SmoothAnimation, SpringSlowAnimation, DirectAnimation, OptionsAnimation };
export default () => {};