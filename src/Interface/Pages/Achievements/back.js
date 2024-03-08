import { PageBase } from 'Interface/Components';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

class BackAchievements extends PageBase {
    state = {
        headerHeight: 0
    }

    constructor(props) {
        super(props);

        const completeAchievements = user.achievements.GetSolvedIDs();
        this.achievement = dataManager.achievements.GetAll(completeAchievements);
        this.achievement = this.achievement.map(achievement => ({
            ID: achievement.ID,
            Name: langManager.GetText(achievement.Name),
            Description: langManager.GetText(achievement.Description),
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
