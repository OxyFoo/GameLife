import * as React from 'react';

import user from '../../Managers/UserManager';
import dataManager from '../../Managers/DataManager';

class BackHome extends React.Component {
    constructor(props) {
        super(props);
    }

    addSkill = () => { user.changePage('activity'); }
    openIdentity = () => { user.changePage('identity'); }
    openCalendar = () => { user.changePage('calendar'); }
    openSkill = (skillID) => { user.changePage('skill', { skillID: skillID }); }
    openSkills = () => { user.changePage('skills'); }
    openExperience = () => { user.changePage('experience'); }
}

export default BackHome;