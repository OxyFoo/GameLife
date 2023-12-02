import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Sleep } from 'Utils/Functions';

/**
 * @this {import('./back').default}
 * @param {number} tutoValue 
 */
function StartTutorial(tutoValue) {
    const lang = langManager.curr['tuto'];
    if (tutoValue === 3) {
        // Skip shop tutorial if user is not connected
        if (!user.server.IsConnected()) {
            user.interface.screenTuto.ShowTutorial([
                {
                    component: null,
                    text: lang['main']['shop-no-internet'],
                    execAfter: () => {
                        user.interface.ChangePage('home', { tuto: 4 }, true);
                        return false;
                    }
                }
            ]);
            return;
        }

        user.interface.screenTuto.ShowTutorial([
            {
                component: this.refTuto1.refTuto1,
                text: lang['main']['shop-1'],
                execBefore: async () => {
                    user.interface.GetCurrentPage()?.refPage?.GotoY(0);
                    await Sleep(400);
                }
            },
            {
                component: this.refTuto1.refTuto2,
                text: lang['main']['shop-2']
            },
            {
                component: this.refTuto1.refTuto3,
                text: lang['main']['shop-3']
            },
            {
                component: this.refTuto2,
                text: lang['main']['shop-4']
            },
            {
                component: this.refTuto3,
                text: lang['main']['shop-5'],
                execBefore: async () => {
                    user.interface.GetCurrentPage()?.refPage?.GotoY(200);
                    await Sleep(400);
                },
                execAfter: () => {
                    user.interface.ChangePage('home', { tuto: 4 }, true);
                    return false;
                }
            }
        ]);
    }
}

export default StartTutorial;
