import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Sleep } from 'Utils/Functions';

async function StartMission3() {
    const mission = user.missions.GetCurrentMission().mission;
    if (mission === null || !user.interface.screenTuto || !user.interface.navBar) {
        user.interface.console?.AddLog('error', '[Missions.Start]: Mission, screenTuto or navBar is null', {
            mission,
            screenTutoIsSet: !!user.interface.screenTuto,
            navBarIsSet: !!user.interface.navBar
        });
        return;
    }

    const lang = langManager.curr['missions']['content'];
    const missionLang = lang['mission3'];
    const missionTexts = missionLang['texts'];

    if (!user.server2.IsAuthenticated()) {
        user.interface.screenTuto.ShowTutorial([
            {
                component: null,
                text: missionLang['texts']['not-connected']
            }
        ]);
        return;
    }

    user.interface.screenTuto.ShowTutorial([
        {
            component: user.interface.navBar.refButtons['multiplayer'],
            text: missionTexts['1'],
            execAfter: async () => {
                await new Promise((resolve) => {
                    user.interface.ChangePage('multiplayer', { callback: () => resolve(null) });
                });
                await Sleep(500);
                return false;
            }
        },
        {
            component: () => user.interface.GetPage('multiplayer')?.refAddButton ?? null,
            text: missionTexts['2'],
            execAfter: () => {
                user.interface.GetPage('multiplayer')?.addFriendHandle();
                return true;
            }
        }
    ]);
}

export default StartMission3;
