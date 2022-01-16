import * as React from 'react';

import user from '../../Managers/UserManager';
import dataManager from '../../Managers/DataManager';

class BackTest extends React.Component {
    constructor(props) {
        super(props);

        // Average XP
        const firstDate = new Date(user.activities.GetFirstTime() * 1000);
        firstDate.setHours(0, 0, 0);
        const delta = (new Date()) - firstDate;
        const delta_days = Math.ceil(delta / (1000 * 60 * 60 * 24));
        this.averageXPperDay = Math.max(0, parseInt(user.xp / delta_days));

        // User activities
        const show = 3;
        const userActivities = user.activities.GetAll();
        this.activities = [];
        for (let i = userActivities.length-1; i > userActivities.length - show - 1; i--) {
            if (i >= 0) {
                this.activities.push(userActivities[i]);
            }
        }

        // Skills
        const MAX_SKILLS = 6;
        let skills = user.experience.GetAllSkills('', [], 0, true);
        skills.length = Math.min(skills.length, MAX_SKILLS);

        this.skills = [];
        for (let s = 0; s < skills.length; s++) {
            const skill = skills[s];
            const skillID = skill.skillID;
            const skillName = dataManager.skills.GetByID(skillID).Name;
            const newVal = { key: skillID, value: skillName };
            this.skills.push(newVal);
        }
        while (this.skills.length < MAX_SKILLS) {
            this.skills.push({ key: -1, value: '' });
        }
    }

    state = {
        test: '',
        testChecked: false,
        selectedSkill: {ID: -1, value: ''},
        switch: true
    }

    addSkill = () => {
        if (dataManager.skills.skills.length <= 1) {
            console.warn("Aucun skill !");
            return;
        }
        user.interface.ChangePage('activity');
    }
    openIdentity = () => { user.interface.ChangePage('identity'); }
    openCalendar = () => { user.interface.ChangePage('calendar'); }
    openSkill = (skillID) => { user.interface.ChangePage('skill', { skillID: skillID }); }
    openSkills = () => { user.interface.ChangePage('skills'); }
    openExperience = () => { user.interface.ChangePage('experience'); }
}

export default BackTest;