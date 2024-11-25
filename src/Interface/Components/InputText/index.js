import * as React from 'react';
import { Animated, View, TextInput } from 'react-native';

import styles from './style';
import InputTextBack from './back';
import themeManager from 'Managers/ThemeManager';

import { Text } from '../Text';
import { Icon } from '../Icon';
import { InputTextThin } from './Thin';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').TextInputProps} TextInputProps
 *
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 */

/** @type {Object.<string, { ios: TextInputProps['textContentType'], android: TextInputProps['autoComplete'] }>} */
const textTypes = {
    default: { ios: 'none', android: 'off' },
    email: { ios: 'emailAddress', android: 'email' },
    name: { ios: 'name', android: 'name' },
    username: { ios: 'username', android: 'username' }
};

class InputText extends InputTextBack {
    static Thin = InputTextThin;

    render() {
        const {
            style,
            containerStyle,
            label,
            icon,
            type,
            enabled,
            staticLabel,
            activeColor,
            inactiveColor,
            backgroundColor,
            forceActive,
            error,
            showCounter,
            placeholderTextColor,
            onParentLayout,
            onSubmit,
            pointerEvents,
            ...props
        } = this.props;
        const {
            animTop,
            animLeft,
            animScale,
            isFocused,
            boxHeight,
            borderWidth,
            textWidth,
            textHeight,
            textCounterWidth
        } = this.state;

        const isActive = isFocused || forceActive;

        /** @type {ThemeColor | ThemeText} */
        const textColor = 'primary';

        /** @type {ThemeColor | ThemeText} */
        let color = inactiveColor;
        if (error) {
            color = 'danger';
        } else if (isActive) {
            color = activeColor;
        }

        const _icon = icon || (error ? 'danger' : null);
        const hexColor = themeManager.GetColor(color);
        const labelY = this.props.multiline ? 28 : boxHeight / 2;
        const textLength = props.value?.length || 0;

        /** @type {TextInput['props']['style']} */
        const colorStyle = {
            color: themeManager.GetColor(textColor)
        };

        /** @type {ViewStyle} */
        const containerStyle2 = {
            borderColor: hexColor,
            borderWidth: borderWidth,
            opacity: enabled ? 1 : 0.6,
            paddingRight: _icon !== null ? 32 : 0,
            backgroundColor: themeManager.GetColor(backgroundColor)
        };

        /** @type {ViewStyle} */
        const barMaskStyle = {
            width: textWidth * 0.75 + (textWidth ? 12 : 0),
            backgroundColor: themeManager.GetColor('background'),
            transform: [{ scaleX: Animated.subtract(1, animTop) }]
        };

        /** @type {ViewStyle} */
        const barCounterMaskStyle = {
            width: textCounterWidth + 6,
            backgroundColor: themeManager.GetColor('background')
        };

        return (
            <Animated.View
                style={[styles.parent, containerStyle2, containerStyle]}
                onLayout={this.onBoxLayout}
                pointerEvents={enabled ? pointerEvents : 'none'}
            >
                {/* Mask bar to hide border between text and input border */}
                <Animated.View style={[styles.bar, barMaskStyle]} />

                {/* Mask bar to hide counter */}
                {textLength > 0 && (
                    <>
                        {showCounter && <Animated.View style={[styles.barCounter, barCounterMaskStyle]} />}

                        {/* Counter Text */}
                        <Text
                            style={styles.counter}
                            color={showCounter ? textColor : 'transparent'}
                            fontSize={12}
                            onLayout={this.onTextCounterLayout}
                        >
                            {`${textLength}/${props.maxLength}`}
                        </Text>
                    </>
                )}

                {/* Title (in center or move into top border if focused or active) */}
                <Animated.View
                    style={[
                        styles.placeholderParent,
                        {
                            transform: [
                                { translateX: -textWidth / 2 },
                                { translateY: -textHeight / 2 },
                                { scale: animScale },
                                { translateX: textWidth / 2 },
                                { translateY: textHeight / 2 },

                                { translateX: animLeft },
                                {
                                    translateY: animTop.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [-textHeight / 2, labelY - textHeight / 2 - 2]
                                    })
                                }
                            ]
                        }
                    ]}
                    pointerEvents={'none'}
                >
                    {/* Hide title when empty to hide empty space on iOS */}
                    {label.length > 0 && (
                        <Text color={textColor} fontSize={16} onLayout={this.onTextLayout}>
                            {label}
                        </Text>
                    )}
                </Animated.View>

                {/* Input */}
                <TextInput
                    {...props}
                    testID={'textInput'}
                    ref={this.refInput}
                    style={[styles.input, colorStyle, style]}
                    selectionColor={'white'}
                    placeholderTextColor={placeholderTextColor || themeManager.GetColor('secondary')}
                    onFocus={this.onFocusIn}
                    onBlur={this.onFocusOut}
                    onSubmitEditing={onSubmit}
                    textContentType={textTypes[type]['ios']}
                    autoComplete={textTypes[type]['android']}
                    autoCorrect={false}
                />

                {/* Icon */}
                {_icon !== null && (
                    <View style={styles.icon}>
                        <Icon icon={_icon} color={color} />
                    </View>
                )}
            </Animated.View>
        );
    }
}

export { InputText };
