import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @this {import('./back').default}
 */
function StartHelp() {
    const lang = langManager.curr['tuto']['achievements'];

    user.interface.screenTuto.ShowTutorial([
        {
            component: null,
            text: lang['1']
        }
    ]);
}

export default StartHelp;
