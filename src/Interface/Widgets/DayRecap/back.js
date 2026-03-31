import React from 'react';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { GetLocalTime } from 'Utils/Time';

import { saveToGallery, shareImage } from './share';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('@oxyfoo/gamelife-types/Class/Experience').StatsXP} StatsXP
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Activities').Activity} Activity
 *
 * @typedef {object} ActivityData
 * @property {string} name
 * @property {number} durationMinutes
 * @property {string} color
 *
 * @typedef {object} QuestDetail
 * @property {string} title
 * @property {boolean} completed
 * @property {number} progress - 0 to 1
 * @property {number} streak - Current streak
 * @property {number} timeDone - Minutes done (for sorting)
 * @property {string} timeText - Time done / goal
 *
 * @typedef {object} QuestProgress
 * @property {number} completedQuests
 * @property {number} totalQuests
 * @property {boolean} allCompleted
 * @property {QuestDetail[]} quests
 *
 * @typedef {object} DayRecapData
 * @property {string} username
 * @property {number} level
 * @property {number} xpGained
 * @property {number} xpCurrent - Current XP in level
 * @property {number} xpNext - XP required for next level
 * @property {number} totalMinutes
 * @property {ActivityData[]} categories - For donut chart (grouped by category)
 * @property {ActivityData[]} skills - For activity list (individual skills)
 * @property {StatsXP} statsGained
 * @property {Array<keyof StatsXP>} statsKeys - Non-zero stat keys for display
 * @property {QuestProgress} questProgress
 *
 * @typedef {object} DayRecapProps
 * @property {StyleProp} [style]
 * @property {Date} date - The date to display recap for
 * @property {() => void} [onClose]
 */

/** @type {DayRecapProps} */
const DayRecapProps = {
    style: /** @type {StyleProp} */ ({}),
    date: new Date(),
    onClose: () => {}
};

/**
 * @typedef {object} DayRecapState
 * @property {boolean} isCapturing
 * @property {boolean} isSharing
 * @property {'idle' | 'saving' | 'success' | 'error'} saveStatus
 * @property {string} template
 * @property {DayRecapData | null} recapData
 */

class BackDayRecap extends React.Component {
    /** @type {React.RefObject<import('react-native-view-shot').default | null>} */
    viewShotRef = React.createRef();

    /** @type {DayRecapState} */
    state = {
        isCapturing: false,
        isSharing: false,
        saveStatus: 'idle',
        template: 'tripleStack',
        recapData: null
    };

    /** @param {string} template */
    setTemplate = (template) => {
        this.setState({ template });
    };

    componentDidMount() {
        this.computeRecapData();
    }

    /**
     * @param {DayRecapProps} prevProps
     */
    componentDidUpdate(prevProps) {
        if (prevProps.date !== this.props.date) {
            this.computeRecapData();
        }
    }

    /**
     * Compute all the recap data for the selected date
     */
    computeRecapData = () => {
        const { date } = this.props;

        const { categories, skills, statsGained, totalXP, totalMinutes } = this.computeActivityStats(date);

        // Compute level/XP as of end of selected day (not current)
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);
        const endTime = GetLocalTime(dayEnd);
        const activitiesUpToDate = user.activities
            .GetUseful(true)
            .filter((a) => a.startTime + a.timezone * 3600 <= endTime);
        const { totalXP: cumulativeXP } = user.experience.CalculateTotalXP(activitiesUpToDate);
        const xpInfo = user.experience.getXPDict(cumulativeXP, 'user');

        const username = user.informations.username.Get() || 'Player';
        const level = xpInfo.lvl;
        const xpCurrent = xpInfo.xp;
        const xpNext = xpInfo.next;
        const questProgress = this.computeQuestProgress(date);
        const statsKeys = user.experience.statsKey
            .filter((key) => statsGained[key] > 0)
            .sort((a, b) => statsGained[b] - statsGained[a]);

        /** @type {DayRecapData} */
        const recapData = {
            username,
            level,
            xpGained: Math.round(totalXP),
            xpCurrent,
            xpNext,
            totalMinutes,
            categories,
            skills,
            statsGained,
            statsKeys,
            questProgress
        };

        this.setState({ recapData });
    };

    /**
     * Compute activity stats, categories, and skills for a given date
     * @param {Date} date
     * @returns {{ categories: ActivityData[], skills: ActivityData[], statsGained: StatsXP, totalXP: number, totalMinutes: number }}
     */
    computeActivityStats = (date) => {
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const startTime = GetLocalTime(dayStart);

        const allActivities = user.activities.allActivities.Get();
        const dayActivities = allActivities.filter((activity) => {
            const activityTime = activity.startTime + activity.timezone * 3600;
            return activityTime >= startTime && activityTime < startTime + 24 * 60 * 60;
        });

        // Use the app's real XP/stats calculation (includes friend bonus, proper stats formula)
        const grantedActivities = dayActivities.filter((a) => user.activities.GetExperienceStatus(a) === 'grant');
        const { totalXP, stats: statsGained } = user.experience.CalculateTotalXP(grantedActivities);

        // Group by category and skill for display (uses all day activities, not just granted)
        /** @type {Map<number, { name: string, durationMinutes: number, color: string }>} */
        const categoryMap = new Map();
        /** @type {Map<number, { name: string, durationMinutes: number, color: string }>} */
        const skillMap = new Map();
        let totalMinutes = 0;

        for (const activity of dayActivities) {
            const skill = dataManager.skills.GetByID(activity.skillID);
            if (!skill) continue;

            const category = dataManager.skills.GetCategoryByID(skill.CategoryID);
            if (!category) continue;

            const color = category.Color || '#7c3aed';
            const duration = activity.duration;
            totalMinutes += duration;

            // Group by category (for donut chart)
            const existingCategory = categoryMap.get(category.ID);
            if (existingCategory) {
                existingCategory.durationMinutes += duration;
            } else {
                categoryMap.set(category.ID, {
                    name: langManager.GetText(category.Name),
                    durationMinutes: duration,
                    color
                });
            }

            // Group by skill (for activity list)
            const existingSkill = skillMap.get(skill.ID);
            if (existingSkill) {
                existingSkill.durationMinutes += duration;
            } else {
                skillMap.set(skill.ID, { name: langManager.GetText(skill.Name), durationMinutes: duration, color });
            }
        }

        const categories = Array.from(categoryMap.values()).sort((a, b) => b.durationMinutes - a.durationMinutes);
        const skills = Array.from(skillMap.values()).sort((a, b) => b.durationMinutes - a.durationMinutes);

        return { categories, skills, statsGained, totalXP, totalMinutes };
    };

    /**
     * Compute quest progress for a given date
     * @param {Date} date
     * @returns {QuestProgress}
     */
    computeQuestProgress = (date) => {
        const time = GetLocalTime(date);
        const allQuests = user.quests.Get();

        let totalQuests = 0;
        let completedQuests = 0;
        /** @type {QuestDetail[]} */
        const quests = [];

        for (const quest of allQuests) {
            const days = user.quests.GetDays(quest, time);
            const selectedDay = days.find((day) => day.isToday);

            if (selectedDay && selectedDay.state !== 'disabled') {
                totalQuests++;
                const completed = selectedDay.state === 'past' || selectedDay.progress >= 1.0;
                if (completed) {
                    completedQuests++;
                }
                const streak = user.quests.GetStreak(quest, time);
                const timeText = user.quests.GetQuestTimeText(quest, time);
                const timeDone = user.activities
                    .GetByTime(time)
                    .filter((a) => quest.skills.includes(a.skillID))
                    .filter((a) => user.activities.GetExperienceStatus(a) === 'grant')
                    .reduce((sum, a) => sum + a.duration, 0);
                quests.push({
                    title: quest.title,
                    completed,
                    progress: Math.min(selectedDay.progress, 1),
                    streak,
                    timeDone,
                    timeText
                });
            }
        }

        quests.sort((a, b) => b.timeDone - a.timeDone);

        return {
            completedQuests,
            totalQuests,
            allCompleted: totalQuests > 0 && completedQuests === totalQuests,
            quests
        };
    };

    /**
     * Compute radar chart data from stats
     * @param {StatsXP} stats
     * @returns {Array<{label: string, value: number}>}
     */
    computeRadarData = (stats) => {
        const values = Object.values(stats);
        const maxValue = Math.max(...values, 1);

        return user.experience.statsKey.map((key) => ({
            label: key.toUpperCase().slice(0, 3),
            value: stats[key] / maxValue
        }));
    };

    /**
     * Format minutes to hours and minutes string
     * @param {number} minutes
     * @returns {string}
     */
    formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hours === 0) {
            return `${mins}m`;
        }
        if (mins === 0) {
            return `${hours}h`;
        }
        return `${hours}h${mins.toString().padStart(2, '0')}`;
    };

    // Share functions - delegate to share.js
    /** @param {boolean} value */
    setCapturing = (value) => this.setState({ isCapturing: value });
    /** @param {boolean} value */
    setSharing = (value) => this.setState({ isSharing: value });

    saveToGallery = async () => {
        this.setState({ saveStatus: 'saving' });
        const success = await saveToGallery(this.viewShotRef, this.setCapturing);
        this.setState({ saveStatus: success ? 'success' : 'error' });

        // Reset status after 2 seconds
        setTimeout(() => {
            this.setState({ saveStatus: 'idle' });
        }, 2000);
    };

    /**
     * @param {'instagram' | 'instagram-stories' | 'general'} [target='general']
     */
    shareImage = (target = 'general') => {
        shareImage(this.viewShotRef, this.setCapturing, this.setSharing, target);
    };
}

BackDayRecap.prototype.props = DayRecapProps;
BackDayRecap.defaultProps = DayRecapProps;

export default BackDayRecap;
