import { Animated } from 'react-native';

function OptionsAnimation(anim, toValue) {
    return Animated.spring(anim, {
        toValue: toValue,
        speed: 8,
        useNativeDriver: true
    });
}

export { OptionsAnimation };
export default () => {};