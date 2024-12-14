import * as React from 'react';
import { Animated } from 'react-native';

import styles from './style';
import BottomBarBack from './back';
import NavButton from './navButton';
import MidButton from './midButton';
import langManager from 'Managers/LangManager';

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
        const lang = langManager.curr['navbar'];
        const { height, animationNavBar, animationAddActivity, animationSelection } = this.state;

        /** @type {StyleViewProp} */
        const animStyle = {
            transform: [
                {
                    translateY: animationNavBar.interpolate({
                        inputRange: [0, 1],
                        outputRange: [height, 0]
                    })
                }
            ]
        };

        return (
            <Animated.View style={[styles.parent, animStyle]} onLayout={this.onLayout}>
                <NavButton
                    ref={this.refButtons['home']}
                    index={0}
                    text={lang['home']}
                    icon='home-outline'
                    iconSelect='home'
                    anim={animationSelection}
                    onPress={this.openHome}
                />

                <NavButton
                    ref={this.refButtons['calendar']}
                    index={1}
                    text={lang['calendar']}
                    icon='planner-outline'
                    iconSelect='planner'
                    anim={animationSelection}
                    onPress={this.openCalendar}
                />

                <MidButton
                    ref={this.refButtons['addActivity']}
                    animationNavBar={animationNavBar}
                    animationAddActivity={animationAddActivity}
                    onPress={this.openAddActivity}
                />

                <NavButton
                    ref={this.refButtons['multiplayer']}
                    index={3}
                    text={lang['multiplayer']}
                    icon='multiplayer-outline'
                    iconSelect='multiplayer-variant'
                    anim={animationSelection}
                    onPress={this.openMultiplayer}
                />

                <NavButton
                    ref={this.refButtons['shop']}
                    index={4}
                    text={lang['shop']}
                    icon='cart-outline'
                    iconSelect='cart'
                    anim={animationSelection}
                    onPress={this.openShop}
                />
            </Animated.View>
        );
    }
}

export { NavBar };
