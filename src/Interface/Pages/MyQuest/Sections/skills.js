import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';
import themeManager from 'Managers/ThemeManager';

import { Button, Text } from 'Interface/Components';

/**
 * @typedef {import('Interface/Widgets/ScreenList').ScreenListItem} ScreenListItem
 */

/////////////////////////////
// TODO: Manage skills ids //
/////////////////////////////

const SectionSkillProps = {
    /** @type {Array<number>} */
    skills: [],

    /** @param {Array<number>} skills */
    onChange: (skills) => {}
};

class SectionSkill extends React.Component {
    onUnselectSkill = () => {
        this.props.onChange([]);
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

        const title = langManager.curr['quest']['input-panel-category'];
        /** @type {Array<ScreenListItem>} */
        const data = dataManager.skills.categories.map(category => ({
            id: category.ID,
            value: dataManager.GetText(category.Name)
        }));
        data.splice(0, 1, {
            id: 0,
            value: langManager.curr['quest']['input-activity-none']
        });
        user.interface.screenList.Open(title, data, callback);
    }

    OpenSkillSelection = (SkillID) => {
        const callback = (id) => {
            //this.props.onChange();

            if (id === 0) {
                //this.setState({ skills: { id: SkillID, isCategory: true } });
                return;
            }

            //this.setState({ skills: { id: id, isCategory: false } });
        };

        const title = langManager.curr['quest']['input-panel-activity'];
        /** @type {Array<ScreenListItem>} */
        const data = dataManager.skills.GetByCategory(SkillID).map(skill => ({
            id: skill.ID,
            value: dataManager.GetText(skill.Name)
        }));

        const category = dataManager.skills.GetCategoryByID(SkillID);
        const categoryName = dataManager.GetText(category.Name);
        data.splice(0, 0, {
            id: 0,
            value: langManager.curr['quest']['input-activity-only'].replace('{}', categoryName)
        });
        user.interface.screenList.Open(title, data, callback);
    }

    render() {
        const lang = langManager.curr['quest'];
        const { skills } = this.props;

        let activityTitle = lang['input-activity-title'];
        let activityText = lang['input-activity-empty'];

        if (skills.length > 0) {
            // TODO: End this
            /*
            if (skills.isCategory) {
                const category = dataManager.skills.GetCategoryByID(skills.id);
                activityTitle = lang['input-activity-title-category'];
                activityText = dataManager.GetText(category.Name);
            } else {
                const activityData = dataManager.skills.GetByID(skills.id);
                if (activityData !== null) {
                    activityTitle = lang['input-activity-title-activity'];
                    activityText = dataManager.GetText(activityData.Name);
                }
            }
            */
        }

        const backgroundColor = {
            backgroundColor: themeManager.GetColor('backgroundCard')
        };

        return (
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
        );
    }
}

SectionSkill.prototype.props = SectionSkillProps;
SectionSkill.defaultProps = SectionSkillProps;

const styles = StyleSheet.create({
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
