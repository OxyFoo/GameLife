import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';
import themeManager from 'Managers/ThemeManager';

import { Button, Text } from 'Interface/Components';

/**
 * @typedef {import('Interface/Widgets/ScreenList').ScreenListItem} ScreenListItem
 * 
 * @typedef {Object} SelectedSkill
 * @property {number} id
 * @property {boolean} isCategory
 */

const SectionSkillProps = {
    onChange: () => {}
};

class SectionSkill extends React.Component {
    state = {
        /** @type {SelectedSkill | null} */
        skill: null
    }

    refHelp1 = null;

    /** @param {SelectedSkill | null} skill */
    SetSkill = (skill) => {
        this.setState({ skill });
    }
    GetSkill = () => {
        return this.state.skill;
    }

    onUnselectSkill = () => {
        this.setState({ skill: null });
        this.props.onChange();
    }

    OpenCategoriesSelection = () => {
        const callback = (id) => {
            if (id === 0) {
                this.onUnselectSkill();
                return;
            }

            setTimeout(() => {
                this.OpenSkillSelection(id);
            }, 100);
        };

        const title = langManager.curr['todo']['input-panel-category'];
        /** @type {Array<ScreenListItem>} */
        const data = dataManager.skills.categories.map(category => ({
            id: category.ID,
            value: dataManager.GetText(category.Name)
        }));
        data.splice(0, 1, {
            id: 0,
            value: langManager.curr['todo']['input-activity-none']
        });
        user.interface.screenList.Open(title, data, callback);
    }

    OpenSkillSelection = (SkillID) => {
        const callback = (id) => {
            this.props.onChange();

            if (id === 0) {
                this.setState({ skill: { id: SkillID, isCategory: true } });
                return;
            }

            this.setState({ skill: { id: id, isCategory: false } });
        };

        const title = langManager.curr['todo']['input-panel-activity'];
        /** @type {Array<ScreenListItem>} */
        const data = dataManager.skills.GetByCategory(SkillID).map(skill => ({
            id: skill.ID,
            value: dataManager.GetText(skill.Name)
        }));

        const category = dataManager.skills.GetCategoryByID(SkillID);
        const categoryName = dataManager.GetText(category.Name);
        data.splice(0, 0, {
            id: 0,
            value: langManager.curr['todo']['input-activity-only'].replace('{}', categoryName)
        });
        user.interface.screenList.Open(title, data, callback);
    }

    render() {
        const lang = langManager.curr['todo'];
        const { skill } = this.state;

        let activityTitle = lang['input-activity-title'];
        let activityText = lang['input-activity-empty'];

        if (!!skill) {
            if (skill.isCategory) {
                const category = dataManager.skills.GetCategoryByID(skill.id);
                activityTitle = lang['input-activity-title-category'];
                activityText = dataManager.GetText(category.Name);
            } else {
                const activityData = dataManager.skills.GetByID(skill.id);
                if (activityData !== null) {
                    activityTitle = lang['input-activity-title-activity'];
                    activityText = dataManager.GetText(activityData.Name);
                }
            }
        }

        const backgroundColor = {
            backgroundColor: themeManager.GetColor('backgroundCard')
        };

        return (
            <>
                <Text style={styles.sectionTitle} fontSize={22}>
                    {lang['title-activity']}
                </Text>
                <View
                    ref={ref => this.refHelp1 = ref}
                    style={[backgroundColor, styles.schedulePanel]}
                >
                    <Text style={styles.text}>{activityTitle}</Text>
                    <Button
                        colorText='main1'
                        style={styles.smallBtn}
                        fontSize={14}
                        onPress={this.OpenCategoriesSelection}
                        onLongPress={this.onUnselectSkill}
                    >
                        {activityText}
                    </Button>
                </View>
            </>
        );
    }
}

SectionSkill.prototype.props = SectionSkillProps;
SectionSkill.defaultProps = SectionSkillProps;

const styles = StyleSheet.create({
    sectionTitle: {
        marginTop: 32,
        marginBottom: 12
    },

    schedulePanel: {
        padding: 24,
        borderRadius: 12
    },
    text: {
        marginBottom: 12
    },
    smallBtn: {
        height: 42,
        paddingHorizontal: 12
    }
});

export default SectionSkill;
