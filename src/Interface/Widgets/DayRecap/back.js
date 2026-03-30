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
 * @property {StatsXP} totalStats
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
 * @property {boolean} isSaving
 * @property {boolean} isSharing
 * @property {'idle' | 'saving' | 'success' | 'error'} saveStatus
 * @property {DayRecapData | null} recapData
 */

class BackDayRecap extends React.Component {
    /** @type {React.RefObject<import('react-native-view-shot').default | null>} */
    viewShotRef = React.createRef();

    /** @type {DayRecapState} */
    state = {
        isCapturing: false,
        isSaving: false,
        isSharing: false,
        saveStatus: 'idle',
        recapData: null
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

        // Get activities for this day
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const startTime = GetLocalTime(dayStart);

        const allActivities = user.activities.allActivities.Get();
        const dayActivities = allActivities.filter((activity) => {
            const activityTime = activity.startTime + activity.timezone * 3600;
            return activityTime >= startTime && activityTime < startTime + 24 * 60 * 60;
        });

        // Group by CATEGORY for donut chart, and by SKILL for activity list
        /** @type {Map<number, { name: string, durationMinutes: number, color: string, xp: number }>} */
        const categoryMap = new Map();
        /** @type {Map<number, { name: string, durationMinutes: number, color: string, xp: number }>} */
        const skillMap = new Map();

        /** @type {StatsXP} */
        const statsGained = { int: 0, soc: 0, for: 0, sta: 0, agi: 0, dex: 0 };
        let totalXP = 0;
        let totalMinutes = 0;

        for (const activity of dayActivities) {
            const skill = dataManager.skills.GetByID(activity.skillID);
            if (!skill) continue;

            // Get category for grouping and color
            const category = dataManager.skills.GetCategoryByID(skill.CategoryID);
            if (!category) continue;

            const color = category.Color || '#7c3aed';
            const categoryName = langManager.GetText(category.Name);

            const duration = activity.duration;
            totalMinutes += duration;

            // XP calculation
            const durationHour = duration / 60;
            const xp = skill.XP * durationHour;
            totalXP += xp;

            // Stats
            for (const stat of user.experience.statsKey) {
                statsGained[stat] += Math.round(skill.Stats[stat] * durationHour);
            }

            // Group by category (for donut chart)
            const existingCategory = categoryMap.get(category.ID);
            if (existingCategory) {
                existingCategory.durationMinutes += duration;
                existingCategory.xp += xp;
            } else {
                categoryMap.set(category.ID, {
                    name: categoryName,
                    durationMinutes: duration,
                    color: color,
                    xp
                });
            }

            // Group by skill (for activity list)
            const skillName = langManager.GetText(skill.Name);
            const existingSkill = skillMap.get(skill.ID);
            if (existingSkill) {
                existingSkill.durationMinutes += duration;
                existingSkill.xp += xp;
            } else {
                skillMap.set(skill.ID, {
                    name: skillName,
                    durationMinutes: duration,
                    color: color,
                    xp
                });
            }
        }

        // Sort categories by duration (for donut chart)
        const categories = Array.from(categoryMap.values())
            .sort((a, b) => b.durationMinutes - a.durationMinutes)
            .map(({ name, durationMinutes, color }) => ({ name, durationMinutes, color }));

        // Sort skills by duration (for activity list)
        const skills = Array.from(skillMap.values())
            .sort((a, b) => b.durationMinutes - a.durationMinutes)
            .map(({ name, durationMinutes, color }) => ({ name, durationMinutes, color }));

        // Get user info
        const experience = user.experience.experience.Get();
        const username = user.informations.username.Get() || 'Player';
        const level = experience.xpInfo.lvl;
        const xpCurrent = experience.xpInfo.xp;
        const xpNext = experience.xpInfo.next;
        const totalStats = experience.stats;

        // Compute quest progress for this date
        const questProgress = this.computeQuestProgress(date);

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
            totalStats,
            questProgress
        };

        this.setState({ recapData });
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
                quests.push({
                    title: quest.title,
                    completed,
                    progress: Math.min(selectedDay.progress, 1),
                    streak,
                    timeText
                });
            }
        }

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
            value: maxValue > 0 ? stats[key] / maxValue : 0
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
