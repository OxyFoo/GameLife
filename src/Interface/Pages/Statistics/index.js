import * as React from 'react';
import { View, ScrollView, FlatList } from 'react-native';

import styles from './style';
import BackNewPage from './back';
import { RenderStatistic } from './Components/statistic';
import langManager from 'Managers/LangManager';

import { Text, KPI } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

class NewPage extends BackNewPage {
    render() {
        const lang = langManager.curr['profile'];
        const { experienceStats, playedDays, totalActivityLength, totalActivityTime } = this.state;

        return (
            <ScrollView style={styles.page}>
                <PageHeader title={lang['title-statistics']} onBackPress={this.onBack} />

                <FlatList
                    data={experienceStats}
                    renderItem={RenderStatistic}
                    keyExtractor={(item) => `user-stat-${item.statKey}`}
                    numColumns={2}
                    scrollEnabled={false}
                />

                <Text style={styles.sectionTitleGraph} color='secondary'>
                    {lang['row-text-graph']}
                </Text>

                {/* [GRAPHIQUE] */}
                <Text
                    style={{
                        fontSize: 21,
                        textAlign: 'left'
                    }}
                    color='error'
                >
                    [GRAPHIQUE]
                </Text>
                <View style={{ width: '100%', height: 200, backgroundColor: '#CC0029' }} />
                {/* [/GRAPHIQUE] */}

                <Text style={styles.sectionTitle} color='secondary'>
                    {lang['row-title-informations']}
                </Text>

                <View style={styles.kpiContainer}>
                    <KPI style={styles.kpiProfile} title={lang['row-since']} value={playedDays} />
                    <KPI
                        style={[styles.kpiProfile, styles.kpiProfileMiddle]}
                        title={lang['row-activities']}
                        value={totalActivityLength}
                    />
                    <KPI style={styles.kpiProfile} title={lang['row-time']} value={totalActivityTime} />
                </View>
            </ScrollView>
        );
    }
}

export default NewPage;
