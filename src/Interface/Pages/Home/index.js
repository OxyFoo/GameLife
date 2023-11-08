import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import BackHome from './back';
import langManager from 'Managers/LangManager';

import { Quests } from 'Interface/Widgets';
import { Button, Swiper, Text, XPBar, Page, News } from 'Interface/Components';

class Home extends BackHome {
    render() {
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
                    {lang['btn-add-quest']}
                </Button>

                <Quests
                    ref={ref => this.refTuto3 = ref}
                    style={styles.topSpace}
                />

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