import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import { Sleep } from 'Utils/Functions';

/**
 * @this {import('./back').default}
 * @param {keyof import('Managers/LangManager').Lang['missions']['content']} missionName
 */
function StartMission(missionName) {
    if (missionName === 'mission5') {
        const lang = langManager.curr['missions']['content']['mission5'];

        // Not connected to the server (TCP)
        if (!user.server2.tcp.IsConnected()) {
            user.interface.screenTuto.ShowTutorial([
                {
                    component: null,
                    text: lang['texts']['not-connected']
                }
            ]);
            return;
        }

        user.interface.screenTuto.ShowTutorial([
            {
                component: this.refMultiplayerPanel?.current,
                text: lang['texts']['1'],
                execBefore: async () => {
                    this.refPage?.GotoY(400);
                    await Sleep(350);
                }
            },
            {
                component: this.refMultiplayerPanel?.current?.refContainer?.current?.refIcon?.current,
                text: lang['texts']['2'],
                execAfter: () => {
                    user.interface.ChangePage('multiplayer', { missionName }, true);
                    return false;
                }
            }
        ]);
    }
}

export default StartMission;
