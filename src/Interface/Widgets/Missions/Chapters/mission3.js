import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

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

    user.interface.screenTuto.ShowTutorial([
        {
            component: user.interface.navBar.refButtons['multiplayer'] ?? null,
            text: missionTexts['1'],
            execAfter: () => {
                user.interface.ChangePage('multiplayer');
                return false;
            }
        },
        {
            component: null,
            text: missionTexts['2']
        }
    ]);
}

export default StartMission3;
