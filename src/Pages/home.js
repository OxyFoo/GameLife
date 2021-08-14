import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

import user from '../Managers/UserManager';
import langManager from '../Managers/LangManager';
import { GLHeader, GLText, GLXPBar, GLXPSmallBar } from '../Components/GL-Components';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.stats = [];
        for (let stat in user.stats) {
            this.stats.push({ key: stat, value: user.stats[stat] });
        }
    }
    openIdentity = () => { user.changePage('identity'); }
    openSettings = () => { user.changePage('settings'); }

    statComponent = ({item}) => {
        const title = langManager.curr['statistics']['names'][item.key];
        const value = item.value;

        return (
            <GLXPSmallBar title={title} value={value} max={10} />
        )
    }

    render() {
        return (
            <View style={styles.parentView}>
                {/* Header */}
                <GLHeader
                    title="Game Life"
                    rightIcon="gear"
                    onPressRight={this.openSettings}
                />

                {/* User - main informations */}
                <View style={styles.containerHeader}>
                    <TouchableOpacity style={styles.containerUserName} activeOpacity={.5} onPress={this.openIdentity}>
                        <GLText title={user.pseudo} style={styles.pseudo} />
                        <GLText title={user.title} style={styles.title} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.containerUserXP} activeOpacity={.5}>
                        <GLXPBar value={5} max={15} />
                    </TouchableOpacity>
                </View>

                {/* User - Stats / Level / Calendar */}
                <View style={styles.containerContent}>
                    {/* Stats */}
                    <TouchableOpacity activeOpacity={.5} style={styles.containerStats}>
                        <FlatList
                            data={this.stats}
                            keyExtractor={item => 'stat_' + item.key}
                            renderItem={this.statComponent}
                        />
                    </TouchableOpacity>

                    <View style={styles.containerLevelColumn}>
                        {/* Level */}
                        <View style={styles.block}>
                            <GLText style={styles.textLevel} title={langManager.curr['level']['level'] + ' ' + 'XX'} />
                            <GLText style={styles.textLevelTotal} title={langManager.curr['level']['total'] + ' ' + 'XX'} color='grey' />
                            <GLText style={styles.textLevelAverage} title={langManager.curr['level']['average'].replace('{}', 'XX')} color='grey' />
                        </View>
                        {/* Calendar */}
                        <View style={[styles.block, styles.blockCalendar]}>
                            <GLText style={styles.textLevel} title='CALENDRIER' />
                        </View>
                    </View>
                </View>

                {/* User - Skills */}
                <GLText style={styles.titleSkill} title='COMPETENCES' />
                <View style={styles.row}>
                    <View style={[styles.block, styles.blockSkill]} />
                    <View style={[styles.block, styles.blockSkill]} />
                    <View style={[styles.block, styles.blockSkill]} />
                </View>
                <View style={styles.row}>
                    <View style={[styles.block, styles.blockSkill]} />
                    <View style={[styles.block, styles.blockSkill]} />
                    <View style={[styles.block, styles.blockSkill]} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    parentView: {
        flex: 1
    },
    containerHeader: {
        marginVertical: 12,
        flexDirection: 'row'
    },
    containerUserXP: {
        width: '60%',
        padding: 12,
        display: 'flex',
        justifyContent: 'center'
    },
    containerUserName: {
        width: '35%',
        margin: 12
    },
    pseudo: {
        fontSize: 18,
        textAlign: 'left'
    },
    title: {
        marginTop: 8,
        fontSize: 14,
        textAlign: 'left'
    },

    containerContent: {
        flexDirection: 'row'
    },
    containerStats: {
        width: '55%',
        padding: 12
    },
    containerLevelColumn: {
        width: '45%',
        margin: 0,
        padding: 12
    },
    textLevel: {
        marginBottom: 12,
        fontSize: 16
    },
    textLevelTotal: {
        marginBottom: 12,
        fontSize: 12
    },
    textLevelAverage: {
        fontSize: 10
    },

    block: {
        padding: 12,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        backgroundColor: '#000000'
    },
    blockCalendar: {
        height: 275,
        marginTop: 24
    },
    blockSkill: {
        width: 64,
        height: 64
    },
    row: {
        width: '100%',
        marginVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },

    titleSkill: {
        marginVertical: 12,
        fontSize: 28
    }
});

export default Home;