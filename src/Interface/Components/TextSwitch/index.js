import * as React from 'react';
import { View, Animated } from 'react-native';

import styles from './style';
import TextSwitchBack from './back';
import user from 'Managers/UserManager';
import themeManager from 'Managers/ThemeManager';

import Button from 'Interface/Components/Button';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 */

class TextSwitch extends TextSwitchBack {
    render() {
        if (this.props.texts.length === 0) {
            user.interface.console.AddLog('warn', 'TextSwitch has no children');
            return null;
        }

        const selectColor = themeManager.GetColor('main1');
        const childrenCount = this.props.texts.length;
        const parentStyle = [
            styles.parent,
            {
                borderColor: selectColor
            },
            this.props.style
        ];

        const selectionInter = {
            inputRange: [0, 1],
            outputRange: [0, this.state.parentWidth/childrenCount]
        };
        const selectionStyle = [
            styles.selection,
            {
                width: this.state.parentWidth/childrenCount - 12,
                backgroundColor: selectColor,
                transform: [
                    { translateX: this.state.anim.interpolate(selectionInter) }
                ]
            }
        ];

        const width = { width: (100 - 5 * (childrenCount - 1)) / childrenCount + '%' };
        const addButtons = (text, index) => (
            <Button
                key={'bt-switch-' + index}
                style={[styles.button, width]}
                onPress={() => this.onChange(index)}
                rippleColor={'white'}
                fontSize={this.props.fontSize}
            >
                {text}
            </Button>
        );

        return (
            <View style={parentStyle} onLayout={this.onLayout}>
                <Animated.View style={selectionStyle} />
                {this.props.texts.map(addButtons)}
            </View>
        );
    }
}

export default TextSwitch;
