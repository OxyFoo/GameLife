import { PageBack } from 'Interface/Components';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { GetDate } from 'Utils/Time';
import { DateToFormatString } from 'Utils/Date';

/**
 * @typedef {import('Class/Activities').Activity} Activity
 * 
 * @typedef HistoryActivity
 * @property {Activity} activity
 * @property {string} title
 * @property {function} onPress
 */

class BackSkill extends PageBack {
    constructor(props) {
        super(props);

        // Property error handling
        if (typeof(props.args) === 'undefined' || !props.args.hasOwnProperty('skillID')) {
            user.interface.BackPage(true);
            return;
        }

        // Get skill
        this.skillID = props.args['skillID'];
        const skill = dataManager.skills.GetByID(this.skillID);
        const skillXP = user.experience.GetSkillExperience(this.skillID);

        // Skill data
        const category = dataManager.skills.GetCategoryByID(skill.CategoryID);
        const authorText = langManager.curr['skill']['text-author'].replace('{}', skill.Creator);
        this.skill = {
            name: dataManager.GetText(skill.Name),
            category: dataManager.GetText(category.Name),
            level: langManager.curr['level']['level'] + ' ' + skillXP.lvl,
            xp: skillXP.xp,
            next: skillXP.next,
            creator: skill.Creator ? authorText : '',
            stats: Object.values(skill.Stats),
            xml: dataManager.skills.GetXmlByLogoID(skill.LogoID)
        };

        // History
        const userActivities = user.activities.Get();
        const history = userActivities.filter((a) => a.skillID === this.skillID).reverse();
        this.history = history.map((activity) => {
            // Format title with date and duration
            const date = DateToFormatString(GetDate(activity.startTime));
            const text = langManager.curr['skill']['text-history'];
            const duration = activity.duration;
            const title = text.replace('{}', date).replace('{}', duration);

            // On press function
            const onPress = () => { user.interface.ChangePage('activity', { 'activity': activity }); }

            return { activity, title, onPress };
        });
    }

    addActivity = () => {
        const args = { skillID: this.skillID };
        user.interface.ChangePage('activity', args, true);
    }
}

export default BackSkill;