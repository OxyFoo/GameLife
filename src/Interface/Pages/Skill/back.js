import React from 'react';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { AddActivity } from 'Interface/Widgets';
import { GetDate } from 'Utils/Time';
import { Round } from 'Utils/Functions';
import { DateFormat } from 'Utils/Date';

/**
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 * @typedef {import('Class/Activities').Activity} Activity
 *
 * @typedef HistoryActivity
 * @property {Activity} activity
 * @property {string} title
 */

const BackSkillProps = {
    args: {
        /** @type {number} */
        skillID: 0
    }
};

class BackSkill extends PageBase {
    /** @type {Array<HistoryActivity>} */
    history = [];

    skill = {
        ID: 0,
        name: '',
        category: '',
        level: langManager.curr['level']['level'] + ' 1',
        totalFloatXp: 0,
        xp: 0,
        next: 1,
        creator: '',
        stats: user.statsKey.map(() => 0),
        xml: '',
        enabled: true,
        totalDuration: 0
    };

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

        this.skill = {
            ID: skillID,
            name: langManager.GetText(skill.Name),
            category: langManager.GetText(category.Name),
            level: langManager.curr['level']['level'] + ' ' + skillXP.lvl,
            totalFloatXp: Round(skillXP.totalXP, 0),
            xp: skillXP.xp,
            next: skillXP.next,
            creator: skill.Creator ? authorText : '',
            stats: Object.values(skill.Stats),
            xml: dataManager.skills.GetXmlByLogoID(skill.LogoID),
            enabled: skill.Enabled,
            totalDuration: totalDuration
        };

        this.__updateHIstory();
    }

    componentDidMount() {
        if (this.skill.ID === 0) {
            // TODO: Clean instant back handle
            this.timeout = setTimeout(() => {
                user.interface.BackHandle();
            }, 100);
        }
    }

    __updateHIstory = () => {
        if (this.skill.ID === 0) return;
        const userActivities = user.activities.GetBySkillID(this.skill.ID);

        this.history = [];
        for (const activity of userActivities.reverse()) {
            const date = GetDate(activity.startTime);

            // Start
            const startDateText = DateFormat(date, 'DD/MM/YYYY');
            const startTimeText = DateFormat(date, 'HH:mm');

            // End
            date.setMinutes(date.getMinutes() + activity.duration);
            const endTimeText = DateFormat(date, 'HH:mm');

            const title = `${startDateText} ${startTimeText} - ${endTimeText}`;
            this.history.push({ activity, title });
        }
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
        const skillID = this.skill.ID;
        user.interface.bottomPanel?.Open({
            content: <AddActivity openSkillID={skillID} />,
            movable: false
        });
    };

    showHistory = () => {
        const lang = langManager.curr['skill'];
        const items = this.history.map((item, index) => ({ id: index + 1, value: item.title }));
        user.interface.screenList?.Open(lang['history-title'], items, (index) => {
            const activity = this.history[index - 1].activity;
            user.interface.bottomPanel?.Open({
                content: <AddActivity editActivity={activity} />
            });
        });
    };

    onBackPress = () => {
        user.interface.BackHandle();
    };
}

BackSkill.defaultProps = BackSkillProps;
BackSkill.prototype.props = BackSkillProps;

export default BackSkill;
