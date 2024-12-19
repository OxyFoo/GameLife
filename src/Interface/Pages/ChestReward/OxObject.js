import * as React from 'react';
import { Animated, StyleSheet } from 'react-native';

import { IMG_OX } from 'Ressources/items/currencies/currencies';
import { Random } from 'Utils/Functions';
import { SpringAnimation, TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ImageStyle} ImageStyle
 * @typedef {import('react-native').Animated.AnimatedProps<ImageStyle>} StyleAnimatedImageProp
 */

/**
 * @param {Object} param0
 * @param {number} param0.index
 * @param {number} param0.total
 * @param {{ width: number, height: number }} param0.parentLayout
 * @returns
 */
function OxObject({ index, total, parentLayout }) {
    const [show, setShow] = React.useState(false);

    const [position] = React.useState(new Animated.ValueXY());
    const [scale] = React.useState(new Animated.Value(index === 0 ? 1 : 0));
    const [shake] = React.useState(new Animated.Value(0));
    const [opacity] = React.useState(new Animated.Value(0));

    // Random position
    React.useEffect(() => {
        TimingAnimation(
            position,
            {
                x: Random(-300, 300),
                y: Random(-300, 300)
            },
            0
        ).start();
    }, [position]);

    // Waiting time
    React.useEffect(() => {
        if (index === 0) {
            setShow(true);
            return;
        }
        const timeout = 1000 + (1600 / total) * index;
        setTimeout(() => setShow(true), timeout);
    }, [index, total]);

    // Scale & opacity
    React.useEffect(() => {
        if (show) {
            if (index === 0) {
                Animated.parallel([
                    TimingAnimation(position, { x: 0, y: 0 }, 0),
                    TimingAnimation(scale, 2, 3000),
                    TimingAnimation(opacity, 1, 150),
                    TimingAnimation(shake, 20, 2500)
                ]).start();
            } else {
                Animated.parallel([
                    TimingAnimation(scale, 1, 150),
                    TimingAnimation(opacity, 1, 150),
                    SpringAnimation(position, { x: 0, y: 0 })
                ]).start();
            }
        }
    }, [index, opacity, position, scale, shake, show]);

    /** @type {StyleAnimatedImageProp} */
    const style = {
        transform: [
            {
                translateX: Animated.add(
                    Animated.add(
                        shake.interpolate({
                            inputRange: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                            outputRange: [0, -2, 2, -2, 2, -2, 2, -2, 2, -2, 2, -2, 2, -2, 2, -2, 2, -2, 2, -2, 0]
                        }),
                        position.x
                    ),
                    parentLayout?.width / 2
                )
            },
            {
                translateY: Animated.add(position.y, parentLayout?.height / 2)
            },
            { scale: scale }
        ],
        opacity: opacity
    };

    if (index === 0) {
        style.zIndex = 1000;
    }

    return <Animated.Image source={IMG_OX} style={[styles.ox, style]} />;
}

const styles = StyleSheet.create({
    ox: {
        position: 'absolute',
        width: 75,
        height: 75,
        top: -75 / 2,
        left: -75 / 2
    }
});

export default OxObject;
