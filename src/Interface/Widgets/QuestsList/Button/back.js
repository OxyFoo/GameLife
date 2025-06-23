import * as React from 'react';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import { AddActivity } from 'Interface/Widgets';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 *
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Quests').Quest} Quest
 *
 * @typedef {Object} QuestPropsType
 * @property {StyleProp} style
 * @property {Quest | null} quest
 * @property {boolean} enableQuickAdd
 * @property {(quest: Quest) => void} onDrag Icon to drag => onTouchStart event (quest only)
 * @property {(event: LayoutChangeEvent) => void} onLayout
 */

/** @type {QuestPropsType} */
const QuestProps = {
    style: {},
    quest: null,
    enableQuickAdd: false,
    onDrag: () => {},
    onLayout: () => {}
};

class QuestButtonBack extends React.Component {
    state = {
        timeText: '',
        streakCount: 0
    };

    /** @param {QuestProps} props */
    constructor(props) {
        super(props);

        if (props.quest !== null) {
            this.state.timeText = user.quests.GetQuestTimeText(props.quest);
            this.state.streakCount = user.quests.GetStreak(props.quest);
        }
    }

    /** @type {Symbol | null} */
    listenerActivities = null;

    /** @type {number} */
    lastY = 0;

    componentDidMount() {
        this.listenerActivities = user.activities.allActivities.AddListener(() => {
            const { quest } = this.props;
            if (quest === null) return;

            this.setState({
                timeText: user.quests.GetQuestTimeText(quest),
                streakCount: user.quests.GetStreak(quest)
            });
        });
    }

    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.listenerActivities);
    }

    /**
     * @param {QuestProps} nextProps
     * @param {this['state']} nextState
     */
    shouldComponentUpdate(nextProps, nextState) {
        // Check if quest changed
        if (
            this.state.timeText !== nextState.timeText ||
            this.state.streakCount !== nextState.streakCount ||
            this.props.quest?.title !== nextProps.quest?.title ||
            JSON.stringify(this.props.quest?.skills) !== JSON.stringify(nextProps.quest?.skills) ||
            JSON.stringify(this.props.quest?.schedule) !== JSON.stringify(nextProps.quest?.schedule)
        ) {
            return true;
        }

        return false;
    }

    openQuest = () => {
        const { quest } = this.props;
        if (quest === null) return;

        user.interface.ChangePage('queststats', { args: { quest }, storeInHistory: false });
    };

    openQuickAddActivity = () => {
        const { quest, enableQuickAdd } = this.props;
        if (quest === null || !enableQuickAdd) return;

        user.interface.bottomPanel?.Open({
            content: <AddActivity listSkillsIDs={quest.skills} />
        });
    };

    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        const { quest, onDrag } = this.props;
        if (quest === null) return;

        this.lastY = event.nativeEvent.pageY;
        this.a = setTimeout(() => {
            onDrag(quest);
        }, 300);
    };

    /** @param {GestureResponderEvent} event */
    onTouchMove = (event) => {
        const deltaY = event.nativeEvent.pageY - this.lastY;
        if (Math.abs(deltaY) > 10) {
            clearTimeout(this.a);
        }
    };

    /** @param {GestureResponderEvent} _event */
    onTouchEnd = (_event) => {
        clearTimeout(this.a);
    };

    /**
     * Calcule le pourcentage de progression d'une quête (0-100)
     * @returns {number}
     */
    getQuestProgress = () => {
        const { quest } = this.props;
        if (quest === null) return 0;

        try {
            // Obtient les jours de la quête pour calculer le progrès d'aujourd'hui
            const days = user.quests.GetDays(quest);
            const today = days.find((day) => day.isToday);
            
            if (today && typeof today.progress === 'number') {
                // Convertit la progression (0-1+) en pourcentage (0-100)
                // Cap à 100% même si on dépasse l'objectif
                return Math.min(today.progress * 100, 100);
            }
            
            return 0;
        } catch (error) {
            console.warn('Erreur lors du calcul du progrès de la quête:', error);
            return 0;
        }
    };

    /**
     * Obtient la couleur de la catégorie la plus utilisée pour cette quête
     * @returns {string}
     */
    getQuestCategoryColor = () => {
        const { quest } = this.props;
        if (quest === null) return '#3498db'; // Couleur par défaut

        try {
            // Obtient toutes les activités liées à cette quête
            const questActivities = user.quests.GetQuestActivities(quest);
            
            if (questActivities.length === 0) {
                // Pas d'activités, utilise la première skill de la quête pour déterminer la couleur
                if (quest.skills.length > 0) {
                    const firstSkill = dataManager.skills.GetByID(quest.skills[0]);
                    if (firstSkill) {
                        const category = dataManager.skills.GetCategoryByID(firstSkill.CategoryID);
                        return category?.Color || '#3498db';
                    }
                }
                return '#3498db';
            }

            // Calcule le temps total par catégorie
            /** @type {Record<number, {duration: number, color: string}>} */
            const categoryDurations = {};
            
            questActivities.forEach((activity) => {
                const skill = dataManager.skills.GetByID(activity.skillID);
                if (skill) {
                    const category = dataManager.skills.GetCategoryByID(skill.CategoryID);
                    if (category) {
                        if (!categoryDurations[category.ID]) {
                            categoryDurations[category.ID] = {
                                duration: 0,
                                color: category.Color
                            };
                        }
                        categoryDurations[category.ID].duration += activity.duration;
                    }
                }
            });

            // Trouve la catégorie avec le plus de temps
            let maxDuration = 0;
            let dominantColor = '#3498db';
            
            Object.values(categoryDurations).forEach((categoryData) => {
                if (categoryData.duration > maxDuration) {
                    maxDuration = categoryData.duration;
                    dominantColor = categoryData.color;
                }
            });

            return dominantColor;
        } catch (error) {
            console.warn('Erreur lors du calcul de la couleur de catégorie de la quête:', error);
            return '#3498db';
        }
    };
}

QuestButtonBack.prototype.props = QuestProps;
QuestButtonBack.defaultProps = QuestProps;

export default QuestButtonBack;
