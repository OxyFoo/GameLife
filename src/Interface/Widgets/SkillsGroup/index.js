import * as React from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';

import styles from './style';
import SkillsGroupBack from './back';
import langManager from 'Managers/LangManager';

import { Text, Icon } from 'Interface/Components';

/**
 * @typedef {import('Types/Data/App/Skills').EnrichedSkill} EnrichedSkill
 */

class SkillsGroup extends SkillsGroupBack {
    render() {
        const lang = langManager.curr['home'];
        const { style } = this.props;
        const { skills } = this.state;

        if (skills.length <= 0) {
            return (
                <View style={[styles.container, style]}>
                    <Text>{lang['container-skills-empty']}</Text>
                </View>
            );
        }

        return (
            <View style={[styles.container, style]}>
                <FlatList
                    style={styles.flatlist}
                    data={skills}
                    renderItem={this.renderSkill}
                    keyExtractor={(_item, index) => 'skill-' + index}
                    numColumns={2}
                    ItemSeparatorComponent={() => <View style={styles.skillSpace} />}
                    scrollEnabled={false}
                />
            </View>
        );
    }

    /** @param {{ item: EnrichedSkill | null }} param0 */
    renderSkill = ({ item }) => {
        const lang = langManager.curr['other'];

        if (item === null) {
            return (
                <TouchableOpacity style={styles.skill} onPress={this.openSkills} activeOpacity={0.6}>
                    <View style={styles.skillImage}>
                        <Icon xml={'default'} size={42} color='main1' />
                    </View>
                    <Text fontSize={12}>{lang['widget-skills-all']}</Text>
                </TouchableOpacity>
            );
        }

        const { ID, FullName, LogoXML } = item;

        return (
            <TouchableOpacity style={styles.skill} onPress={() => this.openSkill(ID)} activeOpacity={0.6}>
                <View style={styles.skillImage}>
                    <Icon xml={LogoXML} size={42} color='main1' />
                </View>
                <Text fontSize={12}>{FullName}</Text>
            </TouchableOpacity>
        );
    };
}

export default SkillsGroup;
