import * as React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { GetDate } from 'Utils/Time';
import { DateToFormatString } from 'Utils/Date';
import { Text, Button, IconCheckable, Icon } from 'Interface/Components';

/**
 * @typedef {import('./index').default} SkillsPage
 * @typedef {import('Data/Skills').EnrichedSkill} EnrichedSkill
 * @typedef {import('Data/Skills').Category} Category
 */

/**
 * @this {SkillsPage}
 * @param {{item: Category}} item
 * @returns {JSX.Element}
 */
function renderCategory({ item }) {
    const { ID, LogoID } = item;

    const checked = this.state.selectedCategories.includes(ID);
    const icon = dataManager.skills.GetXmlByLogoID(LogoID);

    return (
        <IconCheckable
            style={styles.categoryIcon}
            id={ID}
            xml={icon}
            size={32}
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
    const onPress = () => user.interface.ChangePage('skill', { skillID: ID });

    return (
        <TouchableOpacity
            style={[styles.skillCard, this.backgroundCard]}
            onPress={onPress}
            activeOpacity={.6}
        >
            <View style={[styles.skillIcon, this.backgroundActive]}>
                <Icon xml={LogoXML} size={64} />
            </View>

            <View style={styles.skillContent}>
                <Text style={styles.skillTitle} fontSize={24}>{FullName}</Text>
                <Text style={styles.skillText}>{text}</Text>
                <Text style={styles.skillText}>{last}</Text>
            </View>
        </TouchableOpacity>
    );
}

/**
 * @this {SkillsPage}
 * @returns {JSX.Element}
 */
function renderEmpty() {
    const lang = langManager.curr['skills'];
    return (
        <View style={styles.emptyContent}>
            <Text>{lang['text-empty']}</Text>
            <Button
                style={styles.emptyButtonAddActivity}
                borderRadius={8}
                color='main2'
                onPress={this.addActivity}
            >
                {lang['text-add']}
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    categoryIcon: {
        marginBottom: 8
    },

    skillCard: {
        marginBottom: 24,
        borderRadius: 12,
        flexDirection: 'row'
    },
    skillIcon: {
        width: 88,
        margin: 12,
        padding: 12,
        borderRadius: 12
    },
    skillContent: {
        paddingVertical: 12,
        justifyContent: 'space-between'
    },
    skillTitle: {
        textAlign: 'left',
        marginBottom: 6
    },
    skillText: {
        textAlign: 'left'
    },

    emptyContent: {
        padding: 12
    },
    emptyButtonAddActivity: {
        width: '50%',
        height: 48,
        marginTop: 24,
        marginLeft: '25%'
    }
});

export { renderCategory, renderSkill, renderEmpty };
