import * as React from 'react';
import { View, FlatList } from 'react-native';

import BackActivity from './back';
import styles from './style';
import langManager from 'Managers/LangManager';

import { Text, IconCheckable, Input, Button, Icon } from 'Interface/Components';
import { ActivityPanel } from 'Interface/Widgets';

/**
 * @typedef {import('./types').ItemSkill} ItemSkill
 * @typedef {import('./types').ItemCategory} ItemCategory
 */

class AddActivity extends BackActivity {
    render() {
        const lang = langManager.curr['activity'];
        const { skillSearch, skills, selectedCategory, topPanelOffset, inputText } = this.state;

        return (
            <View style={styles.parent}>
                {/* Title & Search bar */}
                <View style={styles.title}>
                    <Icon icon='rounded-magnifer-outline' size={24} color='transparent' />
                    <Text style={styles.primaryTitleText} color='primary'>
                        {lang['title-activity']}
                    </Text>
                    <Icon icon='rounded-magnifer-outline' size={24} color='gradient' />
                </View>

                {/* <View style={styles.activitiesSearchBar}>
                    <Input label={inputText} text={skillSearch} onChangeText={this.onSearchChange} />
                </View> */}

                {/* Categories */}
                {/* <View ref={(ref) => (this.refTuto1 = ref)} onLayout={this.onLayoutCategories}>
                </View> */}
                <View style={styles.categoriesContainer}>{this.allCategoriesItems.map(this.renderCategory)}</View>
                <Text style={styles.secondaryTitleText} color='light'>
                    {selectedCategory === null ? lang['title-category'] : this.categoriesNames[selectedCategory]}
                </Text>

                {/* Activities List */}
                <FlatList
                    ref={(ref) => (this.refActivities = ref)}
                    style={styles.activitiesFlatlist}
                    data={skills}
                    ListEmptyComponent={this.renderEmptyList}
                    renderItem={this.renderSkill}
                    keyExtractor={(item) => 'act-skill-' + item.id}
                />

                {/* Panel */}
                {/* <ActivityPanel ref={(ref) => (this.refActivityPanel = ref)} topOffset={topPanelOffset} /> */}
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
            <Button style={styles.activityElement} appearance='outline' borderColor='secondary' fontColor='primary'>
                <Text fontSize={16} onPress={onPress}>
                    {value}
                </Text>
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

export { AddActivity };
