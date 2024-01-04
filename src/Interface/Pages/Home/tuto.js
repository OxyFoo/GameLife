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
                zapSideToMessage: true,
                text: lang['main']['home-greetings'].replace('{}', user.informations.username.Get())
            },
            {
                component: user.interface.bottomBar.refButtons[0],
                zapSideToMessage: true,
                text: lang['main']['home-hello']
            },
            {
                component: null,
                zapSideToMessage: true,
                text: lang['main']['home'],
                fontSize: 18,
                messagePosY: 0.05 * user.interface.screenHeight
            },
            {
                component: user.interface.bottomBar.refButtons[1],
                zapSideToMessage: true,
                text: lang['main']['home-next'],
                fontSize: 18,
                messagePosY: 0.05 * user.interface.screenHeight,
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
                zapSideToMessage: true,
                text: lang['main']['home-final'],
                fontSize: 20,
                execAfter: () => {
                    return true;
                }
            }
        ]);
    }
}

export default StartTutorial;
