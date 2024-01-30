import React from 'react';
import { View, FlatList, StyleSheet, Dimensions, Platform } from 'react-native';

import { GetRecentSkills, SkillToItem } from '../../../Activity/types';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Swiper, Text } from 'Interface/Components';

/**
 * @typedef {import('../../../Activity/types').ItemSkill} ItemSkill
 * @typedef {import('../../../Activity/types').ItemCategory} ItemCategory
 */

const SCREEN_HEIGHT = Dimensions.get('window').height;

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
    const skillsItems = [];

    // Recent skills
    if (category.id === 0) {
        skillsItems.push(...GetRecentSkills(skill => callback(skill.ID)));
    }

    else {
        const skills = dataManager.skills.GetByCategory(category.id);
        skillsItems.push(...skills.map(skill =>
            SkillToItem(skill, (skill) => callback(skill.ID))
        ));
    }

    // Disable horizontal scroll on iOS
    const FlatListView = Platform.OS === 'ios' ? View : Swiper.View;

    return (
        <FlatListView>
            <FlatList
                style={styles.activitiesFlatlist}
                data={skillsItems}
                ListEmptyComponent={renderEmptyList}
                renderItem={RenderSkill}
                keyExtractor={item => 'act-skill-' + item.id}
            />
        </FlatListView>
    );
}
const RenderSkillsMemo = React.memo(RenderSkills, (prev, next) => prev.category.id === next.category.id);

/**
 * @param {object} param0
 * @param {string} param0.searchInput
 * @param {(param: number) => void} param0.callback
 * @returns {React.ReactNode}
 */
function RenderSkillsSearch({ searchInput, callback }) {
    const [ skillsItems, setSkillsItems ] = React.useState([]);

    React.useEffect(() => {
        const skills = dataManager.skills.Get();
        const newSkills = skills
            .map(skill => SkillToItem(skill, (skill) => callback(skill.ID)))
            .filter(skill => skill.value.toLowerCase().includes(searchInput));
        setSkillsItems(newSkills);
    }, [ searchInput ]);

    // Disable horizontal scroll on iOS
    const FlatListView = Platform.OS === 'ios' ? View : Swiper.View;

    return (
        <FlatListView>
            <FlatList
                style={styles.activitiesFlatlist}
                data={skillsItems}
                ListEmptyComponent={renderEmptyList}
                renderItem={RenderSkill}
                keyExtractor={item => 'act-skill-' + item.id}
            />
        </FlatListView>
    );
}

const styles = StyleSheet.create({
    activitiesFlatlist: {
        width: '100%',
        height: Math.min(500, SCREEN_HEIGHT * .8 - 142 - 16) - 50,
        marginTop: 12
    },
    activityElement: {
        marginHorizontal: 12,
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

export { RenderSkillsMemo, RenderSkillsSearch };
