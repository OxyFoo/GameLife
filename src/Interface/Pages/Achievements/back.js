import { PageBack } from '../../Components';
import user from '../../../Managers/UserManager';
import dataManager from '../../../Managers/DataManager';

class BackAchievements extends PageBack {
    state = {
        headerHeight: 0
    };

    constructor(props) {
        super(props);

        const completeAchievements = user.achievements.Get();

        this.achievement = dataManager.achievements.GetAll(completeAchievements);
        this.achievement = this.achievement.map(achievement => ({
            ID: achievement.ID,
            Name: dataManager.GetText(achievement.Name),
            Description: dataManager.GetText(achievement.Description),
            isSolved: completeAchievements.includes(parseInt(achievement.ID))
        }));
    }

    onLayout = ({ nativeEvent: { layout: { height } } }) => {
        this.setState({ headerHeight: height });
    }

    onAchievementPress = (ID) => {
        user.achievements.ShowCardPopup(ID);
    }
}

export default BackAchievements;