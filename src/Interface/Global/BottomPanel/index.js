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
        const { state, current, height, animOpacity } = this.state;

        const opened = state === 'opened';
        /** @type {StyleProp} */
        const styleParent = {
            bottom: user.interface?.navBar?.show ? user.interface?.navBar?.state?.height ?? 0 : 0,
            zIndex: current?.zIndex ?? 0,
            elevation: current?.zIndex ?? 0
        };
        /** @type {StyleProp} */
        const styleBackground = {
            opacity: Animated.multiply(animOpacity, 0.8)
        };
        /** @type {StyleProp} */
        const stylePanel = {
            minHeight: state === 'opened' ? height : undefined,
            opacity: animOpacity,
            transform: [{ translateY: Animated.add(this.state.animPosY, 48) }], // 48 = padding bottom to avoid animation glitch
            backgroundColor: themeManager.GetColor('ground1')
        };

        return (
            <View style={[styles.parent, styleParent]} pointerEvents={opened ? 'box-none' : 'none'}>
                {/* Background */}
                <Animated.View
                    style={[styles.background, styleBackground]}
                    onTouchStart={this.onTouchStart}
                    onTouchMove={this.onTouchMove}
                    onTouchEnd={this.onTouchEndBackground}
                />

                {/* Panel */}
                <Animated.View
                    style={[styles.panel, stylePanel]}
                    onTouchStart={this.onTouchStart}
                    onTouchMove={this.onTouchMove}
                    onTouchEnd={this.onTouchEnd}
                    onLayout={this.onLayoutPanel}
                >
                    <DynamicBackground opacity={0.15} />
                    {current?.content}
                </Animated.View>
            </View>
        );
    }
}

export { BottomPanel };
