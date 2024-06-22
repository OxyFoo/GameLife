import * as React from 'react';
import { Animated, View } from 'react-native';

import styles from './style';
import PopupBack from './back';

import { Button, Icon } from 'Interface/Components';
import { DynamicBackground } from 'Interface/Primitives';

/**
 * @template {[ data: any, closeReason: any ]} T
 * @typedef {import('./back').PopupType<T>} PopupType
 */

class Popup extends PopupBack {
    render() {
        const { currents } = this.state;

        return (
            <>
                {currents.map((current, i) => (
                    <React.Fragment key={i}>{this.renderPopup(current)}</React.Fragment>
                ))}
            </>
        );
    }

    /**
     * @template {[ data: any, closeReason: any ]} T
     * @param {PopupType<T>} current
     * @returns {React.ReactNode}
     */
    renderPopup = (current) => {
        return (
            <Animated.View
                style={[styles.parent, { opacity: this.state.animOpacity }]}
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
                            transform: [
                                { translateX: this.state.animQuitPos.x },
                                { translateY: this.state.animQuitPos.y }
                            ]
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
                            transform: [{ scale: this.state.animScale }]
                        }
                    ]}
                    onLayout={this.onLayout}
                >
                    <DynamicBackground style={styles.dynamicBackground} opacity={0.12} />
                    {current.content(this.Close)}
                </Animated.View>
            </Animated.View>
        );
    };
}

export { Popup };
export { POPUP_TEMPLATES } from './templates';
