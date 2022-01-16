import * as React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import langManager from '../../Managers/LangManager';
import themeManager from '../../Managers/ThemeManager';

import BackSkills from '../PageBack/skills';
import { GLDropDown, GLHeader, GLIconButton, GLSearchBar, GLSkillBox, GLText } from '../Components';

class Skills extends BackSkills {
    render() {
        const sort = this.SORT_LIST[this.state.sortSelectedIndex];
        const orderIcon = this.state.ascending ? 'chevronBottom' : 'chevronTop';

        return (
            <View style={{ flex: 1 }}>
                {/* Header */}
                <GLHeader
                    title={langManager.curr['skills']['page-title']}
                    leftIcon="back"
                    onPressLeft={this.back}
                    rightIcon="plus"
                    onPressRight={this.addSkill}
                />

                {/* Topbar */}
                <View style={[styles.topBar, { backgroundColor: themeManager.colors['globalBackcomponent'] }]}>
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
                        color={'secondary'}
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
                        ListEmptyComponent={() => (
                            <GLText style={styles.emptyText} title={langManager.curr['skills']['text-empty']} />
                        )}
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
        borderTopWidth: 2
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
        marginBottom: -3,
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
    },
    emptyText: {
        marginTop: 48
    }
});

export default Skills;