import * as React from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';

import styles from './style';
import SkillsGroupBack from './back';
import langManager from 'Managers/LangManager';

import { Button, Text, Icon } from 'Interface/Components';

/**
 * @typedef {import('Data/Skills').EnrichedSkill} EnrichedSkill
 */

class SkillsGroup extends SkillsGroupBack {
    /** @param {{ item: EnrichedSkill }} param0 */
    renderSkill = ({ item: { ID, FullName, LogoXML } }) => (
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
    )

    render() {
        const { style } = this.props;
        const lang = langManager.curr['other'];
        const styleButton = { marginTop: this.state.skills.length === 0 ? 0 : 24 };

        return (
            <>
                <FlatList
                    style={style}
                    data={this.state.skills}
                    renderItem={this.renderSkill}
                    keyExtractor={(item, index) => 'skill-' + index}
                    numColumns={3}
                    ItemSeparatorComponent={() => <View style={styles.skillSpace} />}
                    scrollEnabled={false}
                />

                <Button
                    style={[styles.btnAllSkill, styleButton]}
                    onPress={this.openSkills}
                >
                    {lang['widget-skills-all']}
                </Button>
            </>
        );
    }
}

export default SkillsGroup;
