import { PageBase } from 'Interface/Components';
import user from 'Managers/UserManager';

import StartTutorial from './tuto';
import { Round } from 'Utils/Functions';

class BackHome extends PageBase {
    state = {
        experience: user.experience.GetExperience(),
        values: {
            current_level: '0',
            next_level: '0'
        }
    }

    refTuto1 = null;
    refTuto2 = null;

    componentDidMount() {
        super.componentDidMount();

        this.updateStateValues();
        this.activitiesListener = user.activities.allActivities.AddListener(
            this.updateStateValues
        );
    }
    componentDidFocused = (args) => {
        StartTutorial.call(this, args?.tuto);
    }

    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    updateStateValues = () => {
        const experience = user.experience.GetExperience();
        const { xpInfo: { lvl, xp, next } } = experience;
        const current_level = lvl.toString();
        const next_level = Round(100 * xp / next, 0).toString();

        this.setState({ experience, values: { current_level, next_level } });
    }

    addActivity = () => user.interface.ChangePage('activity', undefined, true);
    openSettings = () => user.interface.ChangePage('settings');
}

export default BackHome;
