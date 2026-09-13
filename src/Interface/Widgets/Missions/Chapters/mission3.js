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
                text: missionTexts['not-connected']
            }
        ]);
        return;
    }

    user.interface.screenTuto.ShowTutorial([
        {
            component: user.interface.navBar.refButtons['raids'],
            text: missionTexts['1'],
            execAfter: async () => {
                await new Promise((resolve) => {
                    user.interface.ChangePage('raids', { callback: () => resolve(null) });
                });
                await Sleep(500);
                return false;
            }
        },
        {
            component: () => user.interface.GetPage('raids')?.refTabs[1] ?? null,
            text: missionTexts['2'],
            execAfter: async () => {
                user.interface.GetPage('raids')?.setTab(1);
                await Sleep(700);
                return false;
            }
        },
        {
            component: () => user.interface.GetPage('raids')?.refAddFriendButton ?? null,
            text: missionTexts['3'],
            execAfter: () => {
                user.interface.GetPage('raids')?.onAddFriendPress();
                return true;
            }
        }
    ]);
}

export default StartMission3;
