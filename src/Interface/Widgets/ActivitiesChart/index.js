import React from 'react';
import { View, StyleSheet } from 'react-native';

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

/** @type {LineData[]} */
const INIT_DATA = [];

/** @param {SkillChartProps} props */
function ActivitiesChart({ style, activities }) {
    const [data, setData] = React.useState(INIT_DATA);

    React.useEffect(() => {
        /** @type {LineData[]} */
        const newData = [];

        for (const activity of activities) {
            const hourDuration = activity.duration / 60;
            const date = DateFormat(GetDate(activity.startTime));
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

        setData(newData);
    }, [activities]);

    const styleContainer = {
        backgroundColor: themeManager.GetColor('dataBigKpi')
    };

    return (
        <View style={[styleContainer, styles.container, style]}>
            <LineChartSvg lineColor={'main2'} data={data} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingHorizontal: 20,
        paddingBottom: 0,
        borderRadius: 20
    },
    headerText: {
        fontWeight: 'bold',
        marginVertical: 10
    }
});

export { ActivitiesChart };
