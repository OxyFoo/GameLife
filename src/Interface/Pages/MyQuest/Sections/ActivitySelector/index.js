import React from 'react';
import { Animated, View, ScrollView, Dimensions, StyleSheet } from 'react-native';

import { RenderSkillsMemo, RenderSkillsSearch } from './renderSkills';
import { CategoryToItem, GetRecentSkills } from '../../../Activity/types';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { Text, IconCheckable, Swiper, Button, Icon, Input } from 'Interface/Components';
import { SpringAnimation } from 'Utils/Animations';

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
        selectedCategory: 0,

        isSearching: false,
        search: '',

        animSearch: new Animated.Value(0)
    }

    /** @type {React.RefObject<Swiper>} */
    refSwiper = React.createRef();

    /** @type {Array<ItemCategory>} */
    allCategoriesItems = dataManager.skills.categories.map(CategoryToItem);

    componentDidMount() {
        const isRecentSkills = GetRecentSkills(undefined).length > 0;
        this.refSwiper.current?.GoTo(isRecentSkills ? 0 : 1);
    }

    handleSearchButton = () => {
        const { isSearching } = this.state;
        SpringAnimation(this.state.animSearch, isSearching ? 0 : 1).start();
        this.setState({ isSearching: !isSearching });
        this.refSwiper.current?.GoTo(0);
    }
    /** @param {string} search */
    handleSearchInput = (search) => {
        this.setState({ search: search.toLowerCase() });
    }

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
                        user.interface.popup.Close();
                    }}
                />
            );
        } else {
            const selectedCategory = this.allCategoriesItems.find(category => category.id === this.state.selectedCategory);
            title = selectedCategory?.name ?? '[ERROR]';
            pages.push(...this.allCategoriesItems.map(category =>
                <RenderSkillsMemo
                    category={category}
                    callback={(id) => {
                        this.props.callback(id);
                        user.interface.popup.Close();
                    }}
                />
            ));
        }

        const styleAnimCategories = {
            transform: [
                { translateY: 10 },
                { translateY: Animated.multiply(-100, animSearch) }
            ]
        };
        const styleAnimSearch = {
            transform: [
                { translateY: -40 },
                { translateY: Animated.multiply(-100, Animated.subtract(1, animSearch)) }
            ]
        };

        // Get swiper height from popup height (max 80% screen height)
        const { height } = Dimensions.get('window');
        const swiperHeight = Math.min(500, height * .8 - 142 - 16);

        return (
            <View style={styles.popup}>
                {/* Categories */}
                <Animated.View style={[styles.categoriesContainer, styleAnimCategories]}>
                    <ScrollView style={styles.categoriesScrollView} horizontal>
                        {this.allCategoriesItems.map(category => this.renderCategory({ item: category }))}
                    </ScrollView>
                </Animated.View>

                {/* Search */}
                <Animated.View style={[styles.searchContainer, styleAnimSearch]}>
                    <Input
                        label={lang['popup-all-categories']}
                        text={search}
                        onChangeText={this.handleSearchInput}
                    />
                </Animated.View>

                {/* Title & search button */}
                <View style={styles.containerTitle}>
                    <Text fontSize={isSearching ? 16 : 24}>{title}</Text>
                    <Button style={styles.searchButton} onPress={this.handleSearchButton}>
                        <Icon
                            icon={isSearching ? 'cross' : 'magnifyingGlass'}
                            size={28}
                        />
                    </Button>
                </View>

                {/* Skills list */}
                <Swiper
                    ref={this.refSwiper}
                    height={swiperHeight}
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
    popup: {
        overflow: 'hidden'
    },

    category: {
        marginVertical: 4,
        marginHorizontal: 4
    },
    categoriesContainer: {
        marginTop: 6,
        alignItems: 'center'
    },
    categoriesScrollView: {
        maxWidth: '100%',
        marginBottom: 0
    },

    searchContainer: {
        height: 24,
        marginHorizontal: 16
    },

    containerTitle: {
        marginBottom: 4,
        marginHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    searchButton: {
        aspectRatio: 1,
        paddingHorizontal: 0
    }
});

export default ActivitySelector;
