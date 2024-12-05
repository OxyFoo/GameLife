import * as React from 'react';
import { Animated, View } from 'react-native';

import styles from './style';

import { Button, Icon, Text } from 'Interface/Components';

/**
 * @typedef {import('Ressources/Icons').IconsName} Icons
 */

/**
 * @typedef {object} NavButtonProps
 * @property {number} index
 * @property {Icons} icon
 * @property {Icons} iconSelect
 * @property {string} text
 * @property {Animated.Value} anim
 * @property {() => void} onPress
 */

const NavButton = React.forwardRef(
    /**
     * @param {NavButtonProps} props
     * @returns {JSX.Element}
     */
    ({ index, icon, iconSelect, text, anim, onPress }, ref) => {
        const inputRange = [index - 1, index - 0.5, index, index + 0.5, index + 1];

        return (
            <View ref={ref} style={styles.buttonParent}>
                <Button
                    style={styles.button}
                    styleContent={styles.buttonContent}
                    appearance='uniform'
                    color='transparent'
                    onPress={onPress}
                >
                    {/* Icon */}
                    <Animated.View
                        style={{
                            opacity: anim.interpolate({
                                inputRange,
                                outputRange: [1, 1, 0, 1, 1],
                                extrapolate: 'clamp'
                            }),
                            transform: [
                                {
                                    scale: anim.interpolate({
                                        inputRange,
                                        outputRange: [1, 1, 0.75, 1, 1],
                                        extrapolate: 'clamp'
                                    })
                                }
                            ]
                        }}
                    >
                        <Icon icon={icon} color='border' size={24} />
                    </Animated.View>

                    {/* Text */}
                    <Animated.View
                        style={[
                            {
                                opacity: anim.interpolate({
                                    inputRange,
                                    outputRange: [1, 0.5, 0, 0.5, 1],
                                    extrapolate: 'clamp'
                                }),
                                transform: [
                                    {
                                        scale: anim.interpolate({
                                            inputRange,
                                            outputRange: [1, 1, 0.75, 1, 1],
                                            extrapolate: 'clamp'
                                        })
                                    }
                                ]
                            }
                        ]}
                    >
                        <Text style={styles.text} color='border'>
                            {text}
                        </Text>
                    </Animated.View>
                </Button>

                {/* Absolute icon */}
                <Animated.View
                    style={[
                        styles.absoluteIcon,
                        {
                            opacity: anim.interpolate({
                                inputRange,
                                outputRange: [0, 0, 1, 0, 0],
                                extrapolate: 'clamp'
                            }),
                            transform: [
                                { translateX: anim.interpolate({ inputRange, outputRange: [-24, -24, 0, 24, 24] }) }
                            ]
                        }
                    ]}
                    pointerEvents='none'
                >
                    <Icon icon={iconSelect} color='main1' size={24} />
                </Animated.View>

                {/* Absolute text */}
                <Animated.View
                    style={[
                        styles.absoluteText,
                        {
                            opacity: anim.interpolate({
                                inputRange,
                                outputRange: [0, 0, 1, 0, 0],
                                extrapolate: 'clamp'
                            }),
                            transform: [
                                { scale: anim.interpolate({ inputRange, outputRange: [0.75, 0.75, 1, 0.75, 0.75] }) },
                                { translateY: anim.interpolate({ inputRange, outputRange: [8, 8, 0, 8, 8] }) }
                            ]
                        }
                    ]}
                    pointerEvents='none'
                >
                    <Text style={styles.text} color='main1'>
                        {text}
                    </Text>
                </Animated.View>
            </View>
        );
    }
);

export default NavButton;
