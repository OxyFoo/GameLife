import * as React from 'react';
import { Animated } from 'react-native';

import StartMission from './mission';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').View} View
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 *
 * @typedef {import('Types/Data/User/Missions').MissionItem} MissionItem
 */

const MissionsProps = {
    /** @type {StyleViewProp} */
    style: {}
};

class BackMissions extends React.Component {
    state = {
        step: 0,

        /** @type {MissionItem | null} */
        mission: null,

        animReward: new Animated.Value(0)
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
        if (this.listener) {
            user.missions.missions.RemoveListener(this.listener);
        }
    }

    handleMissionsUpdate = () => {
        const { index, mission } = user.missions.GetCurrentMission();
        this.setState({ step: index, mission });
    };

    handleNextMission = async () => {
        const lang = langManager.curr['missions'];
        const { mission } = this.state;

        if (mission === null) return;

        // Open mission guide
        if (mission.state === 'pending') {
            StartMission(mission.name);
            return;
        }

        // Claim mission if completed
        if (mission.state === 'completed') {
            // Start animation
            TimingAnimation(this.state.animReward, 1, 300).start();

            const timeBefore = Date.now();

            const claimed = await user.missions.ClaimMission(mission.name);
            if (claimed === 'not-connected') {
                user.interface.popup?.OpenT({
                    type: 'ok',
                    data: {
                        title: lang['alerts']['claim-not-connected-title'],
                        message: lang['alerts']['claim-not-connected-message']
                    }
                });
            } else if (claimed === 'error') {
                user.interface.popup?.OpenT({
                    type: 'ok',
                    data: {
                        title: lang['alerts']['claim-claim-error-title'],
                        message: lang['alerts']['claim-claim-error-message']
                    }
                });
            }

            const timeAfter = Date.now();

            // Stop animation
            if (timeAfter - timeBefore < 300) {
                setTimeout(() => {
                    TimingAnimation(this.state.animReward, 0, 0).start();
                }, 300);
            } else {
                TimingAnimation(this.state.animReward, 0, 0).start();
            }
        }
    };
}

BackMissions.prototype.props = MissionsProps;
BackMissions.defaultProps = MissionsProps;

export default BackMissions;
