import * as React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';
import themeManager from 'Managers/ThemeManager';

import { Text, IconCheckable, Icon } from 'Interface/Components';
import { GetDate } from 'Utils/Time';
import { DateToFormatString } from 'Utils/Date';

/**
 * @typedef {import('./index').default} SkillsPage
 * @typedef {import('Data/Skills').Category} Category
 * @typedef {import('Data/Skills').EnrichedSkill} EnrichedSkill
 */

/**
 * @this {SkillsPage}
 * @param {Category | null} value
 * @param {number} _index
 * @param {Array<Category | null>} _array
 * @returns {JSX.Element | null}
 */
function renderCategory(value, _index, _array) {
    if (value === null) {
        return null;
    }

    const { ID, LogoID } = value;
    const checked = this.state.selectedCategories.includes(ID);
    const icon = dataManager.skills.GetXmlByLogoID(LogoID);

    return (
        <IconCheckable
            key={`category-${ID}`}
            style={styles.category}
            id={ID}
            xml={icon}
            size={24}
            checked={checked}
            onPress={this.onSwitchCategory}
        />
    );
}

/**
 * @this {SkillsPage}
 * @param {{item: EnrichedSkill}} item
 * @returns {JSX.Element}
 */
function renderSkill({ item }) {
    const { ID, LogoXML, FullName, Experience } = item;

    const xpLang = langManager.curr['level'];
    const { lvl, lastTime } = Experience;
    const text = `${xpLang['level']} ${lvl}`;
    const last = DateToFormatString(GetDate(lastTime));
    const onPress = () => user.interface.ChangePage('skill', { args: { skillID: ID } });

    return (
        <TouchableOpacity style={styles.skillItem} onPress={onPress} activeOpacity={0.6}>
            <LinearGradient
                style={styles.skillGradient}
                colors={[
                    themeManager.GetColor('ground1', { opacity: 0.55 }),
                    themeManager.GetColor('ground1', { opacity: 0.25 })
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                {/* Skill header (icon + name) */}
                <View style={styles.skillHeader}>
                    <Icon xml={LogoXML} size={28} />
                    <Text style={styles.skillTitle} fontSize={24}>
                        {FullName}
                    </Text>
                </View>

                <View style={styles.skillDetails}>
                    <Text style={styles.skillLvlText} color='main2'>
                        {text}
                    </Text>
                    <Icon icon='arrow-square' size={24} angle={90} color='gradient' />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    category: {
        flex: 1,
        paddingHorizontal: 0,
        marginVertical: 4,
        marginHorizontal: 4
    },

    skillItem: {
        marginBottom: 8,
        flexDirection: 'row'
    },
    skillGradient: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 8
    },
    skillHeader: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    skillTitle: {
        marginLeft: 12,
        fontSize: 16
    },

    skillDetails: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    skillLvlText: {
        marginRight: 12,
        fontSize: 14
    }
});

export { renderCategory, renderSkill };
