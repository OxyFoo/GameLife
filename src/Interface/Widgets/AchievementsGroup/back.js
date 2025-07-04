import * as React from 'react';

import user from 'Managers/UserManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Multiplayer').Friend} Friend
 * @typedef {import('Data/User/Achievements').Achievement} Achievement
 */

const AchievementsGroupProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {Friend | null} Show achievements of friends */
    friend: null
};

class AchievementsGroupBack extends React.Component {
    state = {
        /** @type {Array<Achievement>} */
        lastAchievements: []
    };

    /** @type {Symbol | null} */
    achievementsListener = null;

    /** @param {AchievementsGroupProps} props */
    constructor(props) {
        super(props);

        if (props.friend === null) {
            this.state.lastAchievements = user.achievements.GetLast(3);
        } else {
            this.state.lastAchievements = user.achievements.GetLast(3, props.friend.achievements);
        }
    }

    componentDidMount() {
        this.achievementsListener = user.achievements.achievements.AddListener(this.updateAchievements);
    }

    componentWillUnmount() {
        user.achievements.achievements.RemoveListener(this.achievementsListener);
    }

    updateAchievements = () => {
        if (this.props.friend !== null) {
            return;
        }

        this.setState({
            lastAchievements: user.achievements.GetLast()
        });
    };

    openAchievements = () => {
        if (this.props.friend === null) {
            user.interface.ChangePage('achievements');
        } else {
            user.interface.ChangePage('achievements', {
                args: {
                    friendID: this.props.friend.accountID
                }
            });
        }
    };

    /** @param {number} ID */
    onAchievementPress = (ID) => user.achievements.ShowCardPopup(ID);
}

AchievementsGroupBack.prototype.props = AchievementsGroupProps;
AchievementsGroupBack.defaultProps = AchievementsGroupProps;

export default AchievementsGroupBack;
