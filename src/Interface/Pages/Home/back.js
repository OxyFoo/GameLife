import { PageBack } from '../../Components';
import user from '../../../Managers/UserManager';

class BackHome extends PageBack {
    state = {
        experience: user.experience.GetExperience()
    };

    componentDidMount() {
        this.activitiesListener = user.activities.allActivities.AddListener(() => {
            this.setState({
                experience: user.experience.GetExperience()
            });
        });
    }
    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    addActivity = () => user.interface.ChangePage('activity', undefined, true);
    openTasks = () => user.interface.ChangePage('tasks');
    openSettings = () => user.interface.ChangePage('settings');
}

export default BackHome;