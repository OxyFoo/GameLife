import React from 'react';

import PageBase from 'Interface/FlowEngine/PageBase';
import StartTutorial from './tuto';
import user from 'Managers/UserManager';

import { Round } from 'Utils/Functions';
import StartMission from './mission';

/**
 * @typedef {import('Interface/Widgets').Missions} Missions
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
            currentLevel: '0',
            currentXP: '0',
            nextLevelXP: '0'
        }
    };

    static feKeepMounted = true;
    static feShowUserHeader = true;
    static feShowNavBar = true;

    /** @type {React.RefObject<Missions>} */
    refMissions = React.createRef();

    /** @type {Symbol | null} */
    listenerActivities = null;

    componentDidMount() {
        this.handleLevelsUpdate();
        this.listenerActivities = user.activities.allActivities.AddListener(this.handleLevelsUpdate);
    }

    /** @param {this['props']} props */
    componentDidFocused = (props) => {
        //StartTutorial.call(this, props.args.tuto);
    };

    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.listenerActivities);
    }

    handleLevelsUpdate = () => {
        const experience = user.experience.GetExperience();
        const {
            xpInfo: { lvl, xp, next }
        } = experience;

        this.setState({
            experience,
            values: {
                currentLevel: lvl.toString(),
                currentXP: Round(xp, 0).toString(),
                nextLevelXP: next.toString()
            }
        });
    };

    StartMission = StartMission.bind(this);

    addActivity = () => user.interface.ChangePage('activity', { storeInHistory: false });
    openSkills = () => user.interface.ChangePage('skills');
    openQuests = () => user.interface.ChangePage('quests');
}

BackHome.defaultProps = BackHomeProps;
BackHome.prototype.props = BackHomeProps;

export default BackHome;
