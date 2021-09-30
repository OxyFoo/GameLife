import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

import Statistic from '../../Pages/statistic';
import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import { GLCropCorner, GLHeader, GLIconButton, GLText } from './Components/GL-Components';

class T0Statistic extends Statistic {
    render() {
        const statKey = this.stat;
        const statName = (langManager.curr['statistics']['names'][statKey] || "").toUpperCase();
        const statDescription = langManager.curr['statistics']['descriptions'][statKey];

        const xp = langManager.curr['level']['xp'] + ' : ' + this.statXP.xp + '/' + this.statXP.next;
        const lvl = langManager.curr['level']['level'] + ' : ' + this.statXP.lvl;
        const total = langManager.curr['level']['total'] + ' : ' + this.statXP.totalXP;

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
                <View style={[styles.container, { backgroundColor: user.themeManager.colors['globalBackcomponent'] }]}>
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
const ww = Dimensions.get('window').width ; 
const wh = Dimensions.get('window').height ;
console.log(ww,wh,wh/ww);
const styles = StyleSheet.create({
    container: {
        width: '80%',
        paddingVertical: "6%",
        paddingHorizontal: "5%",
        marginTop: "15%",
        marginLeft: '10%',

        borderWidth: 3,
        borderTopWidth: 2,
        borderColor: '#FFFFFF'
    },
    topBar: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    description: {
        marginVertical: "5%"
    },
    descriptionText: {
        textAlign: 'left',
        marginVertical: "10%"
    }
});

export { T0Statistic };