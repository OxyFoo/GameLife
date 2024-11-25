import user from 'Managers/UserManager';

import PageBase from 'Interface/FlowEngine/PageBase';
import { Round } from 'Utils/Functions';
import { GetDate, GetGlobalTime } from 'Utils/Time';

/**
 * @typedef {import('Data/User/Activities/index').Activity} Activity
 */

const BackNewPageProps = {
    args: {}
};

class BackNewPage extends PageBase {
    state = {
        experience: user.experience.experience.Get(),
        kpis: this.getValuesKPI()
    };

    /** @type {Symbol | null} */
    activitiesListener = null;

    componentDidMount() {
        this.activitiesListener = user.activities.allActivities.AddListener(() => {
            this.setState({
                experience: user.experience.experience.Get(),
                kpis: this.getValuesKPI()
            });
        });
    }

    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    getValuesKPI() {
        const activities = user.activities.Get();

        return {
            playedDays: this.getTimeFromFirst(activities),
            totalActivityLength: activities.length,
            totalActivityTimeHours: this.getTotalDuration(activities),
            ox: user.informations.ox.Get(),
            inventoryCount: user.inventory.Get().stuffs.length,
            friendsCount: user.multiplayer.friends.Get().length
        };
    }

    /**
     * @param {Array<Activity>} activities
     * @returns {number} in hours
     */
    getTotalDuration(activities) {
        const durations = activities.map((a) => a.duration);
        const hours = durations.reduce((a, b) => a + b, 0) / 60;
        return Round(hours, 1);
    }
    /**
     * @param {Array<Activity>} activities
     * @returns {number} in days
     */
    getTimeFromFirst(activities) {
        if (!activities.length) return 0;

        const initTime = activities[0].startTime;
        const initDate = GetDate(initTime);
        const diff = (GetGlobalTime() - GetGlobalTime(initDate)) / (60 * 60 * 24);
        return Math.floor(diff);
    }

    onBack = () => {
        this.fe.BackHandle();
    };
}

BackNewPage.defaultProps = BackNewPageProps;
BackNewPage.prototype.props = BackNewPageProps;

export default BackNewPage;
