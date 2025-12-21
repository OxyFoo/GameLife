import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Text, Button } from 'Interface/Components';
import { Round } from 'Utils/Functions';
import { GetDate, GetGlobalTime } from 'Utils/Time';

/** @param {{ style?: import('react-native').ViewStyle }} props */
function MoreInfo({ style }) {
    const [state, setState] = React.useState(() => computeData());

    React.useEffect(() => {
        const listener = user.activities.allActivities.AddListener(() => {
            setState(computeData());
        });
        return () => {
            user.activities.allActivities.RemoveListener(listener);
        };
    }, []);

    const openStatistics = () => {
        user.interface.ChangePage('statistics');
    };

    const lang = langManager.curr['profile'];
    const { playedDays, totalActivities, totalHours } = state;

    return (
        <Button style={[styles.button, style]} onPress={openStatistics} appearance='uniform' color='transparent'>
            <View style={styles.kpiRow}>
                <View style={styles.kpiItem}>
                    <Text style={styles.kpiValue} fontSize={18} bold color='primary'>
                        {playedDays}
                    </Text>
                    <Text style={styles.kpiLabel} fontSize={10} color='light'>
                        {lang['kpi-since']}
                    </Text>
                </View>

                <View style={styles.kpiItem}>
                    <Text style={styles.kpiValue} fontSize={18} bold color='primary'>
                        {totalActivities}
                    </Text>
                    <Text style={styles.kpiLabel} fontSize={10} color='light'>
                        {lang['kpi-activities']}
                    </Text>
                </View>

                <View style={styles.kpiItem}>
                    <Text style={styles.kpiValue} fontSize={18} bold color='primary'>
                        {totalHours}
                    </Text>
                    <Text style={styles.kpiLabel} fontSize={10} color='light'>
                        {lang['kpi-time']}
                    </Text>
                </View>
            </View>
        </Button>
    );
}

function computeData() {
    const activities = user.activities.Get();
    const durations = activities.map((a) => a.duration);
    const totalHours = Round(durations.reduce((a, b) => a + b, 0) / 60, 0);

    let playedDays = 0;
    if (activities.length > 0) {
        const initTime = activities[0].startTime;
        const initDate = GetDate(initTime);
        playedDays = Math.floor((GetGlobalTime() - GetGlobalTime(initDate)) / (60 * 60 * 24));
    }

    return {
        playedDays,
        totalActivities: activities.length,
        totalHours
    };
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 0,
        paddingHorizontal: 0,
        backgroundColor: 'transparent'
    },
    kpiRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8
    },
    kpiItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 8
    },
    kpiValue: {
        marginBottom: 4
    },
    kpiLabel: {
        textAlign: 'center'
    }
});

export { MoreInfo };
