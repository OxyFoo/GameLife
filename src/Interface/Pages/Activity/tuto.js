import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @this {import('./back').default}
 * @param {number} tutoValue 
 */
function StartTutorial(tutoValue) {
    const lang = langManager.curr['tuto'];
    if (tutoValue === 6) { 
        user.interface.screenTuto.ShowTutorial([
            {
                component: null,
                zapInline: true,
                text: lang['main']['activity'],
                fontSize: 18,
                positionY: 0.25,
                execAfter: () => {
                    user.interface.ChangePage('home', { tuto: 7 }, true);
                    return false;
                }
            }
        ]);
    }
}

export default StartTutorial;
