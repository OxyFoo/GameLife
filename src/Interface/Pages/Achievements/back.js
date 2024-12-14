import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { Round } from 'Utils/Functions';

/**
 * @typedef {import('Types/Data/App/Achievements').Condition} Condition
 * @typedef {import('Types/Data/User/Multiplayer').Friend} Friend
 *
 * @typedef {Object} PanelAchievementType
 * @property {number} ID
 * @property {string} Name
 * @property {boolean} isSolved
 * @property {number} Progress Between 0 and 1
 * @property {string} GlobalPercentage
 */

const BackAchievementsProps = {
    args: {
        /** @type {number | null} */
        friendID: null
    }
};

class BackAchievements extends PageBase {
    state = {
        title: langManager.curr['achievements']['title'],

        /** @type {PanelAchievementType[]} */
        achievements: [],

        allAchievementsProgression: '0/0',

        ascending: false
    };

    /** @param {typeof BackAchievementsProps} props */
    constructor(props) {
        super(props);

        /** @type {Friend | null} */
        this.friend = null;
        if (this.props.args.hasOwnProperty('friendID') && this.props.args.friendID !== null) {
            const friendID = this.props.args.friendID;
            this.friend = user.multiplayer.GetFriendByID(friendID);

            // If the friend is not found, we go back
            if (this.friend === null) {
                user.interface.console?.AddLog('error', `Friend not found: ${friendID}`);
                user.interface.BackHandle();
                return;
            }

            this.state.title = langManager.curr['achievements']['friend-title'].replace('{}', this.friend.username);
        }

        const completeAchievements =
            this.friend === null
                ? user.achievements.GetSolvedIDs()
                : this.friend.achievements.map((achievement) => achievement.AchievementID);
        const allAchievements = dataManager.achievements.GetVisibles(completeAchievements);

        this.state.allAchievementsProgression = `${completeAchievements.length}/${allAchievements.length}`;

        /** @type {PanelAchievementType[]} */
        this.state.achievements = allAchievements
            .map((achievement) => ({
                ID: achievement.ID,
                Name: langManager.GetText(achievement.Name),
                isSolved: completeAchievements.includes(achievement.ID),
                Progress: user.achievements.GetProgress(achievement.ID),
                GlobalPercentage: Round(achievement.UniversalProgressPercentage, 2).toString()
            }))
            .filter((achievement) => {
                const achievementData = dataManager.achievements.GetByID(achievement.ID);
                if (achievementData === null || achievementData.Type === 'HIDE') {
                    return false;
                }
                return true;
            });
    }

    // TODO: Implement more sort / filter options
    onSortPress = () => {
        this.setState({
            ascending: !this.state.ascending,
            achievements: this.state.achievements.reverse()
        });
    };

    onBackPress = () => {
        this.fe.BackHandle();
    };
}

BackAchievements.defaultProps = BackAchievementsProps;
BackAchievements.prototype.props = BackAchievementsProps;

export default BackAchievements;
