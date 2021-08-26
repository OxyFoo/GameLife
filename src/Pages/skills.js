import * as React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import user from '../Managers/UserManager';
import langManager from '../Managers/LangManager';
import { GLDropDown, GLHeader, GLIconButton, GLSearchBar, GLSkillBox, GLText } from '../Components/GL-Components';

const data = [
    { key: 0, value: 'Test1' },
    { key: 1, value: 'Test2' },
    { key: 2, value: 'Test3' }
];

const SORT_LIST = langManager.curr['skills']['top-sort-list'];

class Skills extends React.Component {
    state = {
        search: '',
        filters: user.getSkillCategories(true),
        selectedFiltersIndex: [],
        sortSelectedIndex: 0,
        ascending: true,
        skills: user.experience.getAllSkills(undefined, undefined, 0, true)
    }

    back = () => { user.backPage(); }
    switchSort = () => {
        const newIndex = (this.state.sortSelectedIndex + 1) % SORT_LIST.length;
        this.setState({ sortSelectedIndex: newIndex });
        setTimeout(this.refreshSkills, 50);
    }
    switchOrder = () => {
        this.setState({ ascending: !this.state.ascending });
        setTimeout(this.refreshSkills, 50);
    }
    changeText = (newText) => {
        this.setState({ search: newText });
        setTimeout(this.refreshSkills, 50);
    }
    filterChange = (indexes) => {
        this.setState({ selectedFiltersIndex: indexes });
        setTimeout(this.refreshSkills, 50);
    }

    refreshSkills = () => {
        const search = this.state.search;
        let filters = [];
        for (let i = 0; i < this.state.selectedFiltersIndex.length; i++) {
            filters.push(this.state.filters[this.state.selectedFiltersIndex[i]].value);
        }
        const sort = this.state.sortSelectedIndex;
        const ascending = this.state.ascending;
        const skills = user.experience.getAllSkills(search, filters, sort, ascending);
        this.setState({ skills: skills });
    }

    render() {
        const sort = SORT_LIST[this.state.sortSelectedIndex];
        const orderIcon = this.state.ascending ? 'chevronBottom' : 'chevronTop';

        return (
            <View style={{ flex: 1 }}>
                {/* Header */}
                <GLHeader
                    title={langManager.curr['skills']['page-title']}
                    leftIcon="back"
                    onPressLeft={this.back}
                />

                {/* Topbar */}
                <View style={styles.topBar}>
                    <GLSearchBar
                        style={styles.search}
                        onChangeText={this.changeText}
                        placeholder={langManager.curr['skills']['top-search-placeholder']}
                    />
                    <GLText
                        style={styles.sort}
                        containerStyle={{ flex: 1 }}
                        title={sort}
                        onPress={this.switchSort}
                    />
                </View>

                {/* Filters out of topbar but absolute to keep in, FUCK U RN */}
                <GLDropDown
                    style={styles.filter}
                    styleBox={styles.filterBox}
                    onSelect={this.filterChange}
                    data={this.state.filters}
                    disabled={this.state.filters.length <= 0}
                    value={langManager.curr['skills']['top-filter-default']}
                    toggleMode={true}
                />

                {/* Content */}
                <View style={styles.content}>
                    <FlatList
                        data={this.state.skills}
                        keyExtractor={(item, i) => 'lang_' + i}
                        renderItem={({ item }) => (
                            <GLSkillBox item={item} />
                        )}
                    />

                    {/* Floating bottom right button */}
                    <GLIconButton
                        style={styles.floatingButton}
                        icon={orderIcon}
                        size={64}
                        onPress={this.switchOrder}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    topBar: {
        width: '100%',
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#FFFFFF',
        borderWidth: 3,
        borderTopWidth: 2,
        backgroundColor: '#000000'
    },
    search: {
        width: '40%',
        height: '100%'
    },
    filter: {
        position: 'absolute',
        top: 64,
        left: '40%',
        width: '40%',
        height: 48,
        marginVertical: 0,
        marginHorizontal: 0,
        marginBottom: -3
    },
    filterBox: {
        height: '100%',
        borderTopWidth: 0,
        borderBottomWidth: 0
    },
    sort: {
        width: '34%',
        paddingVertical: 6,
        marginLeft: '66%'
    },
    content: {
        flex: 1
    },
    floatingButton: {
        position: 'absolute',
        right: 12,
        bottom: 12
    }
});

export default Skills;