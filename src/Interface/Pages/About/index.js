import * as React from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';

import BackAbout from './back';
import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { PageHeader } from 'Interface/Widgets';
import { Page, Text, Icon } from 'Interface/Components';

class About extends BackAbout {
    renderContributor({ item: contributor }) {
        return (
            <TouchableOpacity activeOpacity={.8}>
                <Text>{contributor.value}</Text>
            </TouchableOpacity>
        );
    }

    render() {
        const lang = langManager.curr['about'];

        return (
            <Page ref={ref => this.refPage = ref} scrollable={false}>
                <PageHeader
                    style={styles.pageHeader}
                    onBackPress={user.interface.BackPage}
                    hideHelp
                />

                <View style={styles.content}>

                    {/** Header - Version & Team */}
                    <View>
                        <Text style={styles.headerVersion} color='secondary' fontSize={22}>{this.versionText}</Text>
                        <Text style={styles.headerTitle} fontSize={34}>{lang['block-devs']}</Text>

                        <View style={styles.headerRow}>
                            <Text fontSize={22}>Pierre Marsaa</Text>
                            <Text fontSize={22} color='secondary'>{lang['text-manager']}</Text>
                        </View>

                        <View style={styles.headerRow}>
                            <Text fontSize={22}>Gérémy Lecaplain</Text>
                            <Text fontSize={22} color='secondary'>{lang['text-developer']}</Text>
                        </View>
                    </View>

                    {/** Contributors */}
                    <View style={styles.contributorsView}>
                        <Text fontSize={34}>{lang['block-contributors']}</Text>
                        <Text style={styles.contributorsText} color='secondary' fontSize={22}>{lang['text-contributors']}</Text>

                        <View style={styles.contributorsFlatlist}>
                            <FlatList
                                data={this.contributors}
                                keyExtractor={(item, i) => 'contributors_' + i}
                                renderItem={this.renderContributor}
                            />
                        </View>
                    </View>

                    {/** Footer - Links */}
                    <View>
                        <Text style={styles.footerText} fontSize={34}>{lang['block-links']}</Text>
                        <View style={styles.footerRow}>
                            <Icon onPress={this.TiktokPress} icon='tiktok' />
                            <Icon onPress={this.InstaPress} icon='instagram' />
                            <Icon onPress={this.DiscordPress} icon='discord' />
                            <Icon onPress={this.GamelifePress} icon='loading' />
                        </View>
                    </View>

                </View>
            </Page>
        );
    }
}

export default About;