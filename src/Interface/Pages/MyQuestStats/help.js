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
            text: lang['1']
        },
        {
            component: this.refTuto2,
            text: lang['2']
        },
        {
            component: this.refTuto3,
            text: lang['3']
        }
    ])
}

export default StartHelp;
