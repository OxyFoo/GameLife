import React from 'react';
import { Animated } from 'react-native';

import user from 'Managers/UserManager';

import { TimingAnimation } from 'Utils/Animations';
import { MinMax } from 'Utils/Functions';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 *
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 * @typedef {import('Class/Quests/MyQuests').DayType} DayType
 *
 * @typedef {Object} DayObject
 * @property {DayType} day
 * @property {Animated.Value} animBorder Value between 0 and 1
 * @property {Animated.Value} animBackground Value between 0 and 1
 *
 * @typedef {Object} WeekMapBackPropsType
 * @property {StyleProp} style
 * @property {MyQuest | null} quest
 * @property {boolean} showAnimations
 */

/** @type {WeekMapBackPropsType} */
const WeekMapBackProps = {
    style: {},
    quest: null,
    showAnimations: true
};

class WeekMapBack extends React.Component {
    state = {
        layout: {
            width: 0,
            height: 0
        },
        /** @type {Array<DayObject>} */
        days: []
    };

    /** @type {Array<NodeJS.Timeout>} */
    timeouts = [];

    /** @param {WeekMapBackPropsType} props */
    constructor(props) {
        super(props);

        if (props.quest === null) {
            user.interface.BackHandle();
            user.interface.console?.AddLog('error', 'MyQuest: Quest not found');
            return;
        }

        this.state.days = user.quests.myquests.GetDays(props.quest).map((day) => ({
            day,
            animBorder: new Animated.Value(0),
            animBackground: new Animated.Value(0)
        }));
    }

    componentDidMount() {
        const { showAnimations } = this.props;

        this.state.days.forEach((item, index) => {
            const progress = item.day.progress;

            if (item.day.state === 'past' || item.day.state === 'filling') {
                const progressAnimValue = MinMax(0.02, progress, 1);
                if (!showAnimations) {
                    item.animBorder.setValue(progressAnimValue);
                } else {
                    this.timeouts.push(
                        setTimeout(() => {
                            // Past days with 0 value are not displayed, so we set a minimum value to display them
                            TimingAnimation(item.animBorder, progressAnimValue, 1000, false).start();
                        }, index * 100)
                    );
                }

                // Show background animation only if the day was completed
                if (progress >= 1) {
                    if (!showAnimations) {
                        item.animBackground.setValue(1);
                    } else {
                        this.timeouts.push(
                            setTimeout(
                                () => {
                                    TimingAnimation(item.animBackground, 1, 200, false).start();
                                },
                                1000 + index * 100
                            )
                        );
                    }
                }
            }
        });
    }

    componentWillUnmount() {
        this.timeouts.forEach((timeout) => clearTimeout(timeout));
    }

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        if (width !== this.state.layout.width || height !== this.state.layout.height) {
            this.setState({ layout: { width, height } });
        }
    };
}

WeekMapBack.prototype.props = WeekMapBackProps;
WeekMapBack.defaultProps = WeekMapBackProps;

export default WeekMapBack;
