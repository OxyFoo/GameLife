import * as React from 'react';
import { View, FlatList } from 'react-native';

import styles from './style';
import BackSkills from './back';
import { renderCategory, renderSkill } from './renders';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { Button, Icon, Text, InputText } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

class Skills extends BackSkills {
    render() {
        const { sortSelectedIndex, search, skills, ascending } = this.state;
        const lang = langManager.curr['skills'];

        const sortType = this.sortList[sortSelectedIndex];
        const categories = dataManager.skills.categories.slice(1);

        return (
            <View style={styles.page}>
                <PageHeader title={lang['title']} onBackPress={this.handleBack} />

                {/* Categories buttons */}
                <View style={styles.categoriesContainer}>{categories.map(renderCategory.bind(this))}</View>

                {/* Category text & Sort button */}
                <View style={styles.rowSort}>
                    <InputText.Thin
                        containerStyle={styles.searchbarInput}
                        placeholder={lang['input-search']}
                        icon='rounded-magnifer-outline'
                        value={search}
                        onChangeText={this.onChangeSearch}
                    />

                    <Button
                        style={styles.buttonSortType}
                        appearance='uniform'
                        color='transparent'
                        fontColor='border'
                        onPress={this.onSwitchSort}
                    >
                        {`${lang['input-sort']} ${sortType}`}
                    </Button>
                </View>

                <FlatList
                    ref={this.refSkills}
                    style={styles.skillsFlatlist}
                    data={skills}
                    keyExtractor={(item) => `skill-${item.ID}`}
                    renderItem={renderSkill.bind(this)}
                    ListEmptyComponent={this.renderEmpty}
                />

                {/* Ascending/Descending button */}
                <View style={styles.ascendView}>
                    <Button style={styles.ascendButton} appearance='uniform' color='main1' onPress={this.switchOrder}>
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
