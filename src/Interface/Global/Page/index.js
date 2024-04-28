import * as React from 'react';
import { View, Animated, ScrollView } from 'react-native';

import styles from './style';
import PageBack from './back';
import user from 'Managers/UserManager';
import themeManager from 'Managers/ThemeManager';

class Page extends PageBack {
    renderTopOverlay() {
        if (this.props.topOverlay === null) return null;

        const { topOverlay, topOverlayHeight } = this.props;

        const animation = Animated.multiply(this.topOverlayPosition, -(topOverlayHeight + 32));
        const position = { transform: [{ translateY: animation }] };
        const backgroundColor = { backgroundColor: themeManager.GetColor('main3') };
        const borderColor = { borderColor: themeManager.GetColor('main1') };

        return (
            <Animated.View
                style={[
                    styles.topOverlay,
                    position,
                    borderColor,
                    backgroundColor
                ]}
            >
                <View style={[styles.topOverlayLine, backgroundColor]} />
                {topOverlay}
            </Animated.View>
        );
    }

    render() {
        const { scrollEnabled, pointerEvents } = this.state;
        const {
            style, isHomePage,
            topOffset, bottomOffset,
            scrollable, overlay
        } = this.props;

        const headerHeight = user.interface.header.state.height;
        const valueOffset = isHomePage ? headerHeight : topOffset;

        const styleOpacity = {
            opacity: this.opacity
        };
        const styleParent = {
            ...styles.parent,
            transform: [
                { translateY: this.positionY }
            ],
            paddingTop: valueOffset,
            //height: scrollable ? 'auto' : '100%',
            minHeight: user.interface.screenHeight - topOffset - bottomOffset - 128
        };

        return (
            <Animated.View style={styles.container}>
                <ScrollView
                    style={styles.parent}
                    contentContainerStyle={styles.parentContainer}
                    scrollEnabled={scrollEnabled}
                >
                    {this.props.children}
                </ScrollView>
            </Animated.View>
        );

        return (
            <Animated.View
                style={[styles.container, styleOpacity]}
                pointerEvents={pointerEvents}
            >
                <Animated.View
                    style={[styleParent, style]}
                    onLayout={this.scrolling.onLayout}
                    onTouchStart={this.scrolling.onTouchStart}
                    onTouchMove={this.scrolling.onTouchMove}
                    onTouchEnd={this.scrolling.onTouchEnd}
                    onStartShouldSetResponder={this.props.onStartShouldSetResponder}
                >
                    {this.props.children}
                </Animated.View>
                <Animated.View style={styles.footer}>
                    {this.props.footer}
                </Animated.View>
                {overlay}
                {this.renderTopOverlay()}
            </Animated.View>
        );
    }
}

export default Page;
