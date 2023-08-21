import * as React from 'react';
import { Animated, View, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import ScreenTutoBack from './back';
import themeManager from 'Managers/ThemeManager';

import FadeInText from './fadeInText';
import { Button } from 'Interface/Components';

class ScreenTuto extends ScreenTutoBack {
    renderTopPanel() {
        const { component } = this.state;
        const screenHeight = user?.interface?.screenHeight || 0;
        const styleTopPanel = {
            bottom: Animated.subtract(screenHeight, component.position.y)
        };
        return <Animated.View style={[styles.background, styleTopPanel]} />;
    }

    renderBottomPanel() {
        const { component } = this.state;
        const styleBottomPanel = {
            transform: [{
                translateY: Animated.add(component.position.y, component.size.y)
            }]
        };
        return <Animated.View style={[styles.background, styleBottomPanel]} />;
    }

    renderLeftPanel() {
        const { component } = this.state;
        const styleLeftPanel = {
            top: component.position.y,
            width: component.position.x,
            height: component.size.y
        };
        return <Animated.View style={[styles.background, styleLeftPanel]} />;
    }

    renderRightPanel() {
        const { component } = this.state;
        const styleRightPanel = {
            top: component.position.y,
            left: Animated.add(component.position.x, component.size.x),
            height: component.size.y
        };
        return <Animated.View style={[styles.background, styleRightPanel]} />;
    }

    renderOverlay() {
        const { component } = this.state;
        const styleOverlay = {
            top: component.position.y,
            left: component.position.x,
            width: component.size.x,
            height: component.size.y,
            borderColor: themeManager.GetColor('main1'),
        };
        return (
            <Animated.View style={[styles.overlay, styleOverlay]}>
                <Button
                    style={{ flex: 1 }}
                    borderRadius={4}
                    onPress={this.End}
                />
            </Animated.View>
        );
    }

    renderZap() {
        const { zap } = this.state;
        const posX = Animated.subtract(zap.position.x, zap.layout.width / 2);
        const posY = Animated.subtract(zap.position.y, zap.layout.height / 2);

        return (
            <Animated.Image
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 96,
                    height: 96,
                    resizeMode: 'contain',
                    transform: [
                        { translateX: posX },
                        { translateY: posY },
                        { scaleX: zap.orientation === 'left' ? -1 : 1 },
                    ]
                }}
                onLayout={this.onZapLayout}
                source={this.getZapImage()}
            />
        );
    }

    renderZapText() {
        const { message } = this.state;

        const styleText = {
            top: message.position.y - message.layout.height / 2,
            left: message.position.x - message.layout.width / 2,
            width: '75%',
            borderColor: themeManager.GetColor('main2')
        };

        return (
            <Animated.View
                style={[styles.text, styleText]}
                onLayout={this.onMessageLayout}
            >
                <FadeInText styleText={{ fontSize: 24 }}>
                    {message.text}
                </FadeInText>
            </Animated.View>
        );
    }

    render() {
        const { visible } = this.state;
        if (!visible) return null;

        return (
            <View style={styles.parent}>

                {this.renderTopPanel()}
                {this.renderLeftPanel()}
                {this.renderRightPanel()}
                {this.renderBottomPanel()}

                {this.renderZap()}
                {this.renderZapText()}

                {this.renderOverlay()}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    parent: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    },
    overlay: {
        position: 'absolute',
        borderWidth: 2,
        borderRadius: 4
    },
    text: {
        position: 'absolute',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        backgroundColor: '#00000080',
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: .6,
        backgroundColor: '#000000'
    }
});

export default ScreenTuto;