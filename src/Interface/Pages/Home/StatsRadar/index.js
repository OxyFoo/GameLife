import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

import user from 'Managers/UserManager';
import themeManager from 'Managers/ThemeManager';

import { Button, Icon, RadarChart, Text } from 'Interface/Components';
import langManager from 'Managers/LangManager';

/** @param {{ style?: import('react-native').ViewStyle }} props */
function StatsRadar({ style }) {
    const lang = langManager.curr['home'];

    const [statsData, setStatsData] = React.useState(() => computeStats());
    const [showLabels, setShowLabels] = React.useState(true);

    React.useEffect(() => {
        const listener = user.experience.experience.AddListener(() => {
            setStatsData(computeStats());
        });
        return () => {
            user.experience.experience.RemoveListener(listener);
        };
    }, []);

    const openProfile = () => {
        user.interface.ChangePage('profile');
    };

    const switchManually = () => {
        setShowLabels((prev) => !prev);
    };

    const chartSize = Dimensions.get('window').width * 0.4;

    return (
        <Button
            style={[styles.container, style]}
            onPress={openProfile}
            onLongPress={switchManually}
            gradientColors={[
                themeManager.GetColor('main1', { opacity: 0.25 }),
                themeManager.GetColor('main1', { opacity: 0.08 })
            ]}
            gradientColorsAngle={90}
        >
            <View style={styles.header}>
                <Text fontSize={16}>{lang['btn-stats']}</Text>
                <Icon color='gradient' size={24} icon='arrow-square-outline' angle={90} />
            </View>

            <View style={styles.chartContainer}>
                <RadarChart data={statsData} size={chartSize} showLabels={showLabels} levels={4} />
            </View>
        </Button>
    );
}

function computeStats() {
    const experience = user.experience.experience.Get();
    const stats = experience.stats;
    const values = Object.values(stats);
    const maxValue = Math.max(...values, 1);

    return user.experience.statsKey.map((key) => ({
        label: key.toUpperCase(),
        value: maxValue > 0 ? stats[key] / maxValue : 0
    }));
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
        paddingHorizontal: 12
    },
    container: {
        paddingVertical: 0,
        paddingHorizontal: 0
    },
    content: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        alignItems: 'center'
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export { StatsRadar };
