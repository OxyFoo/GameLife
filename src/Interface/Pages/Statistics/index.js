import * as React from 'react';
import { View, ScrollView } from 'react-native';

import styles from './style';
import BackNewPage from './back';
import langManager from 'Managers/LangManager';

import { Text, KPI } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

class NewPage extends BackNewPage {
    render() {
        const lang = langManager.curr['profile'];
        const { kpis } = this.state;

        return (
            <ScrollView style={styles.page}>
                <PageHeader title={lang['title-statistics']} onBackPress={this.onBack} />

                <Text style={styles.sectionTitle} color='secondary'>
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
                    <View style={styles.kpiRow}>
                        <KPI style={styles.kpiCard} title={lang['kpi-since']} value={kpis.playedDays} />
                        <KPI
                            style={[styles.kpiCard, styles.kpiCardMiddle]}
                            title={lang['kpi-activities']}
                            value={kpis.totalActivityLength}
                        />
                        <KPI style={styles.kpiCard} title={lang['kpi-time']} value={kpis.totalActivityTimeHours} />
                    </View>

                    <View style={styles.kpiRow}>
                        <KPI style={styles.kpiCard} title={lang['kpi-ox']} value={kpis.ox} />
                        <KPI
                            style={[styles.kpiCard, styles.kpiCardMiddle]}
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

export default NewPage;
