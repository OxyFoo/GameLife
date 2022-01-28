import * as React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import BackAbout from '../PageBack/About';
import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

import { PageHeader } from '../Widgets';
import { Page, Text, Icon } from '../Components';

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
        const versionText = lang['text-version'].replace('{}', this.version);

        return (
            <Page style={{ height: '95%' }} canScrollOver={false} bottomOffset={0}>
                <PageHeader onBackPress={user.interface.BackPage} hideHelp />

                <View style={styles.page}>
                    <View>
                        <Text fontSize={34}>{lang['block-devs']}</Text>
                        <Text style={{ marginBottom: 12 }} color='secondary' fontSize={22}>{versionText}</Text>

                        <View style={[styles.row, { marginBottom: 6, justifyContent: 'space-between' }]}>
                            <Text fontSize={22}>Pierre Marsaa</Text>
                            <Text fontSize={22} color='secondary'>{lang['text-manager']}</Text>
                        </View>

                        <View style={[styles.row, { justifyContent: 'space-between' }]}>
                            <Text fontSize={22}>Gérémy Lecaplain</Text>
                            <Text fontSize={22} color='secondary'>{lang['text-developer']}</Text>
                        </View>
                    </View>

                    <View style={{ maxHeight: '40%' }}>
                        <Text fontSize={34}>{lang['block-contributors']}</Text>
                        <Text style={{ marginBottom: 12 }} color='secondary' fontSize={22}>{lang['text-contributors']}</Text>

                        <FlatList
                            style={styles.contributors}
                            data={this.contributors}
                            keyExtractor={(item, i) => 'contributors_' + i}
                            renderItem={this.renderContributor}
                        />
                    </View>

                    <View>
                        <Text style={{ marginBottom: 12 }} fontSize={34}>{lang['block-links']}</Text>
                        <View style={styles.row}>
                            <Icon onPress={this.TiktokPress} icon='tiktok' />
                            <Icon onPress={this.InstaPress} icon='instagram' />
                            <Icon onPress={this.DiscordPress} icon='discord' />
                            <Icon onPress={this.GamelifePress} icon='loading' />
                        </View>
                    </View>
                </View>

            </Page>
        )
    }
}

// TODO - Use SVG icons

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'space-between'
    },
    contributors: {
        borderWidth: 3,
        borderColor: '#FFFFFF'
    },
    row: {
        paddingHorizontal: '2%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    }
});

export default About;