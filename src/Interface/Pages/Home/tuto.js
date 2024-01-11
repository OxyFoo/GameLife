import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @this {import('./back').default}
 * @param {number} tutoValue 
 */
function StartTutorial(tutoValue) {
    const lang = langManager.curr['tuto'];
    if (tutoValue === 1) {
        user.interface.screenTuto.ShowTutorial([
            {
                component: null,
                text: lang['main']['home-greetings'].replace('{}', user.informations.username.Get()),
                execBefore: () => {
                    this.refPage?.GotoY(0);
                }
            },
            {
                component: null,
                zapSideToMessage: true,
                text: lang['main']['home'],
                fontSize: 18,
                messagePosY: 0.05
            },
            {
                component: user.interface.bottomBar.refButtons[1],
                text: lang['main']['home-next'],
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
                zapSideToMessage: false,
                text: lang['main']['home-final'],
                fontSize: 20
            }
        ]);
    }
}

export default StartTutorial;
