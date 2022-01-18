import * as React from 'react';

import user from '../../Managers/UserManager';

class BackHome extends React.Component {
    constructor(props) {
        super(props);
    }

    addActivity = () => user.interface.ChangePage('activity', undefined, true);
    openSettings = () => user.interface.ChangePage('settings');
    openSkills = () => user.interface.ChangePage('skills');
}

export default BackHome;