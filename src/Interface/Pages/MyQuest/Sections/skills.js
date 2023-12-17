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

const SectionSkillProps = {
    /** @type {Array<number>} IDs of skills */
    skillsIDs: [],

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
            value: langManager.curr['quest']['input-activity-reset']
        });
        user.interface.screenList.Open(title, data, callback);
    }

    OpenSkillSelection = (SkillID) => {
        const callback = (id) => {
            const { skillsIDs } = this.props;
            this.props.onChange([...skillsIDs, id]);
        };

        const title = langManager.curr['quest']['input-panel-activity'];
        /** @type {Array<ScreenListItem>} */
        const data = dataManager.skills.GetByCategory(SkillID).map(skill => ({
            id: skill.ID,
            value: dataManager.GetText(skill.Name)
        }));

        user.interface.screenList.Open(title, data, callback);
    }

    render() {
        const lang = langManager.curr['quest'];
        const { skillsIDs } = this.props;

        let activityText = lang['input-activity-title'];
        let activityBtn = lang['input-activity-add'];

        if (skillsIDs.length > 0) {
            activityText = skillsIDs
                .map(id => dataManager.skills.GetByID(id))
                .filter(skill => skill !== null)
                .map(skill => dataManager.GetText(skill.Name))
                .join(', ');
        }

        const backgroundColor = {
            backgroundColor: themeManager.GetColor('backgroundCard')
        };

        return (
            <View
                ref={ref => this.refHelp1 = ref}
                style={[backgroundColor, styles.schedulePanel]}
            >
                <Text style={styles.text}>{activityText}</Text>
                <Button
                    colorText='main1'
                    style={styles.smallBtn}
                    fontSize={14}
                    onPress={this.OpenCategoriesSelection}
                    onLongPress={this.onUnselectSkill}
                >
                    {activityBtn}
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
