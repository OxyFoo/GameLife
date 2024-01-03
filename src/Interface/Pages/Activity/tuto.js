import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @this {import('./back').default}
 * @param {number} tutoValue 
 */
function StartTutorial(tutoValue) {
    const lang = langManager.curr['tuto'];
    if (tutoValue === 105) { 
        user.interface.screenTuto.ShowTutorial([
            {
                component: null,
                zapSideToMessage: true,
                text: lang['first']['activity'],
                fontSize: 20,
                messagePosY: 0.05 * user.interface.screenHeight,
                execAfter: () => {
                    user.interface.ChangePage('home', { tuto: 106 }, true);
                    return false;
                }
            }
        ]);
    }
}

export default StartTutorial;