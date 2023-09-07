import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Sleep } from 'Utils/Functions';

/**
 * @this import('./back').default
 * @param {number} tutoValue 
 */
function StartTutorial(tutoValue) {
    const lang = langManager.curr['tuto'];
    if (tutoValue === 7) {
        user.interface.screenTuto.ShowTutorial([
            {
                component: this.refTuto1,
                text: lang['main']['shop-1'],
                execBefore: async () => {
                    user.interface.GetCurrentPage()?.refPage?.GotoY(0);
                    await Sleep(400);
                }
            },
            {
                component: this.refTuto2,
                text: lang['main']['shop-2']
            },
            {
                component: this.refTuto3,
                text: lang['main']['shop-3'],
                execBefore: async () => {
                    user.interface.GetCurrentPage()?.refPage?.GotoY(200);
                    await Sleep(400);
                }
            },
            {
                component: this.refTuto4,
                text: lang['main']['shop-4'],
                execBefore: async () => {
                    user.interface.GetCurrentPage()?.refPage?.GotoY(400);
                    await Sleep(400);
                },
                execAfter: () => {
                    user.interface.ChangePage('home', { tuto: 8 }, true);
                    return false;
                }
            }
        ]);
    }
}

export default StartTutorial;