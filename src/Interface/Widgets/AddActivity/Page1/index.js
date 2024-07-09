import * as React from 'react';
import { Animated, View, FlatList } from 'react-native';

import BackActivityPage1 from './back';
import styles from './style';
import langManager from 'Managers/LangManager';

import { Text, IconCheckable, InputText, Button, Icon } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('../types').ItemSkill} ItemSkill
 * @typedef {import('../types').ItemCategory} ItemCategory
 */

class AddActivityPage1 extends BackActivityPage1 {
    render() {
        const lang = langManager.curr['activity'];
        const { searchEnabled, skillSearch, animSearch, skills, selectedCategory, inputText } = this.state;

        /** @type {StyleProp} */
        const animSearchTitle = {
            transform: [
                {
                    translateY: Animated.multiply(animSearch, -100)
                }
            ]
        };

        /** @type {StyleProp} */
        const animSearchTextInput = {
            opacity: animSearch
        };

        return (
            <View style={styles.parent}>
                {/* Title & Search button */}
                <View style={styles.titleParent}>
                    <Animated.View style={[styles.title, animSearchTitle]}>
                        <Icon icon='rounded-magnifer-outline' size={24} color='transparent' />
                        <Text style={styles.primaryTitleText} color='primary'>
                            {lang['title-activity']}
                        </Text>
                        <Button
                            style={styles.searchButton}
                            appearance='uniform'
                            color='transparent'
                            onPress={this.openSearch}
                        >
                            <Icon icon='rounded-magnifer-outline' size={24} color='gradient' />
                        </Button>
                    </Animated.View>
                </View>

                {/* Search bar */}
                <Animated.View
                    style={[styles.searchBar, animSearchTextInput]}
                    pointerEvents={searchEnabled ? 'auto' : 'none'}
                >
                    <InputText.Thin
                        ref={this.refSearchInput}
                        style={styles.searchTextInput}
                        placeholder={inputText}
                        value={skillSearch}
                        onChangeText={this.onSearchChange}
                    />
                    <Button
                        style={styles.searchIconButton}
                        appearance='uniform'
                        color='transparent'
                        onPress={this.closeSearch}
                    >
                        <Icon icon='close' size={24} color='main1' />
                    </Button>
                </Animated.View>

                {/* Categories */}
                <View style={styles.categoriesContainer}>{this.allCategoriesItems.map(this.renderCategory)}</View>
                <Text style={styles.secondaryTitleText} color='light'>
                    {selectedCategory === null ? lang['title-category'] : this.categoriesNames[selectedCategory]}
                </Text>

                {/* Activities List */}
                <FlatList
                    ref={this.refActivities}
                    style={styles.activitiesFlatlist}
                    data={skills}
                    ListEmptyComponent={this.renderEmptyList}
                    renderItem={this.renderSkill}
                    keyExtractor={(item) => 'act-skill-' + item.id}
                />
            </View>
        );
    }

    /**
     * @param {ItemCategory | null} value
     * @param {number} _index
     * @param {Array<ItemCategory | null>} _array
     * @returns {JSX.Element}
     */
    renderCategory = (value, _index, _array) => {
        if (value === null) {
            return <View style={styles.categoryEmpty} />;
        }

        const { id, icon } = value;
        const checked = this.state.selectedCategory === id;
        const pressable = this.preselectedSkillsIDs.length === 0;

        return (
            <IconCheckable
                key={`category-${id}`}
                style={styles.category}
                id={id}
                xml={icon}
                size={24}
                checked={checked}
                onPress={this.selectCategory}
                pressable={pressable}
            />
        );
    };

    /**
     * @param {{ item: ItemSkill }} param0
     * @returns {JSX.Element}
     */
    renderSkill = ({ item }) => {
        const { value, onPress } = item;

        return (
            <Button
                style={styles.activityElement}
                appearance='outline'
                borderColor='secondary'
                fontColor='primary'
                onPress={onPress}
            >
                <Text fontSize={16}>{value}</Text>
            </Button>
        );
    };

    /**
     * @returns {JSX.Element}
     */
    renderEmptyList = () => {
        const lang = langManager.curr['activity'];

        return (
            <View style={styles.emptyList}>
                <Text style={styles.emptyListText}>{lang['empty-activity']}</Text>
            </View>
        );
    };
}

export { AddActivityPage1 };
