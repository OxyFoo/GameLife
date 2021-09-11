import * as React from 'react';

import user from '../Managers/UserManager';

class Home extends React.Component {
    constructor(props) {
        super(props);

        // Average XP
        const firstDate = user.getFirstActivity();
        firstDate.setHours(0, 0, 0);
        const delta = (new Date()) - firstDate;
        const delta_days = Math.ceil(delta / (1000 * 60 * 60 * 24));
        this.averageXPperDay = Math.max(0, parseInt(user.xp / delta_days));

        // User activities
        const show = 3;
        this.activities = [];
        for (let i = user.activities.length-1; i > user.activities.length - show - 1; i--) {
            if (i >= 0) {
                this.activities.push(user.activities[i]);
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
            const skillName = user.getSkillByID(skillID).Name;
            const newVal = { key: skillID, value: skillName };
            this.skills.push(newVal);
        }
        while (this.skills.length < MAX_SKILLS) {
            this.skills.push({ key: -1, value: '' });
        }
    }


    addSkill = () => {
        if (user.skills.length <= 1) {
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

export default Home;