import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import { Text } from 'Interface/Components';
import { TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').TextStyle} TextStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StylePropView
 * @typedef {import('react-native').StyleProp<TextStyle>} StylePropText
 */

const FadeInTextProps = {
    /** @type {string|null} */
    children: null,

    /** @type {StylePropView} */
    style: {},

    /** @type {StylePropText} */
    styleText: {}
};

class FadeInText extends React.Component {
    render() {
        const { style, styleText, children } = this.props;

        if (typeof(children) !== 'string') {
            user.interface.console.AddLog('warn', 'FadeInText', 'children is not a string');
            return null;
        }

        let index = 0;
        return (
            <View key={`content-${index}`} style={[styles.content, style]}>
                {children.split(' ').map((word) => 
                    <View key={`word-${index}`} style={styles.word}>
                        {word.split('').map((char) => (
                            <AnimatedChar
                                key={++index}
                                index={index}
                                char={char}
                                style={styleText}
                            />
                        ))}
                        <AnimatedChar
                            key={++index}
                            char={' '}
                            style={styleText}
                        />
                    </View>
                )}
            </View>
        );
    }
}

FadeInText.prototype.props = FadeInTextProps;
FadeInText.defaultProps = FadeInTextProps;

const AnimatedChar = ({ index = 0, char, style }) => {
    // Empty char don't need animation
    if (char === ' ') {
        return (
            <Text style={[styles.character, style]}>{char}</Text>
        );
    }

    const opacity = useRef(new Animated.Value(0)).current;
    const styleOpacity = { opacity: opacity };
    const styleTranslateY = {
        transform: [
            {
                translateY: opacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [8, 0]
                })
            }
        ]
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            TimingAnimation(opacity, 1, 350).start();
        }, 500 + 25 * index);

        return () => clearTimeout(timeout);
    }, [ opacity ]);

    return (
        <Animated.View style={[styleOpacity, styleTranslateY]}>
            <Text style={[styles.character, style]}>{char}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    content: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    word: {
        flexDirection: 'row'
    },
    character: {
        fontSize: 36,
        color: '#FFFFFF'
    }
});

export default FadeInText;