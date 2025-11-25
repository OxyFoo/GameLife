import * as React from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import styles from './style';
import BottomPanelBack from './back';
import user from 'Managers/UserManager';
import themeManager from 'Managers/ThemeManager';

import { DynamicBackground } from 'Interface/Primitives';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native-safe-area-context').EdgeInsets} EdgeInsets
 */

class BottomPanel extends BottomPanelBack {
    static contextType = SafeAreaInsetsContext;

    render() {
        const screenSize = Dimensions.get('window');
        const insets = /** @type {EdgeInsets | null} */ (this.context);
        const topInset = insets?.top || 0;
        const bottomInset = insets?.bottom || 0;
        const { state, current, animOpacity, isOverlayMode } = this.state;

        // Offset used to avoid animation void space at the bottom of the screen
        const offset = 24;
        const opened = state === 'opened';
        const navHeight = user.interface?.navBar?.state?.height ?? 24;
        const navbarHeight = user.interface?.navBar?.show ? navHeight : 0;

        /** @type {StyleProp} */
        const styleParent = {
            zIndex: current?.zIndex ?? 0,
            elevation: current?.zIndex ?? 0
        };

        /** @type {StyleProp} */
        const styleBackground = {
            opacity: Animated.multiply(animOpacity, 0.8)
        };

        // Apply custom overlay color if provided
        if (current?.overlayColor) {
            styleBackground.backgroundColor = current.overlayColor;
        }

        /** @type {StyleProp} */
        const stylePanel = {
            minHeight: opened ? this.mover.panel.height : undefined,
            maxHeight: this.mover.panel.maxPosY,
            opacity: animOpacity,
            paddingBottom: navbarHeight + bottomInset + offset,
            transform: [
                {
                    translateY: Animated.add(this.mover.panel.posAnimY, (screenSize.height || 0) - topInset + offset)
                }
            ],
            backgroundColor: current?.backgroundColor ?? themeManager.GetColor('ground1')
        };

        return (
            <View
                style={[styles.parent, styleParent]}
                pointerEvents={opened ? (isOverlayMode ? 'box-none' : 'box-none') : 'none'}
            >
                {/* Background */}
                {!isOverlayMode && (
                    <Animated.View
                        style={[styles.background, styleBackground]}
                        onTouchStart={this.mover.touchStart}
                        onTouchMove={this.mover.touchMove}
                        onTouchEnd={this.onTouchEndBackground}
                    />
                )}

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
