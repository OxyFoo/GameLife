import * as React from 'react';
import { View, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';

import BackActivityTimer from './back';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Page, Text, Button } from 'Interface/Components';
import { ActivityExperience } from 'Interface/Widgets';

import IMG_MUSIC from 'Ressources/logo/music/music';

/**
 * @typedef {import('Class/Settings').MusicLinks} MusicLinks
 */

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_SIZE = SCREEN_WIDTH * 0.8 / (Object.keys(user.settings.musicLinks).length + 2); 

class ActivityTimer extends BackActivityTimer {
    render() {
        if (user.activities.currentActivity === null) {
            return null;
        }

        const lang = langManager.curr['activity'];
        const {
            displayActivity,
            displayInitialTime,
            displayCurrentTime,
            duration
        } = this.state;

        const textLaunch = lang['timer-launch'] + ' ' + displayInitialTime;
        const bt_cancel = lang['timer-cancel'];
        const bt_complete = lang['timer-complete'];

        const musicKeys =
            /** @type {(keyof MusicLinks)[]} */
            (Object.keys(user.settings.musicLinks));

        return (
            <Page
                ref={ref => this.refPage = ref}
                style={styles.content}
            >
                {/* Title */}
                <View>
                    <Text style={styles.headActivityText}>{displayActivity}</Text>
                    <Text style={styles.headText}>{textLaunch}</Text>
                    <Text fontSize={48}>{displayCurrentTime}</Text>
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

                {/* Zap'N'Music */}
                <View>
                    <Text style={styles.musicTitle}>{lang['timer-music']}</Text>
                    <View style={styles.imageMap}>
                        {musicKeys.map(this.renderMusic)}
                    </View>
                </View>
            </Page>
        );
    }

    /**
     * @param {keyof MusicLinks} musicKey
     * @param {number} index
     */
    renderMusic = (musicKey, index) => {
        return (
            <TouchableOpacity
                key={'music-link-' + musicKey}
                onPress={() => this.openURL(musicKey)}
            >
                <Image
                    style={styles.image}
                    source={IMG_MUSIC[index]}
                />
            </TouchableOpacity>
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
    headActivityText: {
        fontSize: 36
    },
    headText: {
        fontSize: 20
    },
    title: {
        fontSize: 28
    },
    button: {
        width: '45%'
    },
    musicTitle: {
        fontSize: 22
    },
    imageMap: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%'
    },
    image: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        resizeMode: 'contain',
        marginTop: 10
    }
});

export default ActivityTimer;
