import * as React from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';

import styles from './style';
import SwitchTextBack from './back';
import user from 'Managers/UserManager';
import themeManager from 'Managers/ThemeManager';

import { Text } from '../Text';
import { Ripple } from '../../Primitives/Ripple';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 */

function SwitchTextCell(props = {
    text: '',
    fontSize: 16,
    width: 50,
    onPress: () => {}
}) {
    /** @type {React.RefObject<Ripple>} */
    const refRipple = React.useRef(null);

    return (
        <TouchableOpacity
            style={[styles.button, { width: props.width }]}
            onPress={() => props.onPress()}
            onPressIn={(e) => refRipple.current?.Press(e, props.width)}
            onPressOut={refRipple.current?.Release}
            activeOpacity={0.6}
        >
            <Ripple ref={refRipple} />

            <Text fontSize={props.fontSize}>
                {props.text}
            </Text>
        </TouchableOpacity>
    );
}

class SwitchText extends SwitchTextBack {
    render() {
        const { anim, parentWidth } = this.state;
        const { style, color, texts, fontSize } = this.props;

        const childrenCount = texts.length;
        if (childrenCount === 0) {
            user.interface.console.AddLog('warn', 'SwitchText has no children');
            return null;
        }

        const activeColor = themeManager.GetColor(color);
        const width = (100 - 5 * (childrenCount - 1)) / childrenCount;

        /** @type {StyleProp} */
        const parentStyle = {
            borderColor: activeColor
        };

        /** @type {StyleProp} */
        const selectionStyle = {
            width: `${width}%`,
            backgroundColor: activeColor,
            transform: [
                { translateX: Animated.multiply(anim, parentWidth / childrenCount) }
            ]
        };

        return (
            <View
                style={[styles.parent, parentStyle, style]}
                onLayout={this.onLayout}
            >
                {/** Background selection */}
                <Animated.View style={[styles.selection, selectionStyle]} />

                {/** Children */}
                {texts.map((text, index) => (
                    <SwitchTextCell
                        key={'stc-' + index}
                        text={text}
                        fontSize={fontSize}
                        width={width * (parentWidth - 7 * 2) / 100}
                        onPress={() => this.onChange(index)}
                    />
                ))}
            </View>
        );
    }
}

export { SwitchText };
