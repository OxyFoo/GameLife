import * as React from 'react';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 *
 * @typedef {object} InputPropsType
 * @property {StyleProp} style
 * @property {number} [size] - Size of the donut chart
 * @property {string} [progressColor] - Color of progress
 * @property {string} [backgroundColor] - Background color
 */

const InputProps = {
    /** @type {StyleProp} */
    style: {},
    /** @type {number} */
    size: 110,
    /** @type {string} */
    progressColor: '#4CAF50',
    /** @type {string} */
    backgroundColor: '#E0E0E0'
};

class QuestProgressChartBack extends React.Component {
    state = {
        completedQuests: 0,
        totalQuests: 0,
        allCompleted: false,
        layoutWidth: 0
    };

    /** @type {Symbol | null} */
    listenerQuests = null;

    /** @param {InputPropsType} props */
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            ...this.computeProgress(false)
        };
    }

    /**
     * Add a new quest to the list and open the quest page\
     * Max 10 quests
     */
    addQuest = () => {
        const lang = langManager.curr['quests'];
        if (user.quests.IsMax()) {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-questslimit-title'],
                    message: lang['alert-questslimit-message']
                }
            });
            return;
        }
        user.interface.ChangePage('quest', { storeInHistory: false });
    };

    componentDidMount() {
        this.listenerQuests = user.quests.allQuests.AddListener(() => {
            this.computeProgress();
        });
    }

    componentWillUnmount() {
        if (this.listenerQuests) {
            user.quests.allQuests.RemoveListener(this.listenerQuests);
        }
    }

    /**
     * @param {boolean} [setState=true] If true, call setState to update the component
     */
    computeProgress = (setState = true) => {
        try {
            const allQuests = user.quests.Get();

            let totalQuestsToday = 0;
            let completedQuestsToday = 0;

            // Pour chaque quête, vérifier si elle doit être faite aujourd'hui
            allQuests.forEach((quest) => {
                const days = user.quests.GetDays(quest);

                // Trouver le jour d'aujourd'hui dans les données
                const todayDay = days.find((day) => day.isToday);

                if (todayDay && todayDay.state !== 'disabled') {
                    totalQuestsToday++;

                    // Vérifier si la quête est complétée (progress >= 1.0)
                    if (todayDay.state === 'past' || todayDay.progress >= 1.0) {
                        completedQuestsToday++;
                    }
                }
            });

            const newState = {
                completedQuests: completedQuestsToday,
                totalQuests: totalQuestsToday,
                allCompleted: totalQuestsToday > 0 && completedQuestsToday === totalQuestsToday
            };

            // Log the results as requested
            console.log('📊 Quest Progress Chart:', {
                completed: completedQuestsToday,
                total: totalQuestsToday,
                percentage: totalQuestsToday > 0 ? Math.round((completedQuestsToday / totalQuestsToday) * 100) : 0
            });

            if (setState) {
                this.setState(newState);
            }

            return newState;
        } catch (error) {
            console.error('Error updating quest progress:', error);
            const errorState = {
                completedQuests: 0,
                totalQuests: 0,
                allCompleted: false
            };

            if (setState) {
                this.setState(errorState);
            }

            return errorState;
        }
    };

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        this.setState({ layoutWidth: event.nativeEvent.layout.width });
    };
}

QuestProgressChartBack.prototype.props = InputProps;
QuestProgressChartBack.defaultProps = InputProps;

export default QuestProgressChartBack;
