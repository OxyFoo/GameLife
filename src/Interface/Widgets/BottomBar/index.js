import * as React from 'react';
import { View, Animated } from 'react-native';

import styles from './style';
import BottomBarBack from './back';
import themeManager from 'Managers/ThemeManager';

import { Button, Icon } from 'Interface/Components';

/**
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 */

class BottomBar extends BottomBarBack {
    render() {
        /** @param {number} index @returns {ThemeColor} */
        const isChecked = (index) => index === this.state.selectedIndex ? 'main1' : 'unfocused';
        const stylePos = { transform: [{ translateY: this.state.animPosY }] };
        const styleBar = { transform: [{ translateX: this.state.animBarX }] };
        const backgroundBar = { backgroundColor: themeManager.GetColor('main1') };

        return (
            <Animated.View
                style={[styles.parent, stylePos]}
                onLayout={this.onLayout}
                pointerEvents={'box-none'}
            >
                <View style={styles.body} onLayout={this.onLayoutBody}>
                    {/* Selection bar */}
                    <Animated.View
                        style={[styles.bar, styleBar, backgroundBar]}
                    />

                    {/* Buttons */}
                    <Button
                        ref={ref => this.refButtons[0] = ref}
                        style={{...styles.button, ...styles.btFirst}}
                        color='transparent'
                        borderRadius={0}
                        rippleColor='main1'
                        onPress={this.goToHome}
                    >
                        <Icon icon='home' color={isChecked(0)} />
                    </Button>

                    <Button
                        ref={ref => this.refButtons[1] = ref}
                        style={styles.button}
                        color='transparent'
                        borderRadius={0}
                        rippleColor='main1'
                        onPress={this.goToCalendar}
                    >
                        <Icon icon='calendar' color={isChecked(1)} />
                    </Button>



                    <Button
                        style={styles.button}
                        color='transparent'
                        borderRadius={0}>
                    </Button>



                    <Button
                        ref={ref => this.refButtons[3] = ref}
                        style={styles.button}
                        color='transparent'
                        borderRadius={0}
                        rippleColor='main1'
                        onPress={this.goToMultiplayer}
                    >
                        <Icon icon='social' color={isChecked(3)} />
                    </Button>

                    <Button
                        ref={ref => this.refButtons[4] = ref}
                        style={{...styles.button, ...styles.btLast}}
                        color='transparent'
                        borderRadius={0}
                        rippleColor='main1'
                        onPress={this.goToShop}
                    >
                        <Icon icon='shop' color={isChecked(4)} />
                    </Button>
                </View>

                {/* Add button */}
                <Animated.View style={styles.btMiddleParent} pointerEvents='box-none'>
                    <Button
                        ref={ref => this.refButtons[2] = ref}
                        style={styles.btMiddle}
                        onPress={this.goToActivity}
                        color='main2'
                        rippleColor='black'
                        icon='add'
                        borderRadius={50}
                    />
                </Animated.View>
            </Animated.View>
        );
    }
}

export default BottomBar;
