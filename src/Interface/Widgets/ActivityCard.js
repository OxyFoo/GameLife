import * as React from 'react';
import { Animated, TouchableOpacity, StyleSheet } from 'react-native';

import { Activity } from '../../Class/Activities';
import { TimingAnimation } from '../../Functions/Animations';
import { TimeToFormatString } from '../../Functions/Time';
import dataManager from '../../Managers/DataManager';
import langManager from '../../Managers/LangManager';
import themeManager from '../../Managers/ThemeManager';
import { Icon, Text } from '../Components';

const ActivityCardProps = {
    style: {},

    /**
     * @type {Activity}
     */
    activity: {},

    /**
     * Used to delay before displaying the activity card.
     * @type {number}
     */
    index: 0,

    onPress: () => {}
}

class ActivityCard extends React.Component {
    state = {
        anim: new Animated.Value(0)
    }

    componentDidMount() {
        setTimeout(this.show, 200 + this.props.index * 100);
    }

    show = () => {
        TimingAnimation(this.state.anim, 1, 400).start();
    }

    render() {
        const { activity, onPress } = this.props;

        const GetName = dataManager.GetText;
        const T_start = langManager.curr['calendar']['activity-start'];
        const T_duration = langManager.curr['calendar']['activity-duration'];

        const skill = dataManager.skills.GetByID(activity.skillID);
        const LogoID = skill.LogoID;
        const XML = dataManager.skills.icons.find(x => x.ID === LogoID).Content;
        const T_category = GetName(dataManager.skills.categories.find(x => x.ID === skill.CategoryID).Name);
        const T_activity = GetName(skill.Name);
        const T_start_value = TimeToFormatString(activity.startTime/60, true);
        const T_duration_value = TimeToFormatString(activity.duration);

        const inter = { inputRange: [0, 1], outputRange: [30, 0] };
        const parentView = [
            styles.parent,
            {
                opacity: this.state.anim,
                transform: [ { translateY: this.state.anim.interpolate(inter) } ],
                backgroundColor: themeManager.GetColor('backgroundCard', null, skill.XP === 0 ? 0.5 : 1)
            },
            this.props.style
        ];

        return (
            <Animated.View style={parentView}>
                <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={.5}>
                    <Icon xml={XML} color='main1' size={38} />
                    <Text style={styles.text} fontSize={16}>{T_category + ' - ' + T_activity}</Text>
                    <Text style={styles.text} fontSize={14} color='light'>{T_start + ': ' + T_start_value}</Text>
                    <Text style={styles.text} fontSize={14} color='light'>{T_duration + ': ' + T_duration_value}</Text>
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