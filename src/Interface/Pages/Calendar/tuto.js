import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @this {import('./back').default}
 * @param {number} tutoValue 
 */
function StartTutorial(tutoValue) {
    const lang = langManager.curr['tuto'];
    if (tutoValue === 2) {
        user.interface.screenTuto.ShowTutorial([
            {
                component: null,
                zapSideToMessage: true,
                text: lang['main']['calendar'],
                fontSize: 18,
                messagePosY: 0.05 * user.interface.screenHeight
            },
            {
                component: user.interface.bottomBar.refButtons[3],
                zapSideToMessage: true,
                text: lang['main']['calendar-next'],
                fontSize: 18,
                messagePosY: 0.05 * user.interface.screenHeight,
                execAfter: () => {
                    user.interface.ChangePage('quests', { tuto: 3 }, true);
                    return false;
                }
            }
        ]);
    }
}

export default StartTutorial;
