import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @this {import('./back').default}
 * @param {number} tutoValue 
 */
function StartTutorial(tutoValue) {
    const lang = langManager.curr['tuto'];
    if (tutoValue === 102) { 
        user.interface.screenTuto.ShowTutorial([
            {
                component: user.interface.header.refContainer,
                zapSideToMessage: true,
                text: lang['first']['quest'],
                fontSize: 20,
                messagePosY: 0.85 * user.interface.screenHeight,
                execAfter: () => {
                    user.interface.ChangePage('profile', { tuto: 103 }, true);
                    return false;
                }
            }
        ]);
    }
}

export default StartTutorial;