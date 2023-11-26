import * as React from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';

import styles from './style';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Icon, Text } from 'Interface/Components';
import { TimingAnimation } from 'Utils/Animations';
import { GetTimeZone, TimeToFormatString } from 'Utils/Time';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 *
 * @typedef {import('Interface/Components/Icon/index').Icons} Icons
 * @typedef {import('Class/Activities').Activity} Activity
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 */

const ActivityCardProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {'activity'|'start'|'end'} */
    type: 'activity',

    /** @type {Activity} */
    activity: undefined,

    /** @type {number} Used to delay before displaying the activity card */
    index: 0,

    /** @param {GestureResponderEvent} event */
    onPress: (event) => {}
};

class ActivityCard extends React.Component {
    state = {
        anim: new Animated.Value(0)
    }

    constructor(props) {
        super(props);

        const { type, activity } = this.props;
        const GetName = dataManager.GetText;
        const offsetUTC = new Date().getTimezoneOffset() * 60;
        const lang = langManager.curr['calendar'];

        /**
         * Color for normal activity
         * @type {ThemeColor | ThemeText}
        */
        let color = 'main1';

        /** @type {Icons|undefined} */
        this.icon = undefined;

        if (type === 'activity') {
            const skill = dataManager.skills.GetByID(activity.skillID);
            const LogoID = skill?.LogoID ?? 0;
            this.XML = dataManager.skills.icons.find(x => x.ID === LogoID)?.Content ?? '';

            if ((skill?.XP ?? 0) === 0) {
                color = 'main2';
            }

            // Line 1: Start - End (Duration)
            const textStart_value = TimeToFormatString(activity.startTime - offsetUTC);
            const textEnd_value = TimeToFormatString(activity.startTime + activity.duration * 60 - offsetUTC);
            const textDuration_value = TimeToFormatString(activity.duration * 60);

            // Line 1 (optional): UTC+X
            let textUTC_value = '';
            if (activity.timezone !== GetTimeZone()) {
                textUTC_value = lang['utc'];
                if (activity.timezone > 0) {
                    textUTC_value = textUTC_value + '+' + activity.timezone;
                } else if (activity.timezone < 0) {
                    textUTC_value = textUTC_value + activity.timezone;
                }
            }

            // Line 2: Category - Activity
            let textCategory = 'Unknown';
            let textActivity = 'Unknown';
            if (skill !== null) {
                const category = dataManager.skills.categories.find(x => x.ID === skill.CategoryID);
                if (!!category) {
                    textCategory = GetName(category.Name);
                }
                textActivity = GetName(skill.Name);
            }

            this.line1 = `${textStart_value} - ${textEnd_value} (${textDuration_value}${lang['hour-min']}) ${textUTC_value}`;
            this.line2 = textCategory + ' - ' + textActivity;
        }

        else if (type === 'start') {
            color = 'main2';
            this.icon = 'alarmClock';
            this.line1 = '00:00';
            this.line2 = lang['start'];
        }

        else if (type === 'end') {
            color = 'main2';
            this.icon = 'sleepZzz';
            this.line1 = '00:00';
            this.line2 = lang['end'];
        }

        // Theme
        this.themeBackground = {
            backgroundColor: themeManager.GetColor(color)
        };
        this.themeAnimation = {
            opacity: this.state.anim,
            transform: [{
                translateX: this.state.anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                })
            }]
        };
    }

    componentDidMount() {
        const show = () => {
            TimingAnimation(this.state.anim, 1, 300).start();
        }
        setTimeout(show, 300 + this.props.index * 50);
    }


    static Separator({ onPress = () => {}, addButton = false }) {
        const [ anim ] = React.useState(new Animated.Value(0));

        const lang = langManager.curr['calendar'];
        const borderColor = { borderColor: themeManager.GetColor('backgroundCard') };
        const borderColorButton = { borderColor: themeManager.GetColor('main1') };
        const fontColor = { color: themeManager.GetColor('main1') };
        const styleAnimation = {
            opacity: anim,
            transform: [{ scaleY: anim }]
        };

        React.useEffect(() => {
            setTimeout(() =>
                TimingAnimation(anim, 1, 300).start()
            , 400);
        }, []);

        return (
            <Animated.View style={[borderColor, styles.separator, styleAnimation]}>
                {addButton && (
                    <TouchableOpacity
                        style={[borderColorButton, styles.button]}
                        onPress={onPress}
                    >
                        <Text style={fontColor}>{lang['add-activity']}</Text>
                    </TouchableOpacity>
                )}
            </Animated.View>
        );
    }

    render() {
        const { type, onPress, style: propsStyle } = this.props;

        return (
            <Animated.View style={this.themeAnimation}>
                <TouchableOpacity
                    style={[styles.card, propsStyle]}
                    onPress={onPress}
                    activeOpacity={type === 'activity' ? .5 : 1}
                >
                    <View style={[styles.iconContainer, this.themeBackground]}>
                        <Icon icon={this.icon} xml={this.XML} color='white' size={30} />
                    </View>

                    <View style={styles.text}>
                        <Text fontSize={12} color='light'>{this.line1}</Text>
                        <Text fontSize={18}>{this.line2}</Text>
                    </View>

                    {/*
                    <View style={styles.dotContainer}>
                        <View style={[styles.dot, { borderColor: themeManager.GetColor(color) }]} />
                    </View>
                    */}
                </TouchableOpacity>
            </Animated.View>
        );
    }
}

ActivityCard.prototype.props = ActivityCardProps;
ActivityCard.defaultProps = ActivityCardProps;

export default ActivityCard;
