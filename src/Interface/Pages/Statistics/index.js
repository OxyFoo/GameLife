import * as React from 'react';
import { View, ScrollView } from 'react-native';

import styles from './style';
import BackStatistics from './back';
import langManager from 'Managers/LangManager';

import { Text, KPI } from 'Interface/Components';
import { ActivitiesChart, PageHeader } from 'Interface/Widgets';

class Statistics extends BackStatistics {
    render() {
        const lang = langManager.curr['profile'];
        const { activities, kpis } = this.state;

        return (
            <ScrollView style={styles.page}>
                <PageHeader title={lang['title-statistics']} onBackPress={this.onBack} />

                <Text style={styles.sectionTitle} color='secondary'>
                    {lang['row-text-graph']}
                </Text>

                <ActivitiesChart activities={activities} />

                <Text style={styles.sectionTitle} color='secondary'>
                    {lang['row-title-informations']}
                </Text>

                <View style={styles.kpiContainer}>
                    <View style={styles.kpiRow}>
                        <KPI style={styles.kpiCard} title={lang['kpi-since']} value={kpis.playedDays} />
                        <KPI
                            style={styles.kpiCard}
                            containerStyle={styles.kpiCardMiddle}
                            title={lang['kpi-activities']}
                            value={kpis.totalActivityLength}
                        />
                        <KPI style={styles.kpiCard} title={lang['kpi-time']} value={kpis.totalActivityTimeHours} />
                    </View>

                    <View style={styles.kpiRow}>
                        <KPI style={styles.kpiCard} title={lang['kpi-ox']} value={kpis.ox} />
                        <KPI
                            style={styles.kpiCard}
                            containerStyle={styles.kpiCardMiddle}
                            title={lang['kpi-inventory']}
                            value={kpis.inventoryCount}
                        />
                        <KPI style={styles.kpiCard} title={lang['kpi-friends']} value={kpis.friendsCount} />
                    </View>
                </View>
            </ScrollView>
        );
    }
}

export default Statistics;
