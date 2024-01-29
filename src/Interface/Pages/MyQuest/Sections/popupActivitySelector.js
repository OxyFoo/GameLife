import React from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';

import { CategoryToItem, GetRecentSkills, SkillToItem } from '../../Activity/types';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { IconCheckable, Swiper, Text } from 'Interface/Components';

/**
 * @typedef {import('../../Activity/types').ItemSkill} ItemSkill
 * @typedef {import('../../Activity/types').ItemCategory} ItemCategory
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

const ActivitySelectorProps = {
    /** @type {(param: number) => void} */
    callback: (id) => {},
};

class ActivitySelector extends React.Component {
    state = {
        /** @type {number | null} */
        selectedCategory: 0
    }

    /** @type {React.RefObject<Swiper>} */
    refSwiper = React.createRef();

    /** @type {Array<ItemCategory>} */
    allCategoriesItems = dataManager.skills.categories.map(CategoryToItem);
    allRecentSkillsItems = GetRecentSkills((a) => console.log(dataManager.GetText(a.Name)));

    render() {
        return (
            <View>
                <View style={styles.categoriesContainer}>
                    <ScrollView style={styles.categoriesScrollView} horizontal>
                        {this.allCategoriesItems.map(category => this.renderCategory({ item: category }))}
                    </ScrollView>
                </View>
                <Swiper
                    ref={this.refSwiper}
                    height={500}
                    onSwipe={this.handleCategorySwiper}
                    pages={this.allCategoriesItems.map(category => <RenderSkillsMemo category={category} callback={(id) => {
                        this.props.callback(id);
                        user.interface.popup.Close();
                    }} />)}
                    enableAutoNext={false}
                />
            </View>
        );
    }

    /** @param {number} id */
    handleCategorySwiper = (id) => {
        this.setState({ selectedCategory: id });
    }
    /** @param {number} id */
    handleCategoryButton = (id) => {
        this.refSwiper.current?.GoTo(id);
    }

    /**
     * @param {{ item: ItemCategory }} param0
     * @returns {JSX.Element}
     */
    renderCategory = ({ item }) => {
        const { id, icon } = item;
        const checked = this.state.selectedCategory === id;

        return (
            <IconCheckable
                key={`category-${id}`}
                style={styles.category}
                id={id}
                xml={icon}
                size={32}
                checked={checked}
                onPress={this.handleCategoryButton}
            />
        );
    }
}

ActivitySelector.prototype.props = ActivitySelectorProps;
ActivitySelector.defaultProps = ActivitySelectorProps;

const styles = StyleSheet.create({
    category: {
        marginVertical: 4,
        marginHorizontal: 4
    },
    categoriesContainer: {
        alignItems: 'center'
    },
    categoriesScrollView: {
        maxWidth: '100%',
        marginBottom: 18
    },

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

export default ActivitySelector;
