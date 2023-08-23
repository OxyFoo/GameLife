import * as React from 'react';
import { Animated, View } from 'react-native';

import styles from './style';
import ScreenTutoBack from './back';
import themeManager from 'Managers/ThemeManager';

import FadeInText from './fadeInText';
import { Button, Text, Zap } from 'Interface/Components';
import langManager from 'Managers/LangManager';

class ScreenTuto extends ScreenTutoBack {
    renderTopPanel() {
        const { component } = this.state;
        const styleTopPanel = {
            width: '100%',
            height: component.ref !== null ? component.position.y : '100%',
            opacity: component.ref !== null ? .6 : .3
        };
        return <Animated.View style={[styles.background, styleTopPanel]} />;
    }

    renderBottomPanel() {
        const { component } = this.state;
        if (component.ref === null) return null;

        const styleBottomPanel = {
            transform: [{
                translateY: Animated.add(component.position.y, component.size.y)
            }]
        };
        return <Animated.View style={[styles.background, styleBottomPanel]} />;
    }

    renderLeftPanel() {
        const { component } = this.state;
        if (component.ref === null) return null;

        const styleLeftPanel = {
            top: component.position.y,
            width: component.position.x,
            height: component.size.y
        };
        return <Animated.View style={[styles.background, styleLeftPanel]} />;
    }

    renderRightPanel() {
        const { component } = this.state;
        if (component.ref === null) return null;

        const styleRightPanel = {
            top: component.position.y,
            left: Animated.add(component.position.x, component.size.x),
            height: component.size.y
        };
        return <Animated.View style={[styles.background, styleRightPanel]} />;
    }

    renderOverlay() {
        const { component, message } = this.state;
        if (component.ref === null) return null;

        const lang = langManager.curr['other'];
        const styleOverlay = {
            top: component.position.y,
            left: component.position.x,
            width: component.size.x,
            height: component.size.y,
            borderColor: themeManager.GetColor('main1'),
        };
        const styleOverlayHint = {
            opacity: message.hintOpacity,
            backgroundColor: themeManager.GetColor('main1', 0.6)
        };

        return (
            <Animated.View style={[styles.overlay, styleOverlay]}>
                <Button
                    style={styles.overlayButton}
                    borderRadius={4}
                    onPress={this.onComponentPress}
                >
                    <Animated.View style={[styles.overlayButton, styleOverlayHint]}>
                        <Text containerStyle={styles.hintContainer} style={styles.hint}>
                            {lang['tuto-press']}
                        </Text>
                    </Animated.View>
                </Button>
            </Animated.View>
        );
    }

    renderDefaultButton() {
        const { component, showButton } = this.state;
        if (component.ref !== null && !showButton) return null;

        const lang = langManager.curr['other'];

        return (
            <Animated.View style={styles.defaultButtonContainer}>
                <Button
                    style={styles.defaultButton}
                    color='main1'
                    borderRadius={4}
                    onPress={this.onComponentPress}
                >
                    {lang['tuto-button']}
                </Button>
            </Animated.View>
        );
    }

    renderZapMessage() {
        const { message } = this.state;

        const styleText = {
            top: 0,
            left: 0,
            width: '75%',
            borderColor: themeManager.GetColor('main2'),
            transform: [
                { translateX: message.position.x },
                { translateY: message.position.y }
            ]
        };

        return (
            <Animated.View
                style={[styles.text, styleText]}
                onLayout={this.onMessageLayout}
            >
                <FadeInText styleText={styles.textFade}>
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

                {/** Background */}
                {this.renderTopPanel()}
                {this.renderLeftPanel()}
                {this.renderRightPanel()}
                {this.renderBottomPanel()}

                <Zap ref={ref => this.refZap = ref } />
                {this.renderZapMessage()}

                {this.renderOverlay()}
                {this.renderDefaultButton()}

            </View>
        );
    }
}

export default ScreenTuto;