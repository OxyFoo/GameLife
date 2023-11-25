import * as React from 'react';
import { View, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Button, Text, Icon } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {import('Data/Skills').EnrichedSkill} EnrichedSkill
 */

const SkillsGroupProps = {
    /** @type {StyleProp} */
    style: {}
}

class SkillsGroup extends React.Component {
    state = {
        skills: user.activities.GetLastSkills()
    }

    componentDidMount() {
        this.activitiesListener = user.activities.allActivities.AddListener(() => {
            this.setState({ skills: user.activities.GetLastSkills() });
        });
    }

    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    openSkills = () => user.interface.ChangePage('skills');
    openSkill = (ID) => user.interface.ChangePage('skill', { skillID: ID });

    /**
     * @param {{ item: EnrichedSkill }} param0
     * @returns {JSX.Element} L'élément JSX représentant une compétence dans la liste.
     */
    renderSkill = ({ item: { ID, FullName, LogoXML } }) => {
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

SkillsGroup.prototype.props = SkillsGroupProps;
SkillsGroup.defaultProps = SkillsGroupProps;

const styles = StyleSheet.create({
    skill: {
        width: '33%',
        alignItems: 'center'
    },
    skillImage: {
        width: '60%',
        aspectRatio: 1,
        marginBottom: 6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 4
    },
    skillSpace: {
        height: 12
    },
    btnAllSkill: {
        height: 46,
        marginHorizontal: 24,
        borderRadius: 8
    }
});

export default SkillsGroup;