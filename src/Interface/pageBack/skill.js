import * as React from 'react';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import dataManager from '../../Managers/DataManager';

class BackSkill extends React.Component {
    constructor(props) {
        super(props);

        if (typeof(props.args) === 'undefined') {
            user.backPage();
            return;
        }

        const skillID = props.args['skillID'];
        const skill = dataManager.skills.getByID(skillID);
        const skillXP = user.experience.getSkillExperience(skillID);

        this.name = skill.Name;
        this.category = skill.Category;
        this.level = langManager.curr['level']['level'] + ' ' + skillXP.lvl;
        this.xp = skillXP.xp;
        this.maxXP = skillXP.next;
        if (skill.Creator) {
            this.creator = langManager.curr['skill']['text-author'] + ' ' + skill.Creator;
        } else {
            this.creator = '';
        }
        this.stats = skill.Stats;
        this.xml = dataManager.skills.getXmlByLogoID(skill.LogoID);
        this.history = [];
        const userActivities = user.activities.getAll();
        for (let a in userActivities) {
            const activity = userActivities[a];
            if (activity.skillID === skillID) {
                this.history.push(activity);
            }
        }
        this.history.reverse();
    }

    back = () => { user.backPage(); }
}

export default BackSkill;