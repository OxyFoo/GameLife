import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import themeManager from 'Managers/ThemeManager';

import { Text, Button, Icon } from 'Interface/Components';

/**
 * @typedef {import('./back').DayDataType} DayDataType
 * @typedef {import('./back').ActivityDataType} ActivityDataType
 * @typedef {import('react-native').ListRenderItem<ActivityDataType>} ListRenderItemActivityDataType
 * @typedef {import('react-native').ListRenderItem<DayDataType>} ListRenderItemDayDataType
 */

/** @type {React.MemoExoticComponent<ListRenderItemActivityDataType>} */
const RenderActivity = React.memo(
    ({ item }) => {
        const { activity } = item;

        const onPress = () => item.onPress(item);
        const borderColor = {
            borderColor: themeManager.GetColor('border')
        };

        return (
            <Button
                style={[borderColor, styles.activityItem]}
                styleContent={styles.activityButtonContent}
                appearance='uniform'
                color='transparent'
                onPress={onPress}
            >
                <View style={styles.activityChild}>
                    <Icon icon='home' size={24} color='primary' />
                    <Text style={styles.activityHour}>[9:00 / 11:00]</Text>
                </View>
                <View style={styles.activityChild}>
                    <Text style={styles.activityName}>{activity.skillID}</Text>
                </View>
            </Button>
        );
    }
    /** @TODO */
    //(prevProps, nextProps) => prevProps.item.activity.startTime === nextProps.item.activity.startTime
);

/** @type {React.MemoExoticComponent<ListRenderItemDayDataType>} */
const RenderDay = React.memo(
    ({ item }) => {
        const date = new Date(item.year, item.month, item.day);
        const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
        const onPress = () => item.onPress(item);

        return (
            <Button
                style={styles.dayItem}
                styleContent={styles.dayContent}
                appearance='uniform'
                color='main1'
                onPress={onPress}
            >
                <Text style={styles.dayNumber} color='ground1'>
                    {`${item.day}`}
                </Text>
                <Text style={styles.dayName} color='ground1'>
                    {dayName}
                </Text>
            </Button>
        );
    },
    (prevProps, nextProps) => prevProps.item.day === nextProps.item.day
);

export { RenderActivity, RenderDay };
