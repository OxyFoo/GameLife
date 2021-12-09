import * as React from 'react';
import { View, StyleSheet, FlatList,Dimensions } from 'react-native';

import BackAbout from '../pageBack/about';
import { GLHeader, GLIconButton, GLText } from '../Components';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

class About extends BackAbout {
    render() {
        return (
            <View style={{ flex: 1 }}>
                {/* Header */}
                <GLHeader
                    title={langManager.curr['about']['page-title']}
                    leftIcon="back"
                    onPressLeft={user.backPage}
                    rightIcon="info"
                    onPressRight={this.openInfo}
                />

                {/* Content */}
                <View style={styles.container}>
                    <View>
                        <GLText style={styles.title} title={langManager.curr['about']['block-devs']} />
                        <GLText styleText={styles.text} title={"Pierre Marsaa"} value={langManager.curr['about']['text-manager']} />
                        <GLText styleText={styles.text} title={"Gérémy Lecaplain"} value={langManager.curr['about']['text-developer']} />
                    </View>
                    <View style={styles.contributorsContainer}>
                        <GLText style={styles.title} title={langManager.curr['about']['block-staff']} />
                        <View style={styles.contributors}>
                            <FlatList
                                data={this.staff}
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
                    </View>
                    <View style={styles.contributorsContainer}>
                        <GLText style={styles.title} title={langManager.curr['about']['block-contributors']} />
                        <View style={styles.contributors}>
                            <FlatList
                                data={this.tipeee}
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

// juste pour avoir la taille de l'écran 
const ww = Dimensions.get('window').width ; 
const wh = Dimensions.get('window').height ;


const styles = StyleSheet.create({
    container: { // background 
        flex: 1,
        paddingHorizontal: '6.4%',

        display: 'flex',
        justifyContent: 'space-evenly', 
        
    },
    title: { // sous titres 
        fontSize: ww*853/10000,
        marginBottom: '3.6%',
        
    },
    text: { // Crédits Gerem Pierre
        fontSize: ww*53/1000,
        
    },

    contributorsContainer: { // titres et tableaux contributeurs 
        height: '28%',
        
    },
    contributors: { // tableaux contributeurs 
        flex: 1,
        borderColor: '#FFFFFF',
        borderWidth: 3, 
        
    },

    contributorsText: { marginVertical: '1%', },
    contributorsValues: { fontSize: ww*43/1000,  },

    row: { // barre du bas 
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly', 
        
    }
});

export default About;