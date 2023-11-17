import * as React from 'react';
import { View, FlatList } from 'react-native';

import styles from './style';
import ActivityTimelineBack from './back';

import { Icon } from 'Interface/Components';

/**
 * @typedef {import('./back').ActivityTimelineItem} ActivityTimelineItem
 */

class ActivityTimeline extends ActivityTimelineBack {
    /**
     * Render one activity in a time line with the height and icon depending on the scroll
     * @param {{ item: ActivityTimelineItem }} param0
     */
    renderActivity = ({ item }) => {
        const showIcon = !this.state.isScrolled && item.duration >= 60;
        const styleTimelineItem = {
            marginLeft: item.marginLeft,
            width: item.width,
            backgroundColor: item.color
        };

        return (
            <View style={[styles.timelineItem, styleTimelineItem]}>
                {showIcon && (
                    <Icon size={14} xml={item.logo} color={item.logoColor} />
                )}
            </View>
        );
    }

    render() {
        const styleContainer = {
            height: this.state.isScrolled ? 5 : 16
        };

        return (
            <View style={styles.container}>

                <View style={[styles.timelineContainer, styleContainer]}>
                    {this.state.activities.length > 0 && (
                        <FlatList
                            data={this.state.activities}
                            renderItem={this.renderActivity}
                            keyExtractor={(item, index) => `activity-${index}`}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={false}
                        />
                    )}
                </View>

            </View>
        );
    }
}

export default ActivityTimeline;