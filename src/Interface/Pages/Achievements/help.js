import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @this {import('./back').default}
 */
function StartHelp() {
    const lang = langManager.curr['achievements']['tuto'];

    user.interface.screenTuto.ShowTutorial([
        {
            component: null,
            text: lang['1'],
            showNextButton: true
        }
    ]);
}

export default StartHelp;
