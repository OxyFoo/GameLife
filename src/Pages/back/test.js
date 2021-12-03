import * as React from 'react';

import user from '../../Managers/UserManager';
import dataManager from '../../Managers/DataManager';

class BackTest extends React.Component {
    constructor(props) {
        super(props);

        // Average XP
        const firstDate = user.activities.getFirst();
        firstDate.setHours(0, 0, 0);
        const delta = (new Date()) - firstDate;
        const delta_days = Math.ceil(delta / (1000 * 60 * 60 * 24));
        this.averageXPperDay = Math.max(0, parseInt(user.xp / delta_days));

        // User activities
        const show = 3;
        const userActivities = user.activities.getAll();
        this.activities = [];
        for (let i = userActivities.length-1; i > userActivities.length - show - 1; i--) {
            if (i >= 0) {
                this.activities.push(userActivities[i]);
            }
        }

        // Skills
        const MAX_SKILLS = 6;
        let skills = user.experience.getAllSkills('', [], 0, true);
        skills.length = Math.min(skills.length, MAX_SKILLS);

        this.skills = [];
        for (let s = 0; s < skills.length; s++) {
            const skill = skills[s];
            const skillID = skill.skillID;
            const skillName = dataManager.skills.getByID(skillID).Name;
            const newVal = { key: skillID, value: skillName };
            this.skills.push(newVal);
        }
        while (this.skills.length < MAX_SKILLS) {
            this.skills.push({ key: -1, value: '' });
        }
    }

    state = {
        test: '',
        testChecked: false
    }

    addSkill = () => {
        if (dataManager.skills.getAll().length <= 1) {
            console.warn("Aucun skill !");
            return;
        }
        user.changePage('activity');
    }
    openIdentity = () => { user.changePage('identity'); }
    openCalendar = () => { user.changePage('calendar'); }
    openSkill = (skillID) => { user.changePage('skill', { skillID: skillID }); }
    openSkills = () => { user.changePage('skills'); }
    openExperience = () => { user.changePage('experience'); }
}

export default BackTest;