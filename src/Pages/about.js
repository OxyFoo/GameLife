import * as React from 'react';
import { View, StyleSheet, FlatList, Linking } from 'react-native';

import user from '../Managers/UserManager';
import langManager from '../Managers/LangManager';
import { GLHeader, GLIconButton, GLText } from '../Components/GL-Components';

class About extends React.Component {
    TiktokPress  = () => { Linking.openURL('https://vm.tiktok.com/ZMdcNpCvu/'); }
    InstaPress   = () => { Linking.openURL('https://www.instagram.com/p/CTUlsU2jP51'); }
    DiscordPress = () => { Linking.openURL('https://discord.gg/QDfsXCCq')}
    GamelifePress = () => { Linking.openURL('https://oxyfoo.com'); }

    openPopup = () => {
        const version = require('../../package.json').versionName;
        const title = langManager.curr['about']['alert-info-title'];
        const text = langManager.curr['about']['alert-info-text'].replace('{}', version);
        user.openPopup('ok', [ title, text ]);
    }

    render() {
        let staff = [];
        let tipeee = [];
        for (let i = 0; i < user.contributors.length; i++) {
            const contributor = user.contributors[i];
            if (contributor.Type === 'Tipeee') tipeee.push(contributor);
            else staff.push(contributor);
        }

        return (
            <View style={{ flex: 1 }}>
                {/* Header */}
                <GLHeader
                    title={langManager.curr['about']['page-title']}
                    leftIcon="back"
                    onPressLeft={user.backPage}
                    rightIcon="info"
                    onPressRight={this.openPopup}
                />

                {/* Content */}
                <View style={styles.container}>
                    <View>
                        <GLText style={styles.title} title={langManager.curr['about']['block-devs']} />
                        <GLText styleText={styles.text} title={"Pierre Marsaa"} value={langManager.curr['about']['text-manager']} />
                        <GLText styleText={styles.text} title={"Gérémy Lecaplain"} value={langManager.curr['about']['text-developer']} />
                    </View>
                    <View>
                        <GLText style={styles.title} title={langManager.curr['about']['block-staff']} />
                        <FlatList
                            data={staff}
                            style={styles.contributors}
                            keyExtractor={(item, i) => 'staff_' + i}
                            renderItem={({item}) => {
                                const Name = item.Name;
                                const Type = item.Type;
                                return (
                                    <GLText style={styles.contributorsText} styleText={styles.contributorsValues} title={Name} value={Type}/>
                                )
                            }}
                        />
                    </View>
                    <View>
                        <GLText style={styles.title} title={langManager.curr['about']['block-contributors']} />
                        <FlatList
                            data={tipeee}
                            style={styles.contributors}
                            keyExtractor={(item, i) => 'contributors_' + i}
                            renderItem={({item}) => {
                                const Name = item.Name;
                                const Type = item.Type;
                                return (
                                    <GLText style={styles.contributorsText} styleText={styles.contributorsValues} title={Name} value={Type}/>
                                )
                            }}
                        />
                    </View>
                    <View>
                        <GLText style={styles.title} title={langManager.curr['about']['block-links']} />
                        <View style={styles.row}>
                            <GLIconButton onPress={this.TiktokPress} icon={'tiktok'} />
                            <GLIconButton onPress={this.InstaPress} icon={'instagram'} />
                            <GLIconButton onPress={this.DiscordPress} icon={'discord'} />
                            <GLIconButton onPress={this.GamelifePress} icon={'gamelife'} />
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,

        display: 'flex',
        justifyContent: 'space-evenly'
    },
    title: {
        fontSize: 32,
        marginBottom: 24
    },
    text: {
        fontSize: 20
    },

    contributors: {
        height: '20%',
        borderColor: '#FFFFFF',
        borderWidth: 3
    },
    contributorsText: { marginVertical: 4 },
    contributorsValues: { fontSize: 16 },
    row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    }
});

export default About;