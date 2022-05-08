import * as React from 'react';

import user from '../../../Managers/UserManager';

class BackHome extends React.Component {
    state = {
        skills: user.activities.GetLasts()
    };

    componentDidMount() {
        this.activitiesListener = user.activities.allActivities.AddListener(() => {
            this.setState({ skills: user.activities.GetLasts() });
        });
    }
    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    addActivity = () => user.interface.ChangePage('activity', undefined, true);
    openTasks = () => user.interface.ChangePage('tasks');
    openSettings = () => user.interface.ChangePage('settings');
    openSkills = () => user.interface.ChangePage('skills');
}

export default BackHome;