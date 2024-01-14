import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @this {import('./back').default}
 * @param {number} tutoValue 
 */
function StartTutorial(tutoValue) {
    const lang = langManager.curr['tuto'];
    if (tutoValue === 4) { 
        user.interface.screenTuto.ShowTutorial([
            {
                component: null,
                zapInline: true,
                text: lang['main']['avatar'],
                fontSize: 18,
                positionY: 0.25,
                execAfter: () => {
                    user.interface.ChangePage('shop', { tuto: 5 }, true);
                    return false;
                }
            }
        ]);
    }
}

export default StartTutorial;
