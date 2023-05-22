import * as React from 'react';
import { TextInput, Animated } from 'react-native';

import styles from './style';
import InputBack from './back';
import themeManager from '../../../Managers/ThemeManager';

import { Text } from '../../Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * 
 * @typedef {import('../../../Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('../../../Managers/ThemeManager').ColorThemeText} ColorThemeText
 */

/**
 * @type {Object.<string, { ios: string, android: string }>}
 */
const textTypes = {
    default: { ios: 'none', android: 'off' },
    email: { ios: 'emailAddress', android: 'email' },
    name: { ios: 'name', android: 'name' },
    username: { ios: 'username', android: 'username' }
}

class Input extends InputBack {
    render() {
        const isActive = this.state.isFocused || this.props.active;
        const interH = {
            inputRange: [ 0, 1 ],
            outputRange: [
                -this.state.textHeight / 2
                , this.state.boxHeight / 2 - this.state.textHeight / 2 - 2
            ]
        }

        const activeColor = isActive ? this.props.activeColor : 'border';
        const hexActiveColor = themeManager.GetColor(activeColor);
        const hexBackgroundColor = themeManager.GetColor('background');

        /** @type {ColorTheme|ColorThemeText} */
        const textColor = isActive ? this.props.activeColor : 'primary';

        const opacity = this.props.enabled ? 1 : 0.6;
        const barStyle = [styles.bar, {
            width: this.state.textWidth * 0.75 + (this.state.textWidth ? 12 : 0),
            backgroundColor: hexBackgroundColor,
            transform: [
                { scaleX: Animated.subtract(1, this.state.animTop) },
            ]
        }];
        const height = { height: this.props.multiline ? 'auto': this.props.height };

        return (
            <Animated.View style={[styles.parent, {
                    backgroundColor: hexBackgroundColor,
                    borderColor: hexActiveColor,
                    borderWidth: this.state.borderWidth,
                    opacity: opacity
                }, this.props.style]}
                onLayout={this.onBoxLayout}
                pointerEvents={this.props.enabled ? this.props.pointerEvents : 'none'}
            >
                <Animated.View style={barStyle} />

                {/* Title (in center or move into top border if focused or active) */}
                <Animated.View
                    style={[styles.placeholderParent, {
                        //backgroundColor: this.state.animScale.interpolate(interC), // hexBackgroundColor,
                        //backgroundColor: hexBackgroundColor,
                        transform: [
                            { translateX: -this.state.textWidth/2 },
                            { translateY: -this.state.textHeight/2 },
                            { scale: this.state.animScale },
                            { translateX: this.state.textWidth/2 },
                            { translateY: this.state.textHeight/2 },

                            { translateX: this.state.animLeft },
                            { translateY: this.state.animTop.interpolate(interH) }
                        ]
                    }]}
                    pointerEvents={'none'}
                >
                    <Text
                        color={textColor}
                        fontSize={16}
                        onLayout={this.onTextLayout}
                    >
                        {this.props.label}
                    </Text>
                </Animated.View>

                <TextInput
                    ref={(input) => { this.refInput = input; }}
                    style={[styles.input, height]}
                    selectionColor={hexActiveColor}
                    value={this.props.text}
                    onChangeText={this.props.onChangeText}
                    onFocus={this.onFocusIn}
                    onBlur={this.onFocusOut}
                    onSubmitEditing={this.props.onSubmit}
                    // @ts-ignore
                    textContentType={textTypes[this.props.textContentType]['ios']}
                    autoCompleteType={textTypes[this.props.textContentType]['android']}
                    autoCorrect={false}
                    multiline={this.props.multiline}
                    maxLength={this.props.maxLength}
                />
            </Animated.View>
        );
    }
}

export default Input;