import { PageBase } from 'Interface/Global';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { GetDate } from 'Utils/Time';
import { Round } from 'Utils/Functions';
import { DateToFormatString, DateToFormatTimeString } from 'Utils/Date';

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

    constructor(props) {
        super(props);

        // Property error handling
        if (typeof(props.args) === 'undefined' || !props.args.hasOwnProperty('skillID')) {
            return;
        }

        // Get skill
        const skillID = props.args['skillID'];
        const skill = dataManager.skills.GetByID(skillID);
        if (skill === null) {
            user.interface.console.AddLog('error', 'Skill not found for skillID: ' + skillID);
            return;
        }

        // Skill data
        const skillXP = user.experience.GetSkillExperience(skillID);
        if (skillXP === null) {
            user.interface.console.AddLog('error', 'SkillXP not found for skillID: ' + skillID);
            return;
        }

        const category = dataManager.skills.GetCategoryByID(skill.CategoryID);
        if (category === null) {
            user.interface.console.AddLog('error', 'Category not found for skillID: ' + skillID);
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
        const langDateName = langManager.curr['dates']['names'];

        if (this.skill.ID === 0) return;
        const userActivities = user.activities.GetBySkillID(this.skill.ID);

        this.history = [];
        for (const activity of userActivities.reverse()) {
            // Format title with date and duration
            const date = GetDate(activity.startTime);
            const dateStr = DateToFormatString(date);
            const start = DateToFormatTimeString(date);
            const durationH = Math.floor(activity.duration / 60);
            const durationM = activity.duration % 60;
            const title = `${dateStr}\n${start} - ${durationH}${langDateName['hours-min']} ${durationM}${langDateName['minutes-min']}`;

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

            this.history.push({ activity, title, onPress });
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
        const skillID = this.skill.ID;
        user.interface.ChangePage('activity', { skillID }, true);
    }
}

export default BackSkill;
