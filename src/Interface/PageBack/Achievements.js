import * as React from 'react';

import user from '../../Managers/UserManager';
import dataManager from '../../Managers/DataManager';

class BackAchievements extends React.Component {
    constructor(props) {
        super(props);
        this.achievement = dataManager.achievements.GetAchievements(user.achievements.solved);
    }
}

export default BackAchievements;