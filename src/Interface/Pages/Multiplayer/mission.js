import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import { Sleep } from 'Utils/Functions';

/**
 * @typedef {import('Data/User/Missions').MissionKeys} MissionKeys
 */

/**
 * @this {import('./back').default}
 * @param {MissionKeys} missionName
 */
function StartMission(missionName) {
    if (missionName === 'mission5') {
        const lang = langManager.curr['missions']['content']['mission5'];

        user.interface.screenTuto.ShowTutorial([
            {
                component: this.refAddButton.current,
                text: lang['texts']['3'],
                execBefore: async () => {
                    await Sleep(400);
                },
                execAfter: () => {
                    this.addFriendHandle();
                    return true;
                }
            }
        ]);
    }
}

export default StartMission;
