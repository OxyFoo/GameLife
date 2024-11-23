import * as React from 'react';
import { FlatList, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text } from 'Interface/Components';
import { Round } from 'Utils/Functions';
import { GetLocalTime } from 'Utils/Time';

/**
 * @typedef {import('Types/Data/App/Skills').Skill} Skill
 * @typedef {import('Types/Features/UserOnline').CurrentActivity} CurrentActivity
 * @typedef {import('Class/Experience').Stats} Stats
 * @typedef {import('react-native').ListRenderItem<keyof Stats>} ListRenderItemStat
 *
 * @typedef {{ key: string, value: number }} Stat
 */

const ActivityTimerScoreProps = {
    /** @type {CurrentActivity | null} */
    currentActivity: null
};

class ActivityTimerScore extends React.Component {
    state = {
        /** @type {Array<keyof Stats>} */
        data: [],

        /** @type {number} Used to show estimated stats */
        duration: 0
    };

    /** @type {Skill | null} */
    skill = null;

    /** @param {ActivityTimerScoreProps} props */
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

        this.skill = skill;
        this.state.data = user.experience.statsKey.filter((stat) => skill.Stats[stat] > 0);
        this.state.duration = this.getDuration();
    }

    componentDidMount() {
        this.timer_tick = setInterval(this.tick, 200);
    }

    componentWillUnmount() {
        clearInterval(this.timer_tick);
    }

    /**
     * @description Tick function, called every second to update the timer
     * @returns {void}
     */
    tick = () => {
        const duration = this.getDuration();
        this.setState({ duration });
    };

    /**
     * @returns {number} The duration of the current activity in minutes
     * @private
     */
    getDuration = () => {
        const { currentActivity } = this.props;
        if (currentActivity === null) {
            return 0;
        }

        const { startTime } = currentActivity;
        const now = GetLocalTime();
        const currentMillis = new Date().getMilliseconds() / 1000;
        const duration = (now + currentMillis - startTime) / 60;
        return duration;
    };

    /**
     * @returns {string} The experience gained during the current activity
     * @private
     */
    getExperienceText = () => {
        const { duration } = this.state;
        const { currentActivity } = this.props;
        if (this.skill === null || currentActivity === null) {
            return '0';
        }

        const XPstring = Round(this.skill.XP * (duration / 60), 2).toString();
        const zeroRemaining = XPstring.includes('.') && XPstring.split('.')[1].length < 2;
        return XPstring + (zeroRemaining ? '0' : '');
    };

    render() {
        const lang = langManager.curr['activity'];
        const langXP = langManager.curr['statistics']['xp'];
        const { data } = this.state;
        const { currentActivity } = this.props;

        if (currentActivity === null) {
            return null;
        }

        return (
            <View>
                <LinearGradient
                    style={styles.scoreParent}
                    colors={[
                        themeManager.GetColor('main2', { opacity: 0.65 }),
                        themeManager.GetColor('main2', { opacity: 0.25 })
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Text style={styles.scoreTitle}>
                        {lang['timer-gain'].replace('{}', `+ ${this.getExperienceText()} ${langXP['small']}`)}
                    </Text>
                </LinearGradient>

                <View>
                    <FlatList
                        data={data}
                        keyExtractor={(item) => `activity-timer-stat-${item}`}
                        renderItem={this.renderScoreCell}
                        numColumns={2}
                        scrollEnabled={false}
                    />
                </View>
            </View>
        );
    }

    /** @type {ListRenderItemStat} */
    renderScoreCell = ({ item }) => {
        const langStats = langManager.curr['statistics']['names'];
        const { duration } = this.state;

        const statCount = (this.skill?.Stats[item] ?? 0) * (duration / 60);
        const decimal = statCount < 10 ? 2 : 1;

        let statCountText = Round(statCount, decimal).toString();
        if (statCountText.includes('.') && statCountText.split('.')[1].length < decimal) {
            statCountText += '0';
        } else if (!statCountText.includes('.')) {
            statCountText += '.0';
        }

        return (
            <View style={styles.scoreCell}>
                <LinearGradient
                    style={styles.scoreCellSquare}
                    colors={[
                        themeManager.GetColor('backgroundCard', { opacity: 0.65 }),
                        themeManager.GetColor('backgroundCard', { opacity: 0.25 })
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Text style={styles.scoreTitle} color='main2'>
                        {`+ ${statCountText}`}
                    </Text>
                </LinearGradient>
                <Text style={styles.scoreCellText}>{langStats[item]}</Text>
            </View>
        );
    };
}

ActivityTimerScore.prototype.props = ActivityTimerScoreProps;
ActivityTimerScore.defaultProps = ActivityTimerScoreProps;

export default ActivityTimerScore;
