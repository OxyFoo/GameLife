import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @this {import('./back').default}
 * @param {number} tutoValue 
 */
function StartTutorial(tutoValue) {
    const lang = langManager.curr['tuto'];
    if (tutoValue === 103) { 
        user.interface.screenTuto.ShowTutorial([
            {
                component: user.interface.bottomBar.refButtons[4],
                zapSideToMessage: true,
                text: lang['first']['avatar'],
                fontSize: 20,
                yPos: 0.05 * user.interface.screenHeight,
                execAfter: () => {
                    user.interface.ChangePage('shop', { tuto: 104 }, true);
                    return false;
                }
            }
        ]);
    }
}

export default StartTutorial;