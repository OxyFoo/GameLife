// TODO: Finish this component

import * as React from 'react';
import { FlatList, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Text, Icon, Button, DayClock } from 'Interface/Components';
import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').ListRenderItem<DayType>} ListRenderItemDayType
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 *
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 * @typedef {import('Class/Quests/MyQuests').DayType} DayType
 * @typedef {import('Class/Quests/MyQuests').DayClockStates} DayClockStates
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

class QuestElement extends React.Component {
    state = {
        /** @type {Array<DayType>} */
        days: [],

        /** @type {number} */
        streakCount: 0
    };

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
        if (
            this.props.quest.title !== nextProps.quest.title ||
            JSON.stringify(this.props.quest.skills) !== JSON.stringify(nextProps.quest.skills) ||
            JSON.stringify(this.props.quest.schedule) !== JSON.stringify(nextProps.quest.schedule)
        ) {
            return true;
        }

        return false;
    }

    /**
     * @param {QuestPropsType} _prevProps
     * @param {this['state']} prevState
     */
    componentDidUpdate(_prevProps, prevState) {
        if (JSON.stringify(prevState.days) !== JSON.stringify(this.state.days)) {
            this.setState({ days: user.quests.myquests.GetDays(this.props.quest) });
        }
    }

    /** @type {ListRenderItemDayType} */
    renderDay = ({ item }) => {
        return <DayClock day={item.day} isToday={item.isToday} state={item.state} fillingValue={item.fillingValue} />;
    };

    renderContentScrollable() {
        const { quest, onDrag } = this.props;
        if (quest === null) return null;

        const { title } = quest;

        return (
            <View style={styles.itemScrollable} onTouchStart={() => onDrag()}>
                <View style={styles.scrollableHeader}>
                    <Icon icon='default' color='main1' />
                    <Text style={styles.scrollableTitle}>{title}</Text>
                </View>
                <Icon icon='moveVertical' color='main1' />
            </View>
        );
    }

    timeout;
    /** @param {GestureResponderEvent} _event */
    onTouchStart = (_event) => {
        const { onDrag } = this.props;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => onDrag(), 500);
    };
    /** @param {GestureResponderEvent} _event */
    onTouchMove = (_event) => {
        clearTimeout(this.timeout);
    };

    render() {
        const langTimes = langManager.curr['dates']['names'];
        const { days, streakCount } = this.state;
        const { style, quest } = this.props;
        if (quest === null) return null;

        const openQuest = () => user.interface.ChangePage('myqueststats', { args: { quest }, storeInHistory: false });

        const timeHour = Math.floor(quest.schedule.duration / 60);
        const timeMinute = quest.schedule.duration % 60;

        const { title } = quest;
        let titleText = `${title.length > 10 ? title.slice(0, 12) + '...' : title}`;
        let timeText = '';
        if (timeHour > 0 || timeMinute > 0) {
            if (timeHour > 0) {
                timeText += `${timeHour}${langTimes['hours-min']}`;
            }
            if (timeMinute > 0) {
                timeText += ` ${timeMinute}${langTimes['minutes-min']}`;
            }
        }

        return (
            <LinearGradient
                style={[styles.item, style]}
                colors={[
                    themeManager.GetColor('backgroundCard', { opacity: 0.45 }),
                    themeManager.GetColor('backgroundCard', { opacity: 0.2 })
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <Button
                    style={styles.content}
                    appearance='uniform'
                    color='transparent'
                    onPress={openQuest}
                    onTouchStart={this.onTouchStart}
                    onTouchMove={this.onTouchMove}
                    onTouchEnd={this.onTouchMove}
                    onTouchCancel={this.onTouchMove}
                >
                    <View style={styles.header}>
                        <View style={styles.headerTitle}>
                            <Text style={styles.title}>{titleText}</Text>
                        </View>
                        <View style={styles.headerStreak}>
                            <Text style={styles.streakText2} color='main1'>
                                {'0 / ' + timeText}
                            </Text>
                            <Text style={styles.streakText} color='main2'>
                                {streakCount.toString()}
                            </Text>
                            <Icon icon='flame' color='main2' style={styles.streakIcon} />
                            <Icon icon='arrow-square' color='gradient' angle={90} />
                        </View>
                    </View>

                    <FlatList
                        data={days}
                        numColumns={7}
                        keyExtractor={(item) => 'quest-day-' + item.state}
                        columnWrapperStyle={styles.flatlistColumnWrapper}
                        renderItem={this.renderDay}
                    />
                </Button>
            </LinearGradient>
        );
    }
}

QuestElement.prototype.props = QuestProps;
QuestElement.defaultProps = QuestProps;

export default QuestElement;
