import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

import { RenderSkillsMemo } from './renderSkills';
import { CategoryToItem, GetRecentSkills } from '../../../Activity/types';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';

import { IconCheckable, Swiper } from 'Interface/Components';

/**
 * @typedef {import('../../../Activity/types').ItemCategory} ItemCategory
 */

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
                    pages={this.allCategoriesItems.map(category =>
                        <RenderSkillsMemo
                            category={category}
                            callback={(id) => {
                                this.props.callback(id);
                                user.interface.popup.Close();
                            }}
                        />
                    )}
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
    }
});

export default ActivitySelector;
