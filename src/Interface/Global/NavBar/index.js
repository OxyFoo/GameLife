import * as React from 'react';
import { Animated, View } from 'react-native';

import styles from './style';
import BottomBarBack from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Button, Icon, Text } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 *
 * @typedef {import('Managers/LangManager').Lang} Lang
 * @typedef {import('Ressources/Icons').IconsName} Icons
 */

class NavBar extends BottomBarBack {
    render() {
        const { height, animation } = this.state;

        /** @type {StyleViewProp} */
        const animStyle = {
            transform: [
                {
                    translateY: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [height, 0]
                    })
                }
            ]
        };

        const NavButton = this.renderButton;
        const MiddleButton = this.renderMiddleButton;
        return (
            <Animated.View style={[styles.parent, animStyle]} onLayout={this.onLayout}>
                <NavButton text='home' icon='home-outline' onPress={this.openHome} />
                <NavButton text='calendar' icon='planner-outline' onPress={this.openCalendar} />
                <MiddleButton />
                <NavButton text='multiplayer' icon='multiplayer-outline' onPress={this.openMultiplayer} />
                <NavButton text='shop' icon='cart-outline' onPress={this.openShop} />
            </Animated.View>
        );
    }

    /**
     * @param {Object} props
     * @param {Icons} props.icon
     * @param {keyof Lang['navbar']} props.text
     * @param {() => void} props.onPress
     * @returns {JSX.Element}
     */
    renderButton = ({ icon, text, onPress }) => {
        return (
            <View style={styles.buttonParent}>
                <Button
                    ref={this.refButtons[text]}
                    style={styles.button}
                    styleContent={styles.buttonContent}
                    appearance='uniform'
                    color='transparent'
                    onPress={onPress}
                >
                    <Icon icon={icon} color={'main1'} size={24} />
                    <Text style={styles.text} color={'main1'}>
                        {langManager.curr['navbar'][text]}
                    </Text>
                </Button>
            </View>
        );
    };

    renderMiddleButton = () => {
        const { animation, animationAddActivity } = this.state;

        /** @type {StyleViewProp} */
        const middleButtonStyle = {
            transform: [
                {
                    translateY: animation.interpolate({
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
                    ref={this.refButtons['addActivity']}
                    style={styles.middleButton}
                    styleAnimation={middleButtonStyle}
                    appearance='normal'
                    onPress={this.openAddActivity}
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
    };
}

export { NavBar };
