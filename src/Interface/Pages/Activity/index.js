import * as React from 'react';
import { View, FlatList } from 'react-native';

import BackActivity from './back';
import renderPanel from './panel';
import styles from './style';
import user from '../../../Managers/UserManager';
import langManager from '../../../Managers/LangManager';

import { Page, Text, ComboBox, IconCheckable } from '../../Components';
import { PageHeader } from '../../Widgets';

class Activity extends BackActivity {
    renderCategory = ({ item }) => {
        if (item === 0) {
            return <View style={styles.categoryEmpty} />;
        }

        const { ID, icon } = item;
        const checked = this.state.selectedCategory === ID;

        return (
            <IconCheckable
                style={styles.category}
                id={ID}
                xml={icon}
                size={32}
                checked={checked}
                onPress={this.selectCategory}
                pressable={!this.state.visualisationMode}
            />
        );
    }

    render() {
        const lang = langManager.curr['activity'];

        return (
            <Page
                ref={ref => this.refPage = ref}
                style={styles.page}
                scrollable={this.state.selectedSkill.id !== 0}
                canScrollOver={false}
            >
                <PageHeader
                    style={styles.header}
                    onBackPress={user.interface.BackPage}
                />

                <View style={styles.parent}>

                    {/* Categories */}
                    <Text style={styles.categoriesTitle} bold>
                        {lang['title-category']}
                    </Text>
                    <FlatList
                        style={styles.categoriesFlatlist}
                        columnWrapperStyle={styles.categoriesWrapper}
                        data={this.state.categories}
                        renderItem={this.renderCategory}
                        numColumns={6}
                        keyExtractor={item => 'act-cat-' + item.ID}
                    />

                    {/* Activities */}
                    <Text style={styles.activitiesTitle} bold>
                        {lang['title-activity']}
                    </Text>
                    <ComboBox
                        pageRef={this.refPage}
                        style={styles.activitiesCombobox}
                        data={this.state.skills}
                        title={this.getCategoryName()}
                        setSearchBar={true}
                        selectedValue={this.state.selectedSkill.value}
                        onSelect={this.selectActivity}
                        enabled={!this.state.visualisationMode}
                    />

                </View>

                {/* Panel */}
                { renderPanel.call(this) }

            </Page>
        );
    }
}

export default Activity;