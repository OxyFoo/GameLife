import * as React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

import SwiperBack from './back';
import themeManager from 'Managers/ThemeManager';

import Dots from '../Dots';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 */

class Swiper extends SwiperBack {
    renderContent = (p, index) => {
        const { pages, verticalAlign } = this.props;

        /** @type {StyleProp} */
        const pageWidth = {
            width: 100 / pages.length + '%',
            height: '100%',
            justifyContent: verticalAlign
        };

        return (
            <View
                key={'page-' + index}
                style={pageWidth}
                onLayout={this.onLayoutPage}
            >
                {p}
            </View>
        );
    }

    render() {
        const {
            pages, height, style, onLayout,
            backgroundColor, borderRadius
        } = this.props;
        const { width, animHeight, positionX, positionDots } = this.state;

        if (pages.length === 0) return null;

        const pagesContent = pages.map(this.renderContent);
        const contentContainerStyle = {
            transform: [{
                translateX: Animated.subtract(0, Animated.multiply(positionX, width))
            }],
            width: pages.length * 100 + '%'
        };

        return (
            <Animated.View
                style={[
                    styles.parent,
                    {
                        height: height || animHeight,
                        backgroundColor: themeManager.GetColor(backgroundColor),
                        borderRadius: borderRadius
                    },
                    style
                ]}
                onLayout={onLayout}
                onTouchStart={this.onTouchStart}
                onTouchMove={this.onTouchMove}
                onTouchEnd={this.onTouchEnd}
                onTouchCancel={this.onTouchCancel}
            >
                <Animated.View style={[styles.contentContainer, contentContainerStyle]}>
                    {pagesContent}
                </Animated.View>
                <Dots
                    style={styles.dots}
                    pagesLength={pages.length}
                    position={positionDots}
                />
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    parent: {
        overflow: 'hidden'
    },
    contentContainer: {
        position: 'absolute',
        flexDirection: 'row'
    },
    dots: {
        position: 'absolute',
        left: 0,
        bottom: 6,
        right: 0
    }
});

export default Swiper;
