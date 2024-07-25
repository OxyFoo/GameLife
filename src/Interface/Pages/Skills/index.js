import * as React from 'react';
import { View, FlatList } from 'react-native';

import styles from './style';
import BackSkills from './back';
import { renderCategory, renderSkill } from './renders';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { Input, Button, Icon, Text } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

class Skills extends BackSkills {
    render() {
        const { sortSelectedIndex, search, selectedCategories, skills, ascending } = this.state;
        const lang = langManager.curr['skills'];
        const sortType = this.sortList[sortSelectedIndex];

        let categories = dataManager.skills.categories;
        if (categories.length % 6 !== 0) {
            categories.push(...Array(6 - (categories.length % 6)).fill(0));
        }

        return (
            <View style={styles.page}>
                <PageHeader title={lang['title']} onBackPress={this.handleBack} />

                {/* <Input
                    style={styles.inputSearch}
                    label={lang['input-search']}
                    text={search}
                    onChangeText={this.onChangeSearch}
                /> */}

                {/* Categories buttons */}
                <View style={styles.categoriesContainer}>{categories.map(renderCategory.bind(this))}</View>

                {/* Category text & Sort button */}
                <View style={styles.rowSort}>
                    <Text style={styles.secondaryTitleText} color='light'>
                        {
                            'test' /*selectedCategory === null ? lang['title-category'] : this.categoriesNames[selectedCategory]*/
                        }
                    </Text>
                    <View />
                    <Button
                        style={styles.buttonSortType}
                        appearance='uniform'
                        color='transparent'
                        fontColor='border'
                        onPress={this.onSwitchSort}
                    >
                        {`Trier par: ${sortType}`}
                    </Button>
                </View>

                <FlatList
                    ref={this.refSkills}
                    data={skills}
                    keyExtractor={(item) => `skill-${item.ID}`}
                    renderItem={renderSkill.bind(this)}
                    ListEmptyComponent={this.renderEmpty}
                />

                {/* Search button */}
                <View style={{ position: 'absolute', top: 32, right: 24 }}>
                    <Button
                        style={styles.buttonAscendType}
                        appearance='uniform'
                        color='transparent'
                        onPress={() => console.log('TODO: Search')}
                    >
                        <Icon icon='rounded-magnifer-outline' size={28} />
                    </Button>
                </View>

                {/* Ascending/Descending button */}
                <View style={{ position: 'absolute', bottom: 24, right: 24 }}>
                    <Button style={styles.buttonAscendType} onPress={this.switchOrder}>
                        <Icon icon='filter-outline' color='ground1' angle={ascending ? 0 : 180} size={38} />
                    </Button>
                </View>
            </View>
        );
    }

    renderEmpty = () => {
        const lang = langManager.curr['skills'];
        return (
            <View style={styles.emptyContent}>
                <Text>{lang['text-empty']}</Text>
                <Button style={styles.emptyButtonAddActivity} onPress={this.addActivity}>
                    {lang['text-add']}
                </Button>
            </View>
        );
    };
}

export default Skills;
