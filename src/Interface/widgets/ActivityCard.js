import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { Activity } from '../../Class/Activities';
import { TimingAnimation } from '../../Functions/Animations';
import { timeToFormatString } from '../../Functions/Time';
import dataManager from '../../Managers/DataManager';
import langManager from '../../Managers/LangManager';
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
    index: 0
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
        const inter = { inputRange: [0, 1], outputRange: [30, 0] };
        const parentView = [ styles.card,
            { opacity: this.state.anim },
            { transform: [ { translateY: this.state.anim.interpolate(inter) } ] },
            this.props.style
        ];

        const T_start = langManager.curr['calendar']['activity-start'];
        const T_duration = langManager.curr['calendar']['activity-duration'];

        const activity = this.props.activity;
        const skill = dataManager.skills.getByID(activity.skillID);
        const LogoID = skill.LogoID;
        const XML = dataManager.skills.skillsIcons.find(x => x.ID === LogoID).Content;
        const T_category = dataManager.skills.skillsCategories.find(x => x.ID === skill.CategoryID).Name;
        const T_activity = skill.Name;
        const T_start_value = timeToFormatString(activity.startDate/60, true);
        const T_duration_value = timeToFormatString(activity.duration);

        return (
            <Animated.View style={parentView}>
                <Icon xml={XML} color='main1' size={38} />
                <Text style={styles.text} fontSize={16}>{T_category + ' - ' + T_activity}</Text>
                <Text style={styles.text} fontSize={14} color='light'>{T_start + ': ' + T_start_value}</Text>
                <Text style={styles.text} fontSize={14} color='light'>{T_duration + ': ' + T_duration_value}</Text>
            </Animated.View>
        );
    }
}

ActivityCard.prototype.props = ActivityCardProps;
ActivityCard.defaultProps = ActivityCardProps;

const styles = StyleSheet.create({
    card: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        paddingVertical: 20,

        borderRadius: 16,
        backgroundColor: '#384065'
    },
    text: {
        marginTop: 12
    }
});

export default ActivityCard;