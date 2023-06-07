import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import BackActivityTimer from './back';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Page, Text, Button } from 'Interface/Components';
import { ActivityExperience } from 'Interface/Widgets';

class ActivityTimer extends BackActivityTimer {
    render() {
        if (user.activities.currentActivity === null) {
            return null;
        }

        const lang = langManager.curr['activity'];
        const { time, duration } = this.state;

        const textLaunch = lang['timer-launch'] + ' ' + this.displayInitialTime;
        const bt_cancel = lang['timer-cancel'];
        const bt_complete = lang['timer-complete'];

        return (
            <Page
                ref={ref => this.refPage = ref}
                style={styles.content}
            >
                {/* Title */}
                <View>
                    <Text style={styles.headText}>{textLaunch}</Text>
                    <Text fontSize={48}>{time}</Text>
                </View>

                {/* Buttons - Cancel / Done */}
                <View style={styles.row}>
                    <Button
                        style={styles.button}
                        color='background'
                        onPress={this.onPressCancel}
                    >
                        {bt_cancel}
                    </Button>

                    <Button
                        style={styles.button}
                        color='main1'
                        onPress={this.onPressComplete}
                    >
                        {bt_complete}
                    </Button>
                </View>

                {/* Informations */}
                <View>
                    <Text style={styles.title}>{lang['timer-gain']}</Text>
                    <ActivityExperience
                        skillID={user.activities.currentActivity.skillID}
                        duration={duration}
                    />
                </View>
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        height: '100%',
        justifyContent: 'space-evenly'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headText: {
        fontSize: 20,
        marginBottom: 36
    },
    title: {
        fontSize: 28,
        marginBottom: 36
    },
    button: {
        width: '45%'
    }
});

export default ActivityTimer;