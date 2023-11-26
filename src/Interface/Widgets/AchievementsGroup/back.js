import * as React from 'react';

import user from 'Managers/UserManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 */

const AchievementsGroupProps = {
    /** @type {StyleProp} */
    style: {}
};

class AchievementsGroupBack extends React.Component {
    state = {
        lastAchievements: user.achievements.GetLast()
    }

    componentDidMount() {
        this.achievementsListener = user.achievements.achievements.AddListener(() => {
            this.setState({
                lastAchievements: user.achievements.GetLast()
            });
        });
    }
    componentWillUnmount() {
        user.achievements.achievements.RemoveListener(this.achievementsListener);
    }

    openAchievements = () => user.interface.ChangePage('achievements');
    onAchievementPress = (ID) => user.achievements.ShowCardPopup(ID);
}

AchievementsGroupBack.prototype.props = AchievementsGroupProps;
AchievementsGroupBack.defaultProps = AchievementsGroupProps;

export default AchievementsGroupBack;
