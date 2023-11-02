import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import BackHome from './back';
import langManager from 'Managers/LangManager';

import { Tasks } from 'Interface/Widgets';
import { Button, Swiper, Text, XPBar, Page, News, PieChart } from 'Interface/Components';

class Home extends BackHome {
    
    render() {

        // DONNES AJOUTEES POUR LES TESTS DE LA PIE CHART
        const pieData = [
            { id: 1, name: "Bien-être", valueMin: 600, color: '#7578D4' },
            { id: 2, name: "Travail", valueMin: 200, color: '#FFB37A' },
            { id: 3, name: "Créativité", valueMin: 200, color: '#2690ff' },
            { id: 4, name: "Quotidien", valueMin: 200, color: '#5bebc5' },
            { id: 5, name: "Social", valueMin: 200, color: '#FFD633' },
          ];

        const {
            experience: { stats, xpInfo },
            values: { current_level, next_level }
        } = this.state;

        const lang = langManager.curr['home'];
        const txt_level = langManager.curr['level']['level'];

        return (
            <Page ref={ref => this.refPage = ref} isHomePage canScrollOver>
                <View style={styles.XPHeader}>
                    <View style={styles.XPHeaderLvl}>
                        <Text style={styles.level}>{txt_level}</Text>
                        <Text color='main2'>{current_level}</Text>
                    </View>
                    <Text>{next_level + '%'}</Text>
                </View>

                <XPBar
                    value={xpInfo.xp}
                    maxValue={xpInfo.next}
                />

                <Swiper
                    ref={ref => this.refTuto1 = ref}
                    style={styles.topSpace}
                    pages={News()}
                />

                <Button
                    ref={ref => this.refTuto2 = ref}
                    style={styles.topSpace}
                    color='main2'
                    borderRadius={8}
                    icon='add'
                    onPress={this.addActivity}
                >
                    {lang['btn-add-task']}
                </Button>

                <Tasks
                    ref={ref => this.refTuto3 = ref}
                    style={styles.topSpace}
                />

                <PieChart data={pieData} style={styles.topSpace}/>

                <Button
                    style={styles.topSpace}
                    color='backgroundCard'
                    rippleColor='white'
                    borderRadius={8}
                    icon='setting'
                    onPress={this.openSettings}
                >
                    {lang['btn-settings']}
                </Button>

                {/*<Button style={styles.topSpace} color='main1' borderRadius={8} icon='chrono'>{lang['btn-quests']}</Button>*/}

            </Page>
        );
    }
}

const styles = StyleSheet.create({
    XPHeader: {
        marginTop: 16,
        marginBottom: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    XPHeaderLvl: {
        flexDirection: 'row'
    },
    level: {
        marginRight: 8
    },

    topSpace: {
        marginTop: 24
    }
});

export default Home;