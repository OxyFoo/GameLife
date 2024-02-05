import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

import BackHome from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';
import user from 'Managers/UserManager';

import { Swiper, Text, XPBar, Page } from 'Interface/Components';
import { News, TodayPieChart, TodoList, SkillsGroup } from 'Interface/Widgets';
import { popupContent } from 'Interface/Widgets/StatsBars/render';

class Home extends BackHome {
    render() {
        const {
            experience: { stats, xpInfo },
            values: { current_level, next_level }
        } = this.state;

        const lang = langManager.curr['home'];
        const txt_level = langManager.curr['level']['level'];
        const stats_lang = langManager.curr['statistics']['names'];

        // Handler function to log the key
        const handlePress = (key) => {
            user.interface.popup.Open('custom', () => popupContent(key), undefined, true);
        };

        // Render function for FlatList items
        const renderItem = ({ item: key }) => (
            <TouchableOpacity onPress={() => handlePress(key)}>
                <Text>
                    {stats_lang[key].substring(0, 3)}: {stats[key].totalXP}
                </Text>
            </TouchableOpacity>
        );

        const styleContainer = {
            backgroundColor: themeManager.GetColor('dataBigKpi')
        };
        const styleSmallContainer = {
            backgroundColor: themeManager.GetColor('ground2'),
        };
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

                <View style={[styles.homeRow, styles.topSpace]}>
                    <TodayPieChart style={{ flex: 5 }} />
                </View>

                <View style={[styles.homeRow, styles.topSpace]}>
                    <View style={[styleSmallContainer, { flex: 3, borderRadius: 24, marginRight: 18, padding: 8 }]}>
                        <Text bold={true} fontSize={20} style={styles.titleWidget}>{lang['container-stats-title']}</Text>
                        <FlatList
                            data={Object.keys(stats)}
                            renderItem={renderItem}
                            keyExtractor={(item) => item}
                            scrollEnabled={false}
                        />
                    </View>
                    <View style={[styleContainer, { flex: 5, borderRadius: 20, padding: 8 }]}>
                        <Text bold={true} fontSize={20} style={styles.titleWidget}>{lang['container-skills-title']}</Text>
                        <SkillsGroup />
                    </View>
                </View>

                {/*
                <Button
                    ref={ref => this.refTuto2 = ref}
                    style={styles.topSpace}
                    color='main2'
                    borderRadius={8}
                    icon='add'
                    onPress={this.addActivity}
                >
                    {lang['btn-add-activity']}
                </Button>
                */}
                {/*
                <TodoList
                    ref={ref => this.refTuto3 = ref}
                    style={styles.topSpace}
                />
                */}
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    XPHeader: {
        marginTop: 0,
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
    homeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    topSpace: {
        marginTop: 16
    },
    titleWidget: {
        marginBottom: 12,
    },
});

export default Home;
