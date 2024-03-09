import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Sleep } from 'Utils/Functions';

/**
 * @this {import('./back').default}
 * @param {'dailyDeals' | 'randomChests' | 'targetChests' | 'dyes'} section
 */
function StartHelp(section) {
    const lang = langManager.curr['shop']['help'];

    if (section === 'dailyDeals') {
        user.interface.screenTuto.ShowTutorial([
            {
                component: this.refDailyDeals.current,
                text: lang['dailyDeals'],
                showNextButton: true,
                execBefore: async () => {
                    user.interface.GetCurrentPage()?.refPage?.GotoY(0);
                    await Sleep(400);
                }
            }
        ]);
    } else if (section === 'randomChests') {
        user.interface.screenTuto.ShowTutorial([
            {
                component: this.refRandomChests.current,
                text: lang['randomChests'],
                showNextButton: true,
                execBefore: async () => {
                    user.interface.GetCurrentPage()?.refPage?.GotoY(200);
                    await Sleep(400);
                },
            },
            {
                component: this.refRandomChests.current.refChest1,
                text: lang['randomChests-common'],
                showNextButton: true
            },
            {
                component: this.refRandomChests.current.refChest2,
                text: lang['randomChests-rare'],
                showNextButton: true
            },
            {
                component: this.refRandomChests.current.refChest3,
                text: lang['randomChests-epic'],
                showNextButton: true
            }
        ]);
    } else if (section === 'targetChests') {
        user.interface.screenTuto.ShowTutorial([
            {
                component: this.refTargetedChests.current.refTuto1,
                text: lang['targetedChests'],
                showNextButton: true,
                execBefore: async () => {
                    user.interface.GetCurrentPage()?.refPage?.GotoY(500);
                    await Sleep(400);
                }
            },
            {
                component: this.refTargetedChests.current.refChest1,
                text: lang['targetedChests-common'],
                showNextButton: true
            },
            {
                component: this.refTargetedChests.current.refChest2,
                text: lang['targetedChests-rare'],
                showNextButton: true
            },
            {
                component: this.refTargetedChests.current.refChest3,
                text: lang['targetedChests-epic'],
                showNextButton: true
            }
        ]);
    } else if (section === 'dyes') {
        user.interface.screenTuto.ShowTutorial([
            {
                component: this.refDyes.current,
                text: lang['dyes'],
                showNextButton: true,
                execBefore: async () => {
                    user.interface.GetCurrentPage()?.refPage?.GotoY(700);
                    await Sleep(600);
                }
            }
        ]);
    } else if (section === 'iap') {
        user.interface.screenTuto.ShowTutorial([
            {
                component: this.refIAP.current,
                text: lang['iap1'],
                showNextButton: true,
                execBefore: async () => {
                    user.interface.GetCurrentPage()?.refPage?.GotoY(400);
                    await Sleep(400);
                }
            },
            {
                component: null,
                text: lang['iap2'],
                showNextButton: true
            },
            {
                component: null,
                text: lang['iap3'],
                showNextButton: true
            },
            {
                component: null,
                text: lang['iap4'],
                showNextButton: true
            },
            {
                component: null,
                text: lang['iap5'],
                showNextButton: true
            },
            {
                component: null,
                text: lang['iap6'],
                showNextButton: true
            }
        ]);
    }
}

export default StartHelp;
