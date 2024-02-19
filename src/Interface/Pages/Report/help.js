import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @this {import('./back').default}
 */
function StartHelp() {
    const lang = langManager.curr['report']['tuto'];

    user.interface.screenTuto.ShowTutorial([
        {
            component: null,
            text: lang['bug'],
            showNextButton: true
        }
    ]);
}

export default StartHelp;
