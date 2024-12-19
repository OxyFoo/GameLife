import * as React from 'react';
import { View, Animated, StyleSheet, Platform } from 'react-native';

import Dots from './dots';
import SwiperBack from './back';
import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 */

class Swiper extends SwiperBack {
    render() {
        const { pages, style, minHeight: height, onLayout, backgroundColor, borderRadius } = this.props;
        const { width, positionX, positionDots } = this.state;

        if (pages.length === 0) return null;

        /** @type {ViewStyle} */
        const cardStyle = {
            backgroundColor: themeManager.GetColor(backgroundColor),
            borderRadius: borderRadius
        };

        return (
            <Animated.View style={[!height ? styles.parent : styles.parentFixed, style, { maxHeight: height }]}>
                <Animated.View
                    style={[!height ? styles.container : styles.containerFixed, cardStyle]}
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
        flex: 1,
        overflow: 'hidden'
    },
    parentFixed: {
        overflow: 'hidden'
    },
    container: {
        flex: 1,
        marginBottom: 12, // Space at the top of the dots
        paddingBottom: Platform.OS === 'ios' ? 24 * 3 : 24, // TODO: Why ? Where the bottom space on iOS from ?
        overflow: 'hidden'
    },
    containerFixed: {
        marginBottom: 12, // Space at the top of the dots
        overflow: 'hidden'
    },
    contentContainer: {
        flexDirection: 'row'
    },
    dots: {
        marginBottom: 12 // Space at the bottom of the dots
    }
});

export { Swiper };
