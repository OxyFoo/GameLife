import * as React from 'react';
import { Animated, TouchableOpacity, StyleSheet } from 'react-native';

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
        this.textDuration_value = TimeToFormatString(activity.duration * 60);

        const inter = { inputRange: [0, 1], outputRange: [30, 0] };
        this.parentStyle = [
            styles.parent,
            {
                opacity: this.state.anim,
                transform: [ { translateY: this.state.anim.interpolate(inter) } ],
                backgroundColor: themeManager.GetColor('backgroundCard', skill.XP === 0 ? 0.5 : 1)
            },
            this.props.style
        ];
    }

    componentDidMount() {
        setTimeout(this.show, 200 + this.props.index * 100);
    }

    show = () => {
        TimingAnimation(this.state.anim, 1, 400).start();
    }

    render() {
        const { onPress } = this.props;
        const T_start = langManager.curr['calendar']['activity-start'];
        const T_duration = langManager.curr['calendar']['activity-duration'];

        return (
            <Animated.View style={this.parentStyle}>
                <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={.5}>
                    <Icon xml={this.XML} color='main1' size={38} />
                    <Text style={styles.text} fontSize={16}>{this.textCategory + ' - ' + this.textActivity}</Text>
                    <Text style={styles.text} fontSize={14} color='light'>{T_start + ': ' + this.textStart_value}</Text>
                    <Text style={styles.text} fontSize={14} color='light'>{T_duration + ': ' + this.textDuration_value}</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    }
}

ActivityCard.prototype.props = ActivityCardProps;
ActivityCard.defaultProps = ActivityCardProps;

const styles = StyleSheet.create({
    parent: {
        flex: 1,
        borderRadius: 16,
        backgroundColor: '#384065'
    },
    card: {
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 6
    },
    text: {
        marginTop: 12
    }
});

export default ActivityCard;