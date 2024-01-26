import * as React from 'react';
import { View, StyleSheet, Image, Dimensions, FlatList, TouchableOpacity, Linking } from 'react-native';

import BackActivityTimer from './back';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Page, Text, Button } from 'Interface/Components';
import { ActivityExperience } from 'Interface/Widgets';

import IMG_MUSIC from 'Ressources/logo/music/music';

// TODO : faudrait foutre ces liens dans la bdd comme ca on est trql pour les changer
const images = [
    { key: '0', 'link': 'https://open.spotify.com/playlist/2qMPv8Re0IW2FzBGjS7HCG' },
    { key: '1', 'link': 'https://music.apple.com/fr/playlist/zapnmusic-for-work/pl.u-JPAZEomsDXLGvEb' },
    { key: '2', 'link': 'https://music.youtube.com/playlist?list=PLBo5aRk85uWnkkflI9Of9ecRn8e3SsclZ&si=6szeIToboXpBVot7' },
    { key: '3', 'link': 'https://deezer.page.link/huyVFejy9ce3m7YY8' },
]

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_SIZE = SCREEN_WIDTH * 0.8 / (images.length + 2); 

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

        const openURL = (url) => {
            Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
        };

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
                    <View
                        style={styles.imageMap}>
                        {images.map((item, index) => (
                            <TouchableOpacity key={item.key} onPress={() => openURL(item.link)}>
                                <Image
                                    source={IMG_MUSIC[parseInt(item.key)]}
                                    style={styles.image}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
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
    headActivityText: {
        fontSize: 36,
    },
    headText: {
        fontSize: 20,
    },
    title: {
        fontSize: 28,
    },
    button: {
        width: '45%'
    },
    musicTitle: {
        fontSize: 22,
    },
    imageMap: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
    },
    image: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        resizeMode: 'contain',
        marginTop: 10,
    },
});

export default ActivityTimer;
