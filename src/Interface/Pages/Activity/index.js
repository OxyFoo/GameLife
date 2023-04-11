import * as React from 'react';
import { View, FlatList, Dimensions } from 'react-native';

import BackActivity from './back';
import ActivityPanel from './Components/activityPanel';
import styles from './style';
import user from '../../../Managers/UserManager';
import langManager from '../../../Managers/LangManager';
import themeManager from '../../../Managers/ThemeManager';

import { Page, Text, IconCheckable, Input } from '../../Components';
import { PageHeader } from '../../Widgets';

const SCREEN_HEIGHT = Dimensions.get('window').height;

/**
 * @typedef {import('./back').ItemCategory} ItemCategory
 * @typedef {import('./back').ItemSkill} ItemSkill
 */

class Activity extends BackActivity {
    /**
     * @param {{ item: ItemCategory }} param0
     * @returns {JSX.Element}
     */
    renderCategory = ({ item }) => {
        if (item === 0) {
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
     * @param {{item: ItemSkill}} param0
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

    render() {
        const lang = langManager.curr['activity'];

        return (
            <>
            <Page
                ref={ref => this.refPage = ref}
                scrollable={false}
                canScrollOver={false}
            >
                <PageHeader
                    style={styles.header}
                    onBackPress={user.interface.BackPage}
                />

                {/* Categories */}
                <Text style={styles.categoriesTitle} bold>
                    {lang['title-category']}
                </Text>
                <FlatList
                    style={styles.categoriesFlatlist}
                    columnWrapperStyle={styles.categoriesWrapper}
                    data={this.categories}
                    renderItem={this.renderCategory}
                    numColumns={6}
                    keyExtractor={item => 'act-cat-' + item.id}
                    scrollEnabled={false}
                />

                {/* Activities */}
                {/* TODO: Hide in edition mode */}
                <Text fontSize={22} bold>
                    {lang['title-activity']}
                </Text>
                <View
                    style={styles.activitiesSearchBar}
                    onLayout={this.onLayoutActivities}
                >
                    <Input
                        label={langManager.curr['modal']['search']}
                        text={this.state.skillSearch}
                        onChangeText={this.onSearchChange}
                    />
                </View>
                <FlatList
                    ref={ref => this.refActivities = ref}
                    style={styles.activitiesFlatlist}
                    data={this.state.skills}
                    
                    renderItem={this.renderSkill}
                    keyExtractor={item => 'act-skill-' + item.id}
                />

            </Page>

            {/* Panel */}
            <ActivityPanel
                ref={ref => this.refPanel = ref}
                topOffset={this.state.layoutActivities?.y || 0}
            />

            </>
        );
    }
}

export default Activity;