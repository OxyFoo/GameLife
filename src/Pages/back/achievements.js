import * as React from 'react';

import user from '../../Managers/UserManager';

class BackAchievements extends React.Component {
    constructor(props) {
        super(props);
        this.achievement = user.getAchievements();
    }
}

export default BackAchievements;