import * as React from 'react';

import user from '../../../Managers/UserManager';

import { GetDate, GetTime } from '../../../Utils/Time';

/**
 * @typedef {import('./ProfileEditor').default} ProfileEditor
 */

class BackProfile extends React.Component {
    state = {
        editorOpened: false
    }

    constructor(props) {
        super(props);

        this.userXP = user.experience.GetExperience();

        const activities = user.activities.Get();
        this.totalActivityLength = activities.length;
        this.totalActivityTime = this.getTotalDuration(activities);
        this.playTime = this.getTimeFromFirst(activities);

        this.refPage = null;
        this.refAvatar = null;

        /** @type {ProfileEditor} */
        this.refProfileEditor = null;
    }

    openProfileEditor = () => this.refProfileEditor?.Open();

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
        const initDate = GetDate(initTime);
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

export default BackProfile;