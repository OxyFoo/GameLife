import * as React from 'react';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import dataManager from '../../Managers/DataManager';

class BackSkill extends React.Component {
    constructor(props) {
        super(props);

        if (typeof(props.args) === 'undefined' || !props.args.hasOwnProperty('skillID')) {
            user.interface.BackPage();
            return;
        }

        const skillID = props.args['skillID'];
        const skill = dataManager.skills.GetByID(skillID);
        const skillXP = user.experience.GetSkillExperience(skillID);

        this.name = dataManager.GetText(skill.Name);
        const category = dataManager.skills.GetCategoryByID(skill.CategoryID);
        this.category = dataManager.GetText(category.Name);
        this.level = langManager.curr['level']['level'] + ' ' + skillXP.lvl;
        this.xp = skillXP.xp;
        this.maxXP = skillXP.next;
        if (skill.Creator) {
            this.creator = langManager.curr['skill']['text-author'].replace('{}', skill.Creator);
        } else {
            this.creator = '';
        }
        this.stats = skill.Stats;
        this.xml = dataManager.skills.GetXmlByLogoID(skill.LogoID);
        this.history = [];
        const userActivities = user.activities.GetAll();
        for (let a in userActivities) {
            const activity = userActivities[a];
            if (activity.skillID === skillID) {
                this.history.push(activity);
            }
        }
        this.history.reverse();
    }
}

export default BackSkill;