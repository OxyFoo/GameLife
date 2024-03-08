import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @typedef {import('Class/Missions').MissionKeys} MissionKeys
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
                component: null,
                text: lang['texts']['3']
            }
        ]);
    }
}

export default StartMission;
