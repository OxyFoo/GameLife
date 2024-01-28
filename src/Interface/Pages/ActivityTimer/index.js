import * as React from 'react';
import { View, Animated, TouchableOpacity, Image } from 'react-native';

import styles from './style';
import BackActivityTimer from './back';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Page, Text, Button } from 'Interface/Components';
import { ActivityExperience } from 'Interface/Widgets';

import IMG_MUSIC from 'Ressources/logo/music/music';

/**
 * @typedef {import('Class/Settings').MusicLinks} MusicLinks
 */

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
        const animStyle = {
            opacity: this.animations[musicKey].interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
            }),
            transform: [
                { translateY: Animated.multiply(128, this.animations[musicKey]) }
            ]
        };

        return (
            <Animated.View key={'music-link-' + musicKey} style={animStyle}>
                <TouchableOpacity onPress={() => this.openURL(musicKey)}>
                    <Image
                        style={styles.image}
                        source={IMG_MUSIC[index]}
                    />
                </TouchableOpacity>
            </Animated.View>
        );
    }
}

export default ActivityTimer;
