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
    /** @param {{ item: EnrichedSkill }} param0 */
    renderSkill = ({ item }) => {
        const lang = langManager.curr['other'];

        let ID, FullName, LogoXML, onPressSkill;

        if (!item || item.ID == null || item.FullName == null || item.LogoXML == null) {
            ID = -1;
            FullName = lang['widget-skills-all'];
            LogoXML = 'default';
            onPressSkill = () => this.openSkills();
        }
        else {
            ID = item.ID;
            FullName = item.FullName;
            LogoXML = item.LogoXML;
            onPressSkill = () => this.openSkill(ID);
        }

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

        return (
            <View
                style={[styles.container, style]}>
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
