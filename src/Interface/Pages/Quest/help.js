import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Sleep } from 'Utils/Functions';

/**
 * @this {import('./back').default}
 */
function StartHelp() {
    const lang = langManager.curr['quest']['tuto'];

    user.interface.screenTuto.ShowTutorial([
        {
            component: this.refSectionSchedule.refHelp1,
            text: lang['1'],
            showNextButton: true
        },
        {
            component: this.refSectionSkill.refHelp1,
            text: lang['2'],
            showNextButton: true,
            execBefore: async () => {
                this.refPage.current?.GotoY(100);
                await Sleep(400);
            }
        },
        {
            component: this.refSectionComment,
            text: lang['3'],
            showNextButton: true,
            execBefore: async () => {
                this.refPage.current?.GotoY(200);
                await Sleep(400);
            }
        }
    ]);
}

export default StartHelp;
