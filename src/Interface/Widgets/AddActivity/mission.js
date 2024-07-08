import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Sleep } from 'Utils/Functions';

/**
 * @this {import('./back').default}
 * @param {keyof import('Managers/LangManager').Lang['missions']['content']} missionName
 */
function StartMission(missionName, nextStep = false) {
    if (missionName === 'mission1' && !nextStep) {
        const lang = langManager.curr['missions']['content']['mission1'];

        user.interface.screenTuto.ShowTutorial([
            {
                component: null,
                text: lang['texts']['2']
            },
            {
                component: null,
                text: lang['texts']['3']
            }
        ]);
    }

    else if (missionName === 'mission1' && nextStep) {
        const lang = langManager.curr['missions']['content']['mission1'];

        user.interface.screenTuto.ShowTutorial([
            {
                component: this.refActivityPanel.refPanelContent.current,
                text: lang['texts']['4'],
                showNextButton: true,
                execBefore: async () => {
                    await Sleep(300);
                }
            },
            {
                component: this.refActivityPanel.refHelp1,
                text: lang['texts']['5'],
                showNextButton: true
            }
        ]);
    }
}

export default StartMission;
