import * as React from 'react';
import { View, FlatList } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Text, Icon, Button, DayClock } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 *
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 * @typedef {import('Class/Quests/MyQuests').DayType} DayType
 * @typedef {import('Class/Quests/MyQuests').DayClockStates} DayClockStates
 * 
 */

const QuestProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {MyQuest | null} */
    quest: null,

    /** Icon to drag => onTouchStart event (quest only) */
    onDrag: () => {}
};

class QuestElement extends React.Component {
    state = {
        /** @type {Array<DayType>} */
        days: [],

        /** @type {number} */
        streakCount: 0
    }

    /** @param {QuestProps} props */
    constructor(props) {
        super(props);

        if (props.quest !== null) {
            this.state.days = user.quests.myquests.GetDays(props.quest);
            this.state.streakCount = user.quests.myquests.GetStreak(props.quest);
        }
    }

    componentDidMount() {
        this.listenerActivities = user.activities.allActivities.AddListener(() => {
            const { quest } = this.props;
            this.setState({
                days: user.quests.myquests.GetDays(quest),
                streakCount: user.quests.myquests.GetStreak(quest)
            });
        });
    }

    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.listenerActivities);
    }

    /**
     * @param {QuestProps} nextProps
     * @param {{ days: Array<DayType> }} nextState
     */
    shouldComponentUpdate(nextProps, nextState) {
        // Check if days changed
        if (JSON.stringify(nextState.days) !== JSON.stringify(this.state.days)) {
            return true;
        }

        // Check if quest changed
        if (this.props.quest.title !== nextProps.quest.title ||
            JSON.stringify(this.props.quest.skills) !== JSON.stringify(nextProps.quest.skills) ||
            JSON.stringify(this.props.quest.schedule) !== JSON.stringify(nextProps.quest.schedule)) {
            return true;
        }

        return false;
    }

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(prevState.days) !== JSON.stringify(this.state.days)) {
            this.setState({ days: user.quests.myquests.GetDays(this.props.quest) });
        }
    }

    /** @param {{ item: DayType, index: number }} param0 */
    renderDay = ({ item, index }) => {
        return (
            <DayClock
                day={item.day}
                isToday={item.isToday}
                state={item.state}
                fillingValue={item.fillingValue}
            />
        );
    }

    renderContentScrollable() {
        const { quest, onDrag } = this.props;
        if (quest === null) return null;

        const { title } = quest;

        return (
            <View
                style={styles.itemScrollable}
                onTouchStart={() => onDrag()}
            >
                <View style={styles.scrollableHeader}>
                    <Icon icon='default' color='main1' />
                    <Text style={styles.scrollableTitle}>{title}</Text>
                </View>
                <Icon icon='moveVertical' color='main1' />
            </View>
        );
    }

    timeout;
    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        const { onDrag } = this.props;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => onDrag(), 500);
    }
    /** @param {GestureResponderEvent} event */
    onTouchMove = (event) => {
        clearTimeout(this.timeout);
    }

    render() {
        const langTimes = langManager.curr['dates']['names'];
        const { days, streakCount } = this.state;
        const { style, quest } = this.props;
        if (quest === null) return null;

        const { title } = quest;
        const openQuest = () => user.interface.ChangePage('myqueststats', { quest }, true);

        const timeHour = Math.floor(quest.schedule.duration / 60);
        const timeMinute = quest.schedule.duration % 60;

        let titleText = `${title.length > 10 ? title.slice(0, 12) + '...' : title}`;
        if (timeHour > 0 || timeMinute > 0) {
            titleText += ` -`;
            if (timeHour > 0) {
                titleText += ` ${timeHour}${langTimes['hours-min']}`;
            }
            if (timeMinute > 0) {
                titleText += ` ${timeMinute}${langTimes['minutes-min']}`;
            }
        }

        return (
            <View style={[styles.item, style]}>
                <Button
                    style={styles.content}
                    onPress={openQuest}
                    onTouchStart={this.onTouchStart}
                    onTouchMove={this.onTouchMove}
                    onTouchEnd={this.onTouchMove}
                    onTouchCancel={this.onTouchMove}
                >
                    <View style={styles.header}>
                        <View style={styles.headerTitle}>
                            <Text style={styles.title}>
                                {titleText}
                            </Text>
                        </View>
                        <View style={styles.headerStreak}>
                            <Text style={styles.streak}>
                                {streakCount.toString()}
                            </Text>
                            <Icon icon='flame' />
                        </View>
                    </View>

                    <FlatList
                        data={days}
                        numColumns={7}
                        keyExtractor={item => 'quest-day-' + item.state}
                        columnWrapperStyle={styles.flatlistColumnWrapper}
                        renderItem={this.renderDay}
                    />
                </Button>
            </View>
        );
    }
}

QuestElement.prototype.props = QuestProps;
QuestElement.defaultProps = QuestProps;

export default QuestElement;
