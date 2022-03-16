import * as React from 'react';

import user from '../../Managers/UserManager';

class BackHome extends React.Component {
    constructor(props) {
        super(props);
        this.skills = user.activities.GetLasts();
    }
    componentDidMount() {
        user.activities.AddCallback('home', () => {
            this.skills = user.activities.GetLasts();
            this.forceUpdate();
        });
    }
    componentWillUnmount() {
        user.activities.RemoveCallback('home');
    }

    addActivity = () => user.interface.ChangePage('activity', undefined, true);
    openTodo = () => user.interface.ChangePage('todo');
    openSettings = () => user.interface.ChangePage('settings');
    openSkills = () => user.interface.ChangePage('skills');
}

export default BackHome;