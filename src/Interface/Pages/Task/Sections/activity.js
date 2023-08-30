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
 * @typedef {Object} SelectedActivity
 * @property {number} id
 * @property {boolean} isCategory
 */

const SectionActivityProps = {
    onChange: () => {}
};

class SectionSkill extends React.Component {
    state = {
        /** @type {SelectedActivity|null} */
        skill: null
    }

    /** @param {SelectedActivity|null} skill */
    SetSkill = (skill) => {
        this.setState({ skill });
    }
    GetSkill = () => {
        return this.state.skill;
    }

    onUnselectActivity = () => {
        this.setState({ skill: null });
        this.props.onChange();
    }

    onSelectCategory = () => {
        const callback = (id) => {
            if (id === 0) {
                this.setState({ skill: null });
                return;
            }

            setTimeout(() => {
                this.onSelectActivity(id);
            }, 100);
        };

        const title = langManager.curr['task']['input-panel-activity'];
        /** @type {Array<ScreenListItem>} */
        const data = dataManager.skills.categories.map(category => ({
            id: category.ID,
            value: dataManager.GetText(category.Name)
        }));
        data.splice(0, 1, {
            id: 0,
            value: langManager.curr['task']['input-activity-none']
        });
        user.interface.screenList.Open(title, data, callback);
    }

    onSelectActivity = (categoryID) => {
        const callback = (id) => {
            this.props.onChange();

            if (id === 0) {
                this.setState({ skill: { id: categoryID, isCategory: true } });
                return;
            }

            this.setState({ skill: { id: id, isCategory: false } });
        };

        const title = langManager.curr['task']['input-panel-category'];
        /** @type {Array<ScreenListItem>} */
        const data = dataManager.skills.GetByCategory(categoryID).map(skill => ({
            id: skill.ID,
            value: dataManager.GetText(skill.Name)
        }));
        data.splice(0, 0, {
            id: 0,
            value: langManager.curr['task']['input-activity-only'].replace('{}', dataManager.GetText(dataManager.skills.GetCategoryByID(categoryID).Name))
        });
        user.interface.screenList.Open(title, data, callback);
    }

    render() {
        const lang = langManager.curr['task'];
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
                activityTitle = lang['input-activity-title-activity'];
                activityText = dataManager.GetText(activityData.Name);
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
                <View style={[backgroundColor, styles.schedulePanel]}>
                    <Text style={styles.text}>{activityTitle}</Text>
                    <Button
                        colorText='main1'
                        style={styles.smallBtn}
                        fontSize={14}
                        onPress={this.onSelectCategory}
                        onLongPress={this.onUnselectActivity}
                    >
                        {activityText}
                    </Button>
                </View>
            </>
        );
    }
}

SectionSkill.prototype.props = SectionActivityProps;
SectionSkill.defaultProps = SectionActivityProps;

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