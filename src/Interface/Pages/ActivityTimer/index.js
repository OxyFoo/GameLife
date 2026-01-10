import * as React from 'react';
import { View, Animated, TouchableOpacity, Image } from 'react-native';

import styles from './style';
import BackActivityTimer from './back';
import ActivityTimerTitle from './Sections/title';
import ActivityTimerTimer from './Sections/timer';
import ActivityTimerFriends from './Sections/friends';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Text, Button } from 'Interface/Components';

import IMG_MUSIC from 'Ressources/logo/music/music';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Global/Links').MusicLinksKeys} MusicLinksKeys
 */

class ActivityTimer extends BackActivityTimer {
    render() {
        const lang = langManager.curr['activity'];
        const { loading, currentActivity } = this.state;
        if (currentActivity === null) {
            return null;
        }

        const bt_cancel = lang['timer-cancel'];
        const bt_complete = lang['timer-complete'];

        const musicKeys = /** @type {MusicLinksKeys[]} */ (Object.keys(user.settings.musicLinks));

        return (
            <View style={styles.content}>
                {/* Top Section - Title + Friends */}
                <View style={styles.topSection}>
                    <ActivityTimerTitle currentActivity={currentActivity} />
                    <ActivityTimerFriends currentActivity={currentActivity} />
                </View>

                {/* Center Section - Timer + Music */}
                <View style={styles.centerSection}>
                    <ActivityTimerTimer currentActivity={currentActivity} />
                    <View style={styles.musicSection}>
                        <Text style={styles.musicTitle}>{lang['timer-music']}</Text>
                        <View style={styles.imageMap}>{musicKeys.map(this.renderMusic)}</View>
                    </View>
                </View>

                {/* Bottom Section - Buttons */}
                <View style={styles.bottomSection}>
                    <View style={styles.row}>
                        <Button style={styles.button} appearance='outline' onPress={this.onPressCancel}>
                            {bt_cancel}
                        </Button>

                        <Button
                            style={[styles.button, styles.finishButton]}
                            onPress={this.onPressComplete}
                            loading={loading}
                        >
                            {bt_complete}
                        </Button>
                    </View>
                </View>
            </View>
        );
    }

    /**
     * @param {MusicLinksKeys} musicKey
     * @param {number} _index
     * @param {MusicLinksKeys[]} _array
     * @returns {React.ReactNode}
     */
    renderMusic = (musicKey, _index, _array) => {
        const animStyle = {
            opacity: this.animations[musicKey].interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
            }),
            transform: [{ translateY: Animated.multiply(128, this.animations[musicKey]) }]
        };

        return (
            <Animated.View key={'music-link-' + musicKey} style={animStyle}>
                <TouchableOpacity onPress={() => this.openURL(musicKey)}>
                    <Image style={styles.image} source={IMG_MUSIC[musicKey]} />
                </TouchableOpacity>
            </Animated.View>
        );
    };
}

export default ActivityTimer;
