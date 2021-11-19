import * as React from 'react';

import dataManager from '../../Managers/DataManager';

class BackAchievements extends React.Component {
    constructor(props) {
        super(props);
        this.achievement = dataManager.achievements.getAchievements();
    }
}

export default BackAchievements;