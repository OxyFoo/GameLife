import * as React from 'react';
import { Animated, View } from 'react-native';

import styles from './style';
import ScreenTutoBack from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import FadeInText from './fadeInText';
import { Button, Text, Zap, Icon } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 */

const ScreenTutoProps = {
    smallScreen: false
};

class ScreenTuto extends ScreenTutoBack {
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

                {this.renderButtonOverlay()}
                {this.renderDefaultButton()}

                {this.renderZap()}
                {this.renderZapMessage()}

                {this.renderSkipButton()}
                {this.renderStepText()}
            </View>
        );
    }

    renderTopPanel() {
        const { component } = this.state;

        /** @type {ViewStyle} */
        const styleTopPanel = {
            width: '100%',
            height: component.ref !== null ? component.position.y : '100%',
            opacity: component.ref !== null ? 0.6 : 0.4
        };

        return <Animated.View style={[styles.background, styleTopPanel]} />;
    }

    renderBottomPanel() {
        const { component } = this.state;
        if (component.ref === null) return null;

        const styleBottomPanel = {
            transform: [
                {
                    translateY: Animated.add(component.position.y, component.size.y)
                }
            ]
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

    renderButtonOverlay() {
        const { component } = this.state;
        if (component.ref === null) return null;

        const lang = langManager.curr['tuto']['other'];
        const styleOverlay = {
            top: component.position.y,
            left: component.position.x,
            width: component.size.x,
            height: component.size.y
        };
        const styleOverlayHint = {
            opacity: component.hintOpacity,
            backgroundColor: themeManager.GetColor('main1', { opacity: 0.6 })
        };

        return (
            <Animated.View style={[styles.overlay, styleOverlay]}>
                <Button
                    style={styles.overlayButton}
                    styleBackground={styles.overlayButtonBackground}
                    appearance='outline'
                    fontColor='black'
                    onPress={this.onComponentPress}
                >
                    <Animated.View style={[styles.overlayButtonInset, styleOverlayHint]}>
                        <Text containerStyle={styles.hintContainer} style={styles.hint}>
                            {lang['press']}
                        </Text>
                    </Animated.View>
                </Button>
            </Animated.View>
        );
    }

    renderDefaultButton() {
        const lang = langManager.curr['tuto']['other'];
        const { showNextButton } = this.state;

        if (!showNextButton) {
            return null;
        }

        return (
            <Button style={styles.nextButton} appearance='uniform' color='main1' onPress={this.onComponentPress}>
                <Text fontSize={16}>{lang['next']}</Text>
                <Icon icon='arrow-left' size={24} angle={180} />
            </Button>
        );
    }

    renderZap() {
        const { zap } = this.state;

        return (
            <View style={styles.zapContainer} pointerEvents='none'>
                <Zap
                    onLayout={this.onZapLayout}
                    position={zap.position}
                    inclinaison={zap.inclinaison}
                    face={zap.face}
                    orientation={zap.orientation}
                />
            </View>
        );
    }

    renderZapMessage() {
        const { smallScreen } = this.props;
        const { message } = this.state;
        const fontSize = message.fontSize !== null ? message.fontSize : 16;

        /** @type {ViewStyle} */
        const styleTextContainer = {
            top: 0,
            left: 0,
            width: '70%',
            borderColor: themeManager.GetColor('main2'),
            transform: [{ translateX: message.position.x }, { translateY: message.position.y }]
        };

        const styleText = { fontSize };
        if (fontSize !== null) {
            styleText.fontSize = fontSize;
        }
        if (smallScreen) {
            styleText.fontSize -= 4;
        }

        return (
            <Animated.View
                style={[styles.text, styleTextContainer]}
                onLayout={this.onMessageLayout}
                pointerEvents='none'
            >
                <FadeInText styleText={styleText}>{message.text}</FadeInText>
            </Animated.View>
        );
    }

    renderSkipButton() {
        const { showSkipButton } = this.state;
        const lang = langManager.curr['tuto']['other'];

        if (!showSkipButton) {
            return null;
        }

        return (
            <Button
                style={styles.skipButton}
                appearance='uniform'
                color='backgroundGrey'
                fontColor='primary'
                onPress={this.onSkipPress}
            >
                {lang['skip']}
            </Button>
        );
    }

    renderStepText() {
        const { currentIndex, componentsCount } = this.state;

        return (
            <View style={styles.stepText}>
                <Text fontSize={18}>{`${currentIndex} / ${componentsCount}`}</Text>
            </View>
        );
    }
}

ScreenTuto.prototype.props = ScreenTutoProps;
ScreenTuto.defaultProps = ScreenTutoProps;

export { ScreenTuto };
