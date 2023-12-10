import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Sleep } from 'Utils/Functions';

/**
 * @this {import('./back').default}
 */
function StartHelp() {
    const lang = langManager.curr['tuto']['todo'];

    user.interface.screenTuto.ShowTutorial([
        {
            component: this.refSectionSchedule.refHelp1,
            text: lang['1']
        },
        {
            component: this.refSectionSkill.refHelp1,
            text: lang['2'],
            execBefore: async () => {
                this.refPage.GotoY(100);
                await Sleep(400);
            }
        },
        {
            component: this.refSectionTasks.refHelp1,
            text: lang['3'],
            execBefore: async () => {
                this.refPage.GotoY(200);
                await Sleep(400);
            }
        },
        {
            component: this.refSectionDescription.refHelp1,
            text: lang['4'],
            execBefore: async () => {
                this.refPage.GotoY(300);
                await Sleep(400);
            }
        }
    ]);
}

export default StartHelp;
