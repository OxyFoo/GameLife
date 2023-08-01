import * as React from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';

import styles from './style';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Icon, Text } from 'Interface/Components';
import { TimingAnimation } from 'Utils/Animations';
import { TimeToFormatString } from 'Utils/Time';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 *
 * @typedef {import('Class/Activities').Activity} Activity
 */

const ActivityCardProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {Activity} */
    activity: undefined,

    /** @type {number} Used to delay before displaying the activity card */
    index: 0,

    /** @param {GestureResponderEvent} event */
    onPress: (event) => {}
}

class ActivityCard extends React.Component {
    state = {
        anim: new Animated.Value(0)
    }

    constructor(props) {
        super(props);

        const { activity } = this.props;
        const GetName = dataManager.GetText;
        const offsetUTC = new Date().getTimezoneOffset() * 60;

        const skill = dataManager.skills.GetByID(activity.skillID);
        const LogoID = skill.LogoID;
        this.XML = dataManager.skills.icons.find(x => x.ID === LogoID).Content;
        this.textCategory = GetName(dataManager.skills.categories.find(x => x.ID === skill.CategoryID).Name);
        this.textActivity = GetName(skill.Name);
        this.textStart_value = TimeToFormatString(activity.startTime - offsetUTC);
        this.textEnd_value = TimeToFormatString(activity.startTime + activity.duration * 60 - offsetUTC);
        this.textDuration_value = TimeToFormatString(activity.duration * 60);

        this.text = `${this.textStart_value} - ${this.textEnd_value} (${this.textDuration_value}h)`;

        this.themeBorder = { borderColor: themeManager.GetColor('main1') };
        this.themeBackground = { backgroundColor: themeManager.GetColor('main1') };
    }

    componentDidMount() {
        setTimeout(this.show, 200 + this.props.index * 100);
    }

    show = () => {
        TimingAnimation(this.state.anim, 1, 400).start();
    }

    static Separator({ onPress }) {
        const lang = langManager.curr['calendar'];
        const borderColor = { borderColor: themeManager.GetColor('main1') };
        const fontColor = { color: themeManager.GetColor('main1') };

        return (
            <View style={[borderColor, styles.separator]}>
                <TouchableOpacity
                    style={[borderColor, styles.button]}
                    onPress={onPress}
                >
                    <Text style={fontColor}>{lang['add-activity']}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const { onPress, style: propsStyle } = this.props;

        return (
            <TouchableOpacity style={[styles.card, propsStyle]} onPress={onPress} activeOpacity={.5}>
                <View style={[styles.iconContainer, this.themeBackground]}>
                    <Icon xml={this.XML} color='white' size={30} />
                </View>

                <View style={styles.text}>
                    <Text fontSize={12} color='light'>{this.text}</Text>
                    <Text fontSize={24/*16*/}>{this.textCategory + ' - ' + this.textActivity}</Text>
                </View>

                <View style={styles.dotContainer}>
                    <View style={[styles.dot, this.themeBorder]} />
                </View>
            </TouchableOpacity>
        );
    }
}

ActivityCard.prototype.props = ActivityCardProps;
ActivityCard.defaultProps = ActivityCardProps;

export default ActivityCard;