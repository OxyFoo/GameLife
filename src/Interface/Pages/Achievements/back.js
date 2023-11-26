import { PageBase } from 'Interface/Components';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';

class BackAchievements extends PageBase {
    state = {
        headerHeight: 0
    };

    constructor(props) {
        super(props);

        const completeAchievements = user.achievements.GetSolvedIndexes();
        this.achievement = dataManager.achievements.GetAll(completeAchievements);
        this.achievement = this.achievement.map(achievement => ({
            ID: achievement.ID,
            Name: dataManager.GetText(achievement.Name),
            Description: dataManager.GetText(achievement.Description),
            isSolved: completeAchievements.includes(achievement.ID)
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