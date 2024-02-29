import * as React from 'react';
import { Animated, StyleSheet } from 'react-native';

import InputBack from './back';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').ImageProps} ImageProps
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {Animated.WithAnimatedObject<import('react-native').ImageStyle>} StyleAnimProp
 * @typedef {import('./back').ZapOrientation} ZapOrientation
 * 
 * @typedef {Omit<ImageProps & { orientation?: ZapOrientation }, 'source'>} ZapHighProps
 */

class Zap extends InputBack {
    /** @param {ZapHighProps} props */
    static High = (props) => {
        /** @type {ZapOrientation} */
        const orientation = props.orientation || 'right';

        const zapStyle = {
            transform: [
                { scaleX: orientation === 'left' ? -1 : 1 }
            ]
        };

        return (
            <Animated.Image
                style={[styles.zap, zapStyle]}
                source={this.getHighZapImage()}
                {...props}
            />
        );
    }

    render() {
        const { position, orientation } = this.props;

        /** @type {StyleAnimProp} */
        const zapStyle = { ...styles.zap };
        if (position !== null) {
            // Add styles.zapAbsolute to the style
            for (const key in styles.zapAbsolute) {
                zapStyle[key] = styles.zapAbsolute[key];
            }

            zapStyle.transform = [
                { translateX: position.x },
                { translateY: position.y },
                { scaleX: orientation === 'left' ? -1 : 1 },
            ];
        }

        // Add props style to the style
        for (const key in Object(this.props.style)) {
            zapStyle[key] = this.props.style[key];
        }

        return (
            <Animated.Image
                style={zapStyle}
                onLayout={this.onLayout}
                source={this.getZapImage()}
            />
        );
    }
}

const styles = StyleSheet.create({
    zap: {
        width: 96,
        height: 96,
        resizeMode: 'contain'
    },
    zapAbsolute: {
        position: 'absolute',
        top: 0,
        left: 0
    }
});

export default Zap;
