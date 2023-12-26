import { PageBase } from 'Interface/Components';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { GetDate } from 'Utils/Time';
import { Round } from 'Utils/Functions';
import { DateToFormatString } from 'Utils/Date';

/**
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 * @typedef {import('Class/Activities').Activity} Activity
 * @typedef {import('Interface/Widgets').ActivityPanel} ActivityPanel
 * 
 * @typedef HistoryActivity
 * @property {Activity} activity
 * @property {string} title
 * @property {(event: GestureResponderEvent) => void} onPress
 */

class BackSkill extends PageBase {
    /** @type {ActivityPanel | null} */
    refActivityPanel = null;

    constructor(props) {
        super(props);

        // Property error handling
        if (typeof(props.args) === 'undefined' || !props.args.hasOwnProperty('skillID')) {
            user.interface.BackHandle();
            return;
        }

        // Get skill
        this.skillID = props.args['skillID'];
        const skill = dataManager.skills.GetByID(this.skillID);
        if (skill === null) {
            user.interface.BackHandle();
            return;
        }

        // Skill data
        const skillXP = user.experience.GetSkillExperience(this.skillID);
        const category = dataManager.skills.GetCategoryByID(skill.CategoryID);
        const authorText = langManager.curr['skill']['text-author'].replace('{}', skill.Creator);
        const totalDuration = this.getTotalDurationFromSkillID(this.skillID);
        const activitiesLength = user.activities.GetBySkillID(this.skillID).length;

        this.skill = {
            name: dataManager.GetText(skill.Name),
            category: dataManager.GetText(category.Name),
            level: langManager.curr['level']['level'] + ' ' + skillXP.lvl,
            totalFloatXp: Round(skillXP.totalXP, 0),
            xp: skillXP.xp,
            next: skillXP.next,
            creator: skill.Creator ? authorText : '',
            stats: Object.values(skill.Stats),
            xml: dataManager.skills.GetXmlByLogoID(skill.LogoID),
            enabled: skill.Enabled,
            totalDuration: totalDuration,
            numberOfActivities: Round(activitiesLength, 1)
        };

        /** @type {Array<HistoryActivity>} */
        this.history = [];
        this.__updateHIstory();
    }

    __updateHIstory = () => {
        const userActivities = user.activities.GetBySkillID(this.skillID);

        this.history = [];
        for (const activity of userActivities.reverse()) {
            // Format title with date and duration
            const date = DateToFormatString(GetDate(activity.startTime));
            const text = langManager.curr['skill']['text-history'];
            const duration = activity.duration;
            const title = text.replace('{}', date).replace('{}', duration.toString());

            // On press function
            const onPress = () => {
                this.refActivityPanel?.SelectActivity(activity, () => {
                    this.__updateHIstory();
                    if (this.history.length === 0) {
                        user.interface.BackHandle();
                    } else {
                        this.forceUpdate();
                    }
                });
            }

            this.history.push({
                activity: activity,
                title: title,
                onPress: onPress
            });
        };
    }

    /** @param {number} skillID */
    getTotalDurationFromSkillID = (skillID) => {
        const history = user.activities.GetBySkillID(skillID);
        let totalDuration = 0;
        for (const element of history) {
            totalDuration += element.duration;
        }
        return Round(totalDuration/60, 1);
    }

    addActivity = () => {
        const args = { skillID: this.skillID };
        user.interface.ChangePage('activity', args, true);
    }
}

export default BackSkill;
