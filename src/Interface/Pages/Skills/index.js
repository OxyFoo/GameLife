import * as React from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';

import BackSkills from './back';
import { renderCategory, renderSkill, renderEmpty } from './renders';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';
import themeManager from 'Managers/ThemeManager';

import { Page } from 'Interface/Global';
import { Input, Button } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

const SCREEN_WIDTH = Dimensions.get('window').width;

class Skills extends BackSkills {
    backgroundActive = { backgroundColor: themeManager.GetColor('main1') };
    backgroundCard = { backgroundColor: themeManager.GetColor('backgroundCard') };

    render() {
        const { sortSelectedIndex, search, height, skills, ascending } = this.state;
        const lang = langManager.curr['skills'];
        const sortType = this.sortList[sortSelectedIndex];

        let categories = dataManager.skills.categories;
        if (categories.length % 6 !== 0) {
            categories.push(...Array(6 - (categories.length % 6)).fill(0));
        }

        return (
            <Page ref={this.refPage} scrollable={false}>

                <View onLayout={this.setheight}>
                    <PageHeader onBackPress={user.interface.BackHandle} />

                    <View style={styles.row}>
                        <Input
                            style={{ width: SCREEN_WIDTH - 80 - 96 }}
                            label={lang['input-search']}
                            text={search}
                            onChangeText={this.onChangeSearch}
                        />
                        <Button
                            style={styles.buttonSortType}
                            borderRadius={8}
                            color='backgroundCard'
                            icon='filter'
                            onPress={this.onSwitchSort}
                        >
                            {sortType}
                        </Button>
                    </View>

                    <FlatList
                        data={categories}
                        columnWrapperStyle={styles.categoryFlatlist}
                        renderItem={renderCategory.bind(this)}
                        numColumns={6}
                        keyExtractor={(item, index) => 'category-' + index}
                    />
                </View>

                <View style={[styles.skillsParent, { top: height }]}>
                    <FlatList
                        ref={ref => this.refSkills = ref}
                        style={styles.skillsFlatlist}
                        ListEmptyComponent={renderEmpty.bind(this)}
                        data={skills}
                        renderItem={renderSkill.bind(this)}
                        keyExtractor={(item, index) => 'skill-' + index}
                    />
                </View>

                <Button
                    style={styles.buttonSort}
                    color='main2'
                    icon='chevron'
                    iconAngle={ascending ? 90 : -90}
                    onPress={this.switchOrder}
                />
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    row: {
        marginBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    buttonSortType: {
        width: 96,
        paddingHorizontal: 12
    },

    categoryFlatlist: {
        justifyContent: 'space-between'
    },

    skillsParent: {
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 0
    },
    skillsFlatlist: {
        flex: 1
    },
    buttonSort: {
        position: 'absolute',
        right: 24,
        bottom: 24,
        aspectRatio: 1,
        paddingHorizontal: 0
    }
});

export default Skills;
