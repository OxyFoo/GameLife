import * as React from 'react';
import { Animated, View } from 'react-native';

import BackActivityPage1 from './back';
import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Text, IconCheckable, InputText, Button, Icon } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('../types').ItemSkill} ItemSkill
 * @typedef {import('../types').ItemCategory} ItemCategory
 * @typedef {import('react-native').ListRenderItem<ItemSkill>} ListRenderItemItemSkill
 */

class AddActivityPage1 extends BackActivityPage1 {
    render() {
        const lang = langManager.curr['activity'];
        const { listSkillsIDs } = this.props;
        const { searchEnabled, skillSearch, animSearch, skills, selectedCategory, inputText } = this.state;

        let title = lang['title-category'];
        if (listSkillsIDs.length > 0) {
            title = lang['title-preselected'];
        } else if (selectedCategory !== null) {
            title = this.categoriesNames[selectedCategory];
        }

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
                            <Icon icon='rounded-magnifer-outline' size={24} color='white' />
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
                    {title}
                </Text>

                {/* Activities List */}
                <Animated.FlatList
                    ref={user.interface.bottomPanel?.mover.SetScrollView}
                    style={styles.activitiesFlatlist}
                    onLayout={this.onLayoutFlatlist}
                    onContentSizeChange={this.onContentSizeChange}
                    data={skills}
                    initialNumToRender={15}
                    windowSize={100}
                    renderItem={this.renderSkill}
                    keyExtractor={(item) => 'act-skill-' + item.id}
                    ListEmptyComponent={this.renderEmptyList}
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: {
                                        y: this.state.animScroll
                                    }
                                }
                            }
                        ],
                        { useNativeDriver: true }
                    )}
                    scrollEnabled={false}
                />
            </View>
        );
    }

    /**
     * @param {ItemCategory | null} value
     * @param {number} _index
     * @param {Array<ItemCategory | null>} _array
     * @returns {JSX.Element | null}
     */
    renderCategory = (value, _index, _array) => {
        // If there are preselected skills, do not show categories
        if (this.preselectedSkillsIDs.length > 0) {
            return null;
        }

        if (value === null) {
            return <View style={styles.categoryEmpty} />;
        }

        const { id, icon } = value;
        const checked = this.state.selectedCategory === id;

        return (
            <IconCheckable
                key={`category-${id}`}
                style={styles.category}
                id={id}
                xml={icon}
                size={24}
                checked={checked}
                onPress={this.selectCategory}
            />
        );
    };

    /** @type {ListRenderItemItemSkill} */
    renderSkill = ({ item, index }) => {
        const { id, value, onPress } = item;
        const { flatlistHeight, buttonHeight } = this.state;
        const topItemPosY = buttonHeight * index;
        const topNextItemPosY = buttonHeight * (index + 1);

        return (
            <Button
                onLayout={this.onLayoutActivity}
                style={styles.activityElement}
                styleAnimation={
                    buttonHeight === 0 || flatlistHeight === 0
                        ? {}
                        : {
                              opacity: this.state.animScroll.interpolate({
                                  inputRange: [
                                      topItemPosY - flatlistHeight,
                                      topItemPosY - flatlistHeight + buttonHeight,
                                      topItemPosY,
                                      topNextItemPosY
                                  ],
                                  outputRange: [0, 1, 1, 0],
                                  extrapolate: 'clamp'
                              }),
                              transform: [
                                  {
                                      translateY: this.state.animScroll.interpolate({
                                          inputRange: [
                                              topItemPosY - flatlistHeight,
                                              topItemPosY - flatlistHeight + buttonHeight,
                                              topItemPosY,
                                              topNextItemPosY
                                          ],
                                          outputRange: [20, 0, 0, -20],
                                          extrapolate: 'clamp'
                                      })
                                  },
                                  {
                                      scale: this.state.animScroll.interpolate({
                                          inputRange: [
                                              topItemPosY - flatlistHeight,
                                              topItemPosY - flatlistHeight + buttonHeight,
                                              topItemPosY,
                                              topNextItemPosY
                                          ],
                                          outputRange: [0.9, 1, 1, 0.9],
                                          extrapolate: 'clamp'
                                      })
                                  }
                              ]
                          }
                }
                appearance='outline'
                borderColor='secondary'
                fontColor='primary'
                onPress={onPress}
                onLongPress={() => this.openSkill(id)}
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
