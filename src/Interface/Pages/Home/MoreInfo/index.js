import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text, Button, Icon } from 'Interface/Components';
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
        <Button
            style={[styles.button, style]}
            onPress={openStatistics}
            gradientColors={[
                themeManager.GetColor('main1', { opacity: 0.25 }),
                themeManager.GetColor('main1', { opacity: 0.08 })
            ]}
            gradientColorsAngle={90}
        >
            <View style={styles.header}>
                <Text fontSize={16}>{lang['kpi-title']}</Text>
                <Icon color='gradient' icon='arrow-square-outline' angle={90} />
            </View>

            <View style={styles.kpiRow}>
                <View style={styles.kpiItem}>
                    <Text style={styles.kpiValue} fontSize={18} bold color='primary'>
                        {playedDays}
                    </Text>
                    <Text style={styles.kpiLabel} fontSize={10} color='light'>
                        {lang['kpi-since']}
                    </Text>
                </View>

                <View style={styles.verticalDivider} />

                <View style={styles.kpiItem}>
                    <Text style={styles.kpiValue} fontSize={18} bold color='primary'>
                        {totalActivities}
                    </Text>
                    <Text style={styles.kpiLabel} fontSize={10} color='light'>
                        {lang['kpi-activities']}
                    </Text>
                </View>

                <View style={styles.verticalDivider} />

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
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingBottom: 4
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 4,
        backgroundColor: 'transparent'
    },
    kpiRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 6,
        paddingVertical: 8
    },
    kpiItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 4
    },
    kpiValue: {
        marginBottom: 4
    },
    kpiLabel: {
        textAlign: 'center'
    },
    verticalDivider: {
        width: 1,
        marginVertical: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
    }
});

export { MoreInfo };
