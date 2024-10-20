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
    if (missionName === 'mission3') {
        const lang = langManager.curr['missions']['content']['mission3'];

        user.interface.screenTuto.ShowTutorial([
            {
                component: this.refHeader.current,
                text: lang['texts']['2']
            },
            {
                component: null,
                text: lang['texts']['3']
            }
        ]);
    }
}

export default StartMission;
