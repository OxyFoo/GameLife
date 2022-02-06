import * as React from 'react';

import user from '../../Managers/UserManager';

import { GetTime } from '../../Functions/Time';

class BackIdentity extends React.Component {
    constructor(props) {
        super(props);

        const activities = user.activities.Get();
        this.totalActivityLength = activities.length;
        this.totalActivityTime = this.getTotalDuration(activities);
        this.playTime = this.getTimeFromFirst(activities);

        this.refPage = null;
        this.refAvatar = null;
        this.state = {
            stateDTP: '',
            editorOpened: false
        };
    
        this.skills = user.activities.GetLasts();
    }

    openSkills = () => user.interface.ChangePage('skills');
    openAchievements = () => user.interface.ChangePage('achievements');

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