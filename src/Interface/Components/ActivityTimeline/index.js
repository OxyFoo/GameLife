import * as React from 'react';
import { View, FlatList, Animated } from 'react-native';

import styles from './style';
import ActivityTimelineBack from './back';

import Icon from '../Icon';

/**
 * @typedef {import('./back').ActivityTimelineItem} ActivityTimelineItem
 */

class ActivityTimeline extends ActivityTimelineBack {
    /**
     * Render one activity in a time line with the height and icon depending on the scroll
     * @param {{ item: ActivityTimelineItem }} param0
     */
    renderActivity = ({ item }) => {
        const showIcon = item.duration >= 60;
        const styleTimelineItem = {
            marginLeft: item.marginLeft,
            width: item.width,
            backgroundColor: item.color
        };
        const styleIconAnim = {
            opacity: this.state.animHeight
        };

        return (
            <View style={[styles.timelineItem, styleTimelineItem]}>
                {showIcon && (
                    <Animated.View style={styleIconAnim}>
                        <Icon
                            size={14}
                            xml={item.logo}
                            color={item.logoColor}
                        />
                    </Animated.View>
                )}
            </View>
        );
    }

    render() {
        const heightMin = 5;
        const heightMax = 16;
        const styleContainer = {
            height: Animated.add(
                Animated.multiply(this.state.animHeight, heightMax - heightMin),
                heightMin
            )
        };

        return (
            <View style={[styles.background, this.props.style]}>

                <Animated.View style={[styles.container, styleContainer]}>
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
                </Animated.View>

            </View>
        );
    }
}

export default ActivityTimeline;
