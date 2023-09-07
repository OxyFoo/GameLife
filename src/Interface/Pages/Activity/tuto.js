import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

/**
 * @this import('./back').default
 * @param {number} tutoValue 
 */
function StartTutorial(tutoValue) {
    if (tutoValue === 4) {
        const lang = langManager.curr['tuto'];
        const categoriesText = dataManager.skills.categories
            .map(category => dataManager.GetText(category.Name))
            .join(', ');

        user.interface.screenTuto.ShowTutorial([
            {
                component: this.refTuto1,
                text: lang['main']['activity-1'].replace('{}', categoriesText)
            },
            {
                component: this.refActivities,
                text: lang['main']['activity-2'],
                execAfter: () => {
                    user.interface.ChangePage('home', { tuto: 5 }, true);
                    return false;
                }
            }
        ]);
    }
}

export default StartTutorial;