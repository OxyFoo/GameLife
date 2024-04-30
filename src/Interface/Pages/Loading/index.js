import * as React from 'react';
import { Animated, View } from 'react-native';
import Config from 'react-native-config';

import styles from './style';
import BackLoading from './back';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { GLLoading, Button, Text, Icon, Zap } from 'Interface/Components';

class Loading extends BackLoading {
    render() {
        return (
            <View>
                {this.state.icon === 4 ?
                    this.renderTestCautionMessage() :
                    this.renderLoading()
                }
            </View>
        );
    }

    renderLoading() {
        return (
            <>
                <View
                    style={styles.content}
                    onTouchStart={this.onToucheStart}
                    onTouchEnd={this.onToucheEnd}
                >
                    <GLLoading state={this.state.icon} />
                </View>
                {this.renderVersionText()}
                <Text style={styles.sentence}>
                    {this.state.displayedSentence}
                </Text>
            </>
        );
    }

    renderTestCautionMessage() {
        const lang = langManager.curr['onboarding'];
        const smallScreen = user.interface.screenHeight < 600;
        const textSize = smallScreen ? 18 : 22;
        const buttonPosY = {
            transform: [{ translateY: Animated.multiply(300, this.state.animTestButton) }]
        };

        return (
            <View style={styles.contentTest}>
                <Icon style={styles.iconTest} icon='warning' size={84} />

                <Text fontSize={textSize}>
                    {lang['test-caution-message']}
                </Text>
                <Text onPress={this.handleDiscordRedirection} fontSize={textSize} color='main1'>
                    {lang['test-caution-redirect']}
                </Text>

                <Zap style={styles.zapTest} />

                <Button
                    style={styles.buttonTest}
                    styleAnimation={buttonPosY}
                    color='main1'
                    onPress={this.nextPage}
                >
                    {lang['test-caution-button']}
                </Button>
            </View>
        );
    }

    renderVersionText() {
        if (!Config?.ENV || Config.ENV === 'prod') {
            return null;
        }

        const env = Config.ENV.toUpperCase();
        const mode = __DEV__ ? 'DEBUG' : 'RELEASE';
        const bottomText = env + ' MODE - ' + mode;

        return (
            <Text style={styles.version}>
                {bottomText}
            </Text>
        );
    }
}

export default Loading;
