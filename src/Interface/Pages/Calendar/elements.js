import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';
import themeManager from 'Managers/ThemeManager';

import { Text, Button, Icon } from 'Interface/Components';
import { GetDate, GetTimeZone, TimeToFormatString } from 'Utils/Time';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('./back').DayDataType} DayDataType
 * @typedef {import('./back').ActivityDataType} ActivityDataType
 * @typedef {import('react-native').ListRenderItem<ActivityDataType>} ListRenderItemActivityDataType
 * @typedef {import('react-native').ListRenderItem<DayDataType>} ListRenderItemDayDataType
 */

/** @type {React.MemoExoticComponent<ListRenderItemActivityDataType>} */
const RenderActivity = React.memo(
    ({ item }) => {
        const { day, skill, activity } = item;

        if (!skill) {
            user.interface.console?.AddLog('warn', `Skill not found for activity ${activity.skillID}`);
            return null;
        }

        const category = dataManager.skills.GetCategoryByID(skill.CategoryID);
        if (!category) {
            user.interface.console?.AddLog('warn', `Category not found for skill ${skill.ID}`);
            return null;
        }

        const activityText = langManager.GetText(skill.Name);
        const startTime = activity.startTime + activity.timezone * 3600;
        const endTime = startTime + activity.duration * 60;
        const startTimeString = TimeToFormatString(startTime);
        const endTimeString = TimeToFormatString(endTime);
        const xmlIcon = dataManager.skills.GetXmlByLogoID(skill.LogoID || category.LogoID);
        const onPress = () => item.onPress(item);

        let activityTime = `${startTimeString} - ${endTimeString}`;
        const startDate = GetDate(startTime);
        const endDate = GetDate(endTime);
        if (startDate.getUTCDate() !== day.day && (startDate.getUTCHours() > 0 || startDate.getUTCMinutes() > 0)) {
            activityTime = `< 00:00 - ${endTimeString}`;
        } else if (endDate.getUTCDate() !== day.day && (endDate.getUTCHours() > 0 || endDate.getUTCMinutes() > 0)) {
            activityTime = `${startTimeString} - 00:00 >`;
        }

        const currTZ = GetTimeZone();
        const actiTZ = activity.timezone;
        const timezoneText = currTZ !== actiTZ ? `UTC${currTZ < 0 ? actiTZ : '+' + actiTZ}` : null;

        /** @type {StyleProp} */
        const borderColor = {
            borderColor: category?.Color || themeManager.GetColor('border')
        };

        return (
            <Button
                style={[borderColor, styles.activityItem, !!timezoneText && styles.activityItemSmallPadding]}
                styleContent={styles.activityButtonContent}
                appearance='uniform'
                color='transparent'
                onPress={onPress}
            >
                <View style={styles.activityChild}>
                    <Icon
                        xml={xmlIcon}
                        size={24}
                        // @ts-ignore - borderColor is a string from dataManager
                        color={borderColor.borderColor}
                    />
                    <Text style={styles.activityName} numberOfLines={1} ellipsizeMode='tail'>
                        {activityText}
                    </Text>
                </View>
                <View style={styles.activityTimes}>
                    <Text style={styles.activityTime}>{activityTime}</Text>
                    {timezoneText && (
                        <Text style={styles.activityUTC} color='secondary'>
                            {timezoneText}
                        </Text>
                    )}
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
        const { day, month, year, selected, containsActivity, onPress } = item;
        const date = new Date(year, month, day);
        const dayInt = (date.getDay() + 6) % 7;
        const dayText = langManager.curr['dates']['days-min'][dayInt];

        /** @type {ThemeColor} */
        let colorText = 'border';

        /** @type {ThemeColor} */
        let colorBackground = 'transparent';

        /** @type {ViewStyle} */
        const borderColor = {
            borderColor: themeManager.GetColor('main1')
        };

        if (selected) {
            colorText = 'ground1';
            colorBackground = 'main1';
        }

        const today = new Date();
        if (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        ) {
            colorText = 'main2';
            if (selected) {
                colorText = 'ground1';
                colorBackground = 'main2';
            }
        }

        return (
            <Button
                style={[styles.dayItem, borderColor, containsActivity && styles.dayItemActive]}
                styleContent={styles.dayContent}
                appearance='uniform'
                color={colorBackground}
                onPress={() => onPress(item)}
            >
                <Text style={styles.dayNumber} color={colorText}>
                    {`${day}`}
                </Text>
                <Text style={styles.dayName} color={colorText}>
                    {dayText}
                </Text>
            </Button>
        );
    },
    (prevProps, nextProps) => prevProps.item.selected !== nextProps.item.selected
);

export { RenderActivity, RenderDay };
