import * as React from 'react';
import { View, Animated } from 'react-native';

import styles from './style';
import BottomPanelBack from './back';
import user from 'Managers/UserManager';
import themeManager from 'Managers/ThemeManager';

import { DynamicBackground } from 'Interface/Primitives';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 */

class BottomPanel extends BottomPanelBack {
    render() {
        const { state, current, animOpacity } = this.state;

        // Offset used to avoid animation void space at the bottom of the screen
        const offset = 24;
        const opened = state === 'opened';
        const navbarHeight = user.interface?.navBar?.show ? user.interface?.navBar?.state?.height ?? 0 : 0;

        /** @type {StyleProp} */
        const styleParent = {
            zIndex: current?.zIndex ?? 0,
            elevation: current?.zIndex ?? 0
        };

        /** @type {StyleProp} */
        const styleBackground = {
            opacity: Animated.multiply(animOpacity, 0.8)
        };

        /** @type {StyleProp} */
        const stylePanel = {
            minHeight: opened ? this.mover.panel.height : undefined,
            maxHeight: this.mover.panel.maxPosY,
            opacity: animOpacity,
            paddingBottom: navbarHeight + offset,
            transform: [{ translateY: Animated.add(this.mover.panel.posAnimY, offset) }],
            backgroundColor: themeManager.GetColor('ground1')
        };

        return (
            <View style={[styles.parent, styleParent]} pointerEvents={opened ? 'box-none' : 'none'}>
                {/* Background */}
                <Animated.View
                    style={[styles.background, styleBackground]}
                    onTouchStart={this.mover.touchStart}
                    onTouchMove={this.mover.touchMove}
                    onTouchEnd={this.onTouchEndBackground}
                />

                {/* Panel */}
                <Animated.View
                    style={[styles.panel, stylePanel]}
                    onTouchStart={this.mover.touchStart}
                    onTouchMove={this.mover.touchMove}
                    onTouchEnd={this.mover.touchEnd}
                    onLayout={this.onLayoutPanel}
                >
                    <DynamicBackground style={styles.gradient} opacity={0.15} />
                    {current?.content}
                </Animated.View>
            </View>
        );
    }
}

export { BottomPanel };
