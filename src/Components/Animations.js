import { Animated } from 'react-native';

function OptionsAnimation(anim, toValue, duration = 300) {
    return Animated.timing(anim, {
        toValue: toValue,
        duration: duration,
        delay: 0,
        useNativeDriver: true
    });
}

export { OptionsAnimation };
export default () => {};