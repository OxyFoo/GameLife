import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @this {import('./back').default}
 * @param {number} tutoValue
 */
function StartTutorial(tutoValue) {
    const lang = langManager.curr['tuto'];
    if (tutoValue === 5) {
        user.interface.screenTuto.ShowTutorial([
            {
                component: null,
                zapInline: true,
                text: lang['main']['shop'],
                fontSize: 18,
                positionY: 0.25
            },
            {
                component: user.interface.navBar.refButtons['addActivity'],
                text: lang['main']['shop-next'],
                fontSize: 18,
                execAfter: () => {
                    user.interface.ChangePage('activity', { tuto: 6 }, true);
                    return false;
                }
            }
        ]);
    }
}

export default StartTutorial;
