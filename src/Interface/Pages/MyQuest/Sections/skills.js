import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import ActivitySelector from './ActivitySelector';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';
import themeManager from 'Managers/ThemeManager';

import { Button, Text, Icon } from 'Interface/Components';
import { GetLocalTime } from 'Utils/Time';

const MAX_SKILLS = 10;

/**
 * @typedef {import('Data/Skills').Skill} Skill
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 * @typedef {import('Interface/Global/ScreenList').ScreenListItem} ScreenListItem
 *
 * @typedef {Object} SectionSkillPropsType
 * @property {MyQuest | null} quest
 * @property {(quest: MyQuest) => void} onChangeQuest
 */

/**
 * @template {any} T
 * @typedef {import('Interface/Global/Popup/back').PopupOpenType<T>} PopupOpenType
 */

/** @type {SectionSkillPropsType} */
const SectionSkillProps = {
    quest: null,
    onChangeQuest: () => {}
};

class SectionSkill extends React.Component {
    OpenCategoriesSelection = () => {
        const title = langManager.curr['quest']['input-panel-category'];
        /** @type {Array<ScreenListItem>} */
        const data = dataManager.skills.categories.map((category) => ({
            id: category.ID,
            value: langManager.GetText(category.Name)
        }));
        user.interface.screenList?.Open(title, data, (id) => {
            setTimeout(() => {
                this.OpenSkillSelection(id);
            }, 100);
        });
    };

    /** @param {number} categoryID */
    OpenSkillSelection = (categoryID) => {
        const title = langManager.curr['quest']['input-panel-activity'];

        /** @type {Array<ScreenListItem>} */
        let data = [];

        // If category is 'Recent'
        if (categoryID === 0) {
            const now = GetLocalTime();
            const usersActivities = user.activities
                .Get()
                .filter((activity) => activity.startTime <= now)
                .sort((a, b) => b.startTime - a.startTime);
            for (const activity of usersActivities) {
                const skill = dataManager.skills.GetByID(activity.skillID);
                if (skill !== null && !data.find((s) => s.id === skill.ID)) {
                    data.push({
                        id: skill.ID,
                        value: langManager.GetText(skill.Name)
                    });
                }
            }
        }

        // If it's a category
        else {
            /** @type {Array<ScreenListItem>} */
            data = dataManager.skills.GetByCategory(categoryID).map((skill) => ({
                id: skill.ID,
                value: langManager.GetText(skill.Name)
            }));
        }

        if (data.length !== 0) {
            user.interface.screenList?.Open(title, data, (id) => {
                const { quest, onChangeQuest } = this.props;
                if (quest === null || quest.skills.length >= MAX_SKILLS || quest.skills.includes(id)) {
                    return;
                }
                onChangeQuest({ ...quest, skills: [...quest.skills, id] });
            });
        }
    };

    /** @param {number} skillID */
    handleUnselectSkill = (skillID) => {
        const { quest, onChangeQuest } = this.props;
        if (quest === null) return;

        onChangeQuest({
            ...quest,
            skills: quest.skills.filter((id) => id !== skillID)
        });
    };

    /**
     * @param {Object} props
     * @param {import('Data/Skills').Skill} props.skill
     */
    renderSkills = ({ skill }) => {
        const skillTitle = langManager.GetText(skill.Name);

        const styleBackground = {
            backgroundColor: themeManager.GetColor('backgroundCard')
        };

        return (
            <View style={[styles.skillsItem, styleBackground]}>
                <Text style={styles.skillItemText}>{skillTitle}</Text>
                <Button
                    style={styles.skillItemButton}
                    appearance='uniform'
                    color='transparent'
                    onPress={() => this.handleUnselectSkill(skill.ID)}
                >
                    <Icon containerStyle={styles.skillsIconContainer} size={16} icon='close' color='main1' />
                </Button>
            </View>
        );
    };

    handleActivitySelector = () => {
        /** @type {PopupOpenType<number>} */
        user.interface.popup?.Open({
            content: (
                <ActivitySelector
                    callback={(id) => {
                        const { quest, onChangeQuest } = this.props;
                        if (quest === null || quest.skills.length >= MAX_SKILLS || quest.skills.includes(id)) {
                            return;
                        }

                        onChangeQuest({ ...quest, skills: [...quest.skills, id] });
                    }}
                />
            )
        });
    };

    render() {
        const lang = langManager.curr['quest'];
        const { quest } = this.props;

        if (quest === null) {
            return null;
        }

        const selectedSkills = quest.skills
            .map((id) => dataManager.skills.GetByID(id))
            .filter(
                /** @param {Skill | null} skill @returns {skill is Skill} */
                (skill) => skill !== null
            );

        const RenderSkills = this.renderSkills;
        return (
            <View ref={(ref) => (this.refHelp1 = ref)}>
                {/* No skills selected */}
                {selectedSkills.length === 0 && <Text>{lang['input-activity-title']}</Text>}

                {/* Skills selected */}
                {selectedSkills.length > 0 && (
                    <View style={styles.skillsContainer}>
                        {selectedSkills.map((skill) => (
                            <RenderSkills key={skill.ID} skill={skill} />
                        ))}
                    </View>
                )}

                {/* Add skill (if not max) */}
                {selectedSkills.length < MAX_SKILLS && (
                    <Button
                        style={styles.smallBtn}
                        appearance='outline'
                        fontSize={14}
                        onPress={this.handleActivitySelector}
                    >
                        {lang['input-activity-add']}
                    </Button>
                )}
            </View>
        );
    }
}

SectionSkill.prototype.props = SectionSkillProps;
SectionSkill.defaultProps = SectionSkillProps;

const styles = StyleSheet.create({
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    skillsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 4,
        marginBottom: 4,
        borderRadius: 8
    },
    skillItemText: {
        marginLeft: 16,
        marginRight: 8,
        marginVertical: 8
    },
    skillItemButton: {
        width: 'auto',
        paddingVertical: 0,
        paddingHorizontal: 12,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    skillsIconContainer: {
        width: 24,
        height: 24,
        padding: 0,
        marginLeft: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    smallBtn: {
        marginTop: 12,
        paddingVertical: 12,
        paddingHorizontal: 12
    }
});

export default SectionSkill;
