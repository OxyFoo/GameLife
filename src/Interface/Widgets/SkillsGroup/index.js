import * as React from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';

import styles from './style';
import SkillsGroupBack from './back';
import langManager from 'Managers/LangManager';

import { Text, Icon } from 'Interface/Components';

/**
 * @typedef {import('Data/Skills').EnrichedSkill} EnrichedSkill
 */

class SkillsGroup extends SkillsGroupBack {
    /* @param {{ item: { ID: number, FullName: string, LogoXML: string }}} params - The item to render. */
    renderSkill = ({ item: { ID, FullName, LogoXML } }) => {
        const onPressSkill = () => ID === -1 ? this.openSkills() : this.openSkill(ID);
        return (
            <TouchableOpacity
                style={styles.skill}
                onPress={onPressSkill}
                activeOpacity={.6}
            >
                <View style={styles.skillImage}>
                    <Icon xml={LogoXML} size={42} color='main1' />
                </View>
                <Text fontSize={12}>{FullName}</Text>
            </TouchableOpacity>
        );
    }

    render() {
        const { style } = this.props;
        const lang = langManager.curr['other'];

        const allSkills = {
            ID: -1,
            FullName: lang['widget-skills-all'],
            LogoXML: 'default'
        };

        return (
            <View
                style={[styles.container, style]}>
                <FlatList
                    data={[...this.state.skills, allSkills]}
                    renderItem={this.renderSkill}
                    keyExtractor={(item, index) => 'skill-' + index}
                    numColumns={2}
                    ItemSeparatorComponent={() => <View style={styles.skillSpace} />}
                    scrollEnabled={false}
                />
            </View>
        );
    }
}

export default SkillsGroup;
