import * as React from 'react';
import { Animated, View, TextInput } from 'react-native';

import styles from './style';
import InputTextBack from './back';
import themeManager from 'Managers/ThemeManager';

import { Text } from '../Text';
import { Icon } from '../Icon';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').TextInputProps} TextInputProps
 * 
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 */

/** @type {Object.<string, { ios: TextInputProps['textContentType'], android: TextInputProps['autoComplete'] }>} */
const textTypes = {
    default:    { ios: 'none',          android: 'off' },
    email:      { ios: 'emailAddress',  android: 'email' },
    name:       { ios: 'name',          android: 'name' },
    username:   { ios: 'username',      android: 'username' }
};

class InputText extends InputTextBack {
    render() {
        const {
            style, containerStyle, label, icon, type, enabled, staticLabel, activeColor,
            forceActive, error, onParentLayout, onSubmit, pointerEvents, ...props
        } = this.props;
        const {
            animTop, animLeft, animScale, isFocused,
            boxHeight, borderWidth, textWidth, textHeight
        } = this.state;

        const isActive = isFocused || forceActive;

        /** @type {ThemeColor | ThemeText} */
        const textColor = 'primary';

        /** @type {ThemeColor | ThemeText} */
        let color = 'borderLight';
        if (error) {
            color = 'danger';
        } else if (isActive) {
            color = activeColor;
        }

        const _icon = icon || (error ? 'danger' : null);
        const hexColor = themeManager.GetColor(color);

        /** @type {ViewStyle} */
        const containerStyle2 = {
            borderColor: hexColor,
            borderWidth: borderWidth,
            opacity: enabled ? 1 : 0.6,
            paddingRight: _icon !== null ? 32 : 0
        };

        /** @type {ViewStyle} */
        const barMaskStyle = {
            width: textWidth * 0.75 + (textWidth ? 12 : 0),
            backgroundColor: themeManager.GetColor('background'),
            transform: [
                { scaleX: Animated.subtract(1, animTop) },
            ]
        };

        return (
            <Animated.View
                style={[styles.parent, containerStyle, containerStyle2]}
                onLayout={this.onBoxLayout}
                pointerEvents={enabled ? pointerEvents : 'none'}
            >
                {/* Mask bar to hider border between text and input border */}
                <Animated.View style={[styles.bar, barMaskStyle]} />

                {/* Title (in center or move into top border if focused or active) */}
                <Animated.View
                    style={[styles.placeholderParent, {
                        transform: [
                            { translateX: -textWidth/2 },
                            { translateY: -textHeight/2 },
                            { scale: animScale },
                            { translateX: textWidth/2 },
                            { translateY: textHeight/2 },

                            { translateX: animLeft },
                            { translateY: animTop.interpolate({
                                inputRange: [ 0, 1 ],
                                outputRange: [
                                    -textHeight / 2,
                                    boxHeight / 2 - textHeight / 2 - 2
                                ]
                            }) }
                        ]
                    }]}
                    pointerEvents={'none'}
                >
                    <Text
                        color={textColor}
                        fontSize={16}
                        onLayout={this.onTextLayout}
                    >
                        {label}
                    </Text>
                </Animated.View>

                {/* Input */}
                <TextInput
                    {...props}
                    testID={'textInput'}
                    ref={this.refInput}
                    style={[styles.input, style]}
                    selectionColor={'white'}
                    onFocus={this.onFocusIn}
                    onBlur={this.onFocusOut}
                    onSubmitEditing={onSubmit}
                    textContentType={textTypes[type]['ios']}
                    autoComplete={textTypes[type]['android']}
                    autoCorrect={false}
                />

                {/* Error icon */}
                {_icon !== null && (
                    <View style={styles.error}>
                        <Icon
                            icon={_icon}
                            color={color}
                        />
                    </View>
                )}
            </Animated.View>
        );
    }
}

export { InputText };
