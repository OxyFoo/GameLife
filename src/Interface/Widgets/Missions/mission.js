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
    const mission = user.missions.GetCurrentMission().mission;
    if (mission === null) return;

    const lang = langManager.curr['missions']['content'][mission.name];

    if (missionName === 'mission1') {
        const texts = lang['texts'];
        user.interface.screenTuto.ShowTutorial([
            {
                component: user.interface.navBar.refButtons['addActivity'],
                text: texts['1'],
                execAfter: () => {
                    user.interface.ChangePage('activity', { missionName }, true);
                    return false;
                }
            }
        ]);
    } else if (missionName === 'mission2') {
        const texts = lang['texts'];
        user.interface.screenTuto.ShowTutorial([
            {
                component: user.interface.navBar.refButtons['multiplayer'],
                text: texts['1'],
                execAfter: () => {
                    user.interface.ChangePage('quests', { missionName }, true);
                    return false;
                }
            }
        ]);
    } else if (missionName === 'mission3') {
        const texts = lang['texts'];
        user.interface.screenTuto.ShowTutorial([
            {
                component: user.interface.navBar.refButtons[4],
                text: texts['1'],
                execAfter: () => {
                    user.interface.ChangePage('shop', { missionName }, true);
                    return false;
                }
            }
        ]);
    } else if (missionName === 'mission4') {
        const texts = lang['texts'];
        user.interface.screenTuto.ShowTutorial([
            {
                component: user.interface.header.refContainer,
                text: texts['1'],
                execAfter: () => {
                    user.interface.ChangePage('profile', { missionName }, true);
                    return false;
                }
            }
        ]);
    } else if (missionName === 'mission5') {
        this.props.refHome.StartMission('mission5');
    }
}

export default StartMission;
