import * as React from 'react';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 *
 * @typedef {object} InputPropsType
 * @property {StyleProp} style
 * @property {number} size - Size of the donut chart
 * @property {ThemeColor} progressColor - Color of progress
 * @property {ThemeColor} completedColor - Color of completed quests
 * @property {ThemeColor} backgroundColor - Background color
 *
 * @typedef {object} InputStateType
 * @property {number} completedQuests - Number of completed quests
 * @property {number} totalQuests - Total number of quests
 * @property {boolean} allCompleted - True if all quests are completed
 */

/** @type {InputPropsType} */
const InputProps = {
    style: {},
    size: 110,
    progressColor: 'success',
    completedColor: 'success',
    backgroundColor: 'borderLight'
};

/** @extends {React.Component<InputPropsType, InputStateType>} */
class QuestsProgressChartBack extends React.Component {
    state = {
        completedQuests: 0,
        totalQuests: 0,
        allCompleted: false
    };

    /** @type {Symbol | null} */
    listenerQuests = null;

    /** @param {InputPropsType} props */
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            ...this.computeProgress()
        };
    }

    /**
     * Add a new quest to the list and open the quest page, or show a popup if the limit is reached.
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
            const newState = this.computeProgress();
            this.setState(newState);
        });
    }

    componentWillUnmount() {
        if (this.listenerQuests) {
            user.quests.allQuests.RemoveListener(this.listenerQuests);
        }
    }

    /**
     * @returns {Pick<typeof this.state, 'completedQuests' | 'totalQuests' | 'allCompleted'>}
     */
    computeProgress = () => {
        const allQuests = user.quests.Get();

        let totalQuestsToday = 0;
        let completedQuestsToday = 0;

        // For each quest, check if it should be done today
        for (const quest of allQuests) {
            const days = user.quests.GetDays(quest);

            // Find today's day in data
            const todayDay = days.find((day) => day.isToday);

            if (todayDay && todayDay.state !== 'disabled') {
                totalQuestsToday++;

                // Check if the quest is completed (progress >= 1.0)
                if (todayDay.state === 'past' || todayDay.progress >= 1.0) {
                    completedQuestsToday++;
                }
            }
        }

        return {
            completedQuests: completedQuestsToday,
            totalQuests: totalQuestsToday,
            allCompleted: totalQuestsToday > 0 && completedQuestsToday === totalQuestsToday
        };
    };
}

QuestsProgressChartBack.prototype.props = InputProps;
QuestsProgressChartBack.defaultProps = InputProps;

export default QuestsProgressChartBack;
