import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Sleep } from 'Utils/Functions';

/**
 * @this {import('./back').default}
 * @param {number} tutoValue 
 */
function StartTutorial(tutoValue) {
    const lang = langManager.curr['tuto'];
    if (tutoValue === 5) {
        user.interface.screenTuto.ShowTutorial([
            {
                component: null,
                zapSideToMessage: true,
                text: lang['main']['shop'],
                fontSize: 18,
                messagePosY: 0.05
            },
            {
                component: user.interface.bottomBar.refButtons[2],
                text: lang['main']['shop-next'],
                fontSize: 18,
                execAfter: () => {
                    user.interface.ChangePage('activity', { tuto: 6 }, true);
                    return false;
                }
            }
        ]);
    }
}

export default StartTutorial;
