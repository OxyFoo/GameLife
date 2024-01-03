import * as React from 'react';
import { Animated, View } from 'react-native';

import styles from './style';
import ScreenTutoBack from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import FadeInText from './fadeInText';
import { Button, Text, Zap, Icon } from 'Interface/Components';

const ScreenTutoProps = {
    smallScreen: false
};

class ScreenTuto extends ScreenTutoBack {
    renderTopPanel(zapSideToMessage) {
        const { component } = this.state;
        const styleTopPanel = {
            width: '100%',
            height: component.ref !== null ? component.position.y : '100%',
            opacity: zapSideToMessage ? .4 : component.ref !== null ? .8 : .6
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

        const lang = langManager.curr['tuto']['other'];
        const styleOverlay = {
            top: component.position.y,
            left: component.position.x,
            width: component.size.x,
            height: component.size.y,
            borderColor: themeManager.GetColor('main1'),
        };
        const styleOverlayHint = {
            opacity: message.hintOpacity,
            backgroundColor: themeManager.GetColor('main1', { opacity: 0.6 })
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
                            {lang['press']}
                        </Text>
                    </Animated.View>
                </Button>
            </Animated.View>
        );
    }

    renderDefaultButton() {
        const { component, showButton } = this.state;
        if (component.ref !== null && !showButton) return null;

        const lang = langManager.curr['tuto']['other'];

        return (
            <Animated.View style={styles.defaultButtonArrowContainer}>
                <Button
                    style={styles.defaultButton}
                    color='main1'
                    borderRadius={4}
                    onPress={this.onComponentPress}
                >
                    <Icon icon='arrowLeft' size={24} angle={180} />
                    {/*lang['button']*/}
                </Button>
            </Animated.View>
        );
    }

    renderZapMessage() {
        const { smallScreen } = this.props;
        const { message, fontSize } = this.state;

        const styleTextContainer = {
            top: 0,
            left: '10%',
            width: '70%',
            borderColor: themeManager.GetColor('main2'),
            transform: [
                { translateX: message.position.x },
                { translateY: message.position.y }
            ]
        };
        const styleText = {
            fontSize: fontSize !== null && fontSize ? !smallScreen ? fontSize : fontSize - 4 : 16,
        };

        return (
            <Animated.View
                style={[styles.text, styleTextContainer]}
                onLayout={this.onMessageLayout}
            >
                <FadeInText styleText={styleText}>
                    {message.text}
                </FadeInText>
            </Animated.View>
        );
    }

    renderSkipButton() {
        const lang = langManager.curr['tuto']['other'];

        return (
            <Button
                style={styles.skipButton}
                color='transparent'
                colorText='main1'
                onPress={this.onSkipPress}
            >
                {lang['skip']}
            </Button>
        );
    }

    render() {
        const { visible, zapSideToMessage } = this.state;
        if (!visible) return null;

        return (
            <View style={styles.parent}>

                {/** Background */}
                {this.renderTopPanel(zapSideToMessage)}
                {this.renderLeftPanel()}
                {this.renderRightPanel()}
                {this.renderBottomPanel()}

                <Zap ref={ref => this.refZap = ref} />
                {this.renderZapMessage()}

                {this.renderSkipButton()}

                {this.renderOverlay()}
                {this.renderDefaultButton()}

            </View>
        );
    }
}

ScreenTuto.prototype.props = ScreenTutoProps;
ScreenTuto.defaultProps = ScreenTutoProps;

export default ScreenTuto;
