import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @this {import('./back').default}
 */
function StartHelp() {
    const lang = langManager.curr['nonzerodays']['tuto'];

    user.interface.screenTuto.ShowTutorial([
        {
            component: this.refContainer,
            text: lang['1'],
        },
        {
            component: null,
            text: lang['2'],
        },
        {
            component: null,
            text: lang['3'],
        },
        {
            component: this.refOpenStreakPopup,
            text: lang['4'],
        }
    ]);
}

export default StartHelp;
