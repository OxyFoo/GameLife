import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @typedef {import('Data/User/Missions').MissionKeys} MissionKeys
 */

/**
 * @this {import('./back').default}
 * @param {MissionKeys} missionName
 */
function StartMission(missionName) {
    if (missionName === 'mission2') {
        const lang = langManager.curr['missions']['content']['mission2'];

        user.interface.screenTuto.ShowTutorial([
            {
                component: this.refQuestsList.current,
                text: lang['texts']['2'],
                execAfter: () => {
                    user.interface.ChangePage('quest', { missionName }, true);
                    return false;
                }
            }
        ]);
    }
}

export default StartMission;
