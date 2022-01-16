import * as React from 'react';

import user from '../../Managers/UserManager';

class BackHome extends React.Component {
    constructor(props) {
        super(props);
    }

    addSkill = () => { user.interface.ChangePage('activity'); }
    openIdentity = () => { user.interface.ChangePage('identity'); }
    openCalendar = () => { user.interface.ChangePage('calendar'); }
    openSkill = (skillID) => { user.interface.ChangePage('skill', { skillID: skillID }); }
    openSkills = () => { user.interface.ChangePage('skills'); }
    openExperience = () => { user.interface.ChangePage('experience'); }
}

export default BackHome;