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
 * @typedef {import('./back').BottomPanelStackItem} BottomPanelStackItem
 */

class BottomPanel extends BottomPanelBack {
    static contextType = SafeAreaInsetsContext;

    render() {
        const screenSize = Dimensions.get('window');
        const insets = /** @type {EdgeInsets | null} */ (this.context);
        const topInset = insets?.top || 0;
        const bottomInset = insets?.bottom || 0;
        const { stack } = this.state;

        // Offset used to avoid animation void space at the bottom of the screen
        const offset = 24;
        const navHeight = user.interface?.navBar?.state?.height ?? 24;
        const navbarHeight = user.interface?.navBar?.show ? navHeight : 0;

        return (
            <>
                {stack.map((stackItem, index) =>
                    this.renderPanel(stackItem, index, {
                        screenSize,
                        topInset,
                        bottomInset,
                        offset,
                        navbarHeight
                    })
                )}
            </>
        );
    }

    /**
     * Render a single panel
     * @param {BottomPanelStackItem} stackItem
     * @param {number} index
     * @param {object} config
     * @param {{width: number, height: number}} config.screenSize
     * @param {number} config.topInset
     * @param {number} config.bottomInset
     * @param {number} config.offset
     * @param {number} config.navbarHeight
     */
    renderPanel(stackItem, index, { screenSize, topInset, bottomInset, offset, navbarHeight }) {
        const { params, mover, animOpacity, state } = stackItem;
        const isActive = state === 'opened' || state === 'opening';
        const isClosing = state === 'closing';
        const isOverlayMode = params?.overlay === true;

        // Only apply zIndex for stacked panels (index > 0) to keep proper layering with NavBar
        const baseZIndex = params?.zIndex;
        const needsZIndex = baseZIndex !== undefined || index > 0;
        const panelZIndex = (baseZIndex ?? 0) + index;

        /** @type {StyleProp} */
        const styleParent = needsZIndex ? { zIndex: panelZIndex, elevation: panelZIndex } : {};

        /** @type {StyleProp} */
        const styleBackground = {
            opacity: Animated.multiply(animOpacity, index === 0 ? 0.8 : 0.5)
        };

        // Apply custom overlay color if provided
        if (params?.overlayColor) {
            styleBackground.backgroundColor = params.overlayColor;
        }

        /** @type {StyleProp} */
        const stylePanel = {
            minHeight: isActive ? mover.panel.height : undefined,
            maxHeight: mover.panel.maxPosY,
            opacity: animOpacity,
            paddingBottom: navbarHeight + bottomInset + offset,
            transform: [
                {
                    translateY: Animated.add(mover.panel.posAnimY, (screenSize.height || 0) - topInset + offset)
                }
            ],
            backgroundColor: params?.backgroundColor ?? themeManager.GetColor('ground1')
        };

        // Determine pointer events based on state
        const pointerEvents = isActive || isClosing ? 'box-none' : 'none';

        return (
            <View key={`bottom-panel-${index}`} style={[styles.parent, styleParent]} pointerEvents={pointerEvents}>
                {/* Background - only show for non-overlay panels */}
                {!isOverlayMode && (
                    <Animated.View
                        style={[styles.background, styleBackground]}
                        onTouchStart={mover.touchStart}
                        onTouchMove={mover.touchMove}
                        onTouchEnd={(e) => this.onTouchEndBackground(e, index)}
                    />
                )}

                {/* Panel */}
                <Animated.View
                    style={[styles.panel, stylePanel]}
                    onTouchStart={mover.touchStart}
                    onTouchMove={mover.touchMove}
                    onTouchEnd={mover.touchEnd}
                    onLayout={(e) => this.onLayoutPanel(e, index)}
                >
                    <DynamicBackground style={styles.gradient} opacity={0.15} />
                    {params?.content}
                </Animated.View>
            </View>
        );
    }
}

export { BottomPanel };
