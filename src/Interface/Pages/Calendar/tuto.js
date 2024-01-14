import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @this {import('./back').default}
 * @param {number} tutoValue 
 */
function StartTutorial(tutoValue) {
    const lang = langManager.curr['tuto']['main'];
    if (tutoValue === 2) {
        user.interface.screenTuto.ShowTutorial([
            {
                component: null,
                zapInline: true,
                text: lang['calendar'],
                fontSize: 18,
                positionY: 0.25
            },
            {
                component: user.interface.bottomBar.refButtons[3],
                text: lang['calendar-next'],
                fontSize: 18,
                execAfter: () => {
                    user.interface.ChangePage('quests', { tuto: 3 }, true);
                    return false;
                }
            }
        ]);
    }
}

export default StartTutorial;
