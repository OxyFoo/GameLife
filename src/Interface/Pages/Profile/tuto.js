import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @this import('./back').default
 * @param {number} tutoValue
 */
function StartTutorial(tutoValue) {
    const lang = langManager.curr['tuto'];
    if (tutoValue === 2) {
        user.interface.screenTuto.ShowTutorial([
            {
                component: this.refTuto1,
                text: lang['main']['profile-1']
            },
            {
                component: this.refAvatar.refButton,
                text: lang['main']['profile-2'],
                execAfter: () => {
                    user.interface.ChangePage('home', { tuto: 3 }, true);
                    return false;
                }
            }
        ])
    }
}

export default StartTutorial;