import { PageBase } from 'Interface/Components';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { Round } from 'Utils/Functions';

/**
 * @typedef {import('Data/Achievements').Condition} Condition
 * @typedef {import('Types/UserOnline').Friend} Friend
 * 
 * @typedef {Object} PanelAchievementType
 * @property {number} ID
 * @property {string} Name
 * @property {boolean} isSolved
 * @property {string} GlobalPercentage
 */

class BackAchievements extends PageBase {
    state = {
        headerHeight: 0
    }

    constructor(props) {
        super(props);

        /** @type {Friend | null} */
        this.friend = null;
        if (this.props.args.hasOwnProperty('friend')) {
            this.friend = this.props.args.friend;
        }

        const completeAchievements = this.friend === null ?
            user.achievements.GetSolvedIDs() :
            this.friend.achievements.map(achievement => achievement.AchievementID);
        const allAchievements = dataManager.achievements.GetAll(completeAchievements);

        /** @type {Array<PanelAchievementType>} */
        this.achievement = allAchievements.map(achievement => ({
            ID: achievement.ID,
            Name: langManager.GetText(achievement.Name),
            isSolved: completeAchievements.includes(achievement.ID),
            GlobalPercentage: Round(achievement.GlobalPercentage, 0).toString()
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
