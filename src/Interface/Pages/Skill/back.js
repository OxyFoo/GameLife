import React from 'react';

import HistoryView from './history';
import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { AddActivity } from 'Interface/Widgets';
import { GetDate } from 'Utils/Time';
import { Round } from 'Utils/Functions';
import { DateFormat } from 'Utils/Date';

/**
 * @typedef {import('Types/Data/App/Skills').Skill} Skill
 * @typedef {import('Data/User/Activities/index').Activity} Activity
 * @typedef {import('Data/User/Activities/index').ActivitySaved} ActivitySaved
 *
 * @typedef HistoryActivityItem
 * @property {Activity} activity
 * @property {string} title
 * @property {() => void} onPress
 */

const BackSkillProps = {
    args: {
        /** @type {number} */
        skillID: 0
    }
};

class BackSkill extends PageBase {
    state = {
        selectedSkill: {
            ID: 0,
            name: '',
            category: '',
            level: langManager.curr['level']['level'] + ' 1',
            earnXp: 0,
            xp: 0,
            next: 1,
            creator: '',
            stats: user.experience.statsKey.map(() => 0),
            xml: '',
            enabled: true,
            totalDuration: 0
        },

        /** @type {HistoryActivityItem[]} */
        history: []
    };

    /** @type {Symbol | null} */
    listenerActivity = null;

    /** @param {BackSkillProps} props */
    constructor(props) {
        super(props);

        // Property error handling
        if (typeof props.args === 'undefined' || !props.args.hasOwnProperty('skillID')) {
            return;
        }

        // Get skill
        const skillID = props.args['skillID'];
        const skill = dataManager.skills.GetByID(skillID);
        if (skill === null) {
            user.interface.console?.AddLog('error', 'Skill not found for skillID: ' + skillID);
            return;
        }

        // Skill data
        const skillXP = user.experience.GetSkillExperience(skill);
        if (skillXP === null) {
            user.interface.console?.AddLog('error', 'SkillXP not found for skillID: ' + skillID);
            return;
        }

        const category = dataManager.skills.GetCategoryByID(skill.CategoryID);
        if (category === null) {
            user.interface.console?.AddLog('error', 'Category not found for skillID: ' + skillID);
            return;
        }

        const authorText = langManager.curr['skill']['text-author'].replace('{}', skill.Creator);
        const totalDuration = this.getTotalDurationFromSkillID(skillID);

        this.state.selectedSkill = {
            ID: skillID,
            name: langManager.GetText(skill.Name),
            category: langManager.GetText(category.Name),
            level: langManager.curr['level']['level'] + ' ' + skillXP.lvl,
            earnXp: Round(skill.XP, 1),
            xp: skillXP.xp,
            next: skillXP.next,
            creator: skill.Creator ? authorText : '',
            stats: Object.values(skill.Stats),
            xml: dataManager.skills.GetXmlByLogoID(skill.LogoID || category.LogoID),
            enabled: skill.Enabled,
            totalDuration: totalDuration
        };

        this.state.history = this.#getHistory();
    }

    componentDidMount() {
        const { selectedSkill } = this.state;

        if (selectedSkill.ID === 0) {
            this.onBackPress();
            return;
        }

        this.listenerActivity = user.activities.allActivities.AddListener(this.updateActivity);
    }

    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.listenerActivity);
    }

    /** @param {(Activity | ActivitySaved)[]} _activities */
    updateActivity = (_activities) => {
        const { selectedSkill } = this.state;

        if (selectedSkill.ID === 0) {
            user.interface.console?.AddLog('warn', 'No skill selected');
            return;
        }

        const skill = dataManager.skills.GetByID(selectedSkill.ID);
        if (skill === null) {
            user.interface.console?.AddLog('error', 'Skill not found for skillID: ' + selectedSkill.ID);
            return;
        }

        const skillXP = user.experience.GetSkillExperience(skill);
        if (skillXP === null) {
            user.interface.console?.AddLog('error', 'SkillXP not found for skillID: ' + skill.ID);
            return;
        }

        this.setState(
            {
                selectedSkill: {
                    ...selectedSkill,
                    level: langManager.curr['level']['level'] + ' ' + skillXP.lvl,
                    xp: skillXP.xp,
                    next: skillXP.next,
                    stats: Object.values(skill.Stats),
                    totalDuration: this.getTotalDurationFromSkillID(skill.ID)
                },
                history: this.#getHistory()
            },
            async () => {
                // If history is empty, come back
                if (this.state.history.length === 0) {
                    await user.interface.bottomPanel?.Close();
                    this.onBackPress();
                }
            }
        );
    };

    /** @returns {HistoryActivityItem[]} */
    #getHistory = () => {
        const { selectedSkill } = this.state;

        if (selectedSkill.ID === 0) {
            return [];
        }

        const history = [];
        const userActivities = user.activities.GetBySkillID(selectedSkill.ID);

        for (const activity of userActivities.reverse()) {
            const date = GetDate(activity.startTime);

            // Start
            const startDateText = DateFormat(date, 'DD/MM/YYYY');
            const startTimeText = DateFormat(date, 'HH:mm');

            // End
            date.setMinutes(date.getMinutes() + activity.duration);
            const endTimeText = DateFormat(date, 'HH:mm');

            history.push({
                activity,
                title: `${startDateText} ${startTimeText} - ${endTimeText}`,
                onPress: async () => {
                    await user.interface.bottomPanel?.Close();
                    user.interface.bottomPanel?.Open({
                        content: <AddActivity editActivity={activity} />
                    });
                }
            });
        }

        return history;
    };

    /** @param {number} skillID */
    getTotalDurationFromSkillID = (skillID) => {
        const history = user.activities.GetBySkillID(skillID);
        let totalDuration = 0;
        for (const element of history) {
            totalDuration += element.duration;
        }
        return Round(totalDuration / 60, 1);
    };

    addActivity = () => {
        const { selectedSkill } = this.state;
        const skillID = selectedSkill.ID;

        this.fe.bottomPanel?.Open({
            content: <AddActivity openSkillID={skillID} />
        });
    };

    showHistory = () => {
        const { history } = this.state;

        user.interface.bottomPanel?.Open({
            content: <HistoryView items={history} />
        });
    };

    onBackPress = () => {
        user.interface.BackHandle();
    };
}

BackSkill.defaultProps = BackSkillProps;
BackSkill.prototype.props = BackSkillProps;

export default BackSkill;
