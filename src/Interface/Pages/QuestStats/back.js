import React from 'react';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';

import { AddActivity } from 'Interface/Widgets';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Quests').Quest} Quest
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Quests').QuestSaved} QuestSaved
 *
 * @typedef {Object} BackQuestPropsType
 * @property {Object} args
 * @property {Quest | QuestSaved | null} args.quest
 * @property {boolean | undefined} [args.showAnimations]
 */

/** @type {BackQuestPropsType} */
const BackQuestProps = {
    args: {
        quest: null,
        showAnimations: true
    }
};

class BackQuest extends PageBase {
    /**
     * @type {number}
     */
    efficiencyScore = 0;

    /**
     * @type {number}
     */
    dailyProgress = 0;

    /** @param {BackQuestProps} props */
    constructor(props) {
        super(props);

        const quest = props.args.quest;
        if (quest === null) {
            user.interface.BackHandle();
            user.interface.console?.AddLog('error', 'Quest: Quest not found');
            return;
        }

        const realQuest = user.quests.Get().find((q) => q.title === quest.title);
        if (realQuest === undefined) {
            user.interface.BackHandle();
            user.interface.console?.AddLog('error', 'Quest: Quest not found');
            return;
        }

        /** @type {Quest} */
        this.selectedQuest = realQuest;
        this.activitiesTimeText = user.quests.GetQuestTimeText(this.selectedQuest);
        this.showAnimations = props.args.showAnimations ?? BackQuestProps.args.showAnimations;

        // Calculate efficiency score and daily progress
        this.efficiencyScore = this.calculateEfficiency();
        this.dailyProgress = this.calculateDailyProgress();
    }

    /**
     * Calculate efficiency score based on completed days vs total days since creation
     * @returns {number} Efficiency score (0-100)
     */
    calculateEfficiency = () => {
        const creationDate = new Date(this.selectedQuest.created * 1000); // Convert seconds to milliseconds
        const today = new Date();
        const daysSinceCreation = Math.max(
            1,
            Math.floor((today.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24))
        );

        // Calculate days completed by checking activities
        const questActivities = user.activities
            .Get()
            .filter((activity) => this.selectedQuest.skills.includes(activity.skillID));

        // Group activities by day
        const daysDone = new Set();
        questActivities.forEach((activity) => {
            const activityDate = new Date((activity.startTime + activity.timezone * 3600) * 1000);
            const dayKey = `${activityDate.getFullYear()}-${activityDate.getMonth()}-${activityDate.getDate()}`;
            daysDone.add(dayKey);
        });

        const daysCompleted = daysDone.size;
        return Math.round((daysCompleted / daysSinceCreation) * 100);
    };

    /**
     * Calculate daily progress for today (duration done / duration required)
     * @returns {number} Daily progress value between 0 and 1
     */
    calculateDailyProgress = () => {
        const durationRequired = this.selectedQuest.schedule.duration;

        const todayActivities = user.activities
            .GetByTime()
            .filter((activity) => this.selectedQuest.skills.includes(activity.skillID))
            .filter((activity) => user.activities.GetExperienceStatus(activity) === 'grant');

        const todayDuration = todayActivities.reduce((sum, activity) => sum + activity.duration, 0);
        return durationRequired > 0 ? Math.min(1, todayDuration / durationRequired) : 0;
    };

    onAddPress = () => {
        if (this.selectedQuest === null) return;
        const { skills } = this.selectedQuest;

        this.fe.bottomPanel?.Open({
            content: <AddActivity listSkillsIDs={skills} />
        });
    };

    onEditPress = () => {
        if (this.selectedQuest === null) return;
        const quest = this.selectedQuest;

        user.interface.ChangePage('quest', { args: { quest }, storeInHistory: false });
    };

    onBackPress = () => {
        user.interface.BackHandle();
    };
}

BackQuest.defaultProps = BackQuestProps;
BackQuest.prototype.props = BackQuestProps;

export default BackQuest;
