import React from 'react';

import { PageBase } from 'Interface/Components';
import StartTutorial from './tuto';
import user from 'Managers/UserManager';

import { MultiplayerPanel } from 'Interface/Widgets';
import { Round } from 'Utils/Functions';
import StartMission from './mission';

class BackHome extends PageBase {
    state = {
        experience: user.experience.GetExperience(),
        values: {
            current_level: '0',
            next_level: '0'
        }
    }

    /** @type {React.RefObject<MultiplayerPanel>} */
    refMultiplayerPanel = React.createRef();

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

    StartMission = StartMission.bind(this);

    addActivity = () => user.interface.ChangePage('activity', undefined, true);
    openSkills = () => user.interface.ChangePage('skills');
}

export default BackHome;
