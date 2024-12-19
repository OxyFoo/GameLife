import * as React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Icon, Text } from 'Interface/Components';
import { DateFormat } from 'Utils/Date';
import { GetDate, GetLocalTime } from 'Utils/Time';
import { TwoDigit } from 'Utils/Functions';

/**
 * @typedef {import('Types/Data/User/Activities').CurrentActivity} CurrentActivity
 */

const ActivityTimerTitleProps = {
    /** @type {CurrentActivity | null} */
    currentActivity: null
};

class ActivityTimerTitle extends React.Component {
    state = {
        displayActivity: '',
        displayInitialTime: '00:00',
        displayCurrentTime: '00:00:00'
    };

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

        const { startTime } = currentActivity;
        this.state.displayActivity = langManager.GetText(skill.Name);
        this.state.displayInitialTime = DateFormat(GetDate(startTime), 'HH:mm');
        this.state.displayCurrentTime = this.__getCurrentTime();

        if (currentActivity !== null) {
            const category = dataManager.skills.GetCategoryByID(skill.CategoryID);
            if (category === null) {
                return;
            }

            const categoryName = langManager.GetText(category.Name);
            this.skillTitle = `${categoryName} - ${this.state.displayActivity}`;
            this.xmlIcon = dataManager.skills.GetXmlByLogoID(category.LogoID);
        }
    }

    componentDidMount() {
        this.timer_tick = setInterval(this.tick, 500);
    }
    componentWillUnmount() {
        clearInterval(this.timer_tick);
    }

    /**
     * @description Tick function, called every second to update the timer
     * @returns {void}
     */
    tick = () => {
        this.setState({ displayCurrentTime: this.__getCurrentTime() });
    };

    __getCurrentTime = () => {
        const { currentActivity } = this.props;
        if (currentActivity === null) {
            return '00:00:00';
        }

        const { startTime } = currentActivity;

        const time = GetLocalTime() - startTime;
        const HH = Math.floor(time / 3600);
        const MM = Math.floor((time - HH * 3600) / 60);
        const SS = time - HH * 3600 - MM * 60;

        return [HH, MM, SS].map(TwoDigit).join(':');
    };

    render() {
        const lang = langManager.curr['activity'];
        const { displayInitialTime, displayCurrentTime } = this.state;

        return (
            <>
                <LinearGradient
                    style={styles.gradient}
                    colors={[
                        themeManager.GetColor('main1', { opacity: 0.65 }),
                        themeManager.GetColor('main1', { opacity: 0.25 })
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Icon style={styles.activityIcon} xml={this.xmlIcon} />
                    <Text style={styles.activityText}>{this.skillTitle}</Text>
                </LinearGradient>
                <View>
                    <Text style={styles.startText}>{lang['timer-launch'] + ' ' + displayInitialTime}</Text>
                    <Text style={styles.durationText}>{displayCurrentTime}</Text>
                </View>
            </>
        );
    }
}

ActivityTimerTitle.prototype.props = ActivityTimerTitleProps;
ActivityTimerTitle.defaultProps = ActivityTimerTitleProps;

export default ActivityTimerTitle;
