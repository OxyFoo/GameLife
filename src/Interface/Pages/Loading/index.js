import * as React from 'react';
import { View } from 'react-native';
import Config from 'react-native-config';

import styles from './style';
import BackLoading from './back';
import langManager from 'Managers/LangManager';

import { Page, GLLoading, Button, Text, Icon, Zap } from 'Interface/Components';
import { GetDate } from 'Utils/Time';

class Loading extends BackLoading {
    render() {
        return (
            <Page ref={ref => this.refPage = ref} scrollable={false}>
                {this.state.icon === 4 ?
                    this.renderTestCautionMessage() :
                    this.renderLoading()
                }
            </Page>
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
        const isNight = GetDate().getHours() >= 20 || GetDate().getHours() <= 8;

        return (
            <>
                <View style={styles.contentTest}>
                    <Icon style={styles.iconTest} icon='warning' size={84} />

                    <Text fontSize={22}>
                        {lang['test-caution-message']}
                    </Text>

                    <Zap style={styles.zapTest} color={isNight ? 'night' : 'day'} />
                </View>

                <View style={styles.buttonTestContent}>
                    <Button
                        style={styles.buttonTest}
                        styleAnimation={{ opacity: this.state.animTestButton }}
                        color='main1'
                        onPress={this.nextPage}
                    >
                        {lang['test-caution-button']}
                    </Button>
                </View>
            </>
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
