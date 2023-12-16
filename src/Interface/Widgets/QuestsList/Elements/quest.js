import * as React from 'react';
import { View, FlatList } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';

import { Text, Icon, Button } from 'Interface/Components';

import DayClock from '../../../Components/DayClock';
import { Sum } from 'Utils/Functions';
import { DAY_TIME, GetDate, GetTime } from 'Utils/Time';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Class/Quests').Quest} Quest
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 * @typedef {import('Interface/Components/DayClock/back').DayClockStates} DayClockStates
 * 
 * @typedef {object} DayType
 * @property {number} day
 * @property {boolean} isToday
 * @property {DayClockStates} state
 * @property {number} [fillingValue] Only used if state === 'filling'
 */

const QuestProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {Quest | null} */
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
            this.state.days = this.getDays(GetTime(undefined, 'local'));
            this.state.streakCount = this.getStreak();
        }
    }

    componentDidMount() {
        this.listenerActivities = user.activities.allActivities.AddListener(() => {
            this.setState({
                days: this.getDays(GetTime(undefined, 'local')),
                streakCount: this.getStreak()
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
            this.setState({ days: this.getDays(GetTime(undefined, 'local')) });
        }
    }

    /** @param {number} time in seconds */
    getDays(time) {
        const { quest } = this.props;
        if (quest === null) return [];

        const dateNow = GetDate(time);
        const currentDate = dateNow.getDate() - 1;
        const currentDayIndex = (dateNow.getDay() - 1 + 7) % 7;
        const { skills, schedule: { type, repeat, duration } } = quest;

        if (duration === 0) return []; // Avoid division by 0

        /** @type {Array<DayType>} */
        const days = [];

        for (let i = 0; i < 7; i++) {
            const isToday = i === currentDayIndex;

            /** @type {DayClockStates} */
            let state = 'normal';
            let fillingValue = 0;

            // Disabled if not in repeat
            if (type === 'week' && !repeat.includes(i)) {
                state = 'disabled';
            } else if (type === 'month' && !repeat.includes((currentDate - currentDayIndex + i + 31) % 31)) {
                state = 'disabled';
            }

            // Filling if in repeat and not completed
            if (state !== 'disabled') {
                const deltaToNewDay = i - currentDayIndex;
                const activitiesNewDay = user.activities
                    .GetByTime(time + deltaToNewDay * DAY_TIME)
                    .filter(activity => skills.includes(activity.skillID))
                    .filter(activity => user.activities.GetExperienceStatus(activity) === 'grant');

                if (deltaToNewDay === 0) {
                    const activitiesQuest = activitiesNewDay
                        .filter(activity =>
                            activity.startTime + activity.duration * 60 <= time
                        );

                    const totalDuration = Sum(activitiesQuest.map(activity => activity.duration));
                    const progress = totalDuration / duration;
                    state = progress >= 1 ? 'full' : 'filling';
                    fillingValue = Math.min(progress, 1) * 100;
                }
                else if (deltaToNewDay < 0) {
                    const totalDuration = Sum(activitiesNewDay.map(activity => activity.duration));
                    const progress = totalDuration / duration;
                    state = progress >= 1 ? 'full' : 'filling';
                    fillingValue = Math.min(progress, 1) * 100;
                }
                else if (deltaToNewDay > 0) {
                    state = 'normal';
                }
            }

            days.push({ day: i, isToday, state, fillingValue });
        }

        return days;
    }

    getStreak() {
        let i = 0;
        let streak = 0;
        while (true) {
            const week = this
                .getDays(GetTime(undefined, 'local') - i++ * DAY_TIME * 7)
                .map(day => day.state)
                .filter(state => state !== 'disabled' && state !== 'normal')
                .reverse();
            for (let i = 0; i < week.length; i++) {
                if (week[i] !== 'full') {
                    return streak;
                }
                streak++;
            }
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

    render() {
        const { days, streakCount } = this.state;
        const { style, quest } = this.props;
        if (quest === null) return null;

        const { title } = quest;
        const openQuest = () => user.interface.ChangePage('myqueststats', { quest }, true);

        return (
            <View style={[styles.item, style]}>
                <Button
                    style={styles.content}
                    onPress={openQuest}
                >
                    <View style={styles.header}>
                        <View style={styles.headerTitle}>
                            <Icon icon='default' color='main1' />
                            <Text style={styles.title}>{title}</Text>
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
