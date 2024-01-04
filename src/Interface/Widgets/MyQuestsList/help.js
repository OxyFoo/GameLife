import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @this {import('./back').default}
 */
function StartHelp() {

    const lang = langManager.curr['tuto']['quests'];

    user.interface.screenTuto.ShowTutorial([
        {
            component: this.refContainer,
            text: lang["1"],
        },
        {
            component: this.refAddQuest,
            text: lang["2"],
        },
        {
            component: this.refFlatlist,
            text: lang["3"],
        },
        {
            component: null,
            text: lang["4"],
        },
        {
            component: null,
            text: lang["5"],
        },
        {
            component: null,
            text: lang["6"],
        }
    ]);
}

export default StartHelp;