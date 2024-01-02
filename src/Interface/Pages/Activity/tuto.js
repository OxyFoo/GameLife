import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @this {import('./back').default}
 * @param {number} tutoValue 
 */
function StartTutorial(tutoValue) {
    const lang = langManager.curr['tuto'];
    if (tutoValue === 105) { // pourquoi 100 ? j'ai pas trop compris dans ton ordre donc j'ai mis 100 par défaut, on pourra le changer
        user.interface.screenTuto.ShowTutorial([
            {
                component: null,
                text: lang['first']['activity'],
                fontSize: 20,
                execAfter: () => {
                    user.interface.ChangePage('home', { tuto: 106 }, true);
                    return false;
                }
            }
        ]);
    }
}

export default StartTutorial;