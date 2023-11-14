import * as React from 'react';
import { View, Dimensions } from 'react-native';

import styles from './style';
import TimelineBarBack from './back';
import themeManager from 'Managers/ThemeManager';
import { Icon } from 'Interface/Components';


/**
 * 
 */
class TimelineBar extends TimelineBarBack {

    renderActivities(isScrolled) {
        // Assuming the timeline covers a 24-hour day and the container width is 100%
        // startTime and duration should be in hours
        const totalMinutesInDay = 24 * 60;
        return this.state.activities.map((activity, index) => {
            const width = (activity.duration / totalMinutesInDay) * 100 + '%';
            const offset = (activity.startTime / totalMinutesInDay) * 100 + '%';
            return (
                <View
                    key={index}
                    style={{
                        backgroundColor: activity.color,
                        width: width,
                        position: 'absolute',
                        left: offset,
                        top: 0,
                        bottom: 0,
                        borderRadius: 100,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {!isScrolled ?
                    <Icon icon="social" size={14} color="rgba(0,0,0,0.5)" />
                    :<></>
                    }
                </View>
            );
        });
    }

    render() {
        const borderRadius = 16; // This should match your parent container's borderRadius

        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: 16, }}>
                {this.props.isScrolled ?
                    <View style={[styles.timelineContainer, { height: 5 }]}>
                        {this.renderActivities(this.props.isScrolled)}
                    </View>
                    :
                    <View style={[styles.timelineContainer]}>
                        {this.renderActivities(this.props.isScrolled)}
                    </View>
                }
            </View>


        );
    }
}

export default TimelineBar;