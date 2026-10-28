import * as React from 'react';
import { Animated, StyleSheet } from 'react-native';

import { Random } from 'Utils/Functions';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 */

/**
 * A burst of small dots from one point, driven by a single progress value (0 = at the centre,
 * 1 = scattered and faded): the dust of the catalysts on a failure, the sparks on a success.
 * The directions are drawn once per mount, so the same burst never plays twice the same way.
 * @param {object} props
 * @param {Animated.Value} props.progress 0 → 1
 * @param {string} props.color
 * @param {number} [props.count]
 * @param {number} [props.distance] Reach of the burst, in points
 * @param {number} [props.rise] Upward bias of the burst in points: positive = the dots climb
 * @param {StyleProp} [props.style] Where the centre of the burst is
 */
function ForgeParticles({ progress, color, count = 12, distance = 80, rise = 0, style }) {
    const particles = React.useRef(
        Array.from({ length: count }, (_, index) => {
            const angle = (Math.PI * 2 * index) / count + Random(-0.3, 0.3, 2);
            const reach = Random(distance * 0.55, distance, 0);
            return {
                dx: Math.cos(angle) * reach,
                dy: Math.sin(angle) * reach - rise,
                size: Random(3, 7, 0),
                delay: Random(0, 0.25, 2)
            };
        })
    ).current;

    return (
        <Animated.View style={[styles.container, style]} pointerEvents='none'>
            {particles.map((particle, index) => (
                <Animated.View
                    key={`particle-${index}`}
                    style={[
                        styles.particle,
                        {
                            width: particle.size,
                            height: particle.size,
                            borderRadius: particle.size / 2,
                            backgroundColor: color,
                            opacity: progress.interpolate({
                                inputRange: [0, particle.delay, Math.min(1, particle.delay + 0.1), 1],
                                outputRange: [0, 0, 1, 0]
                            }),
                            transform: [
                                {
                                    translateX: progress.interpolate({
                                        inputRange: [0, particle.delay, 1],
                                        outputRange: [0, 0, particle.dx]
                                    })
                                },
                                {
                                    translateY: progress.interpolate({
                                        inputRange: [0, particle.delay, 1],
                                        outputRange: [0, 0, particle.dy]
                                    })
                                },
                                {
                                    scale: progress.interpolate({
                                        inputRange: [0, particle.delay, 1],
                                        outputRange: [1, 1, 0.3]
                                    })
                                }
                            ]
                        }
                    ]}
                />
            ))}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: 0,
        height: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2
    },
    particle: {
        position: 'absolute'
    }
});

export { ForgeParticles };
