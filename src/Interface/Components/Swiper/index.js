import * as React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

import SwiperBack from './back';
import themeManager from 'Managers/ThemeManager';

import Dots from '../../OldComponents/Dots';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 */

/**
 * @deprecated
 * @todo Finish the implementation
 */
class Swiper extends SwiperBack {
    render() {
        const { pages, style, onLayout, backgroundColor, borderRadius } = this.props;
        const { width, animHeight, positionX, positionDots } = this.state;

        if (pages.length === 0) return null;

        return (
            <Animated.View
                style={[
                    styles.parent,
                    {
                        height: animHeight,
                        backgroundColor: themeManager.GetColor(backgroundColor),
                        borderRadius: borderRadius
                    },
                    style
                ]}
                onLayout={onLayout}
                onTouchStart={this.onTouchStart}
                onTouchMove={this.onTouchMove}
                onTouchEnd={this.onTouchEnd}
                onTouchCancel={this.onTouchEnd}
            >
                <Animated.View
                    style={[
                        styles.contentContainer,
                        {
                            width: `${pages.length * 100}%`,
                            transform: [
                                {
                                    translateX: Animated.subtract(0, Animated.multiply(positionX, width))
                                }
                            ]
                        }
                    ]}
                >
                    {pages.map(this.renderContent)}
                </Animated.View>
                <Dots style={styles.dots} pagesLength={pages.length} position={positionDots} />
            </Animated.View>
        );
    }

    /**
     * @param {React.ReactNode} content
     * @param {number} index
     */
    renderContent = (content, index) => {
        const { pages, verticalAlign } = this.props;

        return (
            <View
                key={'page-' + index}
                style={[
                    styles.content,
                    {
                        width: `${100 / pages.length}%`,
                        justifyContent: verticalAlign
                    }
                ]}
                onLayout={this.onLayoutPage}
            >
                {content}
            </View>
        );
    };
}

const styles = StyleSheet.create({
    parent: {
        overflow: 'hidden'
    },
    contentContainer: {
        position: 'absolute',
        flexDirection: 'row'
    },
    content: {
        height: '100%',
        paddingBottom: 24
    },
    dots: {
        position: 'absolute',
        left: 0,
        bottom: 6,
        right: 0
    }
});

export { Swiper };
