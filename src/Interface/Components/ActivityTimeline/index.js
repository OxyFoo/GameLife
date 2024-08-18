import * as React from 'react';
import { View, FlatList } from 'react-native';

import styles from './style';
import ActivityTimelineBack from './back';

/**
 * @typedef {import('./back').ActivityTimelineItem} ActivityTimelineItem
 * @typedef {import('react-native').ListRenderItem<ActivityTimelineItem>} ListRenderItemActivityTimelineItem
 */

class ActivityTimeline extends ActivityTimelineBack {
    render() {
        const { activities } = this.state;

        return (
            <View style={[styles.parent, this.props.style]} onLayout={this.onLayout}>
                <FlatList
                    data={activities}
                    renderItem={this.renderActivity}
                    keyExtractor={(item, index) => `activity-${item.startTime}-${index}`}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={false}
                    horizontal={true}
                />
            </View>
        );
    }

    /** @type {ListRenderItemActivityTimelineItem} */
    renderActivity = ({ item }) => {
        return (
            <View
                style={[
                    styles.timelineItem,
                    {
                        marginLeft: item.marginLeft,
                        width: item.width,
                        borderColor: item.color
                    },
                    item.hasPreviousAdjacentActivity && styles.adjacentLeft,
                    item.hasNextAdjacentActivity && styles.adjacentRight
                ]}
            />
        );
    };
}

export { ActivityTimeline };
