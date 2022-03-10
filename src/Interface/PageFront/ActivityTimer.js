import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import BackActivityTimer from '../PageBack/ActivityTimer';
import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

import { Page, Text, Button } from '../Components';
import { ActivityExperience } from '../Widgets';
import { DateToFormatTimeString } from '../../Utils/Date';

class ActivityTimer extends BackActivityTimer {
    render() {
        const lang = langManager.curr['activity'];
        const textLaunch = lang['timer-launch'] + ' ' + DateToFormatTimeString(this.state.startTime * 1000);
        const bt_cancel = lang['timer-cancel'];
        const bt_complete = lang['timer-complete'];
        const time = this.getTimer();

        return (
            <Page style={styles.content} bottomOffset={0}>
                <View>
                    <Text style={styles.title} fontSize={20}>{textLaunch}</Text>
                    <Text fontSize={48}>{time}</Text>
                </View>
                <View style={styles.row}>
                    <Button style={styles.button} color='background' onPress={this.onPressCancel}>{bt_cancel}</Button>
                    <Button style={styles.button} color='main1' onPress={this.onPressComplete}>{bt_complete}</Button>
                </View>

                <View>
                    <Text style={styles.title} fontSize={28}>{lang['timer-gain']}</Text>
                    <ActivityExperience
                        skillID={user.activities.currentActivity[0]}
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
    title: {
        marginBottom: 36
    },
    button: {
        width: '45%'
    }
});

export default ActivityTimer;