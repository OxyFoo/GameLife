import * as React from 'react';
import { View, FlatList } from 'react-native';

import BackActivity from './back';
import ActivityPanel from './Panel';
import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Page, Text, IconCheckable, Input } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

/**
 * @typedef {import('./types').ItemSkill} ItemSkill
 * @typedef {import('./types').ItemCategory} ItemCategory
 */

class Activity extends BackActivity {
    /**
     * @param {{ item: ItemCategory|null }} param0
     * @returns {JSX.Element}
     */
    renderCategory = ({ item }) => {
        if (item === null) {
            return <View style={styles.categoryEmpty} />;
        }

        const { id, icon } = item;
        const checked = this.state.selectedCategory === id;

        return (
            <IconCheckable
                style={styles.category}
                id={id}
                xml={icon}
                size={32}
                checked={checked}
                onPress={this.selectCategory}
                pressable={!this.editMode}
            />
        );
    }

    /**
     * @param {{ item: ItemSkill }} param0
     * @returns {JSX.Element}
     */
    renderSkill = ({ item }) => {
        const { value, onPress } = item;

        return (
            <Text
                style={[styles.activityElement, this.backgroundCard]}
                fontSize={22}
                onPress={onPress}
            >
                {value}
            </Text>
        );
    }

    /**
     * @returns {JSX.Element}
     */
    renderEmptyList = () => {
        const lang = langManager.curr['activity'];

        return (
            <View style={styles.emptyList}>
                <Text style={styles.emptyListText}>
                    {lang['empty-activity']}
                </Text>
            </View>
        );
    }

    render() {
        const lang = langManager.curr['activity'];
        const { skillSearch, skills, topPanelOffset, inputText } = this.state;

        return (
            <Page
                ref={ref => this.refPage = ref}
                scrollable={false}
                canScrollOver={false}
            >
                <PageHeader
                    style={styles.header}
                    onBackPress={(e) => user.interface.BackPage()}
                />

                {/* Categories */}
                <View onLayout={this.onLayoutCategories}>
                    <Text style={styles.categoriesTitle} bold>
                        {lang['title-category']}
                    </Text>
                    <FlatList
                        style={styles.categoriesFlatlist}
                        columnWrapperStyle={styles.categoriesWrapper}
                        data={this.categories}
                        renderItem={this.renderCategory}
                        numColumns={6}
                        keyExtractor={item => 'act-cat-' + item?.id}
                        scrollEnabled={false}
                    />
                </View>

                {/* Activities */}
                {!this.editMode && (<>
                    {/* Title */}
                    <Text style={styles.activitiesTitle} bold>
                        {lang['title-activity']}
                    </Text>

                    {/* Search bar */}
                    <View style={styles.activitiesSearchBar}>
                        <Input
                            label={inputText}
                            text={skillSearch}
                            onChangeText={this.onSearchChange}
                        />
                    </View>

                    {/* List */}
                    <FlatList
                        ref={ref => this.refActivities = ref}
                        style={styles.activitiesFlatlist}
                        data={skills}
                        ListEmptyComponent={this.renderEmptyList}
                        renderItem={this.renderSkill}
                        keyExtractor={item => 'act-skill-' + item.id}
                    />
                </>)}

                {/* Panel */}
                <ActivityPanel
                    ref={ref => this.refActivityPanel = ref}
                    editMode={this.editMode}
                    delay={this.editMode ? 0 : 300}
                    topOffset={topPanelOffset}
                />
            </Page>
        );
    }
}

export default Activity;