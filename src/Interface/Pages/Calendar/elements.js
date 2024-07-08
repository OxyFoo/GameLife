import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';
import themeManager from 'Managers/ThemeManager';

import { Text, Button, Icon } from 'Interface/Components';
import { TimeToFormatString } from 'Utils/Time';

/**
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('./back').DayDataType} DayDataType
 * @typedef {import('./back').ActivityDataType} ActivityDataType
 * @typedef {import('react-native').ListRenderItem<ActivityDataType>} ListRenderItemActivityDataType
 * @typedef {import('react-native').ListRenderItem<DayDataType>} ListRenderItemDayDataType
 */

/** @type {React.MemoExoticComponent<ListRenderItemActivityDataType>} */
const RenderActivity = React.memo(
    ({ item }) => {
        const { skill, activity } = item;

        if (!skill) {
            user.interface.console.AddLog('warn', `Skill not found for activity ${activity.skillID}`);
            return null;
        }

        const category = dataManager.skills.GetCategoryByID(skill.CategoryID);
        if (!category) {
            user.interface.console.AddLog('warn', `Category not found for skill ${skill.ID}`);
            return null;
        }

        const activityText = langManager.GetText(skill.Name);
        const categoryText = langManager.GetText(category.Name);
        const activityTime =
            TimeToFormatString(activity.startTime) +
            ' - ' +
            TimeToFormatString(activity.startTime + activity.duration * 60);
        const xmlIcon = dataManager.skills.GetXmlByLogoID(skill.LogoID);
        const onPress = () => item.onPress(item);
        const borderColor = {
            borderColor: category?.Color || themeManager.GetColor('border')
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
                    <Icon
                        xml={xmlIcon}
                        size={24}
                        // @ts-ignore - borderColor is a string from dataManager
                        color={borderColor.borderColor}
                    />
                    <Text style={styles.activityName} numberOfLines={1} ellipsizeMode='tail'>
                        {activityText}
                    </Text>
                    <Text style={styles.categoryName}>{categoryText}</Text>
                </View>
                <View style={styles.activityChild}>
                    <Text style={styles.activityTime}>{activityTime}</Text>
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
        const { day, month, year, selected, onPress } = item;
        const date = new Date(year, month, day);
        const dayText = langManager.curr['dates']['days-min'][date.getDay()];

        /** @type {ThemeColor} */
        const colorText = selected ? 'ground1' : 'border';
        /** @type {ThemeColor} */
        const colorBackground = selected ? 'main1' : 'transparent';

        return (
            <Button
                style={styles.dayItem}
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
