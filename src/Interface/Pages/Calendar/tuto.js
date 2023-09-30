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
                component: this.refTuto1,
                text: lang['main']['calendar-1']
            },
            {
                component: this.refTuto2,
                text: lang['main']['calendar-2']
            },
            {
                component: this.refTuto3,
                text: lang['main']['calendar-3']
            },
            {
                component: user.interface.bottomBar.refButtons[4],
                text: lang['main']['calendar-4'],
                showButton: false,
                execAfter: () => {
                    user.interface.ChangePage('shop', { tuto: 3 }, true);
                    return false;
                }
            }
        ]);
    }
}

export default StartTutorial;