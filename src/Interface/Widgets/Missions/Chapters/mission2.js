import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import Home from 'Interface/Pages/Home';

async function StartMission2() {
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
    const missionLang = lang['mission2'];
    const missionTexts = missionLang['texts'];

    user.interface.screenTuto.ShowTutorial([
        {
            component: user.interface.GetPage('home')?.refQuestsTitle ?? null,
            text: missionTexts['1'],
            execBefore: async () => {
                // Go to home page
                const currentPageName = user.interface.GetCurrentPageName();
                if (currentPageName !== 'home') {
                    await new Promise((resolve) => {
                        user.interface.ChangePage('home', { callback: () => resolve(null) });
                    });
                }

                // Scroll to the quests widget
                const currentPage = user.interface.GetCurrentPage();
                if (currentPage !== null && currentPage.pageName === 'home') {
                    const homePage = currentPage.ref.current;
                    if (homePage instanceof Home) {
                        await new Promise((resolve) => {
                            homePage.refScrollView.current?.scrollTo({ y: 100, animated: true });
                            setTimeout(resolve, 500);
                        });
                    }
                }
            },
            execAfter: async () => {
                await new Promise((resolve) => {
                    user.interface.ChangePage('quest', {
                        storeInHistory: false,
                        callback: () => resolve(null)
                    });
                });
                return false;
            }
        },
        {
            component: null,
            text: missionTexts['2']
        }
    ]);
}

export default StartMission2;
