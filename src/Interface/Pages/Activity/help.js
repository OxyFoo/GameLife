import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { Sleep } from 'Utils/Functions';

/**
 * @this import('./back').default
 */
function StartHelp() {
    const lang = langManager.curr['tuto']['activity'];
    const categoriesText = dataManager.skills.categories
        .map(category => dataManager.GetText(category.Name))
        .join(', ');

    user.interface.screenTuto.ShowTutorial([
        {
            component: this.refTuto1,
            text: lang['1'].replace('{}', categoriesText),
            execBefore: () => {
                this.refActivityPanel.Close();
            }
        },
        {
            component: this.refActivities,
            text: lang['2']
        },
        {
            component: this.refActivityPanel.refHelp1,
            text: lang['3'],
            execBefore: async () => {
                const helpSkill = dataManager.skills.GetByID(1);
                this.selectSkill(helpSkill);
                await Sleep(500);
            }
        },
        {
            component: this.refActivityPanel.refHelp2,
            text: lang['4'],
            execBefore: async () => {
                this.refActivityPanel.refPanelScreen.GotoY(-100);
                await Sleep(500);
            }
        },
        {
            component: this.refActivityPanel.refHelp3,
            text: lang['5'],
            execBefore: async () => {
                this.refActivityPanel.refPanelScreen.GotoY(-200);
                await Sleep(500);
            }
        },
        {
            component: this.refActivityPanel.refHelp4,
            text: lang['6']
        }
    ]);
}

export default StartHelp;