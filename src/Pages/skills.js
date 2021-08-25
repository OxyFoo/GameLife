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
        ascending: true,
        sortSelectedIndex: 0,
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

    refreshSkills = () => {
        const search = this.state.search;
        const filter = undefined;
        const sort = this.state.sortSelectedIndex;
        const ascending = this.state.ascending;
        const skills = user.experience.getAllSkills(search, filter, sort, ascending);
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
                    <GLDropDown
                        style={styles.filter}
                        styleBox={styles.filterBox}
                        data={data}
                        value={langManager.curr['skills']['top-filter-default']}
                    />
                    <GLText
                        containerStyle={{ flex: 1 }}
                        title={sort}
                        onPress={this.switchSort}
                    />
                </View>

                {/* Content */}
                <View style={{ flex: 1 }}>
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
        backgroundColor: '#000000',
        zIndex: 100,
        elevation: 100
    },
    search: { width: '40%', height: '100%' },
    filter: {
        width: '40%',
        marginVertical: 0,
        marginHorizontal: 0,
        marginBottom: -3
    },
    filterBox: {
        height: '100%',
        borderTopWidth: 0,
        borderBottomWidth: 0
    },
    sort: { width: '20%' },
    floatingButton: {
        position: 'absolute',
        right: 12,
        bottom: 12
    }
});

export default Skills;