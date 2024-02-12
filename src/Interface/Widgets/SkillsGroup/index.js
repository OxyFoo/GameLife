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
    /** @param {{ item: EnrichedSkill | null }} param0 */
    renderSkill = ({ item }) => {
        const lang = langManager.curr['other'];

        if (item === null) {
            return (
                <TouchableOpacity
                    style={styles.skill}
                    onPress={this.openSkills}
                    activeOpacity={.6}
                >
                    <View style={styles.skillImage}>
                        <Icon xml={'default'} size={42} color='main1' />
                    </View>
                    <Text fontSize={12}>{lang['widget-skills-all']}</Text>
                </TouchableOpacity>
            );
        }

        const { ID, FullName, LogoXML } = item;

        return (
            <TouchableOpacity
                style={styles.skill}
                onPress={() => this.openSkill(ID)}
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

        return (
            <View style={[styles.container, style]}>
                <FlatList
                    data={[...this.state.skills, null]}
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
