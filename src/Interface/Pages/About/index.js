import * as React from 'react';
import { View, ScrollView, Image } from 'react-native';

import BackAbout from './back';
import styles from './style';
import langManager from 'Managers/LangManager';

import { Text, Icon } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

// @ts-ignore
const IMG_LOGO = require('Ressources/logo/GameLife_Text.png');

class About extends BackAbout {
    render() {
        const lang = langManager.curr['about'];

        return (
            <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
                <PageHeader style={styles.pageHeader} title={lang['title']} onBackPress={this.onBackPress} />

                {/** Header */}
                <View>
                    <Image style={styles.headerImage} source={IMG_LOGO} />
                    <Text style={styles.headerVersion} color='secondary' fontSize={22}>
                        {this.versionText}
                    </Text>
                </View>

                {/** Team */}
                <View>
                    <Text style={styles.title}>{lang['block-devs']}</Text>

                    <View style={styles.teamRow}>
                        <Text fontSize={18}>Pierre Marsaa</Text>
                        <Text fontSize={18} color='secondary'>
                            {lang['text-manager']}
                        </Text>
                    </View>

                    <View style={styles.teamRow}>
                        <Text fontSize={18}>Gérémy Lecaplain</Text>
                        <Text fontSize={18} color='secondary'>
                            {lang['text-developer']}
                        </Text>
                    </View>
                </View>

                {/** Contributors */}
                <View style={styles.contributorsView}>
                    <Text style={styles.title}>{lang['block-contributors']}</Text>
                    <Text style={styles.contributorsText} color='secondary'>
                        {lang['text-contributors']}
                    </Text>

                    <Text style={styles.contributorsSubText} color='secondary' fontSize={16}>
                        {this.contributors}
                    </Text>
                </View>

                {/** Links */}
                <View>
                    <Text style={styles.title}>{lang['block-links']}</Text>
                    <View style={styles.iconsRow}>
                        <Icon onPress={this.TiktokPress} icon='tiktok' />
                        <Icon onPress={this.InstaPress} icon='instagram' />
                        <Icon onPress={this.DiscordPress} icon='discord' />
                        <Icon onPress={this.GamelifePress} icon='loading' />
                    </View>
                </View>
            </ScrollView>
        );
    }
}

export default About;
