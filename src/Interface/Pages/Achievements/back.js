import * as React from 'react';

import user from '../../../Managers/UserManager';
import dataManager from '../../../Managers/DataManager';

/**
 * @typedef {import('../../../Data/Achievements').Achievement} Achievement
 */

class BackAchievements extends React.Component {
    constructor(props) {
        super(props);
        const completeAchievements = user.achievements.Get();
        this.achievement = dataManager.achievements.GetAll(completeAchievements);
        this.achievement = this.achievement.map(achievement => ({
            ID: achievement.ID,
            Name: dataManager.GetText(achievement.Name),
            Description: dataManager.GetText(achievement.Description),
            isSolved: completeAchievements.includes(parseInt(achievement.ID))
        }));
    }

    onAchievementPress = (ID) => user.achievements.ShowCardPopup(ID);
}

export default BackAchievements;