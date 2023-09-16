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
                text: lang['main']['home-2'],
                showButton: false,
                execAfter: () => {
                    user.interface.ChangePage('profile', { tuto: 2 }, true);
                    return false;
                }
            }
        ]);
    }
    else if (tutoValue === 3) {
        user.interface.screenTuto.ShowTutorial([
            {
                component: this.refTuto1,
                text: lang['main']['home-3']
            },
            {
                component: this.refTuto2,
                text: lang['main']['home-4']
            },
            {
                component: user.interface.bottomBar.refButtons[2],
                text: lang['main']['home-5'],
                showButton: false,
                execAfter: () => {
                    user.interface.ChangePage('activity', { tuto: 4 }, true);
                    return false;
                }
            }
        ]);
    }
    else if (tutoValue === 5) {
        user.interface.screenTuto.ShowTutorial([
            {
                component: this.refTuto3,
                text: lang['main']['home-6']
            },
            {
                component: user.interface.bottomBar.refButtons[1],
                text: lang['main']['home-7'],
                showButton: false,
                execAfter: () => {
                    user.interface.ChangePage('calendar', { tuto: 6 }, true);
                    return false;
                }
            }
        ]);
    }
    else if (tutoValue === 8) {
        user.interface.screenTuto.ShowTutorial([
            {
                component: null,
                text: lang['main']['home-8']
            }
        ]);
    }
}

export default StartTutorial;