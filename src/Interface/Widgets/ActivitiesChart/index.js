import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import themeManager from 'Managers/ThemeManager';

import { LineChartSvg } from 'Interface/Components';
import { GetDate } from 'Utils/Time';
import { DateFormat } from 'Utils/Date';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Data/User/Activities').Activity} Activity
 */

/**
 * @typedef {{ date: string, value: number }} LineData
 *
 * @typedef {Object} SkillChartProps
 * @property {StyleProp} [style]
 * @property {Activity[]} activities
 */

/** @param {SkillChartProps} props */
function ActivitiesChart({ style, activities }) {
    const [data, setData] = React.useState(/** @type {LineData[]} */ ([]));

    React.useEffect(() => {
        /** @type {LineData[]} */
        const newData = [];

        for (const activity of activities) {
            const activityDate = GetDate(activity.startTime);
            const hourDuration = activity.duration / 60;
            const date = DateFormat(activityDate);
            const index = newData.findIndex((item) => item.date === date);
            if (index !== -1) {
                newData[index].value += hourDuration;
                continue;
            }
            newData.push({
                date: date,
                value: hourDuration
            });
        }

        // Sort by date
        newData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setData(newData);
    }, [activities]);

    return (
        <LinearGradient
            style={[styles.container, style]}
            colors={[
                themeManager.GetColor('border', { opacity: 0.2 }),
                themeManager.GetColor('border', { opacity: 0.06 })
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
        >
            <View style={styles.innerGradient}>
                <LineChartSvg lineColor={'main2'} data={data} enableDownsampling={true} maxPoints={40} />
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 8
    },
    innerGradient: {
        paddingTop: 12,
        paddingHorizontal: 18,
        paddingBottom: 0
    },
    headerText: {
        fontWeight: 'bold',
        marginVertical: 10
    }
});

export { ActivitiesChart };
