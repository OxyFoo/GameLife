import * as React from 'react';
import { View, FlatList } from 'react-native';

import styles from './style';
import ActivityTimelineBack from './back';
import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
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
                {this.renderCurrentTimeIndicator()}
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

    renderCurrentTimeIndicator = () => {
        const { currentTimePosition } = this.state;

        if (currentTimePosition === null || currentTimePosition === undefined) {
            return null;
        }

        /** @type {StyleProp} */
        const indicatorStyles = {
            left: currentTimePosition,
            backgroundColor: themeManager.GetColor('main2')
        };

        return <View style={[styles.currentTimeIndicator, indicatorStyles]} />;
    };
}

export { ActivityTimeline };
