import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';
import themeManager from 'Managers/ThemeManager';

import { GetTime } from 'Utils/Time';
import { Button, Text, Icon } from 'Interface/Components';

const MAX_SKILLS = 10;

/**
 * @typedef {import('Interface/Widgets/ScreenList').ScreenListItem} ScreenListItem
 */

const SectionSkillProps = {
    /** @type {Array<number>} IDs of skills */
    skillsIDs: [],

    /** @param {Array<number>} skills */
    onChange: (skills) => {}
};

class SectionSkill extends React.Component {
    OpenCategoriesSelection = () => {
        const callback = (id) => {
            setTimeout(() => user.interface.console.AddLog('info', 'MyQuest => Category onPress:', id), 300);
            setTimeout(() => {
                this.OpenSkillSelection(id);
            }, 100);
        };

        const title = langManager.curr['quest']['input-panel-category'];
        /** @type {Array<ScreenListItem>} */
        const data = dataManager.skills.categories.map(category => ({
            id: category.ID,
            value: dataManager.GetText(category.Name)
        }));
        user.interface.screenList.Open(title, data, callback);
    }

    OpenSkillSelection = (categoryID) => {
        const callback = (id) => {
            setTimeout(() => user.interface.console.AddLog('info', 'MyQuest => Skill onPress:', id), 300);
            const { skillsIDs } = this.props;
            if (skillsIDs.length >= MAX_SKILLS || skillsIDs.includes(id)) {
                return;
            }
            this.props.onChange([ ...skillsIDs, id ]);
        };

        const title = langManager.curr['quest']['input-panel-activity'];
        /** @type {Array<ScreenListItem>} */
        let data = [];

        // If category is 'Recent'
        if (categoryID === 0) {
            const now = GetTime(undefined, 'local');
            const usersActivities = user.activities.Get()
                .filter(activity => activity.startTime <= now)
                .sort((a, b) => b.startTime - a.startTime);
            for (const activity of usersActivities) {
                const skill = dataManager.skills.GetByID(activity.skillID);
                if (skill !== null && !data.find(s => s.id === skill.ID)) {
                    data.push({
                        id: skill.ID,
                        value: dataManager.GetText(skill.Name)
                    });
                }
            }
        }

        // If it's a category
        else {
            /** @type {Array<ScreenListItem>} */
            data = dataManager.skills.GetByCategory(categoryID).map(skill => ({
                id: skill.ID,
                value: dataManager.GetText(skill.Name)
            }));
        }

        if (data.length !== 0) {
            user.interface.screenList.Open(title, data, callback);
        }
    }

    /** @param {number} skillID */
    handleUnselectSkill = (skillID) => {
        const { skillsIDs } = this.props;
        this.props.onChange(skillsIDs.filter(id => id !== skillID));
    }

    /**
     * @param {Object} props
     * @param {import('Data/Skills').Skill} props.skill
     */
    renderSkills = ({ skill }) => {
        const skillTitle = dataManager.GetText(skill.Name);
        const handleUnselectSkill = () => this.handleUnselectSkill(skill.ID);
        const styleBackground = {
            backgroundColor: themeManager.GetColor('background')
        };

        return (
            <View style={[styles.skillsItem, styleBackground]}>
                <Text>{skillTitle}</Text>
                <Icon
                    containerStyle={styles.skillsIconContainer}
                    size={16}
                    icon='cross'
                    color='main1'
                    onPress={handleUnselectSkill}
                />
            </View>
        );
    }

    render() {
        const lang = langManager.curr['quest'];
        const { skillsIDs } = this.props;

        let selectedSkills = [];
        if (skillsIDs.length > 0) {
            selectedSkills = skillsIDs
                .map(id => dataManager.skills.GetByID(id))
                .filter(skill => skill !== null);
        }

        const backgroundColor = {
            backgroundColor: themeManager.GetColor('backgroundCard')
        };

        const RenderSkills = this.renderSkills;
        return (
            <View
                ref={ref => this.refHelp1 = ref}
                style={[backgroundColor, styles.schedulePanel]}
            >
                {/* No skills selected */}
                {selectedSkills.length === 0 && (
                    <Text style={styles.text}>{lang['input-activity-title']}</Text>
                )}

                {/* Skills selected */}
                {selectedSkills.length > 0 && (
                    <View style={styles.skillsContainer}>
                        {selectedSkills.map(skill => (
                            <RenderSkills
                                key={skill.ID}
                                skill={skill}
                            />
                        ))}
                    </View>
                )}

                {/* Add skill (if not max) */}
                {selectedSkills.length < MAX_SKILLS && (
                    <Button
                        colorText='main1'
                        style={styles.smallBtn}
                        fontSize={14}
                        onPress={this.OpenCategoriesSelection}
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
    schedulePanel: {
        padding: 6,
        borderRadius: 12
    },
    text: {
        marginTop: 12
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    skillsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 4,
        marginBottom: 4,
        padding: 8,
        borderRadius: 12
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
        height: 42,
        marginTop: 12,
        paddingHorizontal: 12
    }
});

export default SectionSkill;
