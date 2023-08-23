import { PageBack } from 'Interface/Components';
import user from 'Managers/UserManager';

import { GetDate, GetTime } from 'Utils/Time';

/**
 * @typedef {import('./editorAvatar').default} EditorAvatar
 * @typedef {import('./editorProfile').default} ProfileEditor
 */

class BackProfile extends PageBack {
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

        this.activitiesListener = user.activities.allActivities.AddListener(
            () => this.setState({
                xpInfo: user.experience.GetExperience().xpInfo
            })
        );
    }

    refTuto1 = null;

    componentDidFocused = (args) => {
        // Update the avatar
        // TODO: Don't update the avatar if the user didn't change anything
        this.refAvatar.updateEquippedItems();
        this.refAvatar.forceUpdate();
        this.refAvatar.refFrame.forceUpdate();

        // Tutorial
        if (args?.tuto === 2) {
            user.interface.screenTuto.ShowSequence([
                { component: this.refTuto1, text: "Ici c'est ton profil, tu peux y modifier tes informations personnelles" },
                { component: this.refAvatar.refButton, text: "Là c'est ton avatar, tu peux cliquer dessus pour le modifier" }
            ], () => {
                user.interface.ChangePage('home', { tuto: 3 }, true);
            });
        }
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
            user.interface.BackPage();
        }
    }
}

export default BackProfile;