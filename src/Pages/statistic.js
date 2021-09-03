import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import user from '../Managers/UserManager';
import langManager from '../Managers/LangManager';
import { GLCropCorner, GLHeader, GLIconButton, GLText } from '../Components/GL-Components';

class Statistic extends React.Component {
    constructor(props) {
        super(props);
        this.stat = this.props.args['stat'] || 'sag';
    }

    back = () => { user.backPage(); }
    next = () => { user.changePage('statistic', {'stat': this.getSideStat(1)}, true, true); };
    prev = () => { user.changePage('statistic', {'stat': this.getSideStat(-1)}, true, true); };

    getSideStat = (value) => {
        const allStats = [ 'sag', 'int', 'con', 'for', 'end', 'agi', 'dex' ];
        const currStat = this.stat;
        let index = allStats.indexOf(currStat) + value;
        if (index >= allStats.length) index = 0;
        if (index < 0) index = allStats.length - 1;
        return allStats[index];
    }

    render() {
        const statKey = this.stat;
        const statName = (langManager.curr['statistics']['names'][statKey] || "").toUpperCase();
        const statDescription = langManager.curr['statistics']['descriptions'][statKey];

        const statXP = user.experience.getStatExperience(statKey);
        const xp = langManager.curr['level']['xp'] + ' : ' + statXP.xp + '/' + statXP.next;
        const lvl = langManager.curr['level']['level'] + ' : ' + statXP.lvl;
        const total = langManager.curr['level']['total'] + ' : ' + statXP.totalXP;

        const statText = xp + "\n" + lvl + "\n" + total;

        return (
            <View style={{ flex: 1 }}>
                {/* Header */}
                <GLHeader
                    title={langManager.curr['statistic']['page-title']}
                    small={true}
                    leftIcon="back"
                    onPressLeft={this.back}
                />

                {/* Topbar */}
                <View style={styles.container}>
                    <View style={styles.topBar}>
                        <GLIconButton onPress={this.prev} icon='chevronLeft' />
                        <GLText title={statName} />
                        <GLIconButton onPress={this.next} icon='chevron' />
                    </View>
                    <GLText style={styles.descriptionText} title={statText} />
                    <GLText style={styles.description} title={statDescription} />
                    <GLCropCorner />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '80%',
        paddingVertical: 24,
        paddingHorizontal: 12,
        marginTop: 48,
        marginLeft: '10%',

        borderWidth: 3,
        borderTopWidth: 2,
        borderColor: '#FFFFFF',
        backgroundColor: '#000000'
    },
    topBar: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    description: {
        marginVertical: 24
    },
    descriptionText: {
        textAlign: 'left',
        marginVertical: 24
    }
});

export default Statistic;