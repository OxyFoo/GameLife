import React from 'react';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Round } from 'Utils/Functions';
import { AddActivity } from 'Interface/Widgets';
import { RecapInfoPopupContent, QuestsInfoPopupContent } from './popup';

/**
 * @typedef {import('react-native').View} View
 * @typedef {import('react-native').ScrollView} ScrollView
 *
 * @typedef {import('Managers/UserManager').UserManager} UserManager
 */

const BackHomeProps = {
    args: {
        /** @type {number} */
        tuto: 0
    }
};

class BackHome extends PageBase {
    static feKeepMounted = true;
    static feShowUserHeader = true;
    static feShowNavBar = true;

    state = {
        experience: user.experience.experience.Get(),
        values: {
            currentLevel: '0',
            currentXP: '0',
            nextLevelXP: '0'
        },
        scrollable: true
    };

    /** @type {React.RefObject<ScrollView | null>} */
    refScrollView = React.createRef();

    /** @type {React.RefObject<View | null>} */
    refQuestsTitle = React.createRef();

    /** @type {Symbol | null} */
    listenerActivities = null;

    componentDidMount() {
        this.handleLevelsUpdate(user.experience.experience.Get());
        this.listenerActivities = user.experience.experience.AddListener(this.handleLevelsUpdate);
    }

    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.listenerActivities);
    }

    /** @param {UserManager['experience']['experience']['var']} experience */
    handleLevelsUpdate = (experience) => {
        const {
            xpInfo: { lvl, xp, next }
        } = experience;

        this.setState({
            experience,
            values: {
                currentLevel: lvl.toString(),
                currentXP: Round(xp, 0).toString(),
                nextLevelXP: next.toString()
            }
        });
    };

    /** @param {boolean} scrollable */
    onChangeScrollable = (scrollable) => {
        this.setState({ scrollable });
    };

    /**
     * Affiche des informations sur les quêtes
     */
    infoQuests = () => {
        user.interface.popup?.Open({
            content: <QuestsInfoPopupContent />
        });
    };

    /**
     * Affiche des informations sur les graphiques de performance
     */
    infoRecap = () => {
        user.interface.popup?.Open({
            content: <RecapInfoPopupContent />
        });
    };

    addTodo = () => {
        const lang = langManager.curr['todos'];
        if (user.todos.IsMax()) {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-todoslimit-title'],
                    message: lang['alert-todoslimit-message']
                }
            });
            return;
        }

        user.interface.ChangePage('todo', { storeInHistory: false });
    };
}

BackHome.defaultProps = BackHomeProps;
BackHome.prototype.props = BackHomeProps;

export default BackHome;
