import * as React from 'react';
import { Animated, View } from 'react-native';

import styles from './style';
import PopupBack from './back';
import themeManager from 'Managers/ThemeManager';

import { Button, Icon } from 'Interface/Components';
import { DynamicBackground } from 'Interface/Primitives';

/**
 * @template {any} T
 * @typedef {import('./back').PopupQueueType<T>} PopupQueueType
 */

class Popup extends PopupBack {
    render() {
        const { currents } = this.state;

        return currents.map((current) => (
            <React.Fragment key={`${current.ID}`}>{this.renderPopup(current)}</React.Fragment>
        ));
    }

    /**
     * @template {any} T
     * @param {PopupQueueType<T>} current
     * @returns {React.ReactNode}
     */
    renderPopup = (current) => {
        return (
            <Animated.View
                style={[styles.parent, { opacity: current.animOpacity }]}
                pointerEvents={current !== null ? 'auto' : 'none'}
            >
                {/* Background */}
                <View
                    style={styles.background}
                    onTouchStart={this.onBackgroundTouchStart}
                    onTouchEnd={this.onBackgroundTouchEnd}
                />

                {/* Cross */}
                {current.cancelable && (
                    <Button
                        style={styles.buttonQuit}
                        styleAnimation={{
                            transform: [{ translateX: current.animQuitPos.x }, { translateY: current.animQuitPos.y }]
                        }}
                        appearance='uniform'
                        color='transparent'
                        onPress={() => this.Close('closed')}
                    >
                        <Icon icon='close-outline' size={36} color='gradient' />
                    </Button>
                )}

                {/* Container */}
                <Animated.View
                    style={[
                        styles.container,
                        {
                            transform: [{ scale: current.animScale }],
                            backgroundColor: themeManager.GetColor('ground1')
                        }
                    ]}
                    onLayout={current.onLayout}
                >
                    <DynamicBackground style={styles.dynamicBackground} opacity={0.12} />
                    {current.content}
                </Animated.View>
            </Animated.View>
        );
    };
}

export { Popup };
