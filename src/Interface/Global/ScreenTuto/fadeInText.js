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
    /** @type {string | null} */
    children: null,

    /** @type {StylePropView} */
    style: {},

    /** @type {StylePropText} */
    styleText: {}
};

/**
 * Parse markdown-like syntax and return array of segments with formatting
 * Supports: **bold**, *italic*, __underline__
 * @param {string} text
 * @returns {Array<{text: string, bold: boolean, italic: boolean, underline: boolean}>}
 */
const parseMarkdown = (text) => {
    /** @type {Array<{text: string, bold: boolean, italic: boolean, underline: boolean}>} */
    const segments = [];

    // Regex to match markdown patterns: **bold**, *italic*, __underline__
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|__(.+?)__)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        // Add text before match
        if (match.index > lastIndex) {
            segments.push({
                text: text.slice(lastIndex, match.index),
                bold: false,
                italic: false,
                underline: false
            });
        }

        // Determine formatting type
        const fullMatch = match[0];
        if (fullMatch.startsWith('**')) {
            segments.push({ text: match[2], bold: true, italic: false, underline: false });
        } else if (fullMatch.startsWith('__')) {
            segments.push({ text: match[4], bold: false, italic: false, underline: true });
        } else if (fullMatch.startsWith('*')) {
            segments.push({ text: match[3], bold: false, italic: true, underline: false });
        }

        lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
        segments.push({
            text: text.slice(lastIndex),
            bold: false,
            italic: false,
            underline: false
        });
    }

    // If no markdown found, return original text
    if (segments.length === 0) {
        segments.push({ text, bold: false, italic: false, underline: false });
    }

    return segments;
};

class FadeInText extends React.Component {
    render() {
        const { style, styleText, children } = this.props;

        if (typeof children !== 'string') {
            user.interface?.console?.AddLog('warn', 'FadeInText', 'children is not a string');
            return null;
        }

        let index = 0;
        const lines = children.split('\n');

        return (
            <View key={`content-${index}-${children}`} style={[styles.content, style]}>
                {lines.map((line, lineIndex) => (
                    <React.Fragment key={`line-${lineIndex}`}>
                        {parseMarkdown(line).map((segment, segmentIndex) => {
                            /** @type {TextStyle} */
                            const segmentStyle = {
                                ...(segment.bold && { fontWeight: 'bold' }),
                                ...(segment.italic && { fontStyle: 'italic' }),
                                ...(segment.underline && {
                                    textDecorationLine: 'underline'
                                })
                            };

                            return segment.text.split(' ').map((word) => (
                                <View key={`word-${index}-${segmentIndex}`} style={styles.word}>
                                    {word.split('').map((char) => (
                                        <AnimatedChar
                                            key={'char-' + (++index).toString()}
                                            index={index}
                                            char={char}
                                            style={[styleText, segmentStyle]}
                                        />
                                    ))}
                                    <AnimatedChar key={++index} char={' '} style={[styleText, segmentStyle]} />
                                </View>
                            ));
                        })}
                        {lineIndex < lines.length - 1 && <View style={styles.lineBreak} />}
                    </React.Fragment>
                ))}
            </View>
        );
    }
}

FadeInText.prototype.props = FadeInTextProps;
FadeInText.defaultProps = FadeInTextProps;

/**
 * @param {object} props
 * @param {number} [props.index]
 * @param {string} props.char
 * @param {StylePropText} props.style
 */
const AnimatedChar = ({ index = 0, char, style }) => {
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
        const timeout = setTimeout(
            () => {
                TimingAnimation(opacity, 1, 350).start();
            },
            500 + 12 * index
        );

        return () => clearTimeout(timeout);
    }, [index, opacity]);

    // Empty char don't need animation
    if (char === ' ') {
        return <Text style={[styles.character, style]}>{char}</Text>;
    }

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
    lineBreak: {
        width: '100%',
        height: 8
    },
    character: {
        fontSize: 36,
        color: '#FFFFFF'
    }
});

export default FadeInText;
