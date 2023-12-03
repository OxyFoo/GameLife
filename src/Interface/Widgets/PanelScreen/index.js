import * as React from 'react';
import { View, Animated } from 'react-native';

import styles from './style';
import PanelScreenBack from './back';
import themeManager from 'Managers/ThemeManager';

class PanelScreen extends PanelScreenBack {
    render() {
        const { opened, anim } = this.state;
        const { containerStyle, disableBackground } = this.props;

        const opacity = { opacity: anim };
        const event = opened ? 'box-none' : 'none';
        const stylePanel = {
            minHeight: this.height,
            transform: [{ translateY: this.state.positionY }],
            backgroundColor: themeManager.GetColor('backgroundCard')
        };

        return (
            <Animated.View
                style={[styles.parent, opacity]}
                pointerEvents={event}
            >
                {!disableBackground && (
                    <View
                        style={styles.background}
                        onTouchStart={this.onTouchStart}
                        onTouchMove={this.onTouchMove}
                        onTouchEnd={this.onTouchEnd}
                    />
                )}
                <Animated.View
                    style={[
                        styles.panel,
                        stylePanel,
                        containerStyle
                    ]}
                    onTouchStart={this.onTouchStart}
                    onTouchMove={this.onTouchMove}
                    onTouchEnd={this.onTouchEnd}
                    onLayout={this.onLayoutPanel}
                >
                    {this.props.children}
                </Animated.View>
            </Animated.View>
        );
    }
}

export default PanelScreen;
