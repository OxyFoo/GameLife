import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @this {import('./back').default}
 * @param {number} tutoValue 
 */
function StartTutorial(tutoValue) {
    const lang = langManager.curr['tuto']['main'];
    if (tutoValue === 1) {
        user.interface.screenTuto.ShowTutorial([
            {
                component: null,
                text: lang['home-greetings'].replace('{}', user.informations.username.Get()),
                execBefore: () => {
                    this.refPage?.GotoY(0);
                }
            },
            {
                component: null,
                zapInline: true,
                text: lang['home'],
                fontSize: 18,
                positionY: 0.25
            },
            {
                component: user.interface.bottomBar.refButtons[1],
                text: lang['home-next'],
                fontSize: 18,
                execAfter: () => {
                    user.interface.ChangePage('calendar', { tuto: 2 }, true);
                    return false;
                }
            }
        ]);
    }
    else if (tutoValue === 7) {
        user.interface.screenTuto.ShowTutorial([
            {
                component: null,
                text: lang['home-final'],
                fontSize: 20
            }
        ]);
    }
}

export default StartTutorial;
