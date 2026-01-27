import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { Icon, Text } from 'Interface/Components';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Activities').CurrentActivity} CurrentActivity
 */

const ActivityTimerTitleProps = {
    /** @type {CurrentActivity | null} */
    currentActivity: null
};

class ActivityTimerTitle extends React.Component {
    /** @param {ActivityTimerTitleProps} props */
    constructor(props) {
        super(props);

        const { currentActivity } = this.props;
        if (currentActivity === null) {
            return;
        }

        const skill = dataManager.skills.GetByID(currentActivity.skillID);
        if (skill === null) {
            return;
        }

        const category = dataManager.skills.GetCategoryByID(skill.CategoryID);
        if (category === null) {
            return;
        }

        this.activityName = langManager.GetText(skill.Name);
        this.categoryName = langManager.GetText(category.Name);
        this.xmlIcon = dataManager.skills.GetXmlByLogoID(category.LogoID);
    }

    render() {
        const lang = langManager.curr['activity'];

        return (
            <View style={styles.gradientInner}>
                <Icon style={styles.activityIcon} xml={this.xmlIcon} size={40} />
                <View style={styles.textContainer}>
                    <Text style={styles.activityText} numberOfLines={1} ellipsizeMode='tail'>
                        {this.activityName}
                    </Text>
                    <Text style={styles.categoryText} numberOfLines={1} ellipsizeMode='tail'>
                        {lang['timer-category']} {this.categoryName}
                    </Text>
                </View>
            </View>
        );
    }
}

ActivityTimerTitle.prototype.props = ActivityTimerTitleProps;
ActivityTimerTitle.defaultProps = ActivityTimerTitleProps;

export default ActivityTimerTitle;
