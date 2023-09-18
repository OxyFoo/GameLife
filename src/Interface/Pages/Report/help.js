import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @this {import('./back').default}
 */
function StartHelp() {
    const lang = langManager.curr['tuto']['report'];

    user.interface.screenTuto.ShowTutorial([
        {
            component: null,
            text: lang['bug']
        }
    ]);
}

export default StartHelp;