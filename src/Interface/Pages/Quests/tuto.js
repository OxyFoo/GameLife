import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @this {import('./back').default}
 * @param {number} tutoValue 
 */
function StartTutorial(tutoValue) {
    const lang = langManager.curr['tuto'];
    if (tutoValue === 3) { 
        user.interface.screenTuto.ShowTutorial([
            {
                component: null,
                zapSideToMessage: true,
                text: lang['main']['quest'],
                fontSize: 18,
                messagePosY: 0.05 * user.interface.screenHeight
            },
            {
                component: user.interface.header.refContainer,
                zapSideToMessage: true,
                text: lang['main']['quest-next'],
                fontSize: 18,
                messagePosY: 0.85 * user.interface.screenHeight,
                execAfter: () => {
                    user.interface.ChangePage('profile', { tuto: 4 }, true);
                    return false;
                }
            }
        ]);
    }
}

export default StartTutorial;