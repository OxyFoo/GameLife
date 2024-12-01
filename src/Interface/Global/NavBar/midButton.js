import * as React from 'react';
import { Animated, View } from 'react-native';

import styles from './style';
import themeManager from 'Managers/ThemeManager';

import { Button, Icon } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 */

/**
 * @param {Object} props
 * @param {React.RefObject<Button>} [props.ref]
 * @param {Animated.Value} props.animationNavBar
 * @param {Animated.Value} props.animationAddActivity
 * @param {() => void} [props.onPress]
 * @returns {JSX.Element}
 */
function MidButton({ ref, animationNavBar, animationAddActivity, onPress }) {
    /** @type {StyleViewProp} */
    const middleButtonStyle = {
        transform: [
            {
                translateY: animationNavBar.interpolate({
                    inputRange: [0, 1],
                    outputRange: [24, -24]
                })
            },
            {
                translateY: animationAddActivity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 20]
                })
            }
        ],
        borderColor: themeManager.GetColor('background')
    };

    return (
        <View style={styles.middleParentButton}>
            <Button
                ref={ref}
                style={styles.middleButton}
                styleAnimation={middleButtonStyle}
                appearance='normal'
                onPress={onPress}
            >
                <Animated.View
                    style={{
                        opacity: Animated.subtract(1, animationAddActivity),
                        transform: [
                            {
                                rotate: animationAddActivity.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '90deg']
                                })
                            }
                        ]
                    }}
                >
                    <Icon icon='add-outline' color='backgroundDark' size={24} />
                </Animated.View>
                <Animated.View
                    style={[
                        styles.absolute,
                        {
                            opacity: animationAddActivity,
                            transform: [
                                {
                                    rotate: animationAddActivity.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['90deg', '0deg']
                                    })
                                }
                            ]
                        }
                    ]}
                >
                    <Icon icon='close-outline' color='backgroundDark' size={24} />
                </Animated.View>
            </Button>
        </View>
    );
}

export default MidButton;
