import * as React from 'react';

import user from 'Managers/UserManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 *
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 *
 * @typedef {Object} QuestPropsType
 * @prop {StyleProp} style
 * @prop {MyQuest | null} quest
 * @prop {() => void} onDrag Icon to drag => onTouchStart event (quest only)
 */

/** @type {QuestPropsType} */
const QuestProps = {
    style: {},
    quest: null,
    onDrag: () => {}
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
            this.state.timeText = user.quests.myquests.GetQuestTimeText(props.quest);
            this.state.streakCount = user.quests.myquests.GetStreak(props.quest);
        }
    }

    /** @type {Symbol | null} */
    listenerActivities = null;

    componentDidMount() {
        this.listenerActivities = user.activities.allActivities.AddListener(() => {
            const { quest } = this.props;
            if (quest === null) return;

            this.setState({
                timeText: user.quests.myquests.GetQuestTimeText(quest),
                streakCount: user.quests.myquests.GetStreak(quest)
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

        user.interface.ChangePage('myqueststats', { args: { quest } });
    };
}

QuestButtonBack.prototype.props = QuestProps;
QuestButtonBack.defaultProps = QuestProps;

export default QuestButtonBack;
