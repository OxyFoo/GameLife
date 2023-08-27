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

class SectionActivity extends React.Component {
    state = {
        /** @type {SelectedActivity|null} */
        activity: null
    }

    /** @param {SelectedActivity|null} activity */
    SetActivity = (activity) => {
        this.setState({ activity });
    }
    GetActivity = () => {
        return this.state.activity;
    }

    onUnselectActivity = () => {
        this.setState({ activity: null });
    }

    onSelectCategory = () => {
        const callback = (id) => {
            if (id === 0) {
                this.setState({ activity: null });
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
        data[0].value = langManager.curr['task']['input-activity-none'];
        user.interface.screenList.Open(title, data, callback);
    }

    onSelectActivity = (categoryID) => {
        const callback = (id) => {
            if (id === 0) {
                this.setState({ activity: { id: categoryID, isCategory: true } });
                return;
            }

            this.setState({ activity: { id: id, isCategory: false } });
        };

        const title = langManager.curr['task']['input-panel-category'];
        /** @type {Array<ScreenListItem>} */
        const data = dataManager.skills.GetByCategory(categoryID).map(activity => ({
            id: activity.ID,
            value: dataManager.GetText(activity.Name)
        }));
        data.splice(0, 0, {
            id: 0,
            value: langManager.curr['task']['input-activity-only'].replace('{}', dataManager.GetText(dataManager.skills.GetCategoryByID(categoryID).Name))
        });
        user.interface.screenList.Open(title, data, callback);
    }

    render() {
        const lang = langManager.curr['task'];
        const { activity } = this.state;

        let activityTitle = lang['input-activity-title'];
        let activityText = lang['input-activity-empty'];

        if (!!activity) {
            if (activity.isCategory) {
                const category = dataManager.skills.GetCategoryByID(activity.id);
                activityTitle = lang['input-activity-title-category'];
                activityText = dataManager.GetText(category.Name);
            } else {
                const activityData = dataManager.skills.GetByID(activity.id);
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

export default SectionActivity;