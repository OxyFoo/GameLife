import * as React from 'react';

import user from '../../Managers/UserManager';

class BackHome extends React.Component {
    constructor(props) {
        super(props);
    }

    addSkill = () => { user.interface.changePage('activity'); }
    openIdentity = () => { user.interface.changePage('identity'); }
    openCalendar = () => { user.interface.changePage('calendar'); }
    openSkill = (skillID) => { user.interface.changePage('skill', { skillID: skillID }); }
    openSkills = () => { user.interface.changePage('skills'); }
    openExperience = () => { user.interface.changePage('experience'); }
}

export default BackHome;