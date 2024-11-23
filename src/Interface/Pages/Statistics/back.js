import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import PageBase from 'Interface/FlowEngine/PageBase';
import { GetStringLength } from 'Utils/String';
import { GetDate, GetGlobalTime } from 'Utils/Time';

/**
 * @typedef {import('Data/User/Activities/index').Activity} Activity
 *
 * @typedef {import('Class/Experience').XPInfo} XPInfo
 * @typedef {import('Class/Experience').Stats} Stats
 * @typedef {{ statKey: keyof Stats; experience: XPInfo }} ExperienceStats
 */

const BackNewPageProps = {
    args: {}
};

class BackNewPage extends PageBase {
    state = {
        experience: user.experience.experience.Get(),

        /** @type {ExperienceStats[]} */
        experienceStats: user.experience.statsKey
            .sort(
                (a, b) =>
                    GetStringLength(langManager.curr['statistics']['names'][b]) -
                    GetStringLength(langManager.curr['statistics']['names'][a])
            )
            .map((statKey) => ({
                statKey,
                experience: user.experience.experience.Get().stats[statKey]
            })),

        ...this.getValuesKPI()
    };

    /** @type {Symbol | null} */
    activitiesListener = null;

    componentDidMount() {
        this.activitiesListener = user.activities.allActivities.AddListener(() => {
            this.setState({
                experience: user.experience.experience.Get(),
                ...this.getValuesKPI()
            });
        });
    }

    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    getValuesKPI() {
        const activities = user.activities.Get();
        const playedDays = this.getTimeFromFirst(activities);
        const totalActivityLength = activities.length;
        const totalActivityTime = this.getTotalDuration(activities);
        return { playedDays, totalActivityLength, totalActivityTime };
    }

    /**
     * @param {Array<Activity>} activities
     * @returns {number} in hours
     */
    getTotalDuration(activities) {
        let totalDuration = 0;
        for (let a in activities) {
            totalDuration += activities[a].duration;
        }
        const totalDurationHour = totalDuration / 60;
        return Math.floor(totalDurationHour);
    }
    /**
     * @param {Array<Activity>} activities
     * @returns {number} in days
     */
    getTimeFromFirst(activities) {
        if (!activities.length) return 0;

        const initTime = activities[0].startTime;
        const initDate = GetDate(initTime);
        const diff = (GetGlobalTime() - GetGlobalTime(initDate)) / (60 * 60 * 24);
        return Math.floor(diff);
    }

    onBack = () => {
        this.fe.BackHandle();
    };
}

BackNewPage.defaultProps = BackNewPageProps;
BackNewPage.prototype.props = BackNewPageProps;

export default BackNewPage;
