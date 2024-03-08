import user from "Managers/UserManager";
import langManager from "Managers/LangManager";

/**
 * @this {import('./back').default}
 */
function StartHelp() {
    const lang = langManager.curr['quest-stats']['tuto'];

    user.interface.screenTuto.ShowTutorial([
        {
            component: this.refTuto1,
            text: lang['1'],
            showNextButton: true
        },
        {
            component: this.refTuto2,
            text: lang['2'],
            showNextButton: true
        },
        {
            component: this.refTuto3,
            text: lang['3'],
            showNextButton: true
        }
    ])
}

export default StartHelp;
