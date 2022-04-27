import * as React from 'react';

import user from '../../Managers/UserManager';
import dataManager from '../../Managers/DataManager';

import { GetTime } from '../../Utils/Time';

class BackIdentity extends React.Component {
    constructor(props) {
        super(props);

        this.userXP = user.experience.GetExperience();

        const activities = user.activities.Get();
        this.totalActivityLength = activities.length;
        this.totalActivityTime = this.getTotalDuration(activities);
        this.playTime = this.getTimeFromFirst(activities);

        const completeAchievements = user.achievements.Get().reverse().slice(0, 3);
        this.lastAchievements = completeAchievements.map(dataManager.achievements.GetByID);

        this.refPage = null;
        this.refAvatar = null;
        this.refIdentityEditor = null;

        this.state = {
            editorOpened: false
        };
    
        this.skills = user.activities.GetLasts();
    }

    openSkills = () => user.interface.ChangePage('skills');
    openAchievements = () => user.interface.ChangePage('achievements');
    onAchievementPress = (ID) => user.achievements.ShowCardPopup(ID);

    /**
     * @returns {Number} in hours
     */
    getTotalDuration(activities) {
        let totalDuration = 0;
        for (let a in activities) {
            totalDuration += activities[a].duration;
        }
        const totalDurationHour = totalDuration / 60;
        return Math.floor(totalDurationHour);
    }
    /**
     * @returns {Number} in days
     */
    getTimeFromFirst(activities) {
        if (!activities.length) return 0;

        const initTime = activities[0].startTime;
        const initDate = new Date(initTime * 1000);
        const diff = (GetTime() - GetTime(initDate)) / (60 * 60 * 24);
        return Math.floor(diff);
    }

    onBack = () => {
        if (this.refAvatar !== null && this.refAvatar.state.editorOpened) {
            this.refAvatar.CloseEditor();
        } else {
            user.interface.BackPage();
        }
    }
}

export default BackIdentity;