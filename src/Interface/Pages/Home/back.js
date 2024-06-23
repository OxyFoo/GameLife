import React from 'react';

import PageBase from 'Interface/FlowEngine/PageBase';
import StartTutorial from './tuto';
import user from 'Managers/UserManager';

import { Round } from 'Utils/Functions';
import StartMission from './mission';

/**
 * @typedef {import('Interface/Widgets').Missions} Missions
 * @typedef {import('Interface/Widgets').MultiplayerPanel} MultiplayerPanel
 * @typedef {import('Class/Missions').MissionsItem} MissionsItem
 */

const BackHomeProps = {
    args: {
        /** @type {number} */
        tuto: 0
    }
};

class BackHome extends PageBase {
    state = {
        experience: user.experience.GetExperience(),
        values: {
            current_level: '0',
            next_level: '0'
        },

        /** @type {MissionsItem | null} */
        mission: user.missions.GetCurrentMission().mission
    };

    feShowUserHeader = true;

    /** @type {React.RefObject<MultiplayerPanel>} */
    refMultiplayerPanel = React.createRef();

    /** @type {React.RefObject<Missions>} */
    refMissions = React.createRef();

    /** @type {Symbol | null} */
    listenerActivities = null;

    /** @type {Symbol | null} */
    listenerMissions = null;

    componentDidMount() {
        this.handleLevelsUpdate();
        this.listenerActivities = user.activities.allActivities.AddListener(this.handleLevelsUpdate);
        this.listenerMissions = user.missions.missions.AddListener(this.handleMissionsUpdate);
    }

    /** @param {this['props']} props */
    componentDidFocused = (props) => {
        StartTutorial.call(this, props.args.tuto);
    };

    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.listenerActivities);
        user.missions.missions.RemoveListener(this.listenerMissions);
    }

    handleLevelsUpdate = () => {
        const experience = user.experience.GetExperience();
        const {
            xpInfo: { lvl, xp, next }
        } = experience;
        const current_level = lvl.toString();
        const next_level = Round((100 * xp) / next, 0).toString();

        this.setState({ experience, values: { current_level, next_level } });
    };

    handleMissionsUpdate = () => {
        const { mission } = user.missions.GetCurrentMission();
        this.setState({ mission });
    };

    StartMission = StartMission.bind(this);

    addActivity = () => user.interface.ChangePage('activity', { storeInHistory: false });
    openSkills = () => user.interface.ChangePage('skills');
    openQuests = () => user.interface.ChangePage('quests');
}

BackHome.defaultProps = BackHomeProps;
BackHome.prototype.props = BackHomeProps;

export default BackHome;
