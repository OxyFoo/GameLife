import * as React from 'react';
import { View, Animated, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles, { TABS_GAP } from './style';
import TabsBack from './back';
import themeManager from 'Managers/ThemeManager';

import { Text } from '../Text';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 */

class Tabs extends TabsBack {
    render() {
        const { anim, parentWidth } = this.state;
        const { style, texts, fontSize, value, refs } = this.props;

        const count = texts.length;
        if (count === 0) {
            return null;
        }

        const cellWidth = Math.max(0, (parentWidth - TABS_GAP * (count - 1)) / count);

        /** @type {StyleProp} */
        const pillStyle = {
            width: cellWidth,
            transform: [{ translateX: Animated.multiply(anim, cellWidth + TABS_GAP) }]
        };

        const inactiveBorder = themeManager.GetColor('main1', { opacity: 0.35 });

        return (
            <View style={[styles.parent, style]} onLayout={this.onLayout}>
                {/** Sliding gradient pill */}
                <Animated.View style={[styles.pill, pillStyle]}>
                    <LinearGradient
                        style={StyleSheet.absoluteFill}
                        colors={[themeManager.GetColor('main1'), themeManager.GetColor('main3')]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    />
                </Animated.View>

                {/** Cells */}
                {texts.map((text, index) => {
                    /** @type {StyleProp} */
                    const cellStyle = {
                        width: cellWidth,
                        borderColor: index === value ? 'transparent' : inactiveBorder
                    };
                    return (
                        <View
                            key={'tab-' + index}
                            ref={refs[index]}
                            collapsable={false}
                            style={[styles.cell, cellStyle]}
                        >
                            <TouchableOpacity
                                style={styles.touchable}
                                activeOpacity={0.7}
                                onPress={() => this.onChange(index)}
                            >
                                <Text fontSize={fontSize} color={index === value ? 'background' : 'primary'} bold>
                                    {text}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>
        );
    }
}

export { Tabs };
