import { PageBack } from 'Interface/Components';
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

class BackSkill extends PageBack {
    /** @type {ActivityPanel|null} */
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
        this.skill = {
            name: dataManager.GetText(skill.Name),
            category: dataManager.GetText(category.Name),
            level: langManager.curr['level']['level'] + ' ' + skillXP.lvl,
            totalXP: skillXP.totalXP + ' ' + langManager.curr['level']['xp'],
            totalFloatXp: Round(skillXP.totalXP, 0),
            xp: skillXP.xp,
            next: skillXP.next,
            creator: skill.Creator ? authorText : '',
            stats: Object.values(skill.Stats),
            xml: dataManager.skills.GetXmlByLogoID(skill.LogoID),
            enabled: skill.Enabled,
            totalDuration: totalDuration,
            numberOfActivities: Round(totalDuration/this.getAllActivityFromSkillID(this.skillID).length,1),
        };

        // History
        this.history = [];
        this.__updateHIstory();
    }

    componentDidMount() {
        super.componentDidMount();

        // Back handler
        user.interface.SetCustomBackHandler(() => {
            this.refActivityPanel?.Close();
            return true;
        });
    }

    __updateHIstory = () => {
        const userActivities = user.activities.Get();
        const history = userActivities.filter((a) => a.skillID === this.skillID).reverse();
        this.history = history.map((activity) => {
            // Format title with date and duration
            const date = DateToFormatString(GetDate(activity.startTime));
            const text = langManager.curr['skill']['text-history'];
            const duration = activity.duration;
            const title = text.replace('{}', date).replace('{}', duration.toString());

            // On press function
            const onPress = () => {
                this.refActivityPanel?.SelectActivity(activity, () => {
                    this.__updateHIstory();
                    const empty = this.history.length === 0;
                    if (empty) user.interface.BackHandle();
                    else       this.forceUpdate();
                });
            }

            return { activity, title, onPress };
        });
    }

    getAllActivityFromSkillID = (skillID) => {
        const userActivities = user.activities.Get();
        const history = userActivities.filter((a) => a.skillID === skillID)
        return history;
    }

    getTotalDurationFromSkillID = (skillID) => {
        const history = this.getAllActivityFromSkillID(skillID);
        let totalDuration = 0;
        for (const element of history) {
            totalDuration += element.duration;
        }
        return Round(totalDuration/60,1);
    }

    addActivity = () => {
        const args = { skillID: this.skillID };
        user.interface.ChangePage('activity', args, true);
    }
}

export default BackSkill;