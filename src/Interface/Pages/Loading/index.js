import * as React from 'react';
import { Animated, View } from 'react-native';

import styles from './style';
import BackLoading from './back';
import IconLoading from './IconLoading';
import langManager from 'Managers/LangManager';

import { Button, Text, Icon, Zap } from 'Interface/Components';
import { env } from 'Utils/Env';

class Loading extends BackLoading {
    render() {
        const { icon, showTestMessage, displayedSentence } = this.state;

        if (showTestMessage) {
            return this.renderTestCautionMessage();
        }

        return (
            <View>
                <View style={styles.content} onTouchStart={this.onToucheStart} onTouchEnd={this.onToucheEnd}>
                    <IconLoading state={icon} />
                </View>
                <View style={styles.textContainer}>
                    {this.renderVersionText()}
                    <Text>{displayedSentence}</Text>
                </View>
            </View>
        );
    }

    renderTestCautionMessage() {
        const lang = langManager.curr['onboarding'];
        const buttonPosY = {
            transform: [
                {
                    translateY: Animated.multiply(300, this.state.animTestButton)
                }
            ]
        };

        return (
            <View style={styles.contentTest}>
                <Icon style={styles.iconTest} icon='warning' size={84} />

                <Text fontSize={22}>{lang['test-caution-message']}</Text>
                <Text onPress={this.handleDiscordRedirection} fontSize={22} color='main1'>
                    {lang['test-caution-redirect']}
                </Text>

                <Zap style={styles.zapTest} />

                <Button style={styles.buttonTest} styleAnimation={buttonPosY} color='main1' onPress={this.nextPage}>
                    {lang['test-caution-button']}
                </Button>
            </View>
        );
    }

    renderVersionText() {
        if (env.ENV === 'prod') {
            return null;
        }

        const environment = env.ENV.toUpperCase();
        const mode = __DEV__ ? 'DEBUG' : 'RELEASE';

        return <Text>{`${environment} MODE - ${mode}`}</Text>;
    }
}

export default Loading;
