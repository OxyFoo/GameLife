import * as React from 'react';
import { View, FlatList } from 'react-native';

import styles from './style';
import ActivityTimelineBack from './back';
import dataManager from 'Managers/DataManager';
import { Icon } from 'Interface/Components';

/**
 * 
 */
class ActivityTimeline extends ActivityTimelineBack {

    /**
     * Render one activity in a time line with the height and icon depending on the scroll
     * 
     */
    renderActivity = ({ item, index }) => {
        if (this.state.isScrolled) this.timeLineOpened = false;
        else this.timeLineOpened = true;
        return (
            <View style={[styles.timelineItem, { marginLeft: item.marginLeft, width: item.width, flexDirection: 'row', alignItems: 'center', backgroundColor: item.color }]}>
                {!this.state.isScrolled && item.duration >= 60 && (
                    <Icon size={14} xml={item.logo} color={item.logoColor} />
                )}
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>

                <View style={[
                    styles.timelineContainer,
                    this.state.isScrolled ? { height: 5 } : {}
                ]}>
                    {this.state.activities.length > 0 ?
                        <FlatList
                            data={this.state.activities}
                            renderItem={this.renderActivity}
                            keyExtractor={(item, index) => `activity-${index}`}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={false}
                        />
                        : null
                    }
                </View>

            </View>


        );
    }
}

export default ActivityTimeline;