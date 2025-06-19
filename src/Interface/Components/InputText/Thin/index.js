import * as React from 'react';
import { Animated, View, TextInput } from 'react-native';

import styles from './style';
import InputTextThinBack from './back';
import themeManager from 'Managers/ThemeManager';

import { Icon } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').TextInputProps} TextInputProps
 */

/** @type {Object.<string, { ios: TextInputProps['textContentType'], android: TextInputProps['autoComplete'] }>} */
const textTypes = {
    default: { ios: 'none', android: 'off' },
    email: { ios: 'emailAddress', android: 'email' },
    name: { ios: 'name', android: 'name' },
    username: { ios: 'username', android: 'username' }
};

class InputTextThin extends InputTextThinBack {
    render() {
        const {
            style,
            containerStyle,
            type,
            icon,
            enabled,
            borderWidth,
            activeColor,
            forceActive,
            onSubmit,
            pointerEvents,
            ...props
        } = this.props;
        const { focused, animBorder } = this.state;

        const hexActiveColor = themeManager.GetColor(activeColor);
        const textColor = themeManager.GetColor('secondary');

        /** @type {ViewStyle} */
        const containerStyle2 = {
            opacity: enabled ? 1 : 0.6
        };

        return (
            <Animated.View
                style={[styles.parent, containerStyle, containerStyle2]}
                pointerEvents={enabled ? pointerEvents : 'none'}
            >
                <View style={[styles.bar, { height: borderWidth, backgroundColor: textColor }]} />
                <Animated.View
                    style={[
                        styles.bar,
                        {
                            height: borderWidth + 1,
                            backgroundColor: hexActiveColor,
                            transform: [{ scaleX: animBorder }]
                        }
                    ]}
                />

                {/* Input */}
                <TextInput
                    {...props}
                    testID={'textInput'}
                    ref={this.refInput}
                    style={[styles.input, icon !== null && styles.inputWithIcon, style]}
                    selectionColor={'white'}
                    onFocus={this.onFocusIn}
                    onBlur={this.onFocusOut}
                    onSubmitEditing={onSubmit}
                    placeholderTextColor={textColor}
                    textContentType={textTypes[type]['ios']}
                    autoComplete={textTypes[type]['android']}
                    autoCorrect={false}
                />

                {icon && (
                    <Animated.View
                        style={[
                            styles.icon,
                            {
                                opacity: animBorder.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.75, 1]
                                })
                            }
                        ]}
                        pointerEvents='none'
                    >
                        <Icon color={focused ? activeColor : 'secondary'} icon={icon} />
                    </Animated.View>
                )}
            </Animated.View>
        );
    }
}

export { InputTextThin };
