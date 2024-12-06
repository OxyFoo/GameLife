import * as React from 'react';
import { Animated, StyleSheet } from 'react-native';

import ZapBack from './back';

/**
 * @typedef {import('react-native').ImageProps} ImageProps
 * @typedef {import('./back').ZapOrientation} ZapOrientation
 *
 * @typedef {Omit<ImageProps & { orientation?: ZapOrientation }, 'source'>} ZapHighProps
 */

class Zap extends ZapBack {
    /** @param {ZapHighProps} props */
    static High = (props) => {
        /** @type {ZapOrientation} */
        const orientation = props.orientation || 'right';

        const zapStyle = {
            transform: [{ scaleX: orientation === 'left' ? -1 : 1 }]
        };

        return (
            <Animated.Image {...props} style={[styles.zap, zapStyle, props.style]} source={this.getHighZapImage()} />
        );
    };

    render() {
        const { style, position, orientation } = this.props;

        if (position === null) {
            return <Animated.Image style={[styles.zap, style]} onLayout={this.onLayout} source={this.getZapImage()} />;
        }

        return (
            <Animated.Image
                style={[
                    styles.zap,
                    styles.zapAbsolute,
                    {
                        transform: [
                            { translateX: position.x },
                            { translateY: position.y },
                            { scaleX: orientation === 'left' ? -1 : 1 }
                        ]
                    },
                    style
                ]}
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

export { Zap };
