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
                text: lang['main']['home-1'],
                execBefore: () => {
                    this.refPage?.GotoY(0);
                }
            },
            {
                component: user.interface.header.refContainer,
                text: lang['main']['home-2']
            },
            {
                component: this.refTuto1,
                text: lang['main']['home-3']
            },
            {
                component: this.refTuto2,
                text: lang['main']['home-4']
            },
            {
                component: this.refTuto3,
                text: lang['main']['home-5']
            },
            {
                component: user.interface.bottomBar.refButtons[1],
                text: lang['main']['home-6'],
                showButton: false,
                execAfter: () => {
                    user.interface.ChangePage('calendar', { tuto: 2 }, true);
                    return false;
                }
            }
        ]);
    }
    else if (tutoValue === 4) {
        user.interface.screenTuto.ShowTutorial([
            {
                component: null,
                text: lang['main']['home-7']
            }
        ]);
    }
    else if (tutoValue === 100) { // pourquoi 100 ? j'ai pas trop compris dans ton ordre donc j'ai mis 100 par défaut, on pourra le changer
        user.interface.screenTuto.ShowTutorial([
            {
                component: null,
                zapSideToMessage: true,
                text: lang['first']['greetings'].replace('{}', user.informations.username.Get())
            },
            {
                component: user.interface.bottomBar.refButtons[0],
                zapSideToMessage: true,
                text: lang['first']['hello'],
            },
            
            {
                component: user.interface.bottomBar.refButtons[1],
                zapSideToMessage: true,
                text: lang['first']['home'],
                fontSize: 20,
                messagePosY: 0.05 * user.interface.screenHeight,
                execAfter: () => {
                    user.interface.ChangePage('calendar', { tuto: 101 }, true);
                    return false;
                }
            }
        ]);
    }
    else if (tutoValue === 106) { 
        user.interface.screenTuto.ShowTutorial([
            {
                component: null,
                zapSideToMessage: true,
                text: lang['first']['final'],
                fontSize: 20,
                execAfter: () => {
                    return true;
                }
            }
        ]);
    }
}

export default StartTutorial;
