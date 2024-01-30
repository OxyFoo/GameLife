import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Sleep } from 'Utils/Functions';

/**
 * @this {import('./back').default}
 * @param {'dailyDeals' | 'randomChests' | 'targetChests' | 'dyes'} section
 */
function StartHelp(section) {
    const lang = langManager.curr['shop']['tuto'];

    if (section === 'dailyDeals') {
        user.interface.screenTuto.ShowTutorial([
            {
                component: this.refTuto2,
                text: lang['dailyDeals'],
                execBefore: async () => {
                    user.interface.GetCurrentPage()?.refPage?.GotoY(0);
                    await Sleep(400);
                }
            }
        ]);
    } else if (section === 'randomChests') {
        user.interface.screenTuto.ShowTutorial([
            {
                component: this.refTuto3,
                text: lang['randomChests'],
                execBefore: async () => {
                    user.interface.GetCurrentPage()?.refPage?.GotoY(200);
                    await Sleep(400);
                },
            },
            {
                component: this.refTuto3.refChest1,
                text: lang['randomChests-common']
            },
            {
                component: this.refTuto3.refChest2,
                text: lang['randomChests-rare']
            },
            {
                component: this.refTuto3.refChest3,
                text: lang['randomChests-epic']
            }
        ]);
    } else if (section === 'targetChests') {
        user.interface.screenTuto.ShowTutorial([
            {
                component: this.refTuto4.refTuto1,
                text: lang['targetedChests'],
                execBefore: async () => {
                    user.interface.GetCurrentPage()?.refPage?.GotoY(500);
                    await Sleep(400);
                }
            },
            {
                component: this.refTuto4.refChest1,
                text: lang['targetedChests-common']
            },
            {
                component: this.refTuto4.refChest2,
                text: lang['targetedChests-rare']
            },
            {
                component: this.refTuto4.refChest3,
                text: lang['targetedChests-epic']
            }
        ]);
    } else if (section === 'dyes') {
        user.interface.screenTuto.ShowTutorial([
            {
                component: this.refTuto5,
                text: lang['dyes'],
                execBefore: async () => {
                    user.interface.GetCurrentPage()?.refPage?.GotoY(700);
                    await Sleep(600);
                }
            }
        ]);
    }
}

export default StartHelp;
