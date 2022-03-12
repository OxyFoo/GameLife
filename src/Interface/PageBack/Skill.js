import * as React from 'react';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import dataManager from '../../Managers/DataManager';

class BackSkill extends React.Component {
    constructor(props) {
        super(props);

        this.enabled = true;
        if (typeof(props.args) === 'undefined' || !props.args.hasOwnProperty('skillID')) {
            this.enabled = false;
            user.interface.BackPage(true);
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
        this.stats = Object.values(skill.Stats);
        this.xml = dataManager.skills.GetXmlByLogoID(skill.LogoID);

        const userActivities = user.activities.Get();
        this.history = userActivities.filter((a) => a.skillID === skillID).reverse();
    }

    addActivity = () => {
        const skillID = this.props.args['skillID'];
        user.interface.ChangePage('activity', { skillID: skillID }, true);
    }
}

export default BackSkill;