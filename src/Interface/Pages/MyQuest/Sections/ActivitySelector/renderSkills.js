import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

import { SkillToItem } from '../../../Activity/types';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Swiper, Text } from 'Interface/Components';

/**
 * @typedef {import('../../../Activity/types').ItemSkill} ItemSkill
 * @typedef {import('../../../Activity/types').ItemCategory} ItemCategory
 */


/** @returns {JSX.Element} */
function renderEmptyList() {
    const lang = langManager.curr['activity'];

    return (
        <View style={styles.emptyList}>
            <Text style={styles.emptyListText}>
                {lang['empty-activity']}
            </Text>
        </View>
    );
}

/**
 * @param {{ item: ItemSkill }} param0
 * @returns {JSX.Element}
 */
function RenderSkill({ item }) {
    const { value, onPress } = item;

    const backgroundCard = {
        backgroundColor: themeManager.GetColor('dataSmallKpi')
    };

    return (
        <Text
            style={[styles.activityElement, backgroundCard]}
            fontSize={22}
            onPress={onPress}
        >
            {value}
        </Text>
    );
}

/**
 * @param {object} param0
 * @param {ItemCategory} param0.category
 * @param {(param: number) => void} param0.callback
 * @returns {React.ReactNode}
 */
function RenderSkills({ category, callback }) {
    const skills = dataManager.skills.GetByCategory(category.id);
    const skillsItems = skills.map(skill =>
        SkillToItem(skill, (skill) => callback(skill.ID))
    );

    return (
        <Swiper.View>
            <Text>{category.name}</Text>
            <FlatList
                style={styles.activitiesFlatlist}
                data={skillsItems}
                ListEmptyComponent={renderEmptyList}
                renderItem={RenderSkill}
                keyExtractor={item => 'act-skill-' + item.id}
            />
        </Swiper.View>
    );
}
const RenderSkillsMemo = React.memo(RenderSkills, (prev, next) => prev.category.id === next.category.id);

const styles = StyleSheet.create({
    activitiesFlatlist: {
        width: '100%',
        height: 450
    },
    activityElement: {
        marginHorizontal: 0,
        marginBottom: 6,
        padding: 8,
        borderRadius: 8,
        overflow: 'hidden'
    },
    emptyList: {
        marginTop: 24
    },
    emptyListText: {
        textAlign: 'center',
        fontSize: 24
    }
});

export { RenderSkillsMemo };
