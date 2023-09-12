import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Sleep } from 'Utils/Functions';

/**
 * @this {import('./back').default}
 * @param {'dailyDeals'|'randomChests'|'targetChests'|'dyes'} section
 */
function StartHelp(section) {
    const lang = langManager.curr['tuto']['shop'];

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