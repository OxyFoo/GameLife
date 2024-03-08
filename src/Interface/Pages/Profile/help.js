import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @this {import('./back').default}
 */
function StartHelp() {
    const lang = langManager.curr['profile']['tuto'];

    user.interface.screenTuto.ShowTutorial([
        {
            component: this.refTuto1,
            text: lang['1'],
            showNextButton: true
        },
        {
            component: this.refAvatar.refButton.current,
            text: lang['2'],
            showNextButton: true
        }
    ])
}

export default StartHelp;
