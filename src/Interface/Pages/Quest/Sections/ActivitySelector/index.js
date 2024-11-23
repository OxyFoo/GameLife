import React from 'react';
import { Animated, View } from 'react-native';

import styles from './style';
import { RenderSkillsMemo, RenderSkillsSearch } from './renderSkills';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { Text, IconCheckable, Swiper, Button, Icon, InputText } from 'Interface/Components';
import { CategoryToItem, GetRecentSkills } from 'Interface/Widgets/AddActivity/types';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('Interface/Widgets/AddActivity/types').ItemCategory} ItemCategory
 * @typedef {import('Interface/Components/InputText/Thin').InputTextThin} InputTextThin
 *
 * @typedef {Object} ActivitySelectorPropsType
 * @property {(id: number) => void} callback
 */

/** @type {ActivitySelectorPropsType} */
const ActivitySelectorProps = {
    callback: () => {}
};

class ActivitySelector extends React.Component {
    state = {
        /** @type {number | null} */
        selectedCategory: 0,

        isSearching: false,
        search: '',

        animSearch: new Animated.Value(0)
    };

    /** @type {React.RefObject<Swiper>} */
    refSwiper = React.createRef();

    /** @type {React.RefObject<InputTextThin>} */
    refInput = React.createRef();

    /** @type {Array<ItemCategory>} */
    allCategoriesItems = dataManager.skills.categories.map(CategoryToItem);

    componentDidMount() {
        const isRecentSkills = GetRecentSkills().length > 0;
        this.refSwiper.current?.GoTo(isRecentSkills ? 0 : 1);
    }

    handleSearchButton = () => {
        const { isSearching } = this.state;
        SpringAnimation(this.state.animSearch, isSearching ? 0 : 1).start();
        this.setState({ isSearching: !isSearching });
        this.refSwiper.current?.GoTo(0);

        // Focus input if searching
        if (!isSearching) {
            this.refInput.current?.focus?.();
        } else {
            this.refInput.current?.blur?.();
        }
    };
    /** @param {string} search */
    handleSearchInput = (search) => {
        this.setState({ search });
    };

    render() {
        const lang = langManager.curr['quest'];
        const { isSearching, search, animSearch } = this.state;
        let title = '';
        const pages = [];

        if (isSearching) {
            title = lang['popup-all-categories'];
            pages.push(
                <RenderSkillsSearch
                    searchInput={search}
                    callback={(id) => {
                        this.props.callback(id);
                        user.interface.popup?.Close();
                    }}
                />
            );
        } else {
            const selectedCategory = this.allCategoriesItems.find(
                (category) => category.id === this.state.selectedCategory
            );
            title = selectedCategory?.name ?? '[ERROR]';
            pages.push(
                ...this.allCategoriesItems.map((category) => (
                    <RenderSkillsMemo
                        category={category}
                        callback={(id) => {
                            this.props.callback(id);
                            user.interface.popup?.Close();
                        }}
                    />
                ))
            );
        }

        const styleAnimCategories = {
            transform: [{ translateY: Animated.multiply(-150, animSearch) }]
        };
        const styleAnimSearch = {
            transform: [{ translateY: Animated.multiply(-150, Animated.subtract(1, animSearch)) }]
        };

        return (
            <View style={styles.popup}>
                {/* Categories */}
                <Animated.View style={[styles.categoriesContainer, styleAnimCategories]}>
                    <View style={styles.categoriesParent}>
                        {this.allCategoriesItems.map((category, index) => (
                            <IconCheckable
                                key={`category-${category.id}`}
                                style={[styles.categoryItem, index === 0 && styles.categoryItemFirst]}
                                id={category.id}
                                xml={category.icon}
                                size={32}
                                checked={this.state.selectedCategory === category.id}
                                onPress={this.handleCategoryButton}
                            />
                        ))}
                    </View>
                </Animated.View>

                {/* Search */}
                <Animated.View style={[styles.searchContainer, styleAnimSearch]}>
                    <InputText.Thin
                        ref={this.refInput}
                        placeholder={lang['popup-all-categories']}
                        value={search}
                        onChangeText={this.handleSearchInput}
                    />
                </Animated.View>

                {/* Title & search button */}
                <View style={styles.containerTitle}>
                    <Text fontSize={isSearching ? 18 : 24}>{title}</Text>
                    <Button
                        style={styles.searchButton}
                        appearance='uniform'
                        color='transparent'
                        onPress={this.handleSearchButton}
                    >
                        <Icon color='main1' icon={isSearching ? 'close' : 'rounded-magnifer-outline'} size={28} />
                    </Button>
                </View>

                {/* Skills list */}
                <Swiper
                    ref={this.refSwiper}
                    backgroundColor='transparent'
                    onSwipe={this.handleCategorySwiper}
                    pages={pages}
                    enableAutoNext={false}
                    disableSwipe={true}
                />
            </View>
        );
    }

    /** @param {number} id */
    handleCategorySwiper = (id) => {
        this.setState({ selectedCategory: id });
    };
    /** @param {number} id */
    handleCategoryButton = (id) => {
        this.refSwiper.current?.GoTo(id);
    };
}

ActivitySelector.prototype.props = ActivitySelectorProps;
ActivitySelector.defaultProps = ActivitySelectorProps;

export default ActivitySelector;
