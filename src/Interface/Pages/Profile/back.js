import { PageBase } from 'Interface/Components';
import user from 'Managers/UserManager';

import { GetDate, GetTime } from 'Utils/Time';

/**
 * @typedef {import('./editorAvatar').default} EditorAvatar
 * @typedef {import('./editorProfile').default} ProfileEditor
 */

class BackProfile extends PageBase {
    state = {
        editorOpened: false,
        xpInfo: user.experience.GetExperience().xpInfo
    }

    constructor(props) {
        super(props);

        const activities = user.activities.Get();
        this.totalActivityLength = activities.length;
        this.totalActivityTime = this.getTotalDuration(activities);
        this.playTime = this.getTimeFromFirst(activities);

        /** @type {EditorAvatar} */
        this.refAvatar = null;

        /** @type {ProfileEditor} */
        this.refProfileEditor = null;
        this.time_start = Date.now();
    }

    refTuto1 = null;

    componentDidMount() {
        super.componentDidMount();
        const time_end = Date.now();
        const time = time_end - this.time_start;
        user.interface.console.AddLog('info', 'PROFILE loaded in ' + time + 'ms');

        this.activitiesListener = user.activities.allActivities.AddListener(() => {
            this.setState({
                xpInfo: user.experience.GetExperience().xpInfo
            });
        });
    }

    componentDidFocused = () => {
        // Update the avatar
        // TODO: Don't update the avatar if the user didn't change anything
        this.refAvatar.updateEquippedItems();
        this.refAvatar.forceUpdate();
        this.refAvatar.selectSlot(this.refAvatar.state.slotSelected);
        this.refAvatar.refFrame.forceUpdate();
    }

    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    openProfileEditor = () => this.refProfileEditor?.Open();

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