import StartTutorial from './tuto';

import user from 'Managers/UserManager';

import { PageBase } from 'Interface/Components';
import { GetDate, GetTime } from 'Utils/Time';

/**
 * @typedef {import('./editorAvatar').default} EditorAvatar
 * @typedef {import('./editorProfile').default} ProfileEditor
 */

class BackProfile extends PageBase {
    state = {
        editorOpened: false,
        xpInfo: user.experience.GetExperience().xpInfo,

        playTime: 0,
        totalActivityLength: 0,
        totalActivityTime: 0
    }

    constructor(props) {
        super(props);

        /** @type {EditorAvatar} */
        this.refAvatar = null;

        /** @type {ProfileEditor} */
        this.refProfileEditor = null;
        this.time_start = Date.now();
    }

    refTuto1 = null;

    componentDidMount() {
        super.componentDidMount();
        this.computeKPI(); 
        const time_end = Date.now();
        const time = time_end - this.time_start;
        user.interface.console.AddLog('info', 'PROFILE loaded in ' + time + 'ms');

        this.activitiesListener = user.activities.allActivities.AddListener(() => {
            this.setState({
                xpInfo: user.experience.GetExperience().xpInfo
            });
        });
    } 

    componentDidFocused = (args) => {
        this.computeKPI(); 
        // Update the avatar
        // TODO: Don't update the avatar if the user didn't change anything
        this.refAvatar.updateEquippedItems();
        this.refAvatar.forceUpdate();
        this.refAvatar.selectSlot(this.refAvatar.state.slotSelected);
        this.refAvatar.refFrame.forceUpdate();

        StartTutorial.call(this, args?.tuto);
    }

    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    openProfileEditor = () => this.refProfileEditor?.Open();
    openSettings = () => user.interface.ChangePage('settings');

    computeKPI() {
        const activities = user.activities.Get();
        const totalActivityLength = activities.length;
        const totalActivityTime = this.getTotalDuration(activities);
        const playTime = this.getTimeFromFirst(activities);

        this.setState({
            playTime,
            totalActivityLength,
            totalActivityTime
        });
    }

    /**
     * @returns {number} in hours
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
     * @returns {number} in days
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
            user.interface.BackHandle();
        }
    }
}

export default BackProfile;
