import * as React from 'react';

import StartMission from './mission';
import user from 'Managers/UserManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 * 
 * @typedef {import('Interface/Pages/Home').default} Home
 * @typedef {import('Class/Missions').MissionsItem} MissionsItem
 */

const MissionsProps = {
    /** @type {StyleViewProp} */
    style: {},

    
    /** @type {Home | null} */
    refHome: null
};

class BackMissions extends React.Component {
    state = {
        step: 0,

        /** @type {MissionsItem} */
        mission: null
    };

    /** @param {typeof MissionsProps} props */
    constructor(props) {
        super(props);

        const { index, mission } = user.missions.GetCurrentMission();
        this.state.step = index;
        this.state.mission = mission;
    }

    componentDidMount() {
        this.listener = user.missions.missions.AddListener(this.handleMissionsUpdate);
    }

    componentWillUnmount() {
        user.missions.missions.RemoveListener(this.listener);
    }

    handleMissionsUpdate = () => {
        const { index, mission } = user.missions.GetCurrentMission();
        this.setState({ step: index, mission });
    }

    handleNextMission = async () => {
        const { mission } = this.state;

        // Open mission guide
        if (mission.state === 'pending') {
            StartMission.call(this, mission.name);
            return;
        }

        // Claim mission if completed
        if (mission.state === 'completed') {
            const claimed = await user.missions.ClaimMission(mission.name);
            if (claimed === false) return;
        }
    };
}

BackMissions.prototype.props = MissionsProps;
BackMissions.defaultProps = MissionsProps;

export default BackMissions;
