import * as React from 'react';
import { View, FlatList, ScrollView } from 'react-native';

import BackActivity from './back';
import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import StartHelp from './help';
import { Page, Text, IconCheckable, Input } from 'Interface/Components';
import { PageHeader, ActivityPanel } from 'Interface/Widgets';

/**
 * @typedef {import('./types').ItemSkill} ItemSkill
 * @typedef {import('./types').ItemCategory} ItemCategory
 */

class Activity extends BackActivity {
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
                    onBackPress={(e) => user.interface.BackHandle()}
                    onHelpPress={StartHelp.bind(this)}
                />

                {/* Categories */}
                <View ref={ref => this.refTuto1 = ref} onLayout={this.onLayoutCategories}>
                    <Text style={styles.categoriesTitle} bold>
                        {lang['title-category']}
                    </Text>
                    <View style={styles.categoriesContainer}>
                        <ScrollView style={styles.categoriesScrollView} horizontal>
                            {this.categories.map(category => this.renderCategory({ item: category }))}
                        </ScrollView>
                    </View>
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
                    delay={this.editMode ? 0 : 300}
                    topOffset={topPanelOffset}
                />
            </Page>
        );
    }
}

export default Activity;