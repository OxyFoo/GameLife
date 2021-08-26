import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import user from '../Managers/UserManager';
import langManager from '../Managers/LangManager';
import { GLHeader, GLIconButton, GLText } from '../Components/GL-Components';

class Statistic extends React.Component {
    constructor(props) {
        super(props);
        this.stat = this.props.args['stat'] || 'sag';
    }

    back = () => { user.backPage(); }
    next = () => { user.changePage('statistic', {'stat': this.getSideStat(1)}, true); };
    prev = () => { user.changePage('statistic', {'stat': this.getSideStat(-1)}, true); };

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
                    <GLText style={styles.description} title={statDescription} />
                    <View style={styles.corner} />
                    <View style={styles.cornerBorder} />
                </View>
            </View>
        )
    }
}

const borderSize = 50;

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
    corner: {
        position: 'absolute',
        right: -3,
        bottom: -3,

        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderRightWidth: borderSize,
        borderTopWidth: borderSize,
        borderRightColor: "transparent",
        borderTopColor: "#000022",

        transform: [{ rotate: "180deg" }]
    },
    cornerBorder: {
        position: 'absolute',
        right: -3 + borderSize/2,
        bottom: -3 - borderSize/5,
        width: 3,
        height: ((borderSize**2)*2)**0.5, // Pythagore
        transform: [{ rotate: "45deg" }],
        backgroundColor: '#FFFFFF'
    }
});

export default Statistic;