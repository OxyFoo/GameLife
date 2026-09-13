import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import Home from 'Interface/Pages/Home';
import { Sleep } from 'Utils/Functions';

/**
 * Bring the skills widget of the home page into view before highlighting it
 * @param {Home} homePage
 * @returns {Promise<void>}
 */
function scrollToSkillsTags(homePage) {
    return new Promise((resolve) => {
        const node = homePage.refSkillsTags.current;
        if (node === null) {
            resolve();
            return;
        }

        node.measureInWindow((_x, y) => {
            const offset = Math.max(0, homePage.scrollOffsetY + y - 140);
            homePage.refScrollView.current?.scrollTo({ y: offset, animated: true });
            setTimeout(resolve, 500);
        });
    });
}

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
            component: () => user.interface.GetPage('home')?.refSkillsTags ?? null,
            text: missionTexts['1'],
            execBefore: async () => {
                // Go to home page
                const currentPageName = user.interface.GetCurrentPageName();
                if (currentPageName !== 'home') {
                    await new Promise((resolve) => {
                        user.interface.ChangePage('home', { callback: () => resolve(null) });
                    });
                }

                // Scroll to the skills widget
                const currentPage = user.interface.GetCurrentPage();
                if (currentPage !== null && currentPage.pageName === 'home') {
                    const homePage = currentPage.ref.current;
                    if (homePage instanceof Home) {
                        await scrollToSkillsTags(homePage);
                    }
                }
            },
            execAfter: async () => {
                await new Promise((resolve) => {
                    user.interface.ChangePage('skills', { callback: () => resolve(null) });
                });
                await Sleep(500);
                return false;
            }
        },
        {
            component: null,
            text: missionTexts['2'],
            showNextButton: true,
            execAfter: async () => {
                // Open the most practiced skill: its page completes the mission
                const lastSkill = user.activities.GetLastSkills(1)[0];
                if (typeof lastSkill !== 'undefined') {
                    user.interface.ChangePage('skill', { args: { skillID: lastSkill.ID } });
                }
                return true;
            }
        }
    ]);
}

export default StartMission2;
