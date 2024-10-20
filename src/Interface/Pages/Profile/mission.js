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
    if (missionName === 'mission4') {
        const lang = langManager.curr['missions']['content']['mission4'];

        user.interface.screenTuto.ShowTutorial([
            {
                component: this.refAvatar.refButton.current,
                text: lang['texts']['2'],
                execAfter: () => {
                    this.refAvatar.OpenEditor();
                    return false;
                }
            },
            {
                component: null,
                text: lang['texts']['3']
            }
        ]);
    }
}

export default StartMission;
