import { PageBack } from 'Interface/Components';
import user from 'Managers/UserManager';

import { Round } from 'Utils/Functions';

class BackHome extends PageBack {
    state = {
        experience: user.experience.GetExperience(),
        values: {
            current_level: '0',
            next_level: '0'
        }
    };

    refTuto1 = null;
    refTuto2 = null;

    componentDidMount() {
        super.componentDidMount();

        this.updateStateValues();
        this.activitiesListener = user.activities.allActivities.AddListener(
            this.updateStateValues
        );
    }
    componentDidFocused = (args) => {
        if (args?.tuto === 1) {
            user.interface.screenTuto.ShowSequence([
                { component: null, text: "Salut ! J'espère que tu vas bien. Je vais te présenter l'applications, suis-moi !" },
                { component: user.interface.header.refContainer, text: "En haut a droite, tu peux y voir ton avatar sur lequel tu peux cliquer pour aller voir ton profil", showButton: false }
            ], () => {
                user.interface.ChangePage('profile', { tuto: 2 }, true);
            });
        }
        else if (args?.tuto === 3) {
            user.interface.screenTuto.ShowSequence([
                { component: this.refTuto1, text: "Voici les actualités, on commence par une citation choisie par la communauté et des news concernant l'application" },
                { component: this.refTuto2, text: "Ce bouton sert à ajouter les activités que tu fais dans la vraie vie" },
                { component: user.interface.bottomBar.refButtons[2], text: "Ce bouton aussi te permet d'ajouter une activité, appuie dessus pour essayer", showButton: false }
            ], () => {
                user.interface.ChangePage('activity', { tuto: 4 }, true);
            });
        }
        else if (args?.tuto === 5) {
            user.settings.tutoFinished = true;
            user.settings.Save();
        }
    }

    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    updateStateValues = () => {
        const experience = user.experience.GetExperience();
        const { xpInfo: { lvl, xp, next } } = experience;
        const current_level = lvl.toString();
        const next_level = Round(100 * xp / next, 0).toString();

        this.setState({ experience, values: { current_level, next_level } });
    }

    addActivity = () => user.interface.ChangePage('activity', undefined, true);
    openTasks = () => user.interface.ChangePage('tasks');
    openSettings = () => user.interface.ChangePage('settings');
}

export default BackHome;