import * as React from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { GetDate, GetTime } from 'Utils/Time';
import { DateToFormatString, GetDay } from 'Utils/Date';
import { Text, Icon, Button } from 'Interface/Components';
import { SpringAnimation, WithInterpolation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Class/Quests').Quest} Quest
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 */

const QuestProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {Quest|null} */
    quest: null,

    /** Icon to drag => onTouchStart event (quest only) */
    onDrag: () => {},

    /**
     * @param {Quest} quest
     * @param {(resolve: (cancel: () => void) => void) => void} callbackRemove
     * @returns {Promise<void>} True to enable remove animation
     */
    onQuestCheck: async (quest, callbackRemove) => {}
};

class QuestElement extends React.Component {
    state = {
        translateY : new Animated.Value(0)
    }

    constructor(props) {
        super(props);

        this.mountQuest();
    }

    mountQuest() {
        const { quest } = this.props;
        if (quest === null) return;

        const { Deadline, Schedule } = quest;

        const d = new Date();
        d.setUTCHours(1, 0, 0, 0);
        const now = GetTime();

        /** @type {'schedule'|'deadline'|null} */
        let deadlineType = null;

        /** @type {number|null} Minimum number of days */
        let minDeltaDays = null;

        // Search next schedule
        let i = 0;
        let days = Schedule.Repeat;
        if (Schedule.Type === 'month') days = days.map(day => day + 1);

        if (days.length > 0) {
            while (minDeltaDays === null) {
                const weekMatch = Schedule.Type === 'week' && days.includes(GetDay(d));
                const monthMatch = Schedule.Type === 'month' && days.includes(d.getUTCDate());
                if (weekMatch || monthMatch) {
                    minDeltaDays = i + 1;
                    deadlineType = 'schedule';
                }
                i++;
                d.setUTCDate(d.getUTCDate() + 1);
            }
        }

        // Search next deadline (if earlier than schedule or no schedule)
        if (Deadline > 0) {
            const delta = (Deadline - now) / (60 * 60 * 24);
            if (minDeltaDays === null || delta < minDeltaDays) {
                deadlineType = 'deadline';
                minDeltaDays = delta;
            }
        }

        // Define text (deadline or schedule)
        this.text = '';
        const lang = langManager.curr['quests'];
        if (deadlineType === 'deadline') {
            this.text = lang['quest-type-deadline'] + ' ' + DateToFormatString(GetDate(Deadline));
        } else if (deadlineType === 'schedule') {
            const nextDate = GetDate(now + (minDeltaDays * 24 * 60 * 60));
            this.text = lang['quest-type-repeat-before'] + ' ' + DateToFormatString(nextDate);
        }

        // Define color (red if overdue, orange if today, white otherwise)
        /** @type {ThemeText} */
        this.colorText = 'primary';
        if (minDeltaDays !== null && minDeltaDays < 0) this.colorText = 'error';
        else if (minDeltaDays !== null && minDeltaDays < 1) this.colorText = 'warning';
    }

    onCheck = () => {
        const { translateY } = this.state;
        const { quest, onQuestCheck } = this.props;

        onQuestCheck(quest, (resolve) => {
            SpringAnimation(translateY, 1).start();
            setTimeout(() => {
                resolve(() => {
                    SpringAnimation(translateY, 0).start();
                });
            }, 200);
        });
    }

    render() {
        const { translateY } = this.state;
        const { style, quest, onDrag } = this.props;
        if (quest === null) return null;

        const { Title, Schedule, Checked } = quest;
        const isTodo = Schedule.Type === 'none';

        const styleAnimation = {
            transform: [
                { translateY: WithInterpolation(translateY, 0, -46) }
            ]
        };
        const styleButtonRadius = { borderRadius: isTodo ? 8 : 200 };
        const openQuest = () => user.interface.ChangePage('quest', { quest });

        return (
            <View style={styles.parent}>
            <Animated.View
                style={[styles.content, styleAnimation, style]}
            >
                <Button
                    style={[styles.checkbox, styleButtonRadius]}
                    color={Checked !== 0 ? 'white' : 'transparent'}
                    onPress={this.onCheck}
                >
                    {Checked !== 0 && (
                        <Icon icon='check' color='main1' size={16} />
                    )}
                </Button>
                <TouchableOpacity
                    style={styles.title}
                    onPress={openQuest}
                    activeOpacity={.6}
                >
                    <Text style={styles.titleText}>{Title}</Text>
                    {!!this.text.length && (
                        <Text
                            style={styles.dateText}
                            color={this.colorText}
                        >
                            {this.text}
                        </Text>
                    )}
                </TouchableOpacity>
                <View onTouchStart={() => onDrag()}>
                    <Icon icon='moveVertical' color='main1' />
                </View>
            </Animated.View>
            </View>
        );
    }
}

QuestElement.prototype.props = QuestProps;
QuestElement.defaultProps = QuestProps;

export default QuestElement;
